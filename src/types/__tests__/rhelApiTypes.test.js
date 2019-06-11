import rhelApiTypes, * as allApiTypes from '../rhelApiTypes';

describe('RhelApiTypes', () => {
  it('Should have specific API properties', () => {
    expect(rhelApiTypes).toMatchSnapshot('specific types');
    expect(allApiTypes).toMatchSnapshot('all exported api types');
  });
});
