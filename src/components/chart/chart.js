import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChartThemeColor } from '@patternfly/react-charts';
import { ChartContext } from './chartContext';
import { ChartElements } from './chartElements';
import { ChartLegend } from './chartLegend';
import { chartHelpers, ChartTypeVariant } from './chartHelpers';
import { useResizeObserver } from '../../hooks/useWindow';

/**
 * PF Charts/Victory area, and line, charts generator.
 *
 * @memberof Components
 * @module Chart
 * @property {module} ChartAxisLabel
 * @property {module} ChartContext
 * @property {module} ChartElements
 * @property {module} ChartHelpers
 * @property {module} ChartIcon
 * @property {module} ChartLegend
 * @property {module} ChartTooltip
 */

/**
 * Return a chart and elements with a context provider.
 *
 * @param {object} props
 * @param {React.ReactNode|Function} props.chartLegend
 * @param {React.ReactNode|Function} props.chartTooltip
 * @param {Array} props.dataSets
 * @param {object} props.padding
 * @param {string} props.themeColor
 * @param {React.ReactNode|Function} props.xAxisChartLabel
 * @param {React.ReactNode|Function} props.yAxisChartLabel
 * @param {boolean} props.xAxisFixLabelOverlap
 * @param {number} props.xAxisLabelIncrement
 * @param {Function} props.xAxisTickFormat
 * @param {Function} props.yAxisTickFormat
 * @param {Function} props.xValueFormat
 * @param {Function} props.yValueFormat
 * @returns {React.ReactNode}
 */
