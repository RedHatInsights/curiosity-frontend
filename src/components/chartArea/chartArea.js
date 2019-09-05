import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart,
  ChartAxis,
  ChartLine,
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
        xAxisDataSet = dataSetOne.data;
        break;
    }

    switch (yAxisLabelUseDataSet) {
      case 'one':
      default:
        yAxisDataSet = dataSetOne.data;
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

    dataSetOne.data.forEach(value => {
      dataSetOneMaxY = value.y > dataSetOneMaxY ? value.y : dataSetOneMaxY;
    });

    dataSetOne.thresholds.forEach(value => {
      dataSetOneMaxY = value.y > dataSetOneMaxY ? value.y : dataSetOneMaxY;
    });

    if (!isXAxisTicks) {
      generatedDomain.x = [0, dataSetOne.data.length || 10];
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

  getLegendData() {
    const { dataSetOne } = this.props;
    const legendData = [];
    if (dataSetOne.thresholdLegend) {
      legendData.push(dataSetOne.thresholdLegend);
    }
    if (dataSetOne.dataLegend) {
      legendData.push(dataSetOne.dataLegend);
    }
    return legendData;
  }

  render() {
    const { chartWidth } = this.state;
    const { dataSetOne, xAxisFixLabelOverlap, yAxisFixLabelOverlap, padding } = this.props;

    const { xAxisTickValues, xAxisTickFormat, yAxisTickValues, yAxisTickFormat } = this.getChartTicks();
    const updatedXAxisProps = {
      fixLabelOverlap: xAxisFixLabelOverlap
    };
    const updatedYAxisProps = {
      dependentAxis: true,
      showGrid: true,
      fixLabelOverlap: yAxisFixLabelOverlap
    };

    if (xAxisTickValues) {
      updatedXAxisProps.tickValues = xAxisTickValues;
    }

    if (xAxisTickFormat) {
      updatedXAxisProps.tickFormat = xAxisTickFormat;
    }

    if (yAxisTickValues) {
      updatedYAxisProps.tickValues = yAxisTickValues;
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

    const legendData = this.getLegendData();
    if (legendData.length) {
      chartProps.legendData = legendData;
      chartProps.legendOrientation = 'horizontal';
      chartProps.legendPosition = 'bottom';
      chartProps.padding = padding; // Adjusted to accomodate legend
    }

    if (Object.keys(domain).length) {
      chartProps.domain = domain;
    }

    return (
      <div ref={this.containerRef}>
        <Chart width={chartWidth} {...chartProps}>
          <ChartAxis {...updatedXAxisProps} />
          <ChartAxis {...updatedYAxisProps} />
          {(dataSetOne.thresholds && dataSetOne.thresholds.length && (
            /** fixme: split this out into a new wrapper called ChartThreshold in PF React */
            <ChartLine data={dataSetOne.thresholds} style={{ data: { strokeDasharray: 3.3 } }} />
          )) ||
            null}
          <ChartStack>
            {(dataSetOne.data && dataSetOne.data.length && <PfChartArea data={dataSetOne.data} />) || null}
          </ChartStack>
        </Chart>
      </div>
    );
  }
}

const dataSetPropTypes = PropTypes.shape({
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      tooltip: PropTypes.string,
      xAxisLabel: PropTypes.string,
      yAxisLabel: PropTypes.string
    })
  ),
  thresholds: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  ),
  dataLegend: PropTypes.object,
  thresholdLegend: PropTypes.object
});

ChartArea.propTypes = {
  dataSetOne: dataSetPropTypes,
  domain: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  height: PropTypes.number,
  padding: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  }),
  xAxisFixLabelOverlap: PropTypes.bool,
  xAxisLabelIncrement: PropTypes.number,
  xAxisLabelUseDataSet: PropTypes.oneOf(['one']),
  xAxisTickFormat: PropTypes.func,
  yAxisFixLabelOverlap: PropTypes.bool,
  yAxisLabelIncrement: PropTypes.number,
  yAxisLabelUseDataSet: PropTypes.oneOf(['one']),
  yAxisTickFormat: PropTypes.func
};

ChartArea.defaultProps = {
  domain: {},
  dataSetOne: {
    data: [],
    thresholds: [],
    dataLegend: null,
    thresholdLegend: null
  },
  height: 275,
  padding: {
    bottom: 75,
    left: 50,
    right: 50,
    top: 50
  },
  xAxisFixLabelOverlap: false,
  xAxisLabelIncrement: 1,
  xAxisLabelUseDataSet: 'one',
  xAxisTickFormat: null,
  yAxisFixLabelOverlap: false,
  yAxisLabelIncrement: 1,
  yAxisLabelUseDataSet: 'one',
  yAxisTickFormat: null
};

export { ChartArea as default, ChartArea };
