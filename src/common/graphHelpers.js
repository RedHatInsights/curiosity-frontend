import moment from 'moment';
import { rhelApiTypes } from '../types/rhelApiTypes';
import { helpers } from './helpers';

/**
 * Chart Date Format (used in axis and tooltips)
 */
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
 * @param previousLabel {string} i18n specific previousLabel
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
 * Returns chart domain setting for given inputs.
 *
 * the y axis max should be rounded to the nearest 10 if less than 50,
 * otherwise round to the nearest power of 10
 *
 * the y axis returns large enough number that zeroed bars dont show
 *
 * @param empty {boolean} Chart data is empty
 * @param maxY {boolean} The max y-value
 * @returns {Object}
 */
const getChartDomain = ({ empty, maxY = 0 }) => {
  const chartDomain = { x: [0, 31] };

  if (empty || maxY < 50) {
    chartDomain.y = [0, Math.ceil((maxY + 1) / 10) * 10];
  } else {
    chartDomain.y = [0, Math.pow(10, maxY.toString().length)];
  }

  return chartDomain;
};

/**
 * Returns x axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {Array} chartData
 * @param {number} xAxisTickInterval
 * @returns {Array}
 */
const getTickValues = ({ chartData, xAxisTickInterval = 5 }) =>
  chartData.reduce((acc, current, index) => (index % xAxisTickInterval === 0 ? acc.concat(current.x) : acc), []);

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
 * @param xAxisTickInterval {number}
 * @returns {Object} Object array result converted { chartData: {...} chartDomain {...} }
 */
const convertGraphUsageData = ({ data, startDate, endDate, label, previousLabel, xAxisTickInterval }) => {
  let chartData = [];
  let chartDomain = {};

  try {
    const values = {};
    let maxY = 0;

    for (let i = 0; i < data.length; i++) {
      const formattedDate = moment
        .utc(data[i][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE])
        .format(chartDateFormat);

      values[formattedDate] = {
        x: formattedDate,
        y: data[i][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS]
      };
      maxY = values[formattedDate].y > maxY ? values[formattedDate].y : maxY;
    }
    chartDomain = getChartDomain({ maxY });

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

  const tickValues = getTickValues({ chartData, xAxisTickInterval });

  return { chartData, chartDomain, tickValues };
};

const graphHelpers = {
  chartDateFormat,
  convertGraphUsageData,
  getChartDomain,
  getTickValues,
  zeroedUsageData
};

export {
  graphHelpers as default,
  graphHelpers,
  chartDateFormat,
  convertGraphUsageData,
  getChartDomain,
  getTickValues,
  zeroedUsageData
};
