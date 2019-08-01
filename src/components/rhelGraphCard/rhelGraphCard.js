import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHead,
  CardActions,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownPosition,
  Label as PfLabel
} from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { Chart, ChartAxis, ChartBar, ChartStack, ChartTooltip } from '@patternfly/react-charts';
import { connectTranslate, reduxActions } from '../../redux';
import { helpers, dateHelpers, graphHelpers } from '../../common';
import { rhelApiTypes } from '../../types/rhelApiTypes';

class RhelGraphCard extends React.Component {
  state = { dropdownIsOpen: false, chartWidth: 0 };

  containerRef = React.createRef();

  componentDidMount() {
    const { getGraphReports, startDate, endDate } = this.props;

    getGraphReports({
      [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: 'daily',
      [rhelApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
      [rhelApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString()
    });

    this.onResizeContainer();
    window.addEventListener('resize', this.onResizeContainer);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeContainer);
  }

  onResizeContainer = () => {
    const containerElement = this.containerRef.current;

    if (containerElement && containerElement.clientWidth) {
      this.setState({ chartWidth: containerElement.clientWidth });
    }
  };

  onSelect = () => {
    this.setState(prevState => ({
      dropdownIsOpen: !prevState.state.dropdownIsOpen
    }));
  };

  onToggle = dropdownIsOpen => {
    this.setState({
      dropdownIsOpen
    });
  };

  renderChart() {
    const { chartWidth } = this.state;
    const { graphData, t, startDate, endDate } = this.props;

    // todo: evaluate show error toast
    // todo: evaluate the granularity here: "daily" "weekly" etc. and pass startDate/endDate
    const { chartData, chartDomain, tickValues } = graphHelpers.convertGraphUsageData({
      data: graphData.usage,
      startDate,
      endDate,
      label: t('curiosity-graph.tooltipLabel', 'sockets on'),
      previousLabel: t('curiosity-graph.tooltipPreviousLabel', 'from previous day')
    });

    return (
      <Chart
        height={275}
        domainPadding={{ x: [30, 25] }}
        padding={{
          bottom: 75, // Adjusted to accommodate legend
          left: 50,
          right: 50,
          top: 50
        }}
        domain={chartDomain}
        width={chartWidth}
      >
        <ChartAxis tickValues={tickValues} fixLabelOverlap />
        <ChartAxis dependentAxis showGrid />
        <ChartStack>
          <ChartBar data={chartData} labelComponent={<ChartTooltip />} />
        </ChartStack>
      </Chart>
    );
  }

  render() {
    const { error, fulfilled, pending, t } = this.props;
    const { dropdownIsOpen } = this.state;

    const dropdownToggle = (
      <DropdownToggle isDisabled onToggle={this.onToggle}>
        {t('curiosity-graph.dropdownDefault', 'Last 30 Days')}
      </DropdownToggle>
    );

    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{t('curiosity-graph.heading', 'Daily CPU socket usage')}</h2>
          <CardActions>
            <PfLabel className="curiosity-usage-graph-label">
              {t('curiosity-graph.dropdownDefault', 'Last 30 Days')}
            </PfLabel>
            {/* todo: revisit dropdown in future iterations */}
            {false && (
              <Dropdown
                onSelect={this.onSelect}
                position={DropdownPosition.right}
                toggle={dropdownToggle}
                isOpen={dropdownIsOpen}
                dropdownItems={[]}
              />
            )}
          </CardActions>
        </CardHead>
        <CardBody>
          {/** todo: combine into a single class w/ --loading and BEM style */}
          <div className="curiosity-skeleton-container" ref={this.containerRef}>
            {pending && (
              <React.Fragment>
                <Skeleton size={SkeletonSize.xs} />
                <Skeleton size={SkeletonSize.sm} />
                <Skeleton size={SkeletonSize.md} />
                <Skeleton size={SkeletonSize.lg} />
              </React.Fragment>
            )}
            {(fulfilled || error) && this.renderChart()}
          </div>
        </CardBody>
      </Card>
    );
  }
}

RhelGraphCard.propTypes = {
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  getGraphReports: PropTypes.func,
  graphData: PropTypes.shape({
    usage: PropTypes.array
  }),
  pending: PropTypes.bool,
  t: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date)
};

RhelGraphCard.defaultProps = {
  error: false,
  fulfilled: false,
  getGraphReports: helpers.noop,
  graphData: {
    usage: []
  },
  pending: false,
  t: helpers.noopTranslate,
  startDate: dateHelpers.defaultDateTime.start,
  endDate: dateHelpers.defaultDateTime.end
};

const mapStateToProps = state => ({
  ...state.rhelGraph
});

const mapDispatchToProps = dispatch => ({
  getGraphReports: query => dispatch(reduxActions.rhel.getGraphReports(query))
});

const ConnectedRhelGraphCard = connectTranslate(mapStateToProps, mapDispatchToProps)(RhelGraphCard);

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
