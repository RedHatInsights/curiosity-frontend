import rhsmConstants, * as allRhsmConstants from '../rhsmConstants';

describe('RHSM Constants', () => {
  it('should have specific properties', () => {
    expect(rhsmConstants).toMatchSnapshot('specific constants');
    expect(allRhsmConstants).toMatchSnapshot('all exported constants');
  });
});
