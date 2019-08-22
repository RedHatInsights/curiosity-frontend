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
 * @returns {Object}
 */
const getGraphLabels = granularity => {
  const labels = {
    label: translate('curiosity-graph.tooltipLabel')
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
    case GRANULARITY_TYPES.DAILY:
      return 'days';
    case GRANULARITY_TYPES.WEEKLY:
      return 'weeks';
    case GRANULARITY_TYPES.MONTHLY:
    case GRANULARITY_TYPES.QUARTERLY:
    default:
      return 'months';
  }
};

/**
 * Apply label formatting
 *
 * @param {number} data
 * @param {number} previousData
 * @param {string} formattedDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getLabel = ({ data, previousData, formattedDate, granularity }) => {
  const { label, previousLabel } = getGraphLabels(granularity);
  const previousCount = data - previousData;
  const updatedLabel = `${data} ${label} ${formattedDate}`;

  if (previousData === null || previousCount === 0) {
    return updatedLabel;
  }

  return `${updatedLabel}\n ${previousCount > -1 ? '+' : ''}${previousCount} ${previousLabel}`;
};

// ToDo: when the API returns filler date values "fillFormatChartData" should be updated
/**
 * Fill missing dates, and format graph data
 *
 * @param {Array} data
 * @param {Date} endDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {Date} startDate
 * @returns {Array}
 */
const fillFormatChartData = ({ data, endDate, granularity, startDate }) => {
  const granularityType = getGranularityDateType(granularity);
  const granularityTick = getChartXAxisLabelIncrement(granularity);
  const endDateStartDateDiff = moment(endDate).diff(startDate, granularityType);
  const chartData = [];

  let previousData = null;
  let previousYear = null;

  for (let i = 0; i <= endDateStartDateDiff; i++) {
    if (GRANULARITY_TYPES.QUARTERLY === granularity && i % 4 !== 0) {
      continue;
    }

    const momentDate = moment.utc(startDate).add(i, granularityType);
    const stringDate = momentDate.toISOString();
    const year = parseInt(momentDate.year(), 10);

    const checkTick = i % granularityTick === 0;
    const isNewYear = i !== 0 && checkTick && year !== previousYear;
    let formattedDate;

    if (granularityType === 'months') {
      formattedDate = isNewYear
        ? momentDate.format(chartDateMonthFormat)
        : momentDate.format(chartDateMonthFormatShort);
    } else {
      formattedDate = isNewYear ? momentDate.format(chartDateDayFormat) : momentDate.format(chartDateDayFormatShort);
    }

    const yAxis = data[stringDate] || 0;

    const labelData = {
      data: yAxis,
      previousData,
      formattedDate,
      granularity
    };

    chartData.push({
      x: chartData.length,
      y: yAxis,
      tooltip: getLabel(labelData),
      xAxisLabel: granularityType === 'months' ? formattedDate.replace(/\s/, '\n') : formattedDate
    });

    previousData = yAxis;

    if (checkTick && year !== previousYear) {
      previousYear = year;
    }
  }

  return chartData;
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
 * @param {date} startDate
 * @param {date} endDate
 * @param {string} granularity, see enum of rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {Object} Object array result converted { chartData: {...} chartDomain {...} }
 */
const convertChartData = ({ data, dataFacet, startDate, endDate, granularity }) => {
  const formattedData = {};

  (data || []).forEach(value => {
    if (value) {
      const stringDate = moment
        .utc(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE])
        .startOf('day')
        .toISOString();
      formattedData[stringDate] = Number.parseInt(value[dataFacet], 10);
    }
  });

  return {
    chartData: fillFormatChartData({ data: formattedData, endDate, granularity, startDate }),
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
