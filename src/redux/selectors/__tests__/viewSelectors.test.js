import viewSelectors from '../viewSelectors';

describe('ViewSelectors', () => {
  it('should return specific selectors', () => {
    expect(viewSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(viewSelectors.view(state)).toMatchSnapshot('missing reducer error');
  });
});
