import React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { helpers } from '../../common';

/**
 * @memberof Chart
 * @module ChartHelpers
 */

/**
 * Available chart types
 *
 * @type {{area: string, line: string, threshold: string}}
 */
const ChartTypeVariant = {
  area: 'area',
  line: 'line',
  threshold: 'threshold'
};

/**
 * Generate max X and Y values from datasets.
 *
 * @param {object} params
 * @param {Array} params.dataSets
 * @returns {{individualMaxY: object, maxY: number, maxX: number}}
 */
const generateMaxXY = ({ dataSets = [] } = {}) => {
  const individualDataSetsMaxY = {};
  let combinedDataSetMaxX = 0;
  let combinedDataSetsMaxY = 0;

  dataSets
    .filter(({ isStacked }) => isStacked === true)
    .forEach(({ data }) => {
      if (Array.isArray(data)) {
        combinedDataSetsMaxY += Math.max(...data.map(value => value?.y ?? 0));
      }
    });

  dataSets.forEach(({ id, data }) => {
    let dataSetMaxY = 0;

    if (Array.isArray(data)) {
      combinedDataSetMaxX = data.length > combinedDataSetMaxX ? data.length : combinedDataSetMaxX;

      dataSetMaxY = Math.max(...data.map(value => value?.y ?? 0));
      combinedDataSetsMaxY = dataSetMaxY > combinedDataSetsMaxY ? dataSetMaxY : combinedDataSetsMaxY;
    }

    if (id) {
      individualDataSetsMaxY[id] = dataSetMaxY;
    }
  });

  return {
    maxX: combinedDataSetMaxX,
    maxY: combinedDataSetsMaxY,
    individualMaxY: individualDataSetsMaxY
  };
};

/**
 * Generate Y axis domain ranges from dataSets, ignore X axis.
 *
 * @param {object} params
 * @param {number|object} params.maxY
 * @param {object} params.padding
 * @returns {{ domain: { y: Array }, padding: {object} }}
 */
const generateDomains = ({ maxY, padding = {} } = {}) => {
  const updatedChartDomain = {};
  const updatedPadding = { ...padding };
  const generatedDomain = {};

  if (Object.values(maxY).length) {
    generatedDomain.y = [0, 1.25];
  } else if (maxY >= 0.1) {
    const floored = Math.pow(10, Math.floor(Math.log10(maxY || 10)));
    generatedDomain.y = [0, Math.ceil((maxY + 1) / floored) * floored];
  } else if (maxY < 0.1) {
    generatedDomain.y = [0, maxY + maxY / 4 || 10];
  } else {
    generatedDomain.y = [0, 10];
  }

  if (maxY < 0.01) {
    updatedPadding.left += generatedDomain.y.toString().length;
    updatedPadding.right += generatedDomain.y.toString().length;
  }

  if (Object.keys(generatedDomain).length) {
    updatedChartDomain.domain = generatedDomain;
  }

  return {
    ...updatedChartDomain,
    padding: updatedPadding
  };
};

/**
 * Generate chart element props.
 *
 * @param {object} params
 * @param {Array} params.dataSets
 * @param {number} params.maxX
 * @param {number} params.maxY
 * @param {Function} params.xValueFormat
 * @param {Function} params.yValueFormat
 * @param {object} options
 * @param {object} options.chartTypeVariant
 * @returns {{elementsById: object, stackedElements: Array, stackedElementsById: object, elements: Array}}
 */
