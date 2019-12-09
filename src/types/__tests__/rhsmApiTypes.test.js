import rhsmApiTypes, * as allApiTypes from '../rhsmApiTypes';

describe('RhsmApiTypes', () => {
  it('Should have specific API properties', () => {
    expect(rhsmApiTypes).toMatchSnapshot('specific types');
    expect(allApiTypes).toMatchSnapshot('all exported api types');
  });
});
