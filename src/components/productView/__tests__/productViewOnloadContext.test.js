import { context, useProductOnload } from '../productViewOnloadContext';
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
});
