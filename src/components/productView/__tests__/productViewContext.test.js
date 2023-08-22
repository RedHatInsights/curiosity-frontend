import {
  context,
  useProductQueryFactory,
  useProductQuery,
  useProductGraphTallyQuery,
  useProductInventoryGuestsQuery,
  useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery,
  useProductToolbarQuery,
  useProductContext,
  useProduct,
  useProductGraphConfig,
  useProductInventoryGuestsConfig,
  useProductInventoryHostsConfig,
  useProductInventorySubscriptionsConfig,
  useProductToolbarConfig
} from '../productViewContext';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';
import { config as openshiftContainerConfig } from '../../../config/product.openshiftContainer';

describe('ProductViewContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook factory for retrieving api queries', async () => {
    const mockContextValue = {
      lorem: { lorem: 'ipsum' },
      dolor: { dolor: 'sit' },
      productId: 'lorem',
      viewId: 'viewIpsum'
    };

    const { result } = await renderHook(() =>
      useProductQueryFactory('lorem', { useProductViewContext: () => mockContextValue })
    );
    expect(result).toMatchSnapshot('query factory');
  });

  it('should apply hooks for retrieving specific api queries', async () => {
    const mockContextValue = {
      query: { lorem: 'ipsum' },
      graphTallyQuery: { [rhsmConstants.RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES.GRANULARITY]: 'testGranularity' },
      inventoryGuestsQuery: { [rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES.OFFSET]: 'testOffset' },
      inventoryHostsQuery: { [rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES.LIMIT]: 'testLimit' },
      inventorySubscriptionsQuery: { [rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES.SLA]: 'testSla' },
      productId: 'lorem',
      viewId: 'viewIpsum'
    };

    const { result: productQuery } = await renderHook(() =>
      useProductQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(productQuery).toMatchSnapshot('query');

    const { result: graphTallyQuery } = await renderHook(() =>
      useProductGraphTallyQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(graphTallyQuery).toMatchSnapshot('graphTallyQuery');

    const { result: inventoryGuestsQuery } = await renderHook(() =>
      useProductInventoryGuestsQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(inventoryGuestsQuery).toMatchSnapshot('inventoryGuestsQuery');

    const { result: inventoryHostsQuery } = await renderHook(() =>
      useProductInventoryHostsQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(inventoryHostsQuery).toMatchSnapshot('inventoryHostsQuery');

    const { result: inventorySubscriptionsQuery } = await renderHook(() =>
      useProductInventorySubscriptionsQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(inventorySubscriptionsQuery).toMatchSnapshot('inventorySubscriptionsQuery');

    const { result: toolbarQuery } = await renderHook(() =>
      useProductToolbarQuery({ options: { useProductViewContext: () => mockContextValue } })
    );
    expect(toolbarQuery).toMatchSnapshot('toolbarQuery');
  });

  it('should apply a hook for retrieving product context', async () => {
    const mockContextValue = {
      lorem: { lorem: 'ipsum' },
      dolor: { dolor: 'sit' },
      productId: 'lorem',
      viewId: 'viewIpsum'
    };

    const { result } = await renderHook(() =>
      useProductContext({ useProductQuery: () => ({}), useProductViewContext: () => mockContextValue })
    );
    expect(result).toMatchSnapshot('product context, basic');

    const { result: openshiftUomCores } = await renderHook(() =>
      useProductContext({
        useProductQuery: () => ({
          [rhsmConstants.RHSM_API_QUERY_SET_TYPES.UOM]: rhsmConstants.RHSM_API_QUERY_UOM_TYPES.CORES
        }),
        useProductViewContext: () => openshiftContainerConfig
      })
    );
    expect(openshiftUomCores).toMatchSnapshot('product context, uom filtering cores');

    const { result: openshiftUomSockets } = await renderHook(() =>
      useProductContext({
        useProductQuery: () => ({
          [rhsmConstants.RHSM_API_QUERY_SET_TYPES.UOM]: rhsmConstants.RHSM_API_QUERY_UOM_TYPES.SOCKETS
        }),
        useProductViewContext: () => openshiftContainerConfig
      })
    );
    expect(openshiftUomSockets).toMatchSnapshot('product context, uom filtering sockets');
  });

  it('should apply hooks for retrieving specific config filters and settings', async () => {
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
      initialToolbarFilters: [{ ipsum: 'dolor' }, { hello: 'world' }],
      initialToolbarSettings: {
        ipsum: 'dolor'
      }
    };

    const { result: productConfig } = await renderHook(() =>
      useProduct({ useProductViewContext: () => mockContextValue })
    );
    expect(productConfig).toMatchSnapshot('productConfig');

    const { result: productGraphConfig } = await renderHook(() =>
      useProductGraphConfig({ useProductContext: () => mockContextValue })
    );
    expect(productGraphConfig).toMatchSnapshot('productGraphConfig');

    const { result: productInventoryGuestsConfig } = await renderHook(() =>
      useProductInventoryGuestsConfig({ useProductContext: () => mockContextValue })
    );
    expect(productInventoryGuestsConfig).toMatchSnapshot('productInventoryGuestsConfig');

    const { result: productInventoryHostsConfig } = await renderHook(() =>
      useProductInventoryHostsConfig({ useProductContext: () => mockContextValue })
    );
    expect(productInventoryHostsConfig).toMatchSnapshot('productInventoryHostsConfig');

    const { result: productInventorySubscriptionsConfig } = await renderHook(() =>
      useProductInventorySubscriptionsConfig({ useProductContext: () => mockContextValue })
    );
    expect(productInventorySubscriptionsConfig).toMatchSnapshot('productInventorySubscriptionsConfig');

    const { result: productToolbarConfig } = await renderHook(() =>
      useProductToolbarConfig({ useProductContext: () => mockContextValue })
    );
    expect(productToolbarConfig).toMatchSnapshot('productToolbarConfig');
  });
});
