import moment from 'moment/moment';
import { helpers } from './helpers';

const defaultDateTime = (helpers.TEST_MODE && {
  start: null,
  end: null
}) || {
  start: moment()
    .utc()
    .startOf('day')
    .subtract(30, 'days'),
  end: moment()
    .utc()
    .endOf('day')
};

const dateHelpers = {
  defaultDateTime
};

export { dateHelpers as default, dateHelpers, defaultDateTime };
