import { dateHelpers } from '../dateHelpers';

describe('DateHelpers', () => {
  it('should have specific functions', () => {
    expect(dateHelpers).toMatchSnapshot('dateHelpers');
  });
});
