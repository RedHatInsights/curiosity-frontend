import { context, useMetricsSelector } from '../graphCardContext';

describe('GraphCardContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should aggregate metric API calls', () => {
    // error response
    const error = useMetricsSelector({
      useGraphCardContext: () => ({
        settings: { metrics: [{ id: 'ipsum_mock-product-id' }, { id: 'dolor_mock-product-id' }] }
      }),
      useSelectorsResponse: () => ({ error: true, data: [{ data: ['ipsum'] }, { data: ['dolor'] }] })
    });

    expect(error).toMatchSnapshot('aggregated calls, error');

    // pending response
    const pending = useMetricsSelector({
      useGraphCardContext: () => ({
        settings: { metrics: [{ id: 'ipsum_mock-product-id' }, { id: 'dolor_mock-product-id' }] }
      }),
      useSelectorsResponse: () => ({ pending: true, data: [{ data: ['ipsum'] }, { data: ['dolor'] }] })
    });

    expect(pending).toMatchSnapshot('aggregated calls, pending');

    // fulfilled response
    const fulfilled = useMetricsSelector({
      useGraphCardContext: () => ({
        settings: { metrics: [{ id: 'ipsum_mock-product-id' }, { id: 'dolor_mock-product-id' }] }
      }),
      useSelectorsResponse: () => ({ fulfilled: true, data: [{ data: ['ipsum'] }, { data: ['dolor'] }] })
    });

    expect(fulfilled).toMatchSnapshot('aggregated calls, fulfilled');
  });
});
