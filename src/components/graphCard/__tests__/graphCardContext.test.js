import { context, useGetMetrics, useMetricsSelector, useParseFiltersSettings } from '../graphCardContext';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

describe('GraphCardContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should parse configuration', async () => {
    const { result: basicConfig } = await renderHook(() => useParseFiltersSettings());
    expect(basicConfig).toMatchSnapshot('configuration, basic');

    const { unmount: groupedUnmount, result: groupedConfig } = await renderHook(() =>
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

    const { unmount: standaloneUnmount, result: standaloneConfig } = await renderHook(() =>
      useParseFiltersSettings({
        useProduct: () => ({ productId: 'loremIpsum' }),
        useProductGraphConfig: () => ({
          filters: [
            {
              metric: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.CORE_SECONDS,
              loremIpsum: true
            }
          ]
        })
      })
    );

    await standaloneUnmount();
    expect(standaloneConfig).toMatchSnapshot('configuration, standalone');
  });

  it('should send resolved SLA and Usage values with graph metric requests', async () => {
    const dispatch = jest.fn();
    const getGraphMetrics = jest.fn(() => dispatchGraphMetrics => dispatchGraphMetrics());
    const query = {
      [rhsmConstants.RHSM_API_QUERY_SET_TYPES.SLA]: rhsmConstants.RHSM_API_QUERY_SLA_TYPES.STANDARD,
      [rhsmConstants.RHSM_API_QUERY_SET_TYPES.USAGE]: rhsmConstants.RHSM_API_QUERY_USAGE_TYPES.PRODUCTION
    };
    const metrics = [
      {
        metric: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.CORE_SECONDS,
        isCapacity: false,
        query: {
          [rhsmConstants.RHSM_API_QUERY_SET_TYPES.SLA]: '',
          [rhsmConstants.RHSM_API_QUERY_SET_TYPES.USAGE]: rhsmConstants.RHSM_API_QUERY_USAGE_TYPES.DISASTER
        }
      }
    ];

    const { unmount } = await renderHook(() =>
      useGetMetrics({
        getGraphMetrics,
        useDispatch: () => dispatch,
        useGraphCardContext: () => ({ settings: { metrics } }),
        useMetricsSelector: () => ({}),
        useProduct: () => ({ productId: 'rhel' }),
        useProductGraphTallyQuery: () => query
      })
    );

    expect(getGraphMetrics).toHaveBeenCalledWith(
      [
        {
          id: 'rhel',
          metric: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.CORE_SECONDS,
          isCapacity: false,
          query: {
            [rhsmConstants.RHSM_API_QUERY_SET_TYPES.SLA]: rhsmConstants.RHSM_API_QUERY_SLA_TYPES.PREMIUM,
            [rhsmConstants.RHSM_API_QUERY_SET_TYPES.USAGE]: rhsmConstants.RHSM_API_QUERY_USAGE_TYPES.DISASTER
          }
        }
      ],
      query
    );
    expect(dispatch).toHaveBeenCalledTimes(1);

    await unmount();
  });

  it('should omit unsupported Usage from annual OpenShift graph requests', async () => {
    const dispatch = jest.fn();
    const getGraphMetrics = jest.fn(() => dispatchGraphMetrics => dispatchGraphMetrics());
    const query = {
      [rhsmConstants.RHSM_API_QUERY_SET_TYPES.SLA]: rhsmConstants.RHSM_API_QUERY_SLA_TYPES.STANDARD
    };
    const metrics = [
      {
        metric: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.CORES,
        isCapacity: false,
        query: {
          [rhsmConstants.RHSM_API_QUERY_SET_TYPES.SLA]: '',
          [rhsmConstants.RHSM_API_QUERY_SET_TYPES.USAGE]: rhsmConstants.RHSM_API_QUERY_USAGE_TYPES.DISASTER
        }
      }
    ];

    const { unmount } = await renderHook(() =>
      useGetMetrics({
        getGraphMetrics,
        useDispatch: () => dispatch,
        useGraphCardContext: () => ({ settings: { metrics } }),
        useMetricsSelector: () => ({}),
        useProduct: () => ({ productId: 'openshift' }),
        useProductGraphTallyQuery: () => query,
        useProductToolbarConfig: () => ({
          filters: [{ id: rhsmConstants.RHSM_API_QUERY_SET_TYPES.SLA }]
        })
      })
    );

    expect(getGraphMetrics).toHaveBeenCalledWith(
      [
        {
          id: 'openshift',
          metric: rhsmConstants.RHSM_API_PATH_METRIC_TYPES.CORES,
          isCapacity: false,
          query: {
            [rhsmConstants.RHSM_API_QUERY_SET_TYPES.SLA]: rhsmConstants.RHSM_API_QUERY_SLA_TYPES.PREMIUM
          }
        }
      ],
      query
    );
    expect(dispatch).toHaveBeenCalledTimes(1);

    await unmount();
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
