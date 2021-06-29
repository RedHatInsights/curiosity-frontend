import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChartThemeColor } from '@patternfly/react-charts';
import { ChartContext } from './chartContext';
import { ChartElements } from './chartElements';
import { ChartLegend } from './chartLegend';
import { chartHelpers } from './chartHelpers';
import { useResizeObserver } from '../../hooks/useWindow';

/**
 * Return a chart and elements with a context provider.
 *
 * @param {object} props
 * @param {Node|Function} props.chartLegend
 * @param {Node|Function} props.chartTooltip
 * @param {Array} props.dataSets
 * @param {object} props.padding
 * @param {string} props.themeColor
 * @param {boolean} props.xAxisFixLabelOverlap
 * @param {number} props.xAxisLabelIncrement
 * @param {Function} props.xAxisTickFormat
 * @param {Function} props.yAxisTickFormat
 * @param {Function} props.xValueFormat
 * @param {Function} props.yValueFormat
 * @returns {Node}
 */
const Chart = ({
  chartLegend,
  chartTooltip,
  dataSets,
  padding,
  themeColor,
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
        xAxisFixLabelOverlap,
        xAxisLabelIncrement,
        xAxisTickFormat,
        yAxisTickFormat
      });

      const isMultiYAxis = yAxisProps.length > 1;
      const chartElementsProps = chartHelpers.generateElementsProps({
        dataSets: toggledDataSets,
        isMultiYAxis,
        maxX,
        maxY,
        xValueFormat,
        yValueFormat
      });
      const chartDomain = chartHelpers.generateDomains({ maxY: (isMultiYAxis && individualMaxY) || maxY });
      const hasData = !!xAxisProps.tickValues;

      return {
        xAxisProps,
        yAxisProps,
        chartDomain,
        chartElementsProps,
        hasData,
        isMultiYAxis,
        maxX,
        maxY: (isMultiYAxis && individualMaxY) || maxY,
        padding,
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
    yAxisTickFormat,
    xAxisTickFormat,
    xAxisLabelIncrement,
    xAxisFixLabelOverlap,
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
 * @type {{chartTooltip: Node|Function, xValueFormat: Function, padding: {top: number, left: number, bottom: number,
 *     right: number}, xAxisTickFormat: Function, themeColor: string, chartLegend: Node|Function,
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
      chartType: PropTypes.oneOf(['area', 'line', 'threshold']),
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
 * @type {{chartTooltip: Node|Function, xValueFormat: Function, padding: {top: number, left: number, bottom: number,
 *     right: number}, xAxisTickFormat: Function, themeColor: string, chartLegend: Node|Function,
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
  xAxisFixLabelOverlap: true,
  xAxisLabelIncrement: 1,
  xAxisTickFormat: null,
  yAxisTickFormat: null,
  xValueFormat: null,
  yValueFormat: null
};

export { Chart as default, Chart };
