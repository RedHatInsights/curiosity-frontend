import platformConstants, * as allPlatformConstants from '../platformConstants';

describe('Platform Constants', () => {
  it('should have specific properties', () => {
    expect(platformConstants).toMatchSnapshot('specific constants');
    expect(allPlatformConstants).toMatchSnapshot('all exported constants');
  });
});
