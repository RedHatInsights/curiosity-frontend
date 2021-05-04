import { config } from '../index';

describe('Configuration', () => {
  it('should have specific config properties', () => {
    expect(config).toMatchSnapshot('config');
  });
});
