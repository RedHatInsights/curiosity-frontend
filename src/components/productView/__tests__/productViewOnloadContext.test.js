import { context, useProductOnload, useUsageBanner, useConfigBanners } from '../productViewOnloadContext';
import { bannersConfig } from '../../../config';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

jest.mock('../../../config', () => ({
  ...jest.requireActual('../../../config'),
  bannersConfig: []
}));

describe('ProductViewOnloadContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
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

  it.each([
    {
      description: 'basic',
      data: {}
    },
    {
      description: 'single account',
      data: {
        isUsageError: true,
        usageMetrics: {
          firstProvider: 'Lorem',
          firstProviderAccount: 'ipsum',
          uniqueAccountsProvidersList: [
            {
              id: 'ipsum',
              provider: 'Lorem'
            }
          ]
        }
      }
    },
    {
      description: 'multiple accounts single provider',
      data: {
        isUsageError: true,
        usageMetrics: {
          firstProvider: 'Lorem',
          firstProviderAccount: 'ipsum',
          uniqueAccountsProvidersList: [
            {
              id: 'ipsum',
              provider: 'Lorem'
            },
            {
              id: 'ipsumLorem',
              provider: 'Lorem'
            }
          ]
        }
      }
    },
    {
      description: 'multiple accounts multiple providers',
      data: {
        isUsageError: true,
        usageMetrics: {
          firstProvider: 'Lorem',
          firstProviderAccount: 'ipsum',
          uniqueAccountsProvidersList: [
            {
              id: 'ipsum',
              provider: 'Lorem'
            },
            {
              id: 'ipsumLorem',
              provider: 'Lorem'
            },
            {
              id: 'sit',
              provider: 'Dolor'
            }
          ]
        }
      }
    }
  ])('should apply a hook for usage banner alerts, $description', async ({ data }) => {
    const mockSetBannerMessagesHook = jest.fn();

    await renderHook(() =>
      useUsageBanner({
        useSetBannerMessages: () => mockSetBannerMessagesHook,
        useSelector: () => ({ data })
      })
    );
    expect(mockSetBannerMessagesHook.mock.calls.pop()).toMatchSnapshot();
  });

  it.each([
    {
      description: 'no banners',
      banners: [],
      productId: 'lorem',
      expectedCalls: 0
    },
    {
      description: 'associated banner',
      banners: [
        {
          id: 'banner-1',
          title: 'title-1',
          productIds: ['lorem']
        }
      ],
      productId: 'lorem',
      expectedCalls: 1
    },
    {
      description: 'non-associated banner',
      banners: [
        {
          id: 'banner-1',
          title: 'title-1',
          productIds: ['ipsum']
        }
      ],
      productId: 'lorem',
      expectedCalls: 0
    },
    {
      description: 'banner with condition met',
      banners: [
        {
          id: 'banner-1',
          title: 'title-1',
          condition: ({ productId }) => productId === 'lorem'
        }
      ],
      productId: 'lorem',
      expectedCalls: 1
    },
    {
      description: 'banner with condition NOT met',
      banners: [
        {
          id: 'banner-1',
          title: 'title-1',
          condition: ({ productId }) => productId === 'ipsum'
        }
      ],
      productId: 'lorem',
      expectedCalls: 0
    }
  ])('should apply a hook for configured banners, $description', async ({ banners, productId, expectedCalls }) => {
    bannersConfig.length = 0;
    bannersConfig.push(...banners);

    const mockSetBannerMessagesHook = jest.fn();

    await renderHook(() =>
      useConfigBanners({
        useProduct: () => ({ productId }),
        useSetBannerMessages: () => mockSetBannerMessagesHook,
        useSelector: () => ({})
      })
    );

    expect(mockSetBannerMessagesHook).toHaveBeenCalledTimes(expectedCalls);
    expect(mockSetBannerMessagesHook.mock.calls).toMatchSnapshot();
  });
});
