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
    const mockSelectors = [mockSelectorOne, { id: 'mockSelectorTwo', selector: mockSelectorTwo }];
    const mockUseSelector = callback => callback();
    const params = [mockSelectors, 'loremIpsum', { equality: 'dolorSit', useSelector: mockUseSelector }];

    reactReduxHooks.useSelectors(...params);

    expect(mockSelectorOne).toBeCalledTimes(1);
    expect(mockSelectorTwo).toBeCalledTimes(1);

    mockSelectorOne.mockClear();
    mockSelectorTwo.mockClear();
  });

  it('should return a list or object with ID for multiple selectors with useSelectors', () => {
    const mockUseSelector = callback => callback();
    const mockListSelectors = [() => 'dolor', () => 'sit'];
    const mockObjectSelectors = [
      { id: 'hello', selector: () => 'dolor' },
      { id: 'world', selector: () => 'sit' }
    ];

    expect({
      list: reactReduxHooks.useSelectors(mockListSelectors, undefined, { useSelector: mockUseSelector }),
      object: reactReduxHooks.useSelectors(mockObjectSelectors, undefined, { useSelector: mockUseSelector })
    }).toMatchSnapshot('list and object');
  });

  it('should apply hooks for aggregating multiple selector responses', () => {
    const generatedSelectorResponses = hook => {
      const responses = {};

      responses.cancelledCancelled = hook(() => {}, {
        useSelectors: () => [{ cancelled: true }, { cancelled: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [{ cancelled: true }, { cancelled: true }],
              cancelledDataByList: [{ cancelled: true }, { cancelled: true }],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [],
              dataByList: [{ cancelled: true }, { cancelled: true }],
              responsesByList: [{ cancelled: true }, { cancelled: true }]
            }
          )
      });

      responses.cancelledCancelledById = hook(() => {}, {
        useSelectors: () => ({
          lorem: { cancelled: true },
          ipsum: { cancelled: true }
        }),
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              isById: true,
              cancelledByList: [
                { id: 'lorem', cancelled: true },
                { id: 'ipsum', cancelled: true }
              ],
              cancelledDataById: {
                lorem: { cancelled: true },
                ipsum: { cancelled: true }
              },
              cancelledDataByList: [
                { id: 'lorem', cancelled: true },
                { id: 'ipsum', cancelled: true }
              ],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [],
              dataById: {
                lorem: { cancelled: true },
                ipsum: { cancelled: true }
              },
              dataByList: [
                { id: 'lorem', cancelled: true },
                { id: 'ipsum', cancelled: true }
              ],
              responsesByList: [
                { id: 'lorem', cancelled: true },
                { id: 'ipsum', cancelled: true }
              ]
            }
          )
      });

      responses.errorError = hook(() => {}, {
        useSelectors: () => [{ error: true }, { error: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [{ error: true }, { error: true }],
              errorDataByList: [{ error: true }, { error: true }],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [],
              dataByList: [{ error: true }, { error: true }],
              responsesByList: [{ error: true }, { error: true }]
            }
          )
      });

      responses.errorErrorById = hook(() => {}, {
        useSelectors: () => ({
          lorem: { error: true },
          ipsum: { error: true }
        }),
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [
                { id: 'lorem', error: true },
                { id: 'ipsum', error: true }
              ],
              errorDataById: {
                lorem: { error: true },
                ipsum: { error: true }
              },
              errorDataByList: [
                { id: 'lorem', error: true },
                { id: 'ipsum', error: true }
              ],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [],
              dataById: {
                lorem: { error: true },
                ipsum: { error: true }
              },
              dataByList: [
                { id: 'lorem', error: true },
                { id: 'ipsum', error: true }
              ],
              responsesByList: [
                { id: 'lorem', error: true },
                { id: 'ipsum', error: true }
              ]
            }
          )
      });

      responses.errorCancelled = hook(() => {}, {
        useSelectors: () => [{ cancelled: true }, { error: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [{ cancelled: true }],
              cancelledDataByList: [{ cancelled: true }],
              errorByList: [{ error: true }],
              errorDataByList: [{ error: true }],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [],
              dataByList: [{ error: true }, { cancelled: true }],
              responsesByList: [{ error: true }, { cancelled: true }]
            }
          )
      });

      responses.pendingError = hook(() => {}, {
        useSelectors: () => [{ pending: true }, { error: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [{ error: true }],
              errorDataByList: [{ error: true }],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [{ pending: true }],
              dataByList: [{ pending: true }, { error: true }],
              responsesByList: [{ pending: true }, { error: true }]
            }
          )
      });

      responses.pendingCancelled = hook(() => {}, {
        useSelectors: () => [{ pending: true }, { cancelled: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [{ cancelled: true }],
              cancelledDataByList: [{ cancelled: true }],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [{ pending: true }],
              dataByList: [{ pending: true }, { cancelled: true }],
              responsesByList: [{ pending: true }, { cancelled: true }]
            }
          )
      });

      responses.pendingPending = hook(() => {}, {
        useSelectors: () => [{ pending: true }, { pending: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [{ pending: true }],
              dataByList: [{ pending: true }],
              responsesByList: [{ pending: true }]
            }
          )
      });

      responses.pendingPendingById = hook(() => {}, {
        useSelectors: () => ({
          lorem: { pending: true },
          ipsum: { pending: true }
        }),
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              isById: true,
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [],
              fulfilledDataByList: [],
              pendingByList: [
                { id: 'lorem', pending: true },
                { id: 'ipsum', pending: true }
              ],
              dataById: {
                lorem: { pending: true },
                ipsum: { pending: true }
              },
              dataByList: [
                { id: 'lorem', pending: true },
                { id: 'ipsum', pending: true }
              ],
              responsesByList: [
                { id: 'lorem', pending: true },
                { id: 'ipsum', pending: true }
              ]
            }
          )
      });

      responses.fulfilledError = hook(() => {}, {
        useSelectors: () => [{ fulfilled: true }, { error: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [{ error: true }],
              errorDataByList: [{ error: true }],
              fulfilledByList: [{ fulfilled: true }],
              fulfilledDataByList: [{ fulfilled: true }],
              pendingByList: [],
              dataByList: [{ fulfilled: true }, { error: true }],
              responsesByList: [{ fulfilled: true }, { error: true }]
            }
          )
      });

      responses.fulfilledCancelled = hook(() => {}, {
        useSelectors: () => [{ fulfilled: true }, { cancelled: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [{ cancelled: true }],
              cancelledDataByList: [{ cancelled: true }],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [{ fulfilled: true }],
              fulfilledDataByList: [{ fulfilled: true }],
              pendingByList: [],
              dataByList: [{ fulfilled: true }, { cancelled: true }],
              responsesByList: [{ fulfilled: true }, { cancelled: true }]
            }
          )
      });

      responses.fulfilledPending = hook(() => {}, {
        useSelectors: () => [{ fulfilled: true }, { pending: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [{ fulfilled: true }],
              fulfilledDataByList: [{ fulfilled: true }],
              pendingByList: [{ pending: true }],
              dataByList: [{ fulfilled: true }, { pending: true }],
              responsesByList: [{ fulfilled: true }, { pending: true }]
            }
          )
      });

      responses.fulfilledFulfilled = hook(() => {}, {
        useSelectors: () => [{ fulfilled: true }, { fulfilled: true }],
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [{ fulfilled: true }, { fulfilled: true }],
              fulfilledDataByList: [{ fulfilled: true }, { fulfilled: true }],
              pendingByList: [],
              dataByList: [{ fulfilled: true }, { fulfilled: true }],
              responsesByList: [{ fulfilled: true }, { fulfilled: true }]
            }
          )
      });

      responses.fulfilledFulfilledById = hook(() => {}, {
        useSelectors: () => ({
          lorem: { fulfilled: true },
          ipsum: { fulfilled: true }
        }),
        useSelectorsResponse: (_, { customResponse }) =>
          customResponse(
            {
              lorem: 'ipsum'
            },
            {
              isById: true,
              cancelledByList: [],
              cancelledDataByList: [],
              errorByList: [],
              errorDataByList: [],
              fulfilledByList: [
                { id: 'lorem', fulfilled: true },
                { id: 'ipsum', fulfilled: true }
              ],
              fulfilledDataById: {
                lorem: { fulfilled: true },
                ipsum: { fulfilled: true }
              },
              fulfilledDataByList: [
                { id: 'lorem', fulfilled: true },
                { id: 'ipsum', fulfilled: true }
              ],
              pendingByList: [],
              dataById: {
                lorem: { fulfilled: true },
                ipsum: { fulfilled: true }
              },
              dataByList: [
                { id: 'lorem', fulfilled: true },
                { id: 'ipsum', fulfilled: true }
              ],
              responsesByList: [
                { id: 'lorem', fulfilled: true },
                { id: 'ipsum', fulfilled: true }
              ]
            }
          )
      });

      return responses;
    };

    expect(generatedSelectorResponses(reactReduxHooks.useSelectorsResponse)).toMatchSnapshot(
      'aggregated calls, useSelectors, All Response'
    );

    expect(generatedSelectorResponses(reactReduxHooks.useSelectorsAllSettledResponse)).toMatchSnapshot(
      'aggregated calls, useSelectorsAllSettledResponse'
    );

    expect(generatedSelectorResponses(reactReduxHooks.useSelectorsAnyResponse)).toMatchSnapshot(
      'aggregated calls, useSelectorsAnyResponse'
    );

    expect(generatedSelectorResponses(reactReduxHooks.useSelectorsRaceResponse)).toMatchSnapshot(
      'aggregated calls, useSelectorsRaceResponse'
    );
  });
});
