import {
  context,
  useProductQueryFactory,
  useProductQuery,
  useProductQueryConditional,
  useProductBillingAccountsQuery,
  useProductExportQuery,
  useProductGraphTallyQuery,
  useProductInventoryGuestsQuery,
  useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery,
  useProductToolbarQuery,
  useProductContext,
  useProduct,
  useProductOnload,
  useProductGraphConfig,
  useProductInventoryGuestsConfig,
  useProductInventoryHostsConfig,
  useProductInventorySubscriptionsConfig,
  useProductToolbarConfig
} from '../productViewContext';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

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

  it('should apply a hook for retrieving configuration based queries', async () => {
    const mockContextValue = {
      lorem: { lorem: 'ipsum' },
      dolor: { dolor: 'sit' },
      productId: 'lorem',
      viewId: 'viewIpsum'
    };
    const mockSelectorValue = {
      billing: {
        data: {
          defaultProvider: 'mockProvider',
          defaultAccount: 'mockAccount'
        }
      }
    };

    const { result } = await renderHook(() =>
      useProductQueryConditional({
        useProductViewContext: () => mockContextValue,
        useSelectors: () => mockSelectorValue
      })
    );
    expect(result).toMatchSnapshot('query factory');
  });

  it.each([
    {
      description: 'billingAccountsQuery',
      useHook: useProductBillingAccountsQuery,
      params: {
        useSession: () => ({ orgId: 'mockOrgId' })
      }
    },
    {
      description: 'query',
      useHook: useProductQuery
    },
    {
      description: 'graphTallyQuery',
      useHook: useProductGraphTallyQuery
    },
    {
      description: 'inventoryGuestsQuery',
      useHook: useProductInventoryGuestsQuery
    },
    {
      description: 'inventoryHostsQuery',
      useHook: useProductInventoryHostsQuery
    },
    {
      description: 'inventorySubscriptionsQuery',
      useHook: useProductInventorySubscriptionsQuery
    },
    {
      description: 'toolbarQuery',
      useHook: useProductToolbarQuery
    },
    {
      description: 'exportQuery',
      useHook: useProductExportQuery
    }
  ])('should apply hooks for retrieving specific api queries: $description', async ({ useHook, params }) => {
    const mockContextValue = {
      billingAccountsQuery: { dolor: 'sit' },
      query: { lorem: 'ipsum' },
      graphTallyQuery: { [rhsmConstants.RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES.GRANULARITY]: 'testGranularity' },
      inventoryGuestsQuery: { [rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES.OFFSET]: 'testOffset' },
      inventoryHostsQuery: { [rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES.LIMIT]: 'testLimit' },
      inventorySubscriptionsQuery: { [rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES.SLA]: 'testSla' },
      productId: 'lorem',
      viewId: 'viewIpsum'
    };

    const { result } = await renderHook(() =>
      useHook({
        ...params,
        options: { useProductViewContext: () => mockContextValue }
      })
    );
    expect(result).toMatchSnapshot();
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
  });

  it.each([
    {
      description: 'productConfig',
      useHook: useProduct
    },
    {
      description: 'productGraphConfig',
      useHook: useProductGraphConfig
    },
    {
      description: 'productInventoryGuestsConfig',
      useHook: useProductInventoryGuestsConfig
    },
    {
      description: 'productInventoryHostsConfig',
      useHook: useProductInventoryHostsConfig
    },
    {
      description: 'productInventorySubscriptionsConfig',
      useHook: useProductInventorySubscriptionsConfig
    },
    {
      description: 'productToolbarConfig',
      useHook: useProductToolbarConfig
    }
  ])('should apply hooks for retrieving specific config filters and settings: $description', async ({ useHook }) => {
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

    const { result } = await renderHook(() =>
      useHook({ useProductViewContext: () => mockContextValue, useProductContext: () => mockContextValue })
    );
    expect(result).toMatchSnapshot();
  });

  it('should apply a hook for product configuration onload', async () => {
    const mockApiCall = jest.fn();
    const mockDispatch = jest.fn();
    const mockContextValue = {
      productId: 'lorem'
    };

    const { result: basic } = await renderHook(() =>
      useProductOnload({ useProductViewContext: () => mockContextValue })
    );
    expect(basic).toMatchSnapshot('product onload, basic');

    const { result: onload } = await renderHook(() =>
      useProductOnload({
        getBillingAccounts: mockApiCall,
        useDispatch: () => mockDispatch,
        useProductViewContext: () => ({
          ...mockContextValue,
          onloadProduct: [rhsmConstants.RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID]
        })
      })
    );
    expect(onload).toMatchSnapshot('product onload, onload');
    expect(mockApiCall.mock.calls).toMatchSnapshot('dispatch');
  });
});
