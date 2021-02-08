import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'victory-create-container';
import {
  Chart,
  ChartAxis,
  ChartStack,
  ChartThreshold,
  ChartThemeColor,
  ChartArea as PfChartArea
} from '@patternfly/react-charts';
import _cloneDeep from 'lodash/cloneDeep';
import { helpers } from '../../common';

/**
 * FixMe: chart redraw issues, possibly related by...
 * - resize setup,
 * - internal caching of the graph, and
 * - restructuring how the query props are passed through product view
 */
/**
 * A wrapper for Patternfly and Victory charts/graphs.
 *
 * @augments React.Component
 * @fires onResizeContainer
 * @fires onHide
 * @fires onRevert
 * @fires onToggle
 */
class ChartArea extends React.Component {
  state = { chartWidth: 0 };

  dataSetsToggle = {};

  resizeObserver = helpers.noop;

  containerRef = React.createRef();

  tooltipRef = React.createRef();

  componentDidMount() {
    this.setResizeObserve();
  }

  componentWillUnmount() {
    this.resizeObserver();
  }

  /**
   * Consumer exposed, hides chart layer.
   *
   * @event onHide
   * @param {string} id
   */
  onHide = id => {
    this.dataSetsToggle = { ...this.dataSetsToggle, [id]: true };
    this.forceUpdate();
  };

  /**
   * Consumer exposed, turns all chart layers back on.
   *
   * @event onRevert
   */
  onRevert = () => {
    this.dataSetsToggle = {};
    this.forceUpdate();
  };

  /**
   * Consumer exposed, turns chart layer on/off.
   *
   * @event onToggle
   * @param {string} id
   * @returns {boolean}
   */
  onToggle = id => {
    const updatedToggle = !this.dataSetsToggle[id];
    this.dataSetsToggle = { ...this.dataSetsToggle, [id]: updatedToggle };
    this.forceUpdate();

    return updatedToggle;
  };

  /**
   * On resize adjust graph display.
   *
   * @event onResizeContainer
   */
  onResizeContainer = () => {
    const { chartWidth } = this.state;
    const { clientWidth = 0 } = this.containerRef.current || {};

    if (clientWidth !== chartWidth) {
      this.setState({ chartWidth: clientWidth });
    }
  };

  /**
   * Consumer exposed, determine if chart layer on/off.
   * Note: Using "setState" as related to this exposed check gives the appearance of a race condition.
   * Using a class property with forceUpdate to bypass.
   *
   * @param {string} id
   * @returns {boolean}
   */
  getIsToggled = id => this.dataSetsToggle[id] || false;

  /**
   * Set ResizeObserver for scenarios where the window.resize event doesn't fire.
   */
  setResizeObserve() {
    const containerElement = this.containerRef.current;
    const { ResizeObserver } = window;

    if (containerElement && ResizeObserver) {
      const resizeObserver = new ResizeObserver(this.onResizeContainer);
      resizeObserver.observe(containerElement);
      this.resizeObserver = () => resizeObserver.unobserve(containerElement);
    } else {
      this.onResizeContainer();
      window.addEventListener('resize', this.onResizeContainer);
      this.resizeObserver = () => window.removeEventListener('resize', this.onResizeContainer);
    }
  }

  /**
   * Apply props, set x and y axis chart increments/ticks formatting.
   *
   * @returns {object}
   */
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

  /**
   * Return x and y axis increments/ticks.
   *
   * @returns {object}
   */
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

