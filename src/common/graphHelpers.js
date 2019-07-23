import moment from 'moment';
import { rhelApiTypes } from '../types/rhelApiTypes';
import { helpers } from './helpers';

const chartDateFormat = 'MMM D';

/**
 * Generate a fallback graph with zeroed data
 *
 * @param startDate {string}
 * @param endDate {string}
 * @returns {Array}
 */
const zeroedUsageData = (startDate, endDate) => {
  const zeroedArray = [];
  const endDateStartDateDiff = moment(endDate).diff(startDate, 'days');

  for (let i = 0; i <= endDateStartDateDiff; i++) {
    const clonedStartDate = moment.utc(startDate);
    zeroedArray.push({
      x: clonedStartDate.add(i, 'days').format(chartDateFormat),
      y: 0
    });
  }

  return zeroedArray;
};

/**
 * Apply label formatting
 *
 * @param data {number}
 * @param previousData {number}
 * @param formattedDate {string}
 * @param label {string}
 * @param previousLabel {string}
 * @returns {string}
 */
const getLabel = ({ data, previousData, formattedDate, label, previousLabel }) => {
  const previousCount = data - previousData;
  const updatedLabel = `${data} ${label} ${formattedDate}`;

  if (previousData === null || previousCount === 0) {
    return updatedLabel;
  }

  return `${updatedLabel}\n ${previousCount > -1 ? '+' : ''}${previousCount} ${previousLabel}`;
};

/**
 * Fills missing dates with zeroed y-values, updates labels
 * walk the date range and fill missing values, all the while updating previous labels
 *
 * @param startDate {string}
 * @param endDate {string}
 * @param values {object} pre-filled key-value object
 * @param label {string} i18n specific label
 * @param previousLabel {string} i18n specific prevousLabel
 * @returns {Array}
 */
const fillMissingValues = ({ startDate, endDate, values, label, previousLabel }) => {
  const endDateStartDateDiff = moment(endDate).diff(startDate, 'days');
  const chartData = [];

  for (let i = 0; i <= endDateStartDateDiff; i++) {
    const formattedDate = moment
      .utc(startDate)
      .add(i, 'days')
      .format(chartDateFormat);
    const updatedLabel = getLabel({
      data: values[formattedDate] ? values[formattedDate].y : 0,
      previousData: i > 0 ? chartData[i - 1].y : null,
      formattedDate,
      label,
      previousLabel
    });

    if (values[formattedDate]) {
      chartData.push({
        x: values[formattedDate].x,
        y: values[formattedDate].y,
        label: updatedLabel
      });
    } else {
      chartData.push({
        x: formattedDate,
        y: 0,
        label: updatedLabel
      });
    }
  }
  return chartData;
};

/**
 * Returns chart domain setting for given inputs
 * the y axis returns large enough number that zeroed bars dont show
 *
 * @param empty {boolean} Chart data is empty
 * @returns {Object}
 */
const getChartDomain = ({ empty }) => {
  // todo: daily vs weekly
  const chartDomain = { x: [0, 31] };
  if (empty) {
    chartDomain.y = [0, 100];
  }
  return chartDomain;
};

/**
 * Convert graph data to usable format
 * convert json usage report from this format:
 *  {cores: 56, date: "2019-06-01T00:00:00Z", instance_count: 28}
 * to this format:
 *  { x: 'Jun 1', y: 56, label: '56 Sockets on Jun 1 \r\n +5 from previous day' }
 *
 * @param data {Array}
 * @param startDate {string}
 * @param endDate {string}
 * @param label {string}
 * @param previousLabel {string}
 * @returns {Object} Object array result converted { chartData: {...} chartDomain {...} }
 */
const convertGraphUsageData = ({ data, startDate, endDate, label, previousLabel }) => {
  let chartData = [];
  let chartDomain = {};

  try {
    chartDomain = getChartDomain({});

    const values = {};
    for (let i = 0; i < data.length; i++) {
      const formattedDate = moment
        .utc(data[i][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE])
        .format(chartDateFormat);

      values[formattedDate] = {
        x: formattedDate,
        y: data[i][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]
      };
    }

    if (data.length) {
      chartData = fillMissingValues({ startDate, endDate, values, label, previousLabel });
    }
  } catch (e) {
    if (!helpers.TEST_MODE) {
      console.warn(`Malformed API response ${e.message}`);
    }
  }

  if (!chartData.length) {
    chartData = zeroedUsageData(startDate, endDate);
    chartDomain = getChartDomain({ empty: true });
  }

  return { chartData, chartDomain };
};

const getGraphHeight = (breakpoints, currentBreakpoint) =>
  (breakpoints[currentBreakpoint] > breakpoints.md && 200) || 400;

const getTooltipDimensions = (breakpoints, currentBreakpoint) => {
  if (breakpoints[currentBreakpoint] < breakpoints.sm) {
    return { height: 60, width: 200 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.md) {
    return { height: 50, width: 180 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.lg) {
    return { height: 40, width: 140 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.xl) {
    return { height: 40, width: 120 };
  }
  if (breakpoints[currentBreakpoint] < breakpoints.xl2) {
    return { height: 30, width: 90 };
  }
  return { height: 20, width: 80 };
};

const getTooltipFontSize = (breakpoints, currentBreakpoint) => {
  if (breakpoints[currentBreakpoint] > breakpoints.lg) {
    return 8;
  }
  if (breakpoints[currentBreakpoint] > breakpoints.md) {
    return 12;
  }
  return 14;
};

const graphHelpers = {
  chartDateFormat,
  convertGraphUsageData,
  getGraphHeight,
  getTooltipDimensions,
  getTooltipFontSize,
  zeroedUsageData
};

export {
  graphHelpers as default,
  graphHelpers,
  chartDateFormat,
  convertGraphUsageData,
  getGraphHeight,
  getTooltipDimensions,
  getTooltipFontSize,
  zeroedUsageData
};
