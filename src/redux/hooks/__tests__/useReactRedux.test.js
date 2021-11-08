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
});
