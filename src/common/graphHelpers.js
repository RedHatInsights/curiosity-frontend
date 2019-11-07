import moment from 'moment';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../types/rhelApiTypes';
import { dateHelpers } from './dateHelpers';
import { rhelGraphCardHelpers } from '../components/rhelGraphCard/rhelGraphCardHelpers';

/**
 * Return a time allotment based on granularity
 *
 * @param {string} granularity enum based on rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getGranularityDateType = granularity => {
  switch (granularity) {
    case GRANULARITY_TYPES.WEEKLY:
      return 'weeks';
    case GRANULARITY_TYPES.MONTHLY:
      return 'months';
    case GRANULARITY_TYPES.QUARTERLY:
      return 'quarters';
    case GRANULARITY_TYPES.DAILY:
    default:
      return 'days';
  }
};

/**
 * Apply label formatting
 *
 * @param {number} data
 * @param {number} previousData
 * @param {string} formattedDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {string} tooltipLabel
 * @returns {string}
 */
const getLabel = ({ data, previousData, formattedDate, granularity, tooltipLabel }) => {
  const { label, previousLabel } = rhelGraphCardHelpers.getGraphLabels({ granularity, tooltipLabel });
  const previousCount = data - previousData;
  const updatedLabel = `${data} ${label} ${formattedDate}`;

  if (!previousData || previousCount === 0) {
    return updatedLabel;
  }

  return `${updatedLabel}\n ${previousCount > -1 ? '+' : ''}${previousCount} ${previousLabel}`;
};

/**
 * Apply Threshold Label formatting
 * @param {number} yValue the yaxis value
 * @param {string} tooltipThresholdLabel the threshold label
 */
const getThresholdLabel = ({ yValue, tooltipThresholdLabel }) => {
  return `${tooltipThresholdLabel}: ${yValue}`;
};

// ToDo: when the API returns filler date values "fillFormatChartData" should be updated
/**
 * Fill missing dates, and format graph data
 *
 * @param {Array} data
 * @param {Date} endDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {Date} startDate
 * @param {string} tooltipLabel
 * @param {string} tooltipLabelNoData
 * @param {string} tooltipThresholdLabel
 * @returns {Object}
 */
const fillFormatChartData = ({
  data,
  endDate,
  granularity,
  startDate,
  tooltipLabel,
  tooltipLabelNoData,
  tooltipThresholdLabel
}) => {
  const granularityType = getGranularityDateType(granularity);
  const granularityTick = rhelGraphCardHelpers.getChartXAxisLabelIncrement(granularity);
  const endDateStartDateDiff = moment(endDate).diff(startDate, granularityType);
  const chartData = [];
  const chartDataThresholds = [];

  let isThreshold = false;
  let previousData = null;
  let previousYear = null;

  for (let i = 0; i <= endDateStartDateDiff; i++) {
    const momentDate = moment
      .utc(startDate)
      .add(i, granularityType)
      .startOf(granularityType);
    const stringDate = momentDate.toISOString();
    const year = parseInt(momentDate.year(), 10);

    const checkTick = i % granularityTick === 0;
    const isNewYear = i !== 0 && checkTick && year !== previousYear;
    let formattedDate;
    let formattedDateTooltip;

    if (granularityType === 'quarters') {
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampQuarterFormats.yearShort)
        : momentDate.format(dateHelpers.timestampQuarterFormats.short);

      formattedDateTooltip = isNewYear
        ? momentDate.format(dateHelpers.timestampQuarterFormats.yearLong)
        : momentDate.format(dateHelpers.timestampQuarterFormats.long);
    } else if (granularityType === 'months') {
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampMonthFormats.yearShort)
        : momentDate.format(dateHelpers.timestampMonthFormats.short);

      formattedDateTooltip = isNewYear
        ? momentDate.format(dateHelpers.timestampMonthFormats.yearLong)
        : momentDate.format(dateHelpers.timestampMonthFormats.long);
    } else {
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampDayFormats.yearShort)
        : momentDate.format(dateHelpers.timestampDayFormats.short);

      formattedDateTooltip = isNewYear
        ? momentDate.format(dateHelpers.timestampDayFormats.yearLong)
        : momentDate.format(dateHelpers.timestampDayFormats.long);
    }

    const yAxis = (data[stringDate] && data[stringDate].data) || 0;
    const yAxisThreshold = (data[stringDate] && data[stringDate].dataThreshold) || 0;

    isThreshold = isThreshold || yAxisThreshold > 0;

    const labelData = {
      data: yAxis,
      previousData,
      formattedDate: formattedDateTooltip,
      granularity,
      tooltipLabel
    };

    const chartDataThresholdsItem = {
      x: chartData.length,
      y: yAxisThreshold
    };

    if (yAxisThreshold) {
      chartDataThresholdsItem.tooltip = getThresholdLabel({ yValue: yAxisThreshold, tooltipThresholdLabel });
    }

    chartDataThresholds.push(chartDataThresholdsItem);

    const chartDataItem = {
      x: chartData.length,
      y: yAxis,
      xAxisLabel:
        granularityType === 'months' || granularityType === 'quarters'
          ? formattedDate.replace(/\s/, '\n')
          : formattedDate
    };

    chartDataItem.tooltip = yAxis ? getLabel(labelData) : tooltipLabelNoData;

    if ((!yAxis && yAxisThreshold) || !chartDataItem.tooltip) {
      delete chartDataItem.tooltip;
    }

    chartData.push(chartDataItem);

    previousData = yAxis;

    if (checkTick && year !== previousYear) {
      previousYear = year;
    }
  }

  return { chartData, chartDataThresholds: (isThreshold && chartDataThresholds) || [] };
};

/**
 * ToDo: the y axis should be a total of all y axis values, an aspect of threshold
 * When multiple data facets are being displayed "convertChartData" should be cleaned up.
 */
/**
 * Convert graph data to consumable format
 *
 * @param {Array} data list of available report data
 * @param {Array} dataThreshold list of available capacity data
 * @param {string} tooltipLabel the tooltip label
 * @param {string} tooltipLabelNoData
 * @param {string} tooltipThresholdLabel the tooltip threshold label
 * @param {date} startDate
 * @param {date} endDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {Object} Object array result converted { chartData: {...} chartDomain {...} }
 */
const convertChartData = ({
  data,
  dataThreshold,
  tooltipLabel,
  tooltipLabelNoData,
  tooltipThresholdLabel,
  startDate,
  endDate,
  granularity
}) => {
  const formattedData = {};

  (data || []).forEach((value, index) => {
    if (value) {
      const stringDate = moment
        .utc(value.date)
        .startOf('day')
        .toISOString();

      formattedData[stringDate] = {
        data: value.y,
        dataThreshold: (dataThreshold && dataThreshold[index] && dataThreshold[index].y) || 0
      };
    }
  });

  const { chartData, chartDataThresholds } = fillFormatChartData({
    data: formattedData,
    endDate,
    granularity,
    startDate,
    tooltipLabel,
    tooltipLabelNoData,
    tooltipThresholdLabel
  });

  return {
    chartData,
    chartDataThresholds,
    chartXAxisLabelIncrement: rhelGraphCardHelpers.getChartXAxisLabelIncrement(granularity)
  };
};

const graphHelpers = {
  fillFormatChartData,
  convertChartData,
  getGranularityDateType,
  getLabel
};

export {
  graphHelpers as default,
  graphHelpers,
  fillFormatChartData,
  convertChartData,
  getGranularityDateType,
  getLabel
};
