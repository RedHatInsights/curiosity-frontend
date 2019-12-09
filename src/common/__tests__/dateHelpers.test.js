import { dateHelpers, getCurrentDate, setRangedDateTime, getRangedDateTime } from '../dateHelpers';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';

describe('DateHelpers', () => {
  it('should have specific functions', () => {
    expect(dateHelpers).toMatchSnapshot('dateHelpers');
  });

  it('should return a date object for defaults', () => {
    expect(dateHelpers.defaultDateTime.startDate.constructor).toBe(Date);
    expect(dateHelpers.defaultDateTime.endDate.constructor).toBe(Date);

    expect(dateHelpers.weeklyDateTime.startDate.constructor).toBe(Date);
    expect(dateHelpers.weeklyDateTime.endDate.constructor).toBe(Date);

    expect(dateHelpers.monthlyDateTime.startDate.constructor).toBe(Date);
    expect(dateHelpers.monthlyDateTime.endDate.constructor).toBe(Date);

    expect(dateHelpers.quarterlyDateTime.startDate.constructor).toBe(Date);
    expect(dateHelpers.quarterlyDateTime.endDate.constructor).toBe(Date);
  });

  it('should return a predictable range of time', () => {
    const currentDate = getCurrentDate();
    const rangeDateTime = setRangedDateTime({ date: getCurrentDate(), subtract: 5, measurement: 'days' });

    expect({
      currentDate,
      rangeDateTime
    }).toMatchSnapshot('range of time');
  });

  it('should return a predictable range based on granularity', () => {
    const rangesOfDatesTimes = Object.values(GRANULARITY_TYPES).map(value => ({
      granularity: value,
      range: getRangedDateTime(value)
    }));

    expect(rangesOfDatesTimes).toMatchSnapshot('granularity range of time');
  });
});
