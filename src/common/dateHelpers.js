import moment from 'moment/moment';
import { helpers } from './helpers';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../types/rhsmApiTypes';

const getCurrentDate = () =>
  (helpers.TEST_MODE && '20190720') || (helpers.DEV_MODE && process.env.REACT_APP_DEBUG_DEFAULT_DATETIME) || new Date();

const setRangedDateTime = ({ date, subtract, measurement }) => ({
  startDate: moment
    .utc(date)
    .startOf(measurement)
    .subtract(subtract, measurement)
    .toDate(),
  endDate: moment
    .utc(date)
    .startOf(measurement)
    .endOf('days')
    .toDate()
});

const defaultDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 30, measurement: 'days' });
const weeklyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 12, measurement: 'weeks' });
const monthlyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 12, measurement: 'months' });
const quarterlyDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 36, measurement: 'months' });

/**
 * Return a range of time based on granularity.
 *
 * @param {string} granularity
 * @returns {{endDate: Date, startDate: Date}}
 */
const getRangedDateTime = granularity => {
  switch (granularity) {
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

const timestampDayFormats = {
  long: 'MMMM D',
  yearLong: 'MMMM D YYYY',
  short: 'MMM D',
  yearShort: 'MMM D YYYY'
};

const timestampMonthFormats = {
  long: 'MMMM',
  yearLong: 'MMMM YYYY',
  short: 'MMM',
  yearShort: 'MMM YYYY'
};

const timestampQuarterFormats = {
  ...timestampMonthFormats
};

const dateHelpers = {
  getCurrentDate,
  getRangedDateTime,
  setRangedDateTime,
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
  dateHelpers,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime,
  timestampDayFormats,
  timestampMonthFormats,
  timestampQuarterFormats
};
