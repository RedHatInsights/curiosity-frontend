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

  // todo: convert "y" back towards a number if/when we handle "chartDomain.y = [0, 100]" within helpers
  for (let i = 0; i <= endDateStartDateDiff; i++) {
    const clonedStartDate = moment.utc(startDate);
    zeroedArray.push({
      x: clonedStartDate.add(i, 'days').format(chartDateFormat),
      y: '0'
    });
  }

  return zeroedArray;
};

/**
 * Apply label formatting
 *
 * @param cores {number}
 * @param previousCores {number}
 * @param formattedDate {string}
 * @param socketLabel {string}
 * @param previousLabel {string}
 * @returns {string}
 */
const getLabel = ({ cores, previousCores, formattedDate, socketLabel, previousLabel }) => {
  const prev = cores - previousCores;
  const label = `${cores} ${socketLabel} ${formattedDate}`;

  if (previousCores === null) {
    return label;
  }

  return `${label}\n ${prev > -1 ? '+' : ''}${prev} ${previousLabel}`;
};

/**
 * Convert graph data to usable format
 * convert json usage report from this format:
 *  {cores: 56, date: "2019-06-01T00:00:00Z", instance_count: 28}
 * to this format:
 *  { x: 'Jun 1', y: 56, label: '56 Sockets on Jun 1 \r\n +5 from previous day' }
 *
 * @param usage {Array}
 * @param startDate {string}
 * @param endDate {string}
 * @param socketLabel {string}
 * @param previousLabel {string}
 * @returns {Array}
 */
const convertGraphData = ({ usage, startDate, endDate, socketLabel, previousLabel }) => {
  let chartData = [];

  try {
    for (let i = 0; i < usage.length; i++) {
      const formattedDate = moment
        .utc(usage[i][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_DATE])
        .format(chartDateFormat);

      const label = getLabel({
        cores: usage[i][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES],
        previousCores: i > 0 ? usage[i - 1][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES] : null,
        formattedDate,
        socketLabel,
        previousLabel
      });

      chartData.push({ x: formattedDate, y: usage[i][rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_CORES], label });
    }
  } catch (e) {
    if (!helpers.TEST_MODE) {
      console.warn(`Malformed API response ${e.message}`);
    }
  }

  if (!chartData.length) {
    chartData = zeroedUsageData(startDate, endDate);
  }

  return chartData;
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
  convertGraphData,
  getGraphHeight,
  getTooltipDimensions,
  getTooltipFontSize,
  zeroedUsageData
};

export {
  graphHelpers as default,
  graphHelpers,
  chartDateFormat,
  convertGraphData,
  getGraphHeight,
  getTooltipDimensions,
  getTooltipFontSize,
  zeroedUsageData
};
