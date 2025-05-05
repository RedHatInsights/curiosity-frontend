import { context, useProductOnload, useUsageBanner } from '../productViewOnloadContext';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

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
});
