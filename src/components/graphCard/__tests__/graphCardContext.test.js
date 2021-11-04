import { context, useMetricsSelector } from '../graphCardContext';

describe('GraphCardContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should aggregate metric API calls', () => {
    // error response
    const errorError = useMetricsSelector({
      useGraphCardContext: () => ({ settings: { metrics: [{ id: 'ipsum' }, { id: 'dolor' }] } }),
      useSelectors: () => [{ error: true }, { error: true }],
      useProduct: () => ({ productId: 'lorem' })
    });

    expect(errorError).toMatchSnapshot('aggregated calls, error');

    // pending response
    const pendingError = useMetricsSelector({
      useGraphCardContext: () => ({ settings: { metrics: [{ id: 'ipsum' }, { id: 'dolor' }] } }),
      useSelectors: () => [{ pending: true }, { error: true }],
      useProduct: () => ({ productId: 'lorem' })
    });

    expect(pendingError).toMatchSnapshot('aggregated calls, pending error');

    const pendingPending = useMetricsSelector({
      useGraphCardContext: () => ({ settings: { metrics: [{ id: 'ipsum' }, { id: 'dolor' }] } }),
      useSelectors: () => [{ pending: true }, { pending: true }],
      useProduct: () => ({ productId: 'lorem' })
    });

    expect(pendingPending).toMatchSnapshot('aggregated calls, pending');

    // fulfilled response
    const fulfilledError = useMetricsSelector({
      useGraphCardContext: () => ({ settings: { metrics: [{ id: 'ipsum' }, { id: 'dolor' }] } }),
      useSelectors: () => [{ error: true }, { fulfilled: true }],
      useProduct: () => ({ productId: 'lorem' })
    });

    expect(fulfilledError).toMatchSnapshot('aggregated calls, fulfilled error');

    const fulfilledPending = useMetricsSelector({
      useGraphCardContext: () => ({ settings: { metrics: [{ id: 'ipsum' }, { id: 'dolor' }] } }),
      useSelectors: () => [{ pending: true }, { fulfilled: true }],
      useProduct: () => ({ productId: 'lorem' })
    });

    expect(fulfilledPending).toMatchSnapshot('aggregated calls, fulfilled pending');

    const fulfilledFulfilled = useMetricsSelector({
      useGraphCardContext: () => ({ settings: { metrics: [{ id: 'ipsum' }, { id: 'dolor' }] } }),
      useSelectors: () => [{ fulfilled: true }, { fulfilled: true }],
      useProduct: () => ({ productId: 'lorem' })
    });

    expect(fulfilledFulfilled).toMatchSnapshot('aggregated calls, fulfilled');
  });
});
