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
import { Chart, ChartBar, ChartBaseTheme, ChartLabel, ChartStack, ChartTooltip } from '@patternfly/react-charts';
import { global_Color_light_200 as globalColorLight200 } from '@patternfly/react-tokens';
import { connectTranslate, reduxActions } from '../../redux';
import { helpers } from '../../common/helpers';
import { graphHelpers } from '../../common/graphHelpers';

class RhelGraphCard extends React.Component {
  state = { isOpen: false };

  componentDidMount() {
    const { getGraphReports } = this.props;

    getGraphReports();
  }

  onToggle = isOpen => {
    this.setState({
      isOpen
    });
  };

  onSelect = () => {
    this.setState(prevState => ({
      isOpen: !prevState.state.isOpen
    }));
  };

  render() {
    const { error, fulfilled, graphData, pending, t, breakpoints, currentBreakpoint } = this.props;
    const { isOpen } = this.state;

    if (error) {
      return null;
    }

    // todo: construct chartData using graphData in the reducer...
    const chartData = graphHelpers.convertGraphData({ ...graphData });

    const dropdownToggle = (
      <DropdownToggle isDisabled onToggle={this.onToggle}>
        {t('curiosity-graph.dropdownDefault', 'Last 30 Days')}
      </DropdownToggle>
    );

    // heights are breakpoint specific since they are scaled via svg
    const graphHeight = graphHelpers.getGraphHeight(breakpoints, currentBreakpoint);
    const tooltipDimensions = graphHelpers.getTooltipDimensions(breakpoints, currentBreakpoint);

    const tooltipTheme = {
      ...ChartBaseTheme,
      tooltip: {
        ...ChartBaseTheme.tooltip,
        pointerLength: 3,
        pointerWidth: 15
      }
    };
    const textStyle = {
      fill: globalColorLight200.value,
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

    // todo: correct pending/loading display
    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{t('curiosity-graph.heading', 'Daily CPU socket usage')}</h2>
          <CardActions>
            <Dropdown
              onSelect={this.onSelect}
              position={DropdownPosition.right}
              toggle={dropdownToggle}
              isOpen={isOpen}
              dropdownItems={[]}
            />
          </CardActions>
        </CardHead>
        {pending && (
          <CardBody>
            <div className="stack-chart-container">
              <small>Loading...</small>
            </div>
          </CardBody>
        )}
        {fulfilled && (
          <CardBody>
            <div className="stack-chart-container">
              <Chart height={graphHeight} domainPadding={{ x: [10, 2], y: [1, 1] }}>
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
  currentBreakpoint: PropTypes.string
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
  currentBreakpoint: ''
};

const mapStateToProps = state => ({
  ...state.rhelGraph
});

const mapDispatchToProps = dispatch => ({
  getGraphReports: () => dispatch(reduxActions.rhel.getGraphReports())
});

const ConnectedRhelGraphCard = connectTranslate(mapStateToProps, mapDispatchToProps)(withBreakpoints(RhelGraphCard));

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
