import appMessagesSelectors from '../appMessagesSelectors';

describe('AppMessagesSelectors', () => {
  it('should return specific selectors', () => {
    expect(appMessagesSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(appMessagesSelectors.appMessages(state)).toMatchSnapshot('missing reducer error');
  });

  it('should pass minimal data on a product ID without a product ID provided', () => {
    const props = {
      viewId: 'test',
      productId: undefined
    };
    const state = {};

    expect(appMessagesSelectors.appMessages(state, props)).toMatchSnapshot('no product id error');
  });
});
