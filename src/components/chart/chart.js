import React, { useRef, useState } from 'react';
import { ChartThemeColor } from '@patternfly/react-charts/victory';
import { useShallowCompareEffect } from 'react-use';
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
 * @typedef {object} ChartPadding
 * @property {number} bottom
 * @property {number} left
 * @property {number} right
 * @property {number} top
 */

/**
 * @typedef {object} ChartDataSet
 * @property {Array<{x: number, y: (number|undefined), xAxisLabel: (number|string|Date|undefined)}>} data
 * @property {boolean|object} [animate]
 * @property {ChartTypeVariant} [chartType]
 * @property {string} [fill]
 * @property {string} [stroke]
 * @property {number} [strokeWidth]
 * @property {string} [strokeDasharray]
 * @property {string} [themeColor]
 * @property {string} [themeVariant]
 * @property {string} id
 * @property {string} [interpolation]
 * @property {object} [style]
 * @property {boolean} [isStacked]
 * @property {React.ReactNode|Function} [xAxisChartLabel]
 * @property {React.ReactNode|Function} [yAxisChartLabel]
 * @property {boolean} [xAxisUseDataSet]
 * @property {boolean} [yAxisUseDataSet]
 */

/**
 * Return a chart and elements with a context provider.
 *
 * @param {object} props
 * @param {React.ReactNode|Function} [props.chartLegend]
 * @param {React.ReactNode|Function} [props.chartTooltip]
 * @param {Array<ChartDataSet>} [props.dataSets=[]]
 * @param {ChartPadding} [props.padding={bottom:75, left:55, right:55, top:50 }]
 * @param {string|ChartThemeColor} [props.themeColor=ChartThemeColor.blue]
 * @param {React.ReactNode|Function} [props.xAxisChartLabel]
 * @param {React.ReactNode|Function} [props.yAxisChartLabel]
 * @param {boolean} [props.xAxisFixLabelOverlap=true]
 * @param {number} [props.xAxisLabelIncrement=1]
 * @param {Function} [props.xAxisTickFormat]
 * @param {Function} [props.yAxisTickFormat]
 * @param {Function} [props.xValueFormat]
 * @param {Function} [props.yValueFormat]
 * @returns {JSX.Element}
 */
const Chart = ({
  chartLegend,
  chartTooltip,
  dataSets = [],
  padding = {
    bottom: 75,
    left: 55,
    right: 55,
    top: 50
  },
  themeColor = ChartThemeColor.blue,
  xAxisChartLabel,
  yAxisChartLabel,
  xAxisFixLabelOverlap,
  xAxisLabelIncrement = 1,
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

  useShallowCompareEffect(() => {
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
        chartWidth,
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
        className="curiosity-chartarea uxui-curiosity__modal uxui-curiosity__modal--loading fadein"
        data-test="curiosity-chartarea"
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

export { Chart as default, Chart, ChartTypeVariant };
