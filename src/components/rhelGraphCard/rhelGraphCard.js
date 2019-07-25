import React from 'react';
import PropTypes from 'prop-types';
import { withBreakpoints } from 'react-breakpoints';
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
import { Chart, ChartBar, ChartBaseTheme, ChartLabel, ChartStack, ChartTooltip } from '@patternfly/react-charts';
import { connectTranslate, reduxActions } from '../../redux';
import { helpers, dateHelpers, graphHelpers } from '../../common';
import { rhelApiTypes } from '../../types/rhelApiTypes';

class RhelGraphCard extends React.Component {
  state = { dropdownIsOpen: false };

  componentDidMount() {
    const { getGraphReports, startDate, endDate } = this.props;

    getGraphReports({
      [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: 'daily',
      [rhelApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
      [rhelApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString()
    });
  }

  onToggle = dropdownIsOpen => {
    this.setState({
      dropdownIsOpen
    });
  };

  onSelect = () => {
    this.setState(prevState => ({
      dropdownIsOpen: !prevState.state.dropdownIsOpen
    }));
  };

  renderChart() {
    const { graphData, t, breakpoints, currentBreakpoint, startDate, endDate } = this.props;

    const graphHeight = graphHelpers.getGraphHeight(breakpoints, currentBreakpoint);
    const tooltipDimensions = graphHelpers.getTooltipDimensions(breakpoints, currentBreakpoint);

    // todo: evaluate show error toast
    // todo: evaluate the granularity here: "daily" "weekly" etc. and pass startDate/endDate
    const { chartData, chartDomain } = graphHelpers.convertGraphUsageData({
      data: graphData.usage,
      startDate,
      endDate,
      label: t('curiosity-graph.tooltipLabel', 'sockets on'),
      previousLabel: t('curiosity-graph.tooltipPreviousLabel', 'from previous day')
    });

    const tooltipTheme = {
      ...ChartBaseTheme,
      tooltip: {
        ...ChartBaseTheme.tooltip,
        pointerLength: 3,
        pointerWidth: 15
      }
    };

    const textStyle = {
      // note: fontSize will also determine vertical space between tooltip tspans
      fontSize: graphHelpers.getTooltipFontSize(breakpoints, currentBreakpoint)
    };

    const chartTooltip = (
      <ChartTooltip
        {...tooltipDimensions}
        style={textStyle}
        theme={tooltipTheme}
        labelComponent={<ChartLabel dy={-1} className="curiosity-usage-graph-tooltip-text" />}
      />
    );

    return (
      <CardBody>
        <div className="curiosity-stack-chart-container">
          <Chart height={graphHeight} domainPadding={{ x: [10, 2], y: [1, 1] }} domain={chartDomain}>
            <ChartStack>
              <ChartBar data={chartData} labelComponent={chartTooltip} />
            </ChartStack>
          </Chart>
        </div>
      </CardBody>
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
        {pending && (
          <CardBody>
            <div className="curiosity-skeleton-container">
              <Skeleton size={SkeletonSize.xs} />
              <Skeleton size={SkeletonSize.sm} />
              <Skeleton size={SkeletonSize.md} />
              <Skeleton size={SkeletonSize.lg} />
            </div>
          </CardBody>
        )}
        {(fulfilled || error) && this.renderChart()}
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
  breakpoints: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
    xl2: PropTypes.number
  }),
  currentBreakpoint: PropTypes.string,
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
  breakpoints: {},
  currentBreakpoint: '',
  startDate: dateHelpers.defaultDateTime.start,
  endDate: dateHelpers.defaultDateTime.end
};

const mapStateToProps = state => ({
  ...state.rhelGraph
});

const mapDispatchToProps = dispatch => ({
  getGraphReports: query => dispatch(reduxActions.rhel.getGraphReports(query))
});

const ConnectedRhelGraphCard = connectTranslate(mapStateToProps, mapDispatchToProps)(withBreakpoints(RhelGraphCard));

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