const generateElementsProps = (
  { dataSets = [], maxX, maxY, xValueFormat, yValueFormat } = {},
  { chartTypeVariant = ChartTypeVariant } = {}
) => {
  const elements = [];
  const stackedElements = [];
  const elementsById = {};
  const stackedElementsById = {};

  dataSets.forEach(dataSet => {
    const { animate, chartType, data, fill, id, isStacked, interpolation, stroke, strokeDasharray, strokeWidth } =
      dataSet;

    if (data?.length) {
      const dataColorStroke = {
        data: {}
      };

      if (fill && chartType !== chartTypeVariant.line && chartType !== chartTypeVariant.threshold) {
        dataColorStroke.data.fill = fill;
      }

      if (stroke) {
        dataColorStroke.data.stroke = stroke;
      }

      if (strokeDasharray) {
        dataColorStroke.data.strokeDasharray = strokeDasharray;
      }

      if (strokeWidth) {
        dataColorStroke.data.strokeWidth = strokeWidth;
      }

      const defaultProps = {};

      if (animate) {
        defaultProps.animate = animate;
      }

      if (interpolation) {
        defaultProps.interpolation = interpolation;
      }

      const chartElementProps = {
        ...defaultProps,
        key: `chart-${dataSet.id}-${chartType || ''}`,
        name: `chart-${dataSet.id}-${chartType || ''}`,
        data: dataSet.data,
        style: { ...(dataSet.style || {}), ...dataColorStroke },
        themeColor: dataSet.themeColor,
        themeVariant: dataSet.themeVariant,
        x:
          (xValueFormat &&
            (datum => {
              const xValue = xValueFormat({ datum, maxX });
              return xValue === undefined || Number.isNaN(xValue) ? 0 : xValue;
            })) ||
          undefined,
        y: datum => {
          let yValue;

          if (yValueFormat) {
            yValue = yValueFormat({
              datum,
              isMultiAxis: typeof maxY !== 'number',
              maxY: typeof maxY === 'number' ? maxY : maxY?.[dataSet.id]
            });
          } else {
            yValue = typeof maxY === 'number' ? datum.y : datum.y / maxY?.[dataSet.id]; // eslint-disable-line
          }

          return yValue === undefined || Number.isNaN(yValue) ? 0 : yValue;
        }
      };

      const props = { ...chartElementProps };
      const updatedProps = { chartType, props };

      if (isStacked) {
        stackedElementsById[id] = updatedProps;
        stackedElements.push(updatedProps);
      } else {
        elementsById[id] = updatedProps;
        elements.push(updatedProps);
      }
    }
  });

  return {
    elements,
    elementsById,
    stackedElements,
    stackedElementsById
  };
};

/**
 * Preprocess datasets for tooltips.
 *
 * @param {object} params
 * @param {React.ReactNode|Function} params.content
 * @param {Array} params.dataSets
 * @returns {{}}
 */
const generateTooltipData = ({ content = helpers.noop, dataSets = [] } = {}) => {
  const tooltipDataSetLookUp = {};

  if (content && Array.isArray(dataSets?.[0]?.data)) {
    dataSets[0].data.forEach((dataSet, index) => {
      const itemsByKey = {};

      dataSets.forEach(data => {
        if (data?.data?.[index]) {
          itemsByKey[data.id] = {
            color: data.stroke || data.fill || data.color || '',
            chartType: data.chartType,
            data: _cloneDeep(data.data[index])
          };
        }
      });

      const mockDatum = {
        datum: { x: dataSet.x, y: dataSet.y, index, itemsByKey }
      };

      tooltipDataSetLookUp[dataSet.x] = {
        x: dataSet.x,
        y: null,
        itemsByKey,
        tooltip:
          (React.isValidElement(content) && React.cloneElement(content, { ...mockDatum })) || content({ ...mockDatum })
      };
    });
  }

  return tooltipDataSetLookUp;
};

/**
 * Generate X axis props, ticks, tick formatting.
 *
 * @param {object} params
 * @param {object} params.dataSet
 * @param {number} params.maxX
 * @param {number} params.xAxisLabelIncrement
 * @param {object} params.xAxisPropDefaults
 * @param {Function} params.xAxisTickFormat
 * @returns {{tickFormat: (function(*)), tickValues: *}}
 */
const generateXAxisProps = ({
  dataSet = {},
  maxX,
  xAxisLabelIncrement,
  xAxisPropDefaults = {},
  xAxisTickFormat
} = {}) => {
  const { data = [], xAxisChartLabel } = dataSet;
  const axisProps = {
    ...xAxisPropDefaults,
    tickValues: data.reduce(
      (acc, current, index) => (index % xAxisLabelIncrement === 0 ? acc.concat(current.x) : acc),
      []
    ),
    tickFormat: tick => data[tick]?.xAxisLabel || tick
  };

  if (typeof xAxisChartLabel === 'function') {
    axisProps.label = xAxisChartLabel({ ...dataSet, xAxisChartLabel: undefined });
  } else {
    axisProps.label = xAxisChartLabel;
  }

  if (typeof xAxisTickFormat === 'function') {
    axisProps.tickFormat = tick => {
      const tickIndex = axisProps.tickValues.indexOf(tick);
      const previousItem = { ...data[axisProps.tickValues[tickIndex - 1]] };
      const nextItem = { ...data[axisProps.tickValues[tickIndex + 1]] };
      const item = { ...data[tick] };

      return xAxisTickFormat({ tick, previousItem, item, nextItem, maxX });
    };
  }

  return axisProps;
};

/**
 * Generate Y axis props, ticks, tick formatting.
 *
 * @param {object} params
 * @param {Array} params.dataSets
 * @param {number|object} params.maxY
 * @param {object} params.yAxisPropDefaults
 * @param {Function} params.yAxisTickFormat
 * @returns {Array}
 */
