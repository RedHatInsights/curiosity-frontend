import apiTypes, * as allApiTypes from '..';

describe('ApiTypes', () => {
  it('should have specific API properties', () => {
    expect(apiTypes).toMatchSnapshot('specific types');
    expect(allApiTypes).toMatchSnapshot('all exported api types');
  });
});
