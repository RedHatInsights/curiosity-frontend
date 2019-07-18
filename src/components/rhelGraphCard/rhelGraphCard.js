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
  DropdownPosition
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

  render() {
    const { error, fulfilled, graphData, pending, t, breakpoints, currentBreakpoint, startDate, endDate } = this.props;
    const { dropdownIsOpen } = this.state;

    const graphHeight = graphHelpers.getGraphHeight(breakpoints, currentBreakpoint);
    const tooltipDimensions = graphHelpers.getTooltipDimensions(breakpoints, currentBreakpoint);

    // todo: evaluate the granularity here: "daily" "weekly" etc. this may need to move towards the helpers
    const chartDomain = { x: [0, 31] };

    let chartData;

    if (error) {
      // todo: evaluate show error toast
      // todo: this only fires on error, not in the event an array with a valid zero length.
      // todo: we may need to combine error and fulfilled checks and handle the x and y axis defaults in the helpers
      // note: specify a y range if we are showing the zeroed view
      chartDomain.y = [0, 100];
      chartData = graphHelpers.zeroedUsageData(startDate, endDate);
    }

    if (fulfilled) {
      chartData = graphHelpers.convertGraphData({
        usage: graphData.usage,
        startDate,
        endDate,
        socketLabel: t('curiosity-graph.socketsOn', 'sockets on'),
        previousLabel: t('curiosity-graph.fromPrevious', 'from previous day')
      });
    }

    const dropdownToggle = (
      <DropdownToggle isDisabled onToggle={this.onToggle}>
        {t('curiosity-graph.dropdownDefault', 'Last 30 Days')}
      </DropdownToggle>
    );

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
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{t('curiosity-graph.heading', 'Daily CPU socket usage')}</h2>
          <CardActions>
            <Dropdown
              onSelect={this.onSelect}
              position={DropdownPosition.right}
              toggle={dropdownToggle}
              isOpen={dropdownIsOpen}
              dropdownItems={[]}
            />
          </CardActions>
        </CardHead>
        {pending && (
          <CardBody>
            <div className="skeleton-container">
              <Skeleton size={SkeletonSize.xs} />
              <Skeleton size={SkeletonSize.sm} />
              <Skeleton size={SkeletonSize.md} />
              <Skeleton size={SkeletonSize.lg} />
            </div>
          </CardBody>
        )}
        {(fulfilled || error) && (
          <CardBody>
            <div className="stack-chart-container">
              <Chart height={graphHeight} domainPadding={{ x: [10, 2], y: [1, 1] }} domain={chartDomain}>
                <ChartStack>
                  <ChartBar data={chartData} labelComponent={chartTooltip} />
                </ChartStack>
              </Chart>
            </div>
          </CardBody>
        )}
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
