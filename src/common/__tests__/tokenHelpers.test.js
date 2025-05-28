import { tokenHelpers } from '../tokenHelpers';

describe('TokenHelpers', () => {
  it('should have specific tokens', () => {
    expect(tokenHelpers).toMatchSnapshot('tokens');
  });
});
