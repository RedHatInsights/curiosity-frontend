import { context, useGetMetrics, useMetricsSelector, useParseFiltersSettings } from '../graphCardContext';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';
import { rhsmServices } from '../../../services/rhsm/rhsmServices';
import { graphCardHelpers } from '../graphCardHelpers';
import { ChartTypeVariant } from '../../chart/chart';
import { graphReducer } from '../../../redux/reducers/graphReducer';
import { reduxHelpers } from '../../../redux/common/reduxHelpers';

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
        useProductGraphTallyQuery: () => query,
        useProductViewContext: () => ({ defaultFilteringEnabled: true })
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
        useProductViewContext: () => ({
          initialToolbarFilters: [{ id: rhsmConstants.RHSM_API_QUERY_SET_TYPES.SLA }],
          defaultFilteringEnabled: true
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

  it.each([false, true])(
    'should retain configured graph IDs across category changes with default filtering enabled: %s',
    async defaultFilteringEnabled => {
      const productId = 'rhel';
      const { filtersSettings } = graphCardHelpers.generateChartSettings({
        productId,
        filters: [
          { metric: 'sockets', chartType: ChartTypeVariant.threshold },
          { metric: 'sockets' },
          { metric: 'cores', query: { category: 'hypervisor', billing_category: 'on_demand' } }
        ]
      });
      const metrics = filtersSettings.flatMap(({ settings }) => settings.metrics);
      const graphContext = { settings: { metrics } };
      let query = {
        category: 'physical',
        billing_category: 'prepaid',
        start_date: '2026-10-01T00:00:00.000Z',
        sla: rhsmConstants.RHSM_API_QUERY_SLA_TYPES.STANDARD,
        usage: rhsmConstants.RHSM_API_QUERY_USAGE_TYPES.DEVELOPMENT
      };
      let graphState;
      const dispatch = jest.fn(actions =>
        actions.map(({ payload, ...action }) =>
          payload.then(response => {
            graphState = graphReducer(graphState, {
              ...action,
              type: reduxHelpers.FULFILLED_ACTION(action.type),
              payload: response
            });
          })
        )
      );
      const capacityService = jest.spyOn(rhsmServices, 'getGraphCapacity').mockResolvedValue({ data: ['capacity'] });
      const tallyService = jest.spyOn(rhsmServices, 'getGraphTally').mockResolvedValue({ data: ['tally'] });

      try {
        const { rerender, unmount, act } = await renderHook(() =>
          useGetMetrics({
            useDispatch: () => dispatch,
            useGraphCardContext: () => graphContext,
            useMetricsSelector: () => ({}),
            useProduct: () => ({ productId }),
            useProductGraphTallyQuery: () => query,
            useProductViewContext: () => ({ defaultFilteringEnabled })
          })
        );

        const expectStoredMetrics = async () => {
          const actions = dispatch.mock.calls.at(-1)[0];
          expect(actions.map(({ meta }) => meta.id)).toEqual(metrics.map(({ id }) => id));
          expect(capacityService).toHaveBeenLastCalledWith([productId, 'sockets'], query, expect.any(Object));
          expect(tallyService).toHaveBeenLastCalledWith(
            [productId, 'cores'],
            { ...query, category: 'hypervisor', billing_category: 'on_demand' },
            expect.any(Object)
          );

          const { result: selected, unmount: unmountSelector } = await renderHook(() =>
            useMetricsSelector({
              useGraphCardContext: () => graphContext,
              useSelectorsResponse: selectors => ({
                data: selectors.map(selector => selector({ graph: graphState }))
              })
            })
          );
          expect(selected.dataSets.map(({ fulfilled }) => fulfilled)).toEqual([true, true, true]);
          expect(selected.dataSets.map(({ data }) => data)).toEqual([['capacity'], ['tally'], ['tally']]);
          await unmountSelector();
        };

        await expectStoredMetrics();
        query = { ...query, category: 'virtual', billing_category: 'on_demand' };
        await act(async () => rerender());
        await expectStoredMetrics();
        expect(dispatch).toHaveBeenCalledTimes(2);
        await unmount();
      } finally {
        capacityService.mockRestore();
        tallyService.mockRestore();
      }
    }
  );

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