const Chart = ({
  chartLegend,
  chartTooltip,
  dataSets,
  padding,
  themeColor,
  xAxisChartLabel,
  yAxisChartLabel,
  xAxisFixLabelOverlap,
  xAxisLabelIncrement,
  xAxisTickFormat,
  yAxisTickFormat,
  xValueFormat,
  yValueFormat
}) => {
  const [context, setContext] = useState();
  const [dataSetsToggle, setDataSetsToggle] = useState({});
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const { width: chartWidth } = useResizeObserver(containerRef);

  useEffect(() => {
    /**
     * Aggregate chart related settings.
     *
     * @returns {{isMultiYAxis: boolean, padding: object, chartDomain: {domain: {y: Array}}, tooltipDataSetLookUp: {},
     *     xAxisProps: object, themeColor: string, maxY: (object|number), hasData: boolean, maxX: number,
     *     yAxisProps: Array, chartElementsProps: {elementsById: object, stackedElements: Array,
     *     stackedElementsById: object, elements: Array}}}
     */
    const updateChartSettings = () => {
      const toggledDataSets = dataSets.filter(({ id }) => !dataSetsToggle[id]);

      const tooltipDataSetLookUp = chartHelpers.generateTooltipData({
        content: chartTooltip,
        dataSets: toggledDataSets
      });

      const { maxX, maxY } = chartHelpers.generateMaxXY({ dataSets: toggledDataSets });
      const { individualMaxY } = chartHelpers.generateMaxXY({ dataSets });
      const { xAxisProps, yAxisProps } = chartHelpers.generateAxisProps({
        dataSets,
        individualMaxY,
        maxX,
        maxY,
        xAxisChartLabel,
        yAxisChartLabel,
        xAxisFixLabelOverlap,
        xAxisLabelIncrement,
        xAxisTickFormat,
        yAxisTickFormat
      });

      const isMultiYAxis = yAxisProps.length > 1;
      const chartElementsProps = chartHelpers.generateElementsProps({
        dataSets: toggledDataSets,
        maxX,
        maxY: (isMultiYAxis && individualMaxY) || maxY,
        xValueFormat,
        yValueFormat
      });
      const { domain, padding: domainPadding } = chartHelpers.generateDomains({
        maxY: (isMultiYAxis && individualMaxY) || maxY,
        padding
      });
      const hasData = !!xAxisProps.tickValues;
      const updatedPadding = { bottom: 0, left: 0, right: 0, top: 0, ...padding, ...domainPadding };

      return {
        xAxisProps,
        yAxisProps,
        chartDomain: { domain },
        chartElementsProps,
        hasData,
        isMultiYAxis,
        maxX,
        maxY: (isMultiYAxis && individualMaxY) || maxY,
        padding: updatedPadding,
        themeColor,
        tooltipDataSetLookUp
      };
    };

    const chartSettings = updateChartSettings();
    const updatedSettings = {
      chartContainerRef: () => containerRef,
      chartSettings: { ...chartSettings, chartLegend, chartWidth, dataSets },
      chartTooltipRef: () => tooltipRef,
      dataSetsToggle: [dataSetsToggle, setDataSetsToggle]
    };

    setContext(updatedSettings);
  }, [
    chartLegend,
    chartTooltip,
    chartWidth,
    dataSets,
    dataSetsToggle,
    padding,
    setContext,
    themeColor,
    xAxisChartLabel,
    yAxisChartLabel,
    xAxisFixLabelOverlap,
    xAxisLabelIncrement,
    yAxisTickFormat,
    xAxisTickFormat,
    xValueFormat,
    yValueFormat
  ]);

  return (
    <ChartContext.Provider value={context}>
      <div
        id="curiosity-chartarea"
        className="curiosity-chartarea uxui-curiosity__modal uxui-curiosity__modal--loading"
        ref={containerRef}
      >
        {chartWidth > 0 && (
          <React.Fragment>
            <ChartElements />
            <ChartLegend />
          </React.Fragment>
        )}
      </div>
    </ChartContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{chartTooltip: React.ReactNode|Function, xValueFormat: Function, padding: {top: number, left: number, bottom: number,
 *     right: number}, xAxisTickFormat: Function, themeColor: string, chartLegend: React.ReactNode|Function,
 *     yAxisTickFormat: Function, dataSets: Array, xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number,
 *     yValueFormat: Function}}
 */
Chart.propTypes = {
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
      chartType: PropTypes.oneOf([...Object.values(ChartTypeVariant)]),
      fill: PropTypes.string,
      stroke: PropTypes.string,
      strokeWidth: PropTypes.number,
      strokeDasharray: PropTypes.string,
      themeColor: PropTypes.string,
      themeVariant: PropTypes.string,
      id: PropTypes.string.isRequired,
      interpolation: PropTypes.string,
      style: PropTypes.object,
      isStacked: PropTypes.bool,
      xAxisChartLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      yAxisChartLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      xAxisUseDataSet: PropTypes.bool,
      yAxisUseDataSet: PropTypes.bool
    })
  ),
  padding: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  }),
  themeColor: PropTypes.oneOf(Object.values(ChartThemeColor)),
  xAxisChartLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  yAxisChartLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  xAxisFixLabelOverlap: PropTypes.bool,
  xAxisLabelIncrement: PropTypes.number,
  xAxisTickFormat: PropTypes.func,
  yAxisTickFormat: PropTypes.func,
  xValueFormat: PropTypes.func,
  yValueFormat: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{chartTooltip: React.ReactNode|Function, xValueFormat: Function, padding: {top: number, left: number, bottom: number,
 *     right: number}, xAxisTickFormat: Function, themeColor: string, chartLegend: React.ReactNode|Function,
 *     yAxisTickFormat: Function, dataSets: Array, xAxisFixLabelOverlap: boolean, xAxisLabelIncrement: number,
 *     yValueFormat: Function}}
 */
Chart.defaultProps = {
  chartLegend: null,
  chartTooltip: null,
  dataSets: [],
  padding: {
    bottom: 75,
    left: 55,
    right: 55,
    top: 50
  },
  themeColor: 'blue',
  xAxisChartLabel: null,
  yAxisChartLabel: null,
  xAxisFixLabelOverlap: true,
  xAxisLabelIncrement: 1,
  xAxisTickFormat: null,
  yAxisTickFormat: null,
  xValueFormat: null,
  yValueFormat: null
};

export { Chart as default, Chart, ChartTypeVariant };
