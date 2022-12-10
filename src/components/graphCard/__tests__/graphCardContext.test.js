import { context, useMetricsSelector, useParseFiltersSettings } from '../graphCardContext';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

describe('GraphCardContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should parse configuration', async () => {
    const { result: basicConfig } = await mountHook(() => useParseFiltersSettings());
    expect(basicConfig).toMatchSnapshot('configuration, basic');

    const { unmount: groupedUnmount, result: groupedConfig } = await mountHook(() =>
      useParseFiltersSettings({
        useProduct: () => ({ productId: 'loremIpsum' }),
        useProductGraphConfig: () => ({
          filters: [
            {
              metric: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.CORE_SECONDS
            }
          ]
        })
      })
    );

    await groupedUnmount();
    expect(groupedConfig).toMatchSnapshot('configuration, grouped');

    const { unmount: standaloneUnmount, result: standaloneConfig } = await mountHook(() =>
      useParseFiltersSettings({
        useProduct: () => ({ productId: 'loremIpsum' }),
        useProductGraphConfig: () => ({
          filters: [
            {
              metric: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.CORE_SECONDS,
              isStandalone: true
            }
          ]
        })
      })
    );

    await standaloneUnmount();
    expect(standaloneConfig).toMatchSnapshot('configuration, standalone');
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
