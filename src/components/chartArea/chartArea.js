import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart,
  ChartAxis,
  ChartVoronoiContainer,
  ChartStack,
  ChartArea as PfChartArea
} from '@patternfly/react-charts';
import _cloneDeep from 'lodash/cloneDeep';

class ChartArea extends React.Component {
  state = { chartWidth: 0 };

  containerRef = React.createRef();

  componentDidMount() {
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

  getChartTicks() {
    const {
      xAxisLabelIncrement,
      yAxisLabelIncrement,
      xAxisLabelUseDataSet,
      yAxisLabelUseDataSet,
      xAxisTickFormat,
      yAxisTickFormat,
      dataSetOne
    } = this.props;
    const xAxisProps = {};
    const yAxisProps = {};
    let xAxisDataSet = [];
    let yAxisDataSet = [];

    switch (xAxisLabelUseDataSet) {
      case 'one':
      default:
        xAxisDataSet = dataSetOne;
        break;
    }

    switch (yAxisLabelUseDataSet) {
      case 'one':
      default:
        yAxisDataSet = dataSetOne;
        break;
    }

    if (xAxisDataSet.find(value => value.xAxisLabel && value.xAxisLabel)) {
      xAxisProps.xAxisTickValues = xAxisDataSet.reduce(
        (acc, current, index) => (index % xAxisLabelIncrement === 0 ? acc.concat(current.x) : acc),
        []
      );
      xAxisProps.xAxisTickFormat = tickValue =>
        (xAxisDataSet[tickValue] && xAxisDataSet[tickValue].xAxisLabel) || tickValue;
    }

    if (typeof xAxisTickFormat === 'function') {
      xAxisProps.xAxisTickFormat = tickValue => xAxisTickFormat({ dataSet: _cloneDeep(xAxisDataSet), tick: tickValue });
    }

    if (yAxisDataSet.find(value => value.yAxisLabel && value.yAxisLabel)) {
      yAxisProps.yAxisTickValues = yAxisDataSet.reduce(
        (acc, current, index) => (index % yAxisLabelIncrement === 0 ? acc.concat(current.y) : acc),
        []
      );
      yAxisProps.yAxisTickFormat = tickValue =>
        (yAxisDataSet[tickValue] && yAxisDataSet[tickValue].yAxisLabel) || tickValue;
    }

    if (typeof yAxisTickFormat === 'function') {
      yAxisProps.yAxisTickFormat = tickValue => yAxisTickFormat({ dataSet: _cloneDeep(yAxisDataSet), tick: tickValue });
    }

    return {
      ...xAxisProps,
      ...yAxisProps
    };
  }

  // ToDo: the domain range needs to be update when additional datasets are added
  getChartDomain({ isXAxisTicks, isYAxisTicks }) {
    const { domain, dataSetOne } = this.props;

    if (Object.keys(domain).length) {
      return domain;
    }

    const generatedDomain = {};
    let dataSetOneMaxY = 0;

    dataSetOne.forEach(value => {
      dataSetOneMaxY = value.y > dataSetOneMaxY ? value.y : dataSetOneMaxY;
    });

    if (!isXAxisTicks) {
      generatedDomain.x = [0, dataSetOne.length || 10];
    }

    if (!isYAxisTicks) {
      const floored = Math.pow(10, Math.floor(Math.log10(dataSetOneMaxY || 10)));
      generatedDomain.y = [0, Math.ceil((dataSetOneMaxY + 1) / floored) * floored];
    }

    return {
      maxY: dataSetOneMaxY,
      domain: generatedDomain
    };
  }

  render() {
    const { chartWidth } = this.state;
    const { dataSetOne } = this.props;

    const { xAxisTickValues, xAxisTickFormat, yAxisTickValues, yAxisTickFormat } = this.getChartTicks();
    const updatedXAxisProps = {};
    const updatedYAxisProps = {
      dependentAxis: true,
      showGrid: true
    };

    if (xAxisTickValues) {
      updatedXAxisProps.tickValues = xAxisTickValues;
      updatedXAxisProps.fixLabelOverlap = false;
    }

    if (xAxisTickFormat) {
      updatedXAxisProps.tickFormat = xAxisTickFormat;
    }

    if (yAxisTickValues) {
      updatedYAxisProps.tickValues = yAxisTickValues;
      updatedYAxisProps.fixLabelOverlap = false;
    }

    if (yAxisTickFormat) {
      updatedYAxisProps.tickFormat = yAxisTickFormat;
    }

    const { domain, maxY } = this.getChartDomain({ isXAxisTicks: !!xAxisTickValues, isYAxisTicks: !!yAxisTickValues });
    const chartProps = {};

    // FixMe: Check maxY has value, and conditionally apply ChartVoronoiContainer to avoid a massive memory leak?
    if (maxY > 0) {
      chartProps.containerComponent = <ChartVoronoiContainer labels={d => d.tooltip} />;
    }

    if (Object.keys(domain).length) {
      chartProps.domain = domain;
    }

    return (
      <div ref={this.containerRef}>
        <Chart width={chartWidth} {...chartProps}>
          <ChartAxis {...updatedXAxisProps} />
          <ChartAxis {...updatedYAxisProps} />
          <ChartStack>{(dataSetOne && dataSetOne.length && <PfChartArea data={dataSetOne} />) || null}</ChartStack>
        </Chart>
      </div>
    );
  }
}

ChartArea.propTypes = {
  dataSetOne: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      tooltip: PropTypes.string,
      xAxisLabel: PropTypes.string,
      yAxisLabel: PropTypes.string
    })
  ),
  domain: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  height: PropTypes.number,
  padding: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  }),
  xAxisLabelIncrement: PropTypes.number,
  xAxisLabelUseDataSet: PropTypes.oneOf(['one']),
  xAxisTickFormat: PropTypes.func,
  yAxisLabelIncrement: PropTypes.number,
  yAxisLabelUseDataSet: PropTypes.oneOf(['one']),
  yAxisTickFormat: PropTypes.func
};

ChartArea.defaultProps = {
  domain: {},
  dataSetOne: [],
  height: 275,
  padding: {
    bottom: 50,
    left: 85,
    right: 85,
    top: 50
  },
  xAxisLabelIncrement: 1,
  xAxisLabelUseDataSet: 'one',
  xAxisTickFormat: null,
  yAxisLabelIncrement: 1,
  yAxisLabelUseDataSet: 'one',
  yAxisTickFormat: null
};

export { ChartArea as default, ChartArea };