const generateYAxisProps = ({ dataSets = [], maxY, yAxisPropDefaults = {}, yAxisTickFormat } = {}) => {
  const axisProps = [];
  const isMultiAxis = dataSets.length > 1;

  dataSets.forEach(({ yAxisChartLabel, id, stroke, strokeWidth, ...dataSet } = {}, index) => {
    const updatedAxisProps = {
      style: { axis: {}, tickLabels: {} },
      tickFormat: tick => tick
    };

    if (isMultiAxis && stroke) {
      updatedAxisProps.style.axis.stroke = stroke;
    }

    if (isMultiAxis && strokeWidth) {
      updatedAxisProps.style.axis.strokeWidth = strokeWidth;
    }

    if (typeof yAxisChartLabel === 'function') {
      updatedAxisProps.label = yAxisChartLabel({ id, stroke, strokeWidth, ...dataSet });
    } else {
      updatedAxisProps.label = yAxisChartLabel;
    }

    if (typeof yAxisTickFormat === 'function') {
      const updatedMaxY = (typeof maxY === 'number' && maxY) || maxY?.[id];

      updatedAxisProps.tickFormat = tick => {
        const normalizedTick = (isMultiAxis && tick * updatedMaxY) || tick;

        return yAxisTickFormat({
          tick: normalizedTick,
          isMultiAxis,
          maxY: updatedMaxY
        });
      };
    }

    axisProps.push({
      ...yAxisPropDefaults,
      ...updatedAxisProps,
      orientation: (index === 0 && 'left') || 'right'
    });
  });

  return axisProps;
};

/**
 * Generate x,y props.
 *
 * @param {object} params
 * @param {Array} params.dataSets
 * @param {object} params.individualMaxY
 * @param {number} params.maxX
 * @param {number} params.maxY
 * @param {React.ReactNode|Function} params.xAxisChartLabel
 * @param {React.ReactNode|Function} params.yAxisChartLabel
 * @param {boolean} params.xAxisFixLabelOverlap
 * @param {number} params.xAxisLabelIncrement
 * @param {Function} params.xAxisTickFormat
 * @param {Function} params.yAxisTickFormat
 * @returns {{xAxisProps: object, yAxisProps: Array}}
 */
const generateAxisProps = ({
  dataSets = [],
  individualMaxY = {},
  maxX,
  maxY,
  xAxisChartLabel,
  yAxisChartLabel,
  xAxisFixLabelOverlap = true,
  xAxisLabelIncrement = 1,
  xAxisTickFormat,
  yAxisTickFormat
} = {}) => {
  const xAxisPropDefaults = {
    fixLabelOverlap: xAxisFixLabelOverlap
  };

  const yAxisPropDefaults = {
    dependentAxis: true,
    showGrid: true
  };

  let yAxisDataSets = [];
  let xAxisDataSet;

  dataSets.forEach(dataSet => {
    if (dataSet.yAxisUseDataSet) {
      yAxisDataSets.push({
        yAxisChartLabel,
        ...dataSet
      });
    }
    if (dataSet.xAxisUseDataSet) {
      xAxisDataSet = {
        xAxisChartLabel,
        ...dataSet
      };
    }
  });

  if (!yAxisDataSets.length) {
    yAxisDataSets.push({
      yAxisChartLabel,
      ...dataSets?.[0]
    });
  } else {
    yAxisDataSets = yAxisDataSets.slice(0, 2);
  }

  if (!xAxisDataSet) {
    xAxisDataSet = {
      xAxisChartLabel,
      ...dataSets?.[0]
    };
  }

  const updatedMaxY = (yAxisDataSets.length > 1 && individualMaxY) || maxY;

  return {
    xAxisProps: generateXAxisProps({
      dataSet: xAxisDataSet,
      maxX,
      xAxisLabelIncrement,
      xAxisPropDefaults,
      xAxisTickFormat
    }),
    yAxisProps: generateYAxisProps({ dataSets: yAxisDataSets, maxY: updatedMaxY, yAxisPropDefaults, yAxisTickFormat })
  };
};

const chartHelpers = {
  ChartTypeVariant,
  generateAxisProps,
  generateDomains,
  generateElementsProps,
  generateMaxXY,
  generateTooltipData,
  generateXAxisProps,
  generateYAxisProps
};

export {
  chartHelpers as default,
  chartHelpers,
  ChartTypeVariant,
  generateAxisProps,
  generateDomains,
  generateElementsProps,
  generateMaxXY,
  generateTooltipData,
  generateXAxisProps,
  generateYAxisProps
};
