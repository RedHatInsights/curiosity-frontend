import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart,
  ChartAxis,
  ChartLegend,
  ChartLine,
  ChartVoronoiContainer,
  ChartStack,
  ChartArea as PfChartArea
} from '@patternfly/react-charts';
import _cloneDeep from 'lodash/cloneDeep';
import { helpers } from '../../common';

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

  setChartTicks() {
    const { xAxisLabelIncrement, yAxisLabelIncrement, xAxisTickFormat, yAxisTickFormat, dataSets } = this.props;
    const xAxisProps = {};
    const yAxisProps = {};
    let xAxisDataSet = (dataSets.length && dataSets[0].data) || [];
    let yAxisDataSet = (dataSets.length && dataSets[0].data) || [];

    dataSets.forEach(dataSet => {
      if (dataSet.xAxisLabelUseDataSet) {
        xAxisDataSet = dataSet.data;
      }

      if (dataSet.yAxisLabelUseDataSet) {
        yAxisDataSet = dataSet.data;
      }
    });

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

  getChartTicks() {
    const { xAxisFixLabelOverlap, yAxisFixLabelOverlap } = this.props;

    const { xAxisTickValues, xAxisTickFormat, yAxisTickValues, yAxisTickFormat } = this.setChartTicks();
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

    return {
      isXAxisTicks: !!xAxisTickValues,
      isYAxisTicks: !!yAxisTickValues,
      xAxisProps: updatedXAxisProps,
      yAxisProps: updatedYAxisProps
    };
  }

  // ToDo: the domain range needs to be update when additional datasets are added
  getChartDomain({ isXAxisTicks, isYAxisTicks }) {
    const { domain, dataSets } = this.props;

    if (Object.keys(domain).length) {
      return domain;
    }

    const generatedDomain = {};
    const updatedChartDomain = {};
    let dataSetMaxX = 0;
    let dataSetMaxY = 0;

    dataSets.forEach(dataSet => {
      dataSetMaxX = dataSet.data.length > dataSetMaxX ? dataSet.data : dataSetMaxX;

      dataSet.data.forEach(value => {
        dataSetMaxY = value.y > dataSetMaxY ? value.y : dataSetMaxY;
      });

      if (dataSet.thresholds) {
        dataSet.thresholds.forEach(value => {
          dataSetMaxY = value.y > dataSetMaxY ? value.y : dataSetMaxY;
        });
      }
    });

    if (!isXAxisTicks) {
      generatedDomain.x = [0, dataSetMaxX || 10];
    }

    if (!isYAxisTicks) {
      const floored = Math.pow(10, Math.floor(Math.log10(dataSetMaxY || 10)));
      generatedDomain.y = [0, Math.ceil((dataSetMaxY + 1) / floored) * floored];
    }

    if (Object.keys(generatedDomain).length) {
      updatedChartDomain.domain = generatedDomain;
    }

    return {
      maxY: dataSetMaxY,
      chartDomain: { ...updatedChartDomain }
    };
  }

  getChartLegend() {
    const { dataSets } = this.props;
    const legendData = [];

    dataSets.forEach(dataSet => {
      if (dataSet.legendThreshold) {
        legendData.push({ symbol: { type: 'dash' }, ...dataSet.legendThreshold });
      }

      if (dataSet.legendData) {
        legendData.push(dataSet.legendData);
      }
    });

    return {
      legendData,
      legendOrientation: 'horizontal',
      legendPosition: 'bottom-left',
      legendComponent: <ChartLegend borderPadding={{ top: 20 }} />
    };
  }

  render() {
    const { chartWidth } = this.state;
    const { dataSets, padding } = this.props;

    const { isXAxisTicks, isYAxisTicks, xAxisProps, yAxisProps } = this.getChartTicks();
    const { chartDomain, maxY } = this.getChartDomain({ isXAxisTicks, isYAxisTicks });
    const chartLegendProps = this.getChartLegend();
    const chartProps = { padding, ...chartLegendProps, ...chartDomain };

    // FixMe: Check maxY has value, and conditionally apply ChartVoronoiContainer to avoid a massive memory leak?
    if (maxY > 0) {
      chartProps.containerComponent = <ChartVoronoiContainer labels={d => d.tooltip} />;
    }

    return (
      <div ref={this.containerRef}>
        <Chart width={chartWidth} {...chartProps}>
          <ChartAxis {...xAxisProps} />
          <ChartAxis {...yAxisProps} />
          {(dataSets &&
            dataSets.length &&
            dataSets.map(
              dataSet =>
                (dataSet.thresholds && dataSet.thresholds.length && (
                  /** fixme: split this out into a new wrapper called ChartThreshold in PF React */
                  <ChartLine
                    interpolation={dataSet.thresholdInterpolation || 'step'}
                    key={helpers.generateId()}
                    data={dataSet.thresholds}
                    style={dataSet.thresholdStyle || { data: { strokeDasharray: 3.3 } }}
                  />
                )) ||
                null
            )) ||
            null}
          <ChartStack>
            {(dataSets &&
              dataSets.length &&
              dataSets.map(
                dataSet =>
                  (dataSet.data && dataSet.data.length && (
                    <PfChartArea
                      interpolation={dataSet.dataInterpolation || 'catmullRom'}
                      key={helpers.generateId()}
                      data={dataSet.data}
                    />
                  )) ||
                  null
              )) ||
              null}
          </ChartStack>
        </Chart>
      </div>
    );
  }
}

ChartArea.propTypes = {
  dataSets: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
          tooltip: PropTypes.string,
          xAxisLabel: PropTypes.string,
          yAxisLabel: PropTypes.string
        })
      ),
      dataInterpolation: PropTypes.string,
      threshold: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number
        })
      ),
      thresholdInterpolation: PropTypes.string,
      thresholdStyle: PropTypes.object,
      legendData: PropTypes.shape({
        name: PropTypes.string
      }),
      legendThreshold: PropTypes.shape({
        name: PropTypes.string
      }),
      xAxisLabelUseDataSet: PropTypes.bool,
      yAxisLabelUseDataSet: PropTypes.bool
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
  xAxisFixLabelOverlap: PropTypes.bool,
  xAxisLabelIncrement: PropTypes.number,
  xAxisTickFormat: PropTypes.func,
  yAxisFixLabelOverlap: PropTypes.bool,
  yAxisLabelIncrement: PropTypes.number,
  yAxisTickFormat: PropTypes.func
};

ChartArea.defaultProps = {
  domain: {},
  dataSets: [],
  height: 275,
  padding: {
    bottom: 75,
    left: 50,
    right: 50,
    top: 50
  },
  xAxisFixLabelOverlap: false,
  xAxisLabelIncrement: 1,
  xAxisTickFormat: null,
  yAxisFixLabelOverlap: false,
  yAxisLabelIncrement: 1,
  yAxisTickFormat: null
};

export { ChartArea as default, ChartArea };
