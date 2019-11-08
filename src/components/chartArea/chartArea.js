import React from 'react';
import PropTypes from 'prop-types';
import { createContainer, VictoryPortal } from 'victory';
import {
  Chart,
  ChartAxis,
  ChartLegend,
  ChartStack,
  ChartThreshold,
  ChartTooltip,
  ChartThemeColor,
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

  setDataSets() {
    const { dataSets, tooltips } = this.props;

    if (tooltips && dataSets && dataSets[0] && dataSets[0].data) {
      const updatedDataSets = _cloneDeep(dataSets);

      updatedDataSets[0].data = updatedDataSets[0].data.map((value, index) => {
        const itemsByKey = {};
        const items = [];

        dataSets.forEach((data, i) => {
          if (data.data && data.data[value.x]) {
            itemsByKey[data.id || `dataSet-${i}`] = data.data[value.x];
            items.push(data.data[value.x]);
          }
        });

        return {
          ...value,
          _tooltip: tooltips({
            x: value.x,
            y: value.y,
            index,
            items,
            itemsByKey,
            dataSets: _cloneDeep(dataSets)
          })
        };
      });

      return updatedDataSets;
    }

    return dataSets;
  }

  setChartTicks() {
    const { xAxisLabelIncrement, xAxisTickFormat, yAxisTickFormat, dataSets } = this.props;
    const xAxisProps = {};
    const yAxisProps = {};
    let xAxisDataSet = (dataSets.length && dataSets[0].data) || [];

    dataSets.forEach(dataSet => {
      if (dataSet.xAxisLabelUseDataSet) {
        xAxisDataSet = dataSet.data;
      }
    });

    xAxisProps.xAxisTickValues = xAxisDataSet.reduce(
      (acc, current, index) => (index % xAxisLabelIncrement === 0 ? acc.concat(current.x) : acc),
      []
    );

    xAxisProps.xAxisTickFormat = tickValue =>
      (xAxisDataSet[tickValue] && xAxisDataSet[tickValue].xAxisLabel) || tickValue;

    if (typeof xAxisTickFormat === 'function') {
      xAxisProps.xAxisTickFormat = tick => {
        const tickValues = xAxisProps.xAxisTickValues;
        const tickIndex = tickValues.indexOf(tick);
        const previousItem = { ...(xAxisDataSet[tickValues[tickIndex - 1]] || {}) };
        const nextItem = { ...(xAxisDataSet[tickValues[tickIndex + 1]] || {}) };
        const item = { ...(xAxisDataSet[tick] || {}) };

        return xAxisTickFormat({ tick, previousItem, item, nextItem });
      };
    }

    if (typeof yAxisTickFormat === 'function') {
      yAxisProps.yAxisTickFormat = tick => yAxisTickFormat({ tick });
    }

    return {
      ...xAxisProps,
      ...yAxisProps
    };
  }

  getChartTicks() {
    const { xAxisFixLabelOverlap } = this.props;

    const { xAxisTickValues, xAxisTickFormat, yAxisTickFormat } = this.setChartTicks();
    const updatedXAxisProps = {
      fixLabelOverlap: xAxisFixLabelOverlap
    };
    const updatedYAxisProps = {
      dependentAxis: true,
      showGrid: true
    };

    if (xAxisTickValues) {
      updatedXAxisProps.tickValues = xAxisTickValues;
    }

    if (xAxisTickFormat) {
      updatedXAxisProps.tickFormat = xAxisTickFormat;
    }

    if (yAxisTickFormat) {
      updatedYAxisProps.tickFormat = yAxisTickFormat;
    }

    return {
      isXAxisTicks: !!xAxisTickValues,
      xAxisProps: updatedXAxisProps,
      yAxisProps: updatedYAxisProps
    };
  }

  // ToDo: the domain range needs to be update when additional datasets are added
  getChartDomain({ isXAxisTicks }) {
    const { domain, dataSets } = this.props;

    if (Object.keys(domain).length) {
      return domain;
    }

    const generatedDomain = {};
    const updatedChartDomain = {};
    let dataSetMaxX = 0;
    let dataSetMaxY = 0;

    const stackedSets = dataSets.filter(set => set.isStacked === true);

    stackedSets.forEach(dataSet => {
      if (dataSet.data) {
        let dataSetMaxYStacked = 0;

        dataSet.data.forEach((value, index) => {
          dataSetMaxYStacked = value && value.y > dataSetMaxYStacked ? value.y : dataSetMaxYStacked;

          if (index === dataSet.data.length - 1) {
            dataSetMaxY += dataSetMaxYStacked;
          }
        });
      }
    });

    dataSets.forEach(dataSet => {
      if (dataSet.data) {
        dataSetMaxX = dataSet.data.length > dataSetMaxX ? dataSet.data.length : dataSetMaxX;

        dataSet.data.forEach(value => {
          dataSetMaxY = value && value.y > dataSetMaxY ? value.y : dataSetMaxY;
        });
      }
    });

    if (!isXAxisTicks) {
      generatedDomain.x = [0, dataSetMaxX || 10];
    }

    const floored = Math.pow(10, Math.floor(Math.log10((dataSetMaxY > 10 && dataSetMaxY) || 10)));
    generatedDomain.y = [0, Math.ceil((dataSetMaxY + 1) / floored) * floored];

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
      if (dataSet.legendLabel) {
        const legendDataSettings = { symbol: {}, name: dataSet.legendLabel };

        if (dataSet.isThreshold) {
          legendDataSettings.symbol = { type: 'threshold' };
        }

        if (dataSet.themeColor) {
          legendDataSettings.symbol.fill = dataSet.themeColor;
        } else if (dataSet.stroke) {
          legendDataSettings.symbol.fill = dataSet.stroke;
        } else if (dataSet.fill) {
          legendDataSettings.symbol.fill = dataSet.fill;
        }

        legendData.push(legendDataSettings);
      }
    });

    return {
      legendData,
      legendOrientation: 'horizontal',
      legendPosition: 'bottom-left',
      legendComponent: <ChartLegend borderPadding={{ top: 20 }} />
    };
  }

  static getContainerComponent() {
    const VictoryVoronoiCursorContainer = createContainer('voronoi', 'cursor');
    const containerComponentProps = {
      constrainToVisibleArea: true,
      cursorDimension: 'x',
      voronoiDimension: 'x',
      voronoiPadding: 50,
      mouseFollowTooltips: true
    };

    containerComponentProps.labelComponent = (
      <VictoryPortal>
        <ChartTooltip pointerLength={0} centerOffset={{ x: tooltip => tooltip.flyoutWidth / 2 + 5, y: 0 }} />
      </VictoryPortal>
    );

    containerComponentProps.labels = ({ datum }) =>
      (/^chartArea-0/.test(datum.childName) && datum._tooltip) || datum.tooltip || undefined;

    return {
      containerComponent: <VictoryVoronoiCursorContainer {...containerComponentProps} />
    };
  }

  renderChart({ stacked = false }) {
    const dataSets = this.setDataSets();
    const charts = [];
    const chartsStacked = [];

    const thresholdChart = (dataSet, index) => {
      const dataColorStroke = { data: {} };

      if (dataSet.fill) {
        dataColorStroke.data.fill = dataSet.fill;
      }

      if (dataSet.stroke) {
        dataColorStroke.data.stroke = dataSet.stroke;
      }

      return (
        <ChartThreshold
          animate={dataSet.animate || false}
          interpolation={dataSet.interpolation || 'step'}
          key={helpers.generateId()}
          name={`chartArea-${index}-threshold`}
          data={dataSet.data}
          style={{ ...(dataSet.style || {}), ...dataColorStroke }}
          // FixMe: PFCharts inconsistent implementation around themeColor and style, see ChartArea. Appears enforced, see PFCharts. Leads to multiple checks and implementations.
          themeColor={dataSet.themeColor}
          themeVariant={dataSet.themeVariant}
        />
      );
    };

    const areaChart = (dataSet, index) => {
      const dataColorStroke = { data: {} };

      if (dataSet.fill) {
        dataColorStroke.data.fill = dataSet.fill;
      }

      if (dataSet.stroke) {
        dataColorStroke.data.stroke = dataSet.stroke;
      }

      return (
        <PfChartArea
          animate={dataSet.animate || false}
          interpolation={dataSet.interpolation || 'catmullRom'}
          key={helpers.generateId()}
          name={`chartArea-${index}-area`}
          data={dataSet.data}
          style={{ ...(dataSet.style || {}), ...dataColorStroke }}
          // FixMe: PFCharts inconsistent implementation around themeColor and style, see ChartThreshold themeColor and style
          themeColor={dataSet.themeColor}
          themeVariant={dataSet.themeVariant}
        />
      );
    };

    dataSets.forEach((dataSet, index) => {
      if (dataSet.data && dataSet.data.length) {
        const updatedDataSet = (dataSet.isThreshold && thresholdChart(dataSet, index)) || areaChart(dataSet, index);

        if (dataSet.isStacked) {
          chartsStacked.push(updatedDataSet);
        } else {
          charts.push(updatedDataSet);
        }
      }
    });

    return (stacked && chartsStacked) || charts;
  }

  render() {
    const { chartWidth } = this.state;
    const { padding, themeColor } = this.props;

    const { isXAxisTicks, xAxisProps, yAxisProps } = this.getChartTicks();
    const { chartDomain, maxY } = this.getChartDomain({ isXAxisTicks });
    const chartLegendProps = this.getChartLegend();
    const containerComponent = (maxY > 0 && ChartArea.getContainerComponent()) || {};
    const chartProps = { padding, ...chartLegendProps, ...chartDomain, ...containerComponent };

    /**
     * FixMe: PFCharts or Victory, unable to return null or empty content.
     * General practice of returning "null" shouldn't necessarily melt the
     * graph. To avoid issues we return an empty array
     */
    return (
      <div ref={this.containerRef}>
        <Chart animate={{ duration: 0 }} width={chartWidth} themeColor={themeColor} {...chartProps}>
          <ChartAxis {...xAxisProps} animate={false} />
          <ChartAxis {...yAxisProps} animate={false} />
          {this.renderChart({})}
          <ChartStack>{this.renderChart({ stacked: true })}</ChartStack>
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
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          tooltip: PropTypes.string,
          xAxisLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
        })
      ),
      animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
      fill: PropTypes.string,
      stroke: PropTypes.string,
      themeColor: PropTypes.string,
      themeVariant: PropTypes.string,
      id: PropTypes.string,
      interpolation: PropTypes.string,
      legendLabel: PropTypes.string,
      style: PropTypes.object,
      isStacked: PropTypes.bool,
      isThreshold: PropTypes.bool,
      xAxisLabelUseDataSet: PropTypes.bool
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
  themeColor: PropTypes.oneOf(Object.values(ChartThemeColor)),
  tooltips: PropTypes.func,
  xAxisFixLabelOverlap: PropTypes.bool,
  xAxisLabelIncrement: PropTypes.number,
  xAxisTickFormat: PropTypes.func,
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
  themeColor: 'blue',
  tooltips: null,
  xAxisFixLabelOverlap: false,
  xAxisLabelIncrement: 1,
  xAxisTickFormat: null,
  yAxisTickFormat: null
};

export { ChartArea as default, ChartArea };
