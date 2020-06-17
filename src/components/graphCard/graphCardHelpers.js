import moment from 'moment';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';
import { dateHelpers, helpers } from '../../common';

/**
 * Returns x axis ticks/intervals array for the xAxisTickInterval
 *
 * @param {string} granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
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
 * Return a formatted date string.
 *
 * @param {object} params
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @returns {string}
 */
const getTooltipDate = ({ date, granularity }) => {
  const momentDate = moment.utc(date);

  switch (granularity) {
    case GRANULARITY_TYPES.QUARTERLY:
      return `${momentDate.format(dateHelpers.timestampQuarterFormats.yearShort)} - ${momentDate
        .add(1, 'quarter')
        .format(dateHelpers.timestampQuarterFormats.yearShort)}`;

    case GRANULARITY_TYPES.MONTHLY:
      return momentDate.format(dateHelpers.timestampMonthFormats.yearLong);

    case GRANULARITY_TYPES.WEEKLY:
      return `${momentDate.format(dateHelpers.timestampDayFormats.short)} - ${momentDate
        .add(1, 'week')
        .format(dateHelpers.timestampDayFormats.yearShort)}`;

    case GRANULARITY_TYPES.DAILY:
    default:
      return momentDate.format(dateHelpers.timestampDayFormats.long);
  }
};

/**
 * Format x axis ticks.
 *
 * @param {object} params
 * @param {Date} params.date
 * @param {string} params.granularity See enum of RHSM_API_QUERY_GRANULARITY_TYPES
 * @param {number|string} params.tick
 * @param {Date} params.previousDate
 * @returns {string|undefined}
 */
const xAxisTickFormat = ({ date, granularity, tick, previousDate }) => {
  if (!date || !granularity) {
    return undefined;
  }

  const momentDate = moment.utc(date);
  const isNewYear =
    tick !== 0 && Number.parseInt(momentDate.year(), 10) !== Number.parseInt(moment.utc(previousDate).year(), 10);
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
    case GRANULARITY_TYPES.WEEKLY:
    case GRANULARITY_TYPES.DAILY:
    default:
      formattedDate = isNewYear
        ? momentDate.format(dateHelpers.timestampDayFormats.yearShort)
        : momentDate.format(dateHelpers.timestampDayFormats.short);

      formattedDate = formattedDate.replace(/\s(\d{4})$/, '\n$1');
      break;
  }

  return formattedDate;
};

/**
 * ToDo: Remove yAxisTickFormatFallback.
 * Appears Linux combined with Firefox has an issue using `Intl.NumberFormat` method.
 * We've applied shim code from NumeralJS and Numbro as a fallback. Up-to-date
 * browsers still have the optimal version with locale. If the original package used
 * corrects its rounding behavior we may consider re-implementing it.
 */
/**
 * Fallback method for Linux and Firefox.
 *
 * @param {object} params
 * @param {number|string} params.tick
 * @returns {string}
 */
const yAxisTickFormatFallback = ({ tick }) => {
  const abs = Math.abs(tick);
  let updatedTick = tick;
  let updatedAbbr = '';

  if (abs >= Math.pow(10, 12)) {
    updatedAbbr = 'T';
    updatedTick = tick / Math.pow(10, 12);
  } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
    updatedAbbr = 'B';
    updatedTick = tick / Math.pow(10, 9);
  } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
    updatedAbbr = 'M';
    updatedTick = tick / Math.pow(10, 6);
  } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
    updatedAbbr = 'K';
    updatedTick = tick / Math.pow(10, 3);
  }

  return `${updatedTick}${updatedAbbr}`;
};

// ToDo: remove yAxisTickFormatFallback check.
/**
 * Format y axis ticks.
 *
 * @param {object} params
 * @param {number|string} params.tick
 * @param {string} params.locale
 * @returns {string}
 */
const yAxisTickFormat = ({ tick, locale = helpers.UI_LOCALE_DEFAULT }) => {
  let updatedTick = `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(tick)}`;

  if (updatedTick.length > 3 && updatedTick.length >= `${tick}`.length) {
    updatedTick = yAxisTickFormatFallback({ tick });
  }

  return updatedTick;
};

const graphCardHelpers = {
  getChartXAxisLabelIncrement,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat,
  yAxisTickFormatFallback
};

export {
  graphCardHelpers as default,
  graphCardHelpers,
  getChartXAxisLabelIncrement,
  getTooltipDate,
  xAxisTickFormat,
  yAxisTickFormat,
  yAxisTickFormatFallback
};
