import {
  dateHelpers,
  getCurrentDate,
  setRangedDateTime,
  getRangedDateTime,
  getRangedMonthDateTime
} from '../dateHelpers';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../services/rhsm/rhsmConstants';

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

    expect(dateHelpers.rangedYearDateTime.startDate.constructor).toBe(Date);
    expect(dateHelpers.rangedYearDateTime.endDate.constructor).toBe(Date);
  });

  it('should return a predictable range of time', () => {
    const currentDate = getCurrentDate();

    expect(dateHelpers.setRangedDateTime()).toMatchSnapshot('range of time for today');

    const rangeDateTime = setRangedDateTime({ subtract: 5, measurement: 'days' });

    expect({
      currentDate,
      rangeDateTime
    }).toMatchSnapshot('range of time');

    const expectedProvidedDate = new Date('2023-9-24');
    const rangeDateTimeWithProvidedDate = setRangedDateTime({
      date: expectedProvidedDate,
      subtract: 0,
      measurement: 'days'
    });

    expect(rangeDateTimeWithProvidedDate).toEqual({
      endDate: new Date(expectedProvidedDate.setUTCHours(23, 59, 59, 999)),
      startDate: new Date(expectedProvidedDate.setUTCHours(0, 0, 0, 0))
    });

    const nonSundayStartDate = new Date(Date.UTC(2023, 9, 24, 18, 6, 8, 3));
    const expectedSundayStartDate = new Date(Date.UTC(2023, 6, 30, 0, 0, 0, 0));
    const expectedSaturdayEndDate = new Date(Date.UTC(2023, 9, 22, 23, 59, 59, 999));

    expect(
      dateHelpers.setRangedDateTime({
        date: nonSundayStartDate,
        subtract: 12,
        measurement: 'weeks'
      })
    ).toEqual({ startDate: expectedSundayStartDate, endDate: expectedSaturdayEndDate });
  });

  it('should return a predictable range based on granularity', () => {
    const rangesOfDatesTimes = Object.values(GRANULARITY_TYPES).map(value => ({
      granularity: value,
      range: getRangedDateTime(value)
    }));

    expect(rangesOfDatesTimes).toMatchSnapshot('granularity range of time');
  });

  it('should return a predictable object and list of months based on a year range', () => {
    expect(getRangedMonthDateTime()).toMatchSnapshot('getRangedYearDateTime');
    expect(getRangedMonthDateTime('april')).toMatchSnapshot('get a specific month by name');
    expect(getRangedMonthDateTime(3)).toMatchSnapshot('get a specific month by number');
  });

  it('should change date to end of day', () => {
    const startDate = new Date(Date.UTC(2020, 7, 15, 3, 6, 8, 3));
    const expectedDate = new Date(Date.UTC(2020, 7, 15, 23, 59, 59, 999));

    expect(dateHelpers.setEndOfDay(startDate).getTime()).toEqual(expectedDate.getTime());
  });

  it('should change date to start of day', () => {
    const startDate = new Date(Date.UTC(2020, 7, 15, 3, 6, 8, 3));
    const expectedDate = new Date(Date.UTC(2020, 7, 15, 0, 0, 0, 0));

    expect(dateHelpers.setStartOfDay(startDate).getTime()).toEqual(expectedDate.getTime());
  });

  it('should change date to end of Month', () => {
    const startDate = new Date(Date.UTC(2020, 7, 15, 3, 6, 8, 3));
    const expectedDate = new Date(Date.UTC(2020, 7, 31, 23, 59, 59, 999));

    expect(dateHelpers.setEndOfMonth(startDate).getTime()).toEqual(expectedDate.getTime());
  });
});
