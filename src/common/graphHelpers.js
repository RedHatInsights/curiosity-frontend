import moment from 'moment';
import { rhelApiTypes } from '../types/rhelApiTypes';
import { translate } from '../components/i18n/i18n';

const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;

/**
 * Chart Date Format (used in axis and tooltips)
 */
const chartDateDayFormatShort = 'MMM D';
const chartDateDayFormat = 'MMM D YYYY';

const chartDateMonthFormatShort = 'MMM';
const chartDateMonthFormat = 'MMM YYYY';

const chartDateQuarterFormatShort = 'MMM';
const chartDateQuarterFormat = 'MMM YYYY';

/**
 * Returns x axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {number}
 */
const getChartXAxisLabelIncrement = granularity => {
  switch (granularity) {
    case GRANULARITY_TYPES.DAILY:
      return 5;
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.MONTHLY:
      return 2;
    case GRANULARITY_TYPES.QUARTERLY:
    default:
      return 1;
  }
};

/**
 * Return translated labels based on granularity.
 *
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {string} tooltipLabel
 * @returns {Object}
 */
const getGraphLabels = ({ granularity, tooltipLabel }) => {
  const labels = {
    label: tooltipLabel
  };

  switch (granularity) {
    case GRANULARITY_TYPES.WEEKLY:
      labels.previousLabel = translate('curiosity-graph.tooltipPreviousLabelWeekly');
      break;
    case GRANULARITY_TYPES.MONTHLY:
      labels.previousLabel = translate('curiosity-graph.tooltipPreviousLabelMonthly');
      break;
    case GRANULARITY_TYPES.QUARTERLY:
      labels.previousLabel = translate('curiosity-graph.tooltipPreviousLabelQuarterly');
      break;
    case GRANULARITY_TYPES.DAILY:
    default:
      labels.previousLabel = translate('curiosity-graph.tooltipPreviousLabelDaily');
      break;
  }

  return labels;
};

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
  const { label, previousLabel } = getGraphLabels({ granularity, tooltipLabel });
  const previousCount = data - previousData;
  const updatedLabel = `${data} ${label} ${formattedDate}`;

  if (previousData === null || previousCount === 0) {
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
 * @param {string} tooltipThresholdLabel
 * @returns {Object}
 */
const fillFormatChartData = ({ data, endDate, granularity, startDate, tooltipLabel, tooltipThresholdLabel }) => {
  const granularityType = getGranularityDateType(granularity);
  const granularityTick = getChartXAxisLabelIncrement(granularity);
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

    if (granularityType === 'quarters') {
      formattedDate = isNewYear
        ? momentDate.format(chartDateQuarterFormat)
        : momentDate.format(chartDateQuarterFormatShort);
    } else if (granularityType === 'months') {
      formattedDate = isNewYear
        ? momentDate.format(chartDateMonthFormat)
        : momentDate.format(chartDateMonthFormatShort);
    } else {
      formattedDate = isNewYear ? momentDate.format(chartDateDayFormat) : momentDate.format(chartDateDayFormatShort);
    }

    const yAxis = (data[stringDate] && data[stringDate].data) || 0;
    const yAxisThreshold = (data[stringDate] && data[stringDate].dataThreshold) || 0;

    isThreshold = isThreshold || yAxisThreshold > 0;

    const labelData = {
      data: yAxis,
      previousData,
      formattedDate,
      granularity,
      tooltipLabel
    };

    chartDataThresholds.push({
      x: chartData.length,
      y: yAxisThreshold,
      tooltip: getThresholdLabel({ yValue: yAxisThreshold, tooltipThresholdLabel })
    });

    chartData.push({
      x: chartData.length,
      y: yAxis,
      tooltip: getLabel(labelData),
      xAxisLabel:
        granularityType === 'months' || granularityType === 'quarters'
          ? formattedDate.replace(/\s/, '\n')
          : formattedDate
    });

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
 * @param {Array} data
 * @param {string} dataFacet the response property used for the y axis
 * @param {string} dataThresholdFacet the response property for the threshold line indicator
 * @param {string} tooltipLabel the tooltip label
 * @param {string} tooltipThresholdLabel the tooltip threshold label
 * @param {date} startDate
 * @param {date} endDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {Object} Object array result converted { chartData: {...} chartDomain {...} }
 */
const convertChartData = ({
  data,
  dataFacet,
  dataThresholdFacet,
  tooltipLabel,
  tooltipThresholdLabel,
  startDate,
  endDate,
  granularity
}) => {
  const formattedData = {};

  (data || []).forEach(value => {
    if (value) {
      const stringDate = moment
        .utc(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE])
        .startOf('day')
        .toISOString();
      formattedData[stringDate] = {
        data: Number.parseInt(value[dataFacet], 10),
        dataThreshold: Number.parseInt(value[dataThresholdFacet], 10)
      };
    }
  });

  const { chartData, chartDataThresholds } = fillFormatChartData({
    data: formattedData,
    endDate,
    granularity,
    startDate,
    tooltipLabel,
    tooltipThresholdLabel
  });

  return {
    chartData,
    chartDataThresholds,
    chartXAxisLabelIncrement: getChartXAxisLabelIncrement(granularity)
  };
};

const graphHelpers = {
  fillFormatChartData,
  convertChartData,
  getGranularityDateType,
  getGraphLabels,
  getChartXAxisLabelIncrement,
  getLabel
};

export {
  graphHelpers as default,
  graphHelpers,
  fillFormatChartData,
  convertChartData,
  getGranularityDateType,
  getGraphLabels,
  getChartXAxisLabelIncrement,
  getLabel
};