  /**
   * Calculate and return the x and y domain range.
   *
   * @param {boolean} isXAxisTicks
   * @returns {object}
   */
  getChartDomain({ isXAxisTicks }) {
    const { dataSetsToggle } = this;
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
      if (!dataSetsToggle[dataSet.id] && dataSet.data) {
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
      if (!dataSetsToggle[dataSet.id] && dataSet.data) {
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

  /**
   * Apply data set to custom tooltips.
   *
   * @returns {Array}
   */
  getTooltipData() {
    const { dataSetsToggle } = this;
    const { dataSets, chartTooltip } = this.props;
    let tooltipDataSet = [];

    if (chartTooltip && dataSets && dataSets[0] && dataSets[0].data) {
      tooltipDataSet = dataSets[0].data.map((dataSet, index) => {
        const itemsByKey = {};

        dataSets.forEach(data => {
          if (!dataSetsToggle[data.id] && data.data && data.data[index]) {
            itemsByKey[data.id] = {
              color: data.stroke || data.fill || data.color || '',
              data: _cloneDeep(data.data[index])
            };
          }
        });

        const mockDatum = {
          datum: { x: dataSet.x, y: dataSet.y, index, itemsByKey, dataSets: _cloneDeep(dataSets) }
        };

        return {
          x: dataSet.x,
          y: null,
          itemsByKey,
          tooltip:
            (React.isValidElement(chartTooltip) && React.cloneElement(chartTooltip, { ...mockDatum })) ||
            chartTooltip({ ...mockDatum })
        };
      });
    }

    return tooltipDataSet;
  }

  /**
   * ToDo: monitor Victory charts release version increment around Voronoi container attributes.
   * Future updates could lead to additional unexpected behavior. Victory charts released a patch/fix
   * around attribute behavior for Voronoi containers. The behavior was already "unexpected" in that there appears
   * to be a need to provide the "label" attribute when using the "labelComponent" attribute, even if "label" is
   * just a pass-through. Providing `label={() => ''}` was a work-around, that is now `label={obj => obj}`. See
   * - https://github.com/FormidableLabs/victory/blob/master/CHANGELOG.md#3436-2020-05-18
   * - https://github.com/FormidableLabs/victory/pull/1581
   */
  /**
   * FixMe: Victory charts voronoi containers throw inaccurate coordinates on large graph widths
   * Issue is "patched" by removing the "x" dimension attribute for voronoi.
   * - https://github.com/RedHatInsights/curiosity-frontend/issues/318
   */
  /**
   * Return a chart/graph tooltip Victory container component to allow custom HTML tooltips.
   *
   * @returns {Node}
   */
  renderTooltip() {
    const { dataSetsToggle } = this;
    const { chartTooltip, dataSets } = this.props;

    if (!chartTooltip || Object.values(dataSetsToggle).filter(v => v === true).length === dataSets.length) {
      return null;
    }

    const VictoryVoronoiCursorContainer = createContainer('voronoi', 'cursor');
    const parsedTooltipData = this.getTooltipData();
    let globalContainerBounds = {};
    let globalTooltipBounds = {};

    const applyParsedTooltipData = ({ datum }) => {
      const t = parsedTooltipData.find(v => v.x === datum.x) || {};
      return t?.tooltip || '';
    };

    const FlyoutComponent = obj => {
      const containerRef = this.containerRef.current;
      const tooltipRef = this.tooltipRef.current;
      const containerBounds = (containerRef && containerRef.getBoundingClientRect()) || {};
      const tooltipBounds = (tooltipRef && tooltipRef.getBoundingClientRect()) || {};

      if (containerBounds.right) {
        globalContainerBounds = containerBounds;
      }

      if (tooltipBounds.right) {
        globalTooltipBounds = tooltipBounds;
      }

      let xCoordinate = obj.x + 10;

      if (
        globalContainerBounds.right < globalTooltipBounds.right ||
        obj.x + globalTooltipBounds.width > globalContainerBounds.right / 2
      ) {
        xCoordinate = obj.x - 10 - globalTooltipBounds.width;
      }

      const htmlContent = applyParsedTooltipData({ ...obj });

      if (htmlContent) {
        return (
          <g>
            <foreignObject x={xCoordinate} y={obj.y / 2.2} width="100%" height="100%">
              <div ref={this.tooltipRef} style={{ display: 'inline-block' }} xmlns="http://www.w3.org/1999/xhtml">
                {htmlContent}
              </div>
            </foreignObject>
          </g>
        );
      }

      return <g />;
    };

    return (
      <VictoryVoronoiCursorContainer
        cursorDimension="x"
        labels={obj => obj}
        labelComponent={<FlyoutComponent />}
        voronoiPadding={60}
      />
    );
  }

  /**
   * Return a custom chart/graph legend component.
   *
   * @returns {Node}
   */
  renderLegend() {
    const { chartLegend, dataSets } = this.props;

    if (!chartLegend) {
      return null;
    }

    const legendProps = {
      datum: { dataSets: _cloneDeep(dataSets) },
      chart: {
        hide: this.onHide,
        revert: this.onRevert,
        toggle: this.onToggle,
        isToggled: this.getIsToggled
      }
    };

    return (
      (React.isValidElement(chartLegend) && React.cloneElement(chartLegend, { ...legendProps })) ||
      chartLegend({ ...legendProps })
    );
  }

  /**
   * Return a list/array of both stacked and non-stacked charts/graphs.
   *
   * @param {boolean} stacked
   * @returns {Array}
   */
  renderChart({ stacked = false }) {
    const { dataSetsToggle } = this;
    const { dataSets } = this.props;
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

      if (dataSet.strokeWidth) {
        dataColorStroke.data.strokeWidth = dataSet.strokeWidth;
      }

      if (dataSet.strokeDasharray) {
        dataColorStroke.data.strokeDasharray = dataSet.strokeDasharray;
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

      if (dataSet.strokeWidth) {
        dataColorStroke.data.strokeWidth = dataSet.strokeWidth;
      }

      return (
        <PfChartArea
          animate={dataSet.animate || false}
          interpolation={dataSet.interpolation || 'monotoneX'}
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
      if (!dataSetsToggle[dataSet.id] && dataSet.data && dataSet.data.length) {
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

  /**
   * Render a chart/graph.
   *
   * @returns {Node}
   */
  render() {
    const { chartWidth } = this.state;
    const { chartLegend, padding, themeColor } = this.props;

    const { isXAxisTicks, xAxisProps, yAxisProps } = this.getChartTicks();
    const { chartDomain, maxY } = this.getChartDomain({ isXAxisTicks });
    const tooltipComponent = { containerComponent: (maxY >= 0 && this.renderTooltip()) || undefined };
    const chartProps = { padding, ...chartDomain, ...tooltipComponent };

    return (
      <div
        id="curiosity-chartarea"
        className="uxui-curiosity__modal uxui-curiosity__modal--loading"
        ref={this.containerRef}
      >
        <Chart animate={{ duration: 0 }} width={chartWidth} themeColor={themeColor} {...chartProps}>
          <ChartAxis {...xAxisProps} animate={false} />
          <ChartAxis {...yAxisProps} animate={false} />
          {this.renderChart({})}
          <ChartStack>{this.renderChart({ stacked: true })}</ChartStack>
        </Chart>
        {chartLegend && <div className="curiosity-chartarea-description victory-legend">{this.renderLegend()}</div>}
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{chartLegend: Node|Function, chartTooltip: Node|Function, padding, xAxisTickFormat: Function,
 *     themeColor: string, yAxisTickFormat: Function, domain: object|Array, dataSets: object,
 *     xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number, height: number}}
 */
ChartArea.propTypes = {
  chartLegend: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  chartTooltip: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  dataSets: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number,
          xAxisLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)])
        })
      ),
      animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
      fill: PropTypes.string,
      stroke: PropTypes.string,
      strokeWidth: PropTypes.number,
      strokeDasharray: PropTypes.string,
      themeColor: PropTypes.string,
      themeVariant: PropTypes.string,
      id: PropTypes.string.isRequired,
      interpolation: PropTypes.string,
      legendLabel: PropTypes.string,
      legendSymbolType: PropTypes.string,
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
  xAxisFixLabelOverlap: PropTypes.bool,
  xAxisLabelIncrement: PropTypes.number,
  xAxisTickFormat: PropTypes.func,
  yAxisTickFormat: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{chartLegend: null, chartTooltip: null, padding: {top: number, left: number, bottom: number,
 *     right: number}, xAxisTickFormat: null, themeColor: string, yAxisTickFormat: null, domain: object,
 *     dataSets: Array, xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number, height: number}}
 */
ChartArea.defaultProps = {
  chartLegend: null,
  chartTooltip: null,
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
  xAxisFixLabelOverlap: false,
  xAxisLabelIncrement: 1,
  xAxisTickFormat: null,
  yAxisTickFormat: null
};

export { ChartArea as default, ChartArea };
