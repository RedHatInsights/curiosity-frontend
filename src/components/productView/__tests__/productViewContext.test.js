import {
  context,
  useProductQueryFactory,
  useProductQuery,
  useProductGraphTallyQuery,
  useProductInventoryGuestsQuery,
  useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery,
  useProductContext,
  useProduct,
  useProductGraphConfig,
  useProductInventoryGuestsConfig,
  useProductInventoryHostsConfig,
  useProductInventorySubscriptionsConfig,
  useProductToolbarConfig
} from '../productViewContext';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';
import { config as openshiftContainerConfig } from '../../../config/product.openshiftContainer';

describe('ProductViewContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook factory for retrieving api queries', () => {
    const mockContextValue = {
      lorem: { lorem: 'ipsum' },
      dolor: { dolor: 'sit' },
      productId: 'lorem',
      viewId: 'viewIpsum'
    };

    const { result } = shallowHook(() =>
      useProductQueryFactory('lorem', { useProductViewContext: () => mockContextValue })
    );
    expect(result).toMatchSnapshot('query factory');
  });

  it('should apply hooks for retrieving specific api queries', () => {
    const mockContextValue = {
      query: { lorem: 'ipsum' },
      graphTallyQuery: { [rhsmApiTypes.RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES.GRANULARITY]: 'testGranularity' },
      inventoryGuestsQuery: { [rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES.OFFSET]: 'testOffset' },
      inventoryHostsQuery: { [rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_TYPES.LIMIT]: 'testLimit' },
      inventorySubscriptionsQuery: { [rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES.SLA]: 'testSla' },
      productId: 'lorem',
      viewId: 'viewIpsum'
    };

    const { result: productQuery } = shallowHook(() =>
      useProductQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(productQuery).toMatchSnapshot('query');

    const { result: graphTallyQuery } = shallowHook(() =>
      useProductGraphTallyQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(graphTallyQuery).toMatchSnapshot('graphTallyQuery');

    const { result: inventoryGuestsQuery } = shallowHook(() =>
      useProductInventoryGuestsQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(inventoryGuestsQuery).toMatchSnapshot('inventoryGuestsQuery');

    const { result: inventoryHostsQuery } = shallowHook(() =>
      useProductInventoryHostsQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(inventoryHostsQuery).toMatchSnapshot('inventoryHostsQuery');

    const { result: inventorySubscriptionsQuery } = shallowHook(() =>
      useProductInventorySubscriptionsQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(inventorySubscriptionsQuery).toMatchSnapshot('inventorySubscriptionsQuery');
  });

  it('should apply a hook for retrieving product context', () => {
    const mockContextValue = {
      lorem: { lorem: 'ipsum' },
      dolor: { dolor: 'sit' },
      productId: 'lorem',
      viewId: 'viewIpsum'
    };

    const { result } = shallowHook(() =>
      useProductContext({ useProductQuery: () => ({}), useProductViewContext: () => mockContextValue })
    );
    expect(result).toMatchSnapshot('product context, basic');

    const { result: openshiftUomCores } = shallowHook(() =>
      useProductContext({
        useProductQuery: () => ({
          [rhsmApiTypes.RHSM_API_QUERY_TYPES.UOM]: rhsmApiTypes.RHSM_API_QUERY_UOM_TYPES.CORES
        }),
        useProductViewContext: () => openshiftContainerConfig
      })
    );
    expect(openshiftUomCores).toMatchSnapshot('product context, uom filtering cores');

    const { result: openshiftUomSockets } = shallowHook(() =>
      useProductContext({
        useProductQuery: () => ({
          [rhsmApiTypes.RHSM_API_QUERY_TYPES.UOM]: rhsmApiTypes.RHSM_API_QUERY_UOM_TYPES.SOCKETS
        }),
        useProductViewContext: () => openshiftContainerConfig
      })
    );
    expect(openshiftUomSockets).toMatchSnapshot('product context, uom filtering sockets');
  });

  it('should apply hooks for retrieving specific config filters and settings', () => {
    const mockContextValue = {
      productGroup: 'loremIpsum',
      productId: 'lorem',
      productLabel: 'labelLorem',
      viewId: 'viewIpsum',
      initialGraphFilters: [{ lorem: 'ipsum' }],
      initialGraphSettings: {
        lorem: 'ipsum'
      },
      initialGuestsFilters: [{ sit: 'dolor' }],
      initialGuestsSettings: {
        sit: 'dolor'
      },
      initialInventoryFilters: [{ dolor: 'sit' }],
      initialInventorySettings: {
        dolor: 'sit'
      },
      initialSubscriptionsInventoryFilters: [{ sit: 'amet' }],
      initialSubscriptionsInventorySettings: {
        sit: 'amet'
      },
      initialToolbarFilters: [{ ipsum: 'dolor' }],
      initialSecondaryToolbarFilters: [{ hello: 'world' }],
      initialToolbarSettings: {
        ipsum: 'dolor'
      }
    };

    const { result: productConfig } = shallowHook(() => useProduct({ useProductViewContext: () => mockContextValue }));
    expect(productConfig).toMatchSnapshot('productConfig');

    const { result: productGraphConfig } = shallowHook(() =>
      useProductGraphConfig({ useProductContext: () => mockContextValue })
    );
    expect(productGraphConfig).toMatchSnapshot('productGraphConfig');

    const { result: productInventoryGuestsConfig } = shallowHook(() =>
      useProductInventoryGuestsConfig({ useProductContext: () => mockContextValue })
    );
    expect(productInventoryGuestsConfig).toMatchSnapshot('productInventoryGuestsConfig');

    const { result: productInventoryHostsConfig } = shallowHook(() =>
      useProductInventoryHostsConfig({ useProductContext: () => mockContextValue })
    );
    expect(productInventoryHostsConfig).toMatchSnapshot('productInventoryHostsConfig');

    const { result: productInventorySubscriptionsConfig } = shallowHook(() =>
      useProductInventorySubscriptionsConfig({ useProductContext: () => mockContextValue })
    );
    expect(productInventorySubscriptionsConfig).toMatchSnapshot('productInventorySubscriptionsConfig');

    const { result: productToolbarConfig } = shallowHook(() =>
      useProductToolbarConfig({ useProductContext: () => mockContextValue })
    );
    expect(productToolbarConfig).toMatchSnapshot('productToolbarConfig');
  });
});
