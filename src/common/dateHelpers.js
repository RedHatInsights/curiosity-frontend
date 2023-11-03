import { helpers } from './helpers';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../services/rhsm/rhsmConstants';
import { translate } from '../components/i18n/i18n';

/**
 * @memberof Helpers
 * @module Dates
 */

/**
 * Return a date.
 *
 * @returns {string|Date}
 */
const getCurrentDate = () => {
  if (helpers.TEST_MODE) {
    return new Date(new Date('2019-07-20').setUTCHours(0, 0, 0, 0));
  }
  if (helpers.DEV_MODE && process.env.REACT_APP_DEBUG_DEFAULT_DATETIME) {
    return new Date(new Date(process.env.REACT_APP_DEBUG_DEFAULT_DATETIME).setUTCHours(0, 0, 0, 0));
  }
  return new Date();
};

/**
 * Sets the UTC time to the end of day.
 *
 * @param {Date} date The date tp use
 * @returns {Date} The date with the time set to the last millisecond of that day.
 */
const setEndOfDay = date => new Date(date.setUTCHours(23, 59, 59, 999));

/**
 * Sets UTC time to beginning of the day.
 *
 * @param {Date} date The date tp use
 * @returns {Date} Returns the date with the time set to the start of that day.
 */
const setStartOfDay = date => new Date(date.setUTCHours(0, 0, 0, 0));

/**
 *Sets the UTC date and time to the end of tha month.
 *
 * @param {Date} date The date tp use
 * @returns {Date} The date with the date and time set to the last millisecond of that month.
 */
const setEndOfMonth = date => new Date(setEndOfDay(date).setUTCMonth(date.getUTCMonth() + 1, 0));

/**
 * Set a date range based on a granularity type.
 *
 * @param {object} params
 * @param {Date} params.date Start date, typically the current date.
 * @param {number} params.subtract Number of granularity type to subtract from the current date.
 * @param {'days' | 'weeks' | 'months' | 'years'} params.measurement Granularity type .
 * @returns {{endDate: Date, startDate: Date}}
 */
const setRangedDateTime = ({ date = getCurrentDate(), subtract = 0, measurement = 'days' } = {}) => {
  switch (measurement) {
    case 'weeks':
      return {
        startDate: new Date(setStartOfDay(date).setUTCDate(date.getUTCDate() - date.getUTCDay() - subtract * 7)),
        endDate: new Date(setEndOfDay(date).setUTCDate(date.getUTCDate() - date.getUTCDay()))
      };
    case 'months':
      return {
        startDate: new Date(setStartOfDay(date).setUTCMonth(date.getUTCMonth() - subtract, 1)),
        endDate: new Date(setEndOfDay(date).setUTCDate(1))
      };
    case 'years':
      return {
        startDate: new Date(
          setStartOfDay(date).setUTCFullYear(date.getUTCFullYear() - subtract, date.getUTCMonth() + 1, 1)
        ),
        endDate: setEndOfMonth(date)
      };
    case 'days':
    default:
      return {
        startDate: new Date(setStartOfDay(date).setUTCDate(date.getUTCDate() - subtract)),
        endDate: setEndOfDay(date)
      };
  }
};

/**
 * Generates the date range, starting at the beginning of getCurrentDate, and ending at the end of getCurrentDate.
 *
 * @type {{endDate: Date, startDate: Date}}
 */
const currentDateTime = setRangedDateTime({
  subtract: 1,
  measurement: 'days'
});

/**
 * Generates the date range, starting 30 days prior to getCurrentDate, and ending at the end of the getCurrentDate.
 *
 * @type {{endDate: Date, startDate: Date}}
 */
const defaultDateTime = setRangedDateTime({
  subtract: 30,
  measurement: 'days'
});

/**
 *  Generates the date range, starting on Sunday 12 weeks prior to getCurrentDate,
 *  and ending at the end of the previous Saturday.
 *
 * @type {{endDate: Date, startDate: Date}}
 */
const weeklyDateTime = setRangedDateTime({
  subtract: 12,
  measurement: 'weeks'
});

/**
 *  Generates the date range, starting 12 months prior to getCurrentDate, and ending at the end of the getCurrentDate.
 *
 * @type {{endDate: Date, startDate: Date}}
 */
const monthlyDateTime = setRangedDateTime({
  subtract: 12,
  measurement: 'months'
});

/**
 *  Generates the date range, starting 36 months prior to getCurrentDate, and ending at the end of getCurrentDate.
 *
 * @type {{endDate: Date, startDate: Date}}
 */
const quarterlyDateTime = setRangedDateTime({
  subtract: 36,
  measurement: 'months'
});

/**
 * Generates the date range, starting a year prior, and ending at the end of the previous month.
 *
 * @type {{endDate: Date, startDate: Date}}
 */
const rangedYearDateTime = setRangedDateTime({
  subtract: 1,
  measurement: 'years'
});

/**
 * Return a range of time based on known granularity types.
 *
 * @param {string} granularity
 * @returns {{endDate: Date, startDate: Date}}
 */
const getRangedDateTime = granularity => {
  switch (granularity) {
    case 'CURRENT':
      return { ...currentDateTime };
    case GRANULARITY_TYPES.WEEKLY:
      return { ...weeklyDateTime };
    case GRANULARITY_TYPES.MONTHLY:
      return { ...monthlyDateTime };
    case GRANULARITY_TYPES.QUARTERLY:
      return { ...quarterlyDateTime };
    case GRANULARITY_TYPES.DAILY:
    default:
      return { ...defaultDateTime };
  }
};

