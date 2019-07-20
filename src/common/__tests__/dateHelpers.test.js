import { dateHelpers } from '../dateHelpers';

describe('DateHelpers', () => {
  it('should have specific functions', () => {
    expect(dateHelpers).toMatchSnapshot('dateHelpers');
  });

  it('should return a date object for defaultDateTime', () => {
    expect(dateHelpers.defaultDateTime.start.constructor).toBe(Date);
    expect(dateHelpers.defaultDateTime.end.constructor).toBe(Date);
  });
});
