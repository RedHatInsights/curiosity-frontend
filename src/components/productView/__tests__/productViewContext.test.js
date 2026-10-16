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
  useProductGraphConfig,
  useProductInventoryGuestsConfig,
  useProductInventoryHostsConfig,
  useProductInventorySubscriptionsConfig,
  useProductToolbarConfig
} from '../productViewContext';
import {
  rhsmConstants,
  RHSM_API_QUERY_SET_TYPES as QUERY_TYPES,
  RHSM_API_QUERY_SLA_TYPES as SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES as USAGE_TYPES
} from '../../../services/rhsm/rhsmConstants';
import { config as rhelConfig } from '../../../config/product.rhel';
import { config as rhelPaygConfig } from '../../../config/product.rhelElsPayg';
import { config as openshiftConfig } from '../../../config/product.openshiftContainer';

const enableResolvedSlaUsageFiltering = () => true;

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

  it('should resolve cleared SLA and Usage filters to their defaults', async () => {
    const { result } = await renderHook(() =>
      useProductQuery({
        useResolvedSlaUsageFilteringEnabled: enableResolvedSlaUsageFiltering,
        useProductQueryFactory: () => ({
          [QUERY_TYPES.SLA]: null,
          [QUERY_TYPES.USAGE]: null
        })
      })
    );

    expect(result).toEqual({
      [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM,
      [QUERY_TYPES.USAGE]: USAGE_TYPES.PRODUCTION
    });
  });

  it('should leave cleared SLA and Usage filters unchanged while the feature flag is disabled by default', async () => {
    const { result } = await renderHook(() =>
      useProductQuery({
        useProductQueryFactory: () => ({
          [QUERY_TYPES.SLA]: null,
          [QUERY_TYPES.USAGE]: null
        })
      })
    );

    expect(result).toEqual({
      [QUERY_TYPES.SLA]: null,
      [QUERY_TYPES.USAGE]: null
    });
  });

  it.each([
    [
      'annual RHEL',
      rhelConfig,
      {
        [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM,
        [QUERY_TYPES.USAGE]: USAGE_TYPES.PRODUCTION
      }
    ],
    ['PAYG RHEL', rhelPaygConfig, {}],
    ['annual OpenShift', openshiftConfig, { [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM }]
  ])('should resolve only supported inventory filters for %s', async (_description, productConfig, expectedFilters) => {
    const { result, unmount } = await renderHook(() =>
      useProductInventorySubscriptionsQuery({
        useProductViewContext: () => productConfig,
        useResolvedSlaUsageFilteringEnabled: enableResolvedSlaUsageFiltering,
        useProductQuery: () => ({
          [QUERY_TYPES.SLA]: SLA_TYPES.STANDARD,
          [QUERY_TYPES.USAGE]: USAGE_TYPES.DEVELOPMENT
        }),
        useProductQueryFactory: () => ({
          [QUERY_TYPES.SLA]: '',
          [QUERY_TYPES.USAGE]: 'unsupported',
          [QUERY_TYPES.LIMIT]: 100
        })
      })
    );

    expect(result).toEqual({ [QUERY_TYPES.LIMIT]: 100, ...expectedFilters });

    await unmount();
  });

  it.each([
    ['base', useProductQuery],
    ['graph', useProductGraphTallyQuery],
    ['guest inventory', useProductInventoryGuestsQuery],
    ['host inventory', useProductInventoryHostsQuery],
    ['subscription inventory', useProductInventorySubscriptionsQuery]
  ])('should omit Usage from annual OpenShift %s queries', async (_description, useQuery) => {
    const { result, unmount } = await renderHook(() =>
      useQuery({
        useProductViewContext: () => openshiftConfig,
        useResolvedSlaUsageFilteringEnabled: enableResolvedSlaUsageFiltering,
        useProductQuery: () => ({
          [QUERY_TYPES.SLA]: null,
          [QUERY_TYPES.USAGE]: null
        }),
        useProductQueryFactory: () => ({
          [QUERY_TYPES.SLA]: '',
          [QUERY_TYPES.USAGE]: 'unsupported'
        })
      })
    );

    expect(result).toEqual({ [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM });

    await unmount();
  });

  it('should omit Usage from annual OpenShift export requests', async () => {
    const { result, unmount } = await renderHook(() =>
      useProductExportQuery({
        useProduct: () => ({ productId: openshiftConfig.productId }),
        useProductViewContext: () => openshiftConfig,
        useResolvedSlaUsageFilteringEnabled: enableResolvedSlaUsageFiltering,
        useProductToolbarQuery: () => ({
          [QUERY_TYPES.SLA]: null,
          [QUERY_TYPES.USAGE]: null
        })
      })
    );

    expect(result).toEqual({
      product_id: openshiftConfig.productId,
      [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM
    });

    await unmount();
  });

  it.each([
    [
      'invalid endpoint values',
      { [QUERY_TYPES.SLA]: null, [QUERY_TYPES.USAGE]: 'unsupported' },
      SLA_TYPES.PREMIUM,
      USAGE_TYPES.PRODUCTION
    ],
    [
      'valid endpoint values',
      { [QUERY_TYPES.SLA]: SLA_TYPES.SELF, [QUERY_TYPES.USAGE]: USAGE_TYPES.DISASTER },
      SLA_TYPES.SELF,
      USAGE_TYPES.DISASTER
    ]
  ])(
    'should resolve endpoint filters after merging global values: %s',
    async (_description, endpointQuery, sla, usage) => {
      const { result } = await renderHook(() =>
        useProductGraphTallyQuery({
          useResolvedSlaUsageFilteringEnabled: enableResolvedSlaUsageFiltering,
          useProductQuery: () => ({
            [QUERY_TYPES.SLA]: SLA_TYPES.STANDARD,
            [QUERY_TYPES.USAGE]: USAGE_TYPES.DEVELOPMENT
          }),
          useProductQueryFactory: () => endpointQuery
        })
      );

      expect(result).toEqual({
        [QUERY_TYPES.SLA]: sla,
        [QUERY_TYPES.USAGE]: usage
      });
    }
  );

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
});