/**
 * Generate a list of months for use in a select list.
 *
 * @param {string} month
 * @param {string} defaultLocale
 * @returns {{keyDateTimeRanges: {}, listDateTimeRanges: Array}|*|undefined}
 */
const getRangedMonthDateTime = (month, defaultLocale = helpers.UI_LOCALE_DEFAULT) => {
  const currentYear = getCurrentDate().getUTCFullYear();
  const { startDate, endDate } = { ...rangedYearDateTime };
  const keyDateTimeRanges = {};
  let listDateTimeRanges = [];

  const startDateUpdated = new Date(startDate);
  const endDateUpdated = new Date(endDate);

  while (endDateUpdated > startDateUpdated || startDateUpdated.getUTCMonth() === endDateUpdated.getUTCMonth()) {
    const dateTime = {
      value: {
        startDate: new Date(setStartOfDay(startDateUpdated))
      }
    };

    const titleYear = startDateUpdated.toLocaleString(defaultLocale, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    });
    const title = startDateUpdated.toLocaleString(defaultLocale, { month: 'long', timeZone: 'UTC' });
    const titleIndex = startDateUpdated.toLocaleString(defaultLocale, { month: 'numeric', timeZone: 'UTC' });
    const isNextYear = currentYear !== startDateUpdated.getUTCFullYear();
    dateTime.title = (isNextYear && titleYear) || title;
    dateTime._title = title.toLowerCase();
    dateTime.value.endDate = setEndOfMonth(startDateUpdated);

    startDateUpdated.setUTCMonth(startDateUpdated.getUTCMonth() + 1);

    dateTime.title = translate('curiosity-toolbar.label', { context: ['granularityRangedMonthly', dateTime.title] });
    keyDateTimeRanges[title.toLowerCase()] = { ...dateTime };
    keyDateTimeRanges[titleIndex] = { ...dateTime };
    listDateTimeRanges.push(dateTime);
  }

  listDateTimeRanges = listDateTimeRanges.reverse();
  listDateTimeRanges[0] = {
    ...listDateTimeRanges[0],
    isCurrent: true,
    _title: 'current',
    title: translate('curiosity-toolbar.label', { context: ['granularityRangedMonthly', 'current'] })
  };

  keyDateTimeRanges.current = { ...listDateTimeRanges[0] };

  if (month) {
    return keyDateTimeRanges?.[month] || undefined;
  }

  return { keyDateTimeRanges, listDateTimeRanges };
};

/**
 * Consistent timestamp day formats.
 *
 * @type {{short: string, yearShort: string, yearLong: string, long: string}}
 */
const timestampDayFormats = {
  long: 'MMMM D',
  yearLong: 'MMMM D YYYY',
  short: 'MMM D',
  yearShort: 'MMM D YYYY'
};

/**
 * Consistent timestamp month formats.
 *
 * @type {{short: string, yearShort: string, yearLong: string, long: string}}
 */
const timestampMonthFormats = {
  long: 'MMMM',
  yearLong: 'MMMM YYYY',
  short: 'MMM',
  yearShort: 'MMM YYYY'
};

/**
 * Consistent timestamp quarter formats.
 *
 * @type {{short: string, yearShort: string, yearLong: string, long: string}}
 */
const timestampQuarterFormats = {
  ...timestampMonthFormats
};

/**
 * Consistent timestamp time formats.
 *
 * @type {{yearTimeShort: string, timeLong: string, yearTimeLong: string, timeShort: string}}
 */
const timestampTimeFormats = {
  timeLong: 'MMMM D h:mm:ss A',
  yearTimeLong: 'MMMM D YYYY h:mm:ss A',
  timeShort: 'MMM D h:mm A',
  yearTimeShort: 'MMM D YYYY h:mm A'
};

/**
 * Consistent UTC timestamp time formats.
 *
 * @type {{yearTimeShort: string, timeLong: string, yearTimeLong: string, timeShort: string}}
 */
const timestampUTCTimeFormats = {
  timeLong: 'DD MMMM HH:mm:ss UTC',
  yearTimeLong: 'DD MMMM YYYY HH:mm:ss UTC',
  timeShort: 'DD MMM HH:mm UTC',
  yearTimeShort: 'DD MMM YYYY HH:mm UTC'
};

const dateHelpers = {
  getCurrentDate,
  setStartOfDay,
  setEndOfDay,
  setEndOfMonth,
  getRangedMonthDateTime,
  getRangedDateTime,
  setRangedDateTime,
  currentDateTime,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime,
  rangedYearDateTime,
  timestampDayFormats,
  timestampMonthFormats,
  timestampQuarterFormats,
  timestampTimeFormats,
  timestampUTCTimeFormats
};

export {
  dateHelpers as default,
  getCurrentDate,
  setStartOfDay,
  setEndOfDay,
  setEndOfMonth,
  getRangedMonthDateTime,
  getRangedDateTime,
  setRangedDateTime,
  currentDateTime,
  dateHelpers,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime,
  rangedYearDateTime,
  timestampDayFormats,
  timestampMonthFormats,
  timestampQuarterFormats,
  timestampTimeFormats,
  timestampUTCTimeFormats
};
