import moment from 'moment';
import numbro from 'numbro';
import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhelApiTypes';
import { dateHelpers } from '../../common/dateHelpers';

/**
 * Returns x axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {string} granularity, see enum of RHSM_API_QUERY_GRANULARITY_TYPES
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
 * @param {string} granularity, see enum of RHSM_API_QUERY_GRANULARITY_TYPES
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
 * Return a formatted date string.
 *
 * @param {Date} date
 * @param {string} granularity, see enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getTooltipDate = ({ date, granularity }) => {
  const momentDate = moment.utc(date);
  let formattedDateTooltip;

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      formattedDateTooltip = dateHelpers.timestampQuarterFormats.long;
      break;
    case GRANULARITY_TYPES.MONTHLY:
      formattedDateTooltip = dateHelpers.timestampMonthFormats.long;
      break;
    default:
      formattedDateTooltip = dateHelpers.timestampDayFormats.long;
      break;
  }

  return momentDate.format(formattedDateTooltip);
};

/**
 * Format x axis ticks.
 *
 * @param {Date} date
 * @param {string} granularity, see enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {number|string} tick
 * @param {Date} previousDate
 * @returns {string|undefined}
 */
const xAxisTickFormat = ({ date, granularity, tick, previousDate }) => {
  if (!date || !granularity) {
    return undefined;
  }

  const momentDate = moment.utc(date);
  const isNewYear = tick !== 0 && parseInt(momentDate.year(), 10) !== parseInt(moment.utc(previousDate).year(), 10);
  let formattedDate;

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampQuarterFormats.yearShort)
        : momentDate.format(dateHelpers.timestampQuarterFormats.short);

      formattedDate = formattedDate.replace(/\s/, '\n');
      break;
    case GRANULARITY_TYPES.MONTHLY:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampMonthFormats.yearShort)
        : momentDate.format(dateHelpers.timestampMonthFormats.short);

      formattedDate = formattedDate.replace(/\s/, '\n');
      break;
    default:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampDayFormats.yearShort)
        : momentDate.format(dateHelpers.timestampDayFormats.short);
      break;
  }

  return formattedDate;
};

/**
 * Format y axis ticks.
 *
 * @param {number|string} tick
 * @returns {string}
 */
const yAxisTickFormat = tick => numbro(tick).format({ average: true, mantissa: 1, optionalMantissa: true });

const rhelGraphCardHelpers = {
  getChartXAxisLabelIncrement,
  getGraphLabels,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat
};

export {
  rhelGraphCardHelpers as default,
  rhelGraphCardHelpers,
  getChartXAxisLabelIncrement,
  getGraphLabels,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat
};
