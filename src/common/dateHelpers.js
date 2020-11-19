import moment from 'moment/moment';
import { helpers } from './helpers';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../types/rhsmApiTypes';

/**
 * Return a date.
 *
 * @returns {string|Date}
 */
const getCurrentDate = () =>
  (helpers.TEST_MODE && '20190720') || (helpers.DEV_MODE && process.env.REACT_APP_DEBUG_DEFAULT_DATETIME) || new Date();

/**
 * Set a date range based on a granularity type.
 *
 * @param {object} params
 * @param {Date} params.date Start date, typically the current date.
 * @param {number} params.subtract Number of granularity type to subtract from the current date.
 * @param {string} params.measurement Granularity type.
 * @returns {{endDate: Date, startDate: Date}}
 */
const setRangedDateTime = ({ date, subtract, measurement }) => ({
  startDate: moment.utc(date).startOf(measurement).subtract(subtract, measurement).toDate(),
  endDate: moment.utc(date).startOf(measurement).endOf('days').toDate()
});

const currentDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 1, measurement: 'days' });
const defaultDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 30, measurement: 'days' });
const weeklyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 12, measurement: 'weeks' });
const monthlyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 12, measurement: 'months' });
const quarterlyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 36, measurement: 'months' });

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

const dateHelpers = {
  getCurrentDate,
  getRangedDateTime,
  setRangedDateTime,
  currentDateTime,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime,
  timestampDayFormats,
  timestampMonthFormats,
  timestampQuarterFormats
};

export {
  dateHelpers as default,
  getCurrentDate,
  getRangedDateTime,
  setRangedDateTime,
  currentDateTime,
  dateHelpers,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime,
  timestampDayFormats,
  timestampMonthFormats,
  timestampQuarterFormats
};
