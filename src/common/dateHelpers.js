import moment from 'moment/moment';
import { helpers } from './helpers';

const defaultDateTime = (helpers.TEST_MODE && {
  start: moment
    .utc('20190720')
    .startOf('day')
    .subtract(30, 'days')
    .toDate(),
  end: moment
    .utc('20190720')
    .endOf('day')
    .toDate()
}) || {
  start: moment
    .utc()
    .startOf('day')
    .subtract(30, 'days')
    .toDate(),
  end: moment
    .utc()
    .endOf('day')
    .toDate()
};

const dateHelpers = {
  defaultDateTime
};

export { dateHelpers as default, dateHelpers, defaultDateTime };
