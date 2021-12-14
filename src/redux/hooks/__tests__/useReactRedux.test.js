import { reactReduxHooks, useDispatch } from '../useReactRedux';
import { store } from '../../store';

describe('useReactRedux', () => {
  it('should return specific properties', () => {
    expect(reactReduxHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useDispatch', () => {
    const mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
    const dispatch = useDispatch();

    dispatch({
      type: 'lorem',
      data: 'ipsum'
    });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch');
    mockDispatch.mockClear();
  });

  it('should apply a hook for single selectors with useSelector', () => {
    const mockSelector = jest.fn();
    const mockUseSelector = callback => callback();
    const params = [mockSelector, 'loremIpsum', { equality: 'dolorSit', useSelector: mockUseSelector }];

    reactReduxHooks.useSelector(...params);

    expect(mockSelector).toBeCalledTimes(1);
    mockSelector.mockClear();
  });

  it('should apply a hook for multiple selectors with useSelectors', () => {
    const mockSelectorOne = jest.fn();
    const mockSelectorTwo = jest.fn();
    const mockSelectors = [mockSelectorOne, mockSelectorTwo];
    const mockUseSelector = callback => callback();
    const params = [mockSelectors, 'loremIpsum', { equality: 'dolorSit', useSelector: mockUseSelector }];

    reactReduxHooks.useSelectors(...params);

    expect(mockSelectorOne).toBeCalledTimes(1);
    expect(mockSelectorTwo).toBeCalledTimes(1);

    mockSelectorOne.mockClear();
    mockSelectorTwo.mockClear();
  });

  it('should apply a hook for aggregating multiple selector responses with useSelectorsResponse', () => {
    const errorError = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ error: true }, { error: true }]
    });

    expect(errorError).toMatchSnapshot('aggregated calls, error');

    const cancelledError = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ cancelled: true }, { error: true }]
    });

    expect(cancelledError).toMatchSnapshot('aggregated calls, cancelled error');

    const cancelledCancelled = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ cancelled: true }, { cancelled: true }]
    });

    expect(cancelledCancelled).toMatchSnapshot('aggregated calls, cancelled');

    const pendingError = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ pending: true }, { error: true }]
    });

    expect(pendingError).toMatchSnapshot('aggregated calls, pending error');

    const pendingCancelled = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ pending: true }, { cancelled: true }]
    });

    expect(pendingCancelled).toMatchSnapshot('aggregated calls, pending cancelled');

    const pendingPending = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ pending: true }, { pending: true }]
    });

    expect(pendingPending).toMatchSnapshot('aggregated calls, pending');

    const fulfilledError = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ fulfilled: true }, { error: true }]
    });

    expect(fulfilledError).toMatchSnapshot('aggregated calls, fulfilled error');

    const fulfilledCancelled = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ fulfilled: true }, { cancelled: true }]
    });

    expect(fulfilledCancelled).toMatchSnapshot('aggregated calls, fulfilled cancelled');

    const fulfilledPending = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ fulfilled: true }, { pending: true }]
    });

    expect(fulfilledPending).toMatchSnapshot('aggregated calls, fulfilled pending');

    const fulfilledFulfilled = reactReduxHooks.useSelectorsResponse(() => {}, {
      useSelectors: () => [{ fulfilled: true }, { fulfilled: true }]
    });

    expect(fulfilledFulfilled).toMatchSnapshot('aggregated calls, fulfilled');
  });
});
