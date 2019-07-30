import moment from 'moment/moment';
import { helpers } from './helpers';

const defaultDateTime = ((
  date = (helpers.TEST_MODE && '20190720') ||
    (helpers.DEV_MODE && process.env.REACT_APP_DEBUG_DEFAULT_DATETIME) ||
    new Date()
) => ({
  start: moment
    .utc(date)
    .startOf('day')
    .subtract(30, 'days')
    .toDate(),
  end: moment
    .utc(date)
    .endOf('day')
    .toDate()
}))();

const dateHelpers = {
  defaultDateTime
};

export { dateHelpers as default, dateHelpers, defaultDateTime };
