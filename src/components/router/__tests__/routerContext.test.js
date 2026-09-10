import {
  context,
  setRouteProduct,
  useNavigate,
  useRouteDetail,
  useSanitizeOidcParams,
  useSetRouteProduct
} from '../routerContext';
import { RHSM_API_PATH_PRODUCT_TYPES } from '../../../services/rhsm/rhsmConstants';
import { helpers } from '../../../common';

describe('RouterContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useNavigate', async () => {
    const mockWindowHistory = jest.fn();
    const { result: mockNavigationSet } = await renderHook(() =>
      useNavigate({
        useLocation: () => ({
          search: '?lorem=ipsum'
        }),
        windowHistory: { pushState: mockWindowHistory }
      })
    );

    /**
     * Note: Snapshots for first "mockNavigationSet" are aimed at being what Levenshtein denotes as a "closest match"
     * It is expected that this will alter as products are added to configuration.
     */
    mockNavigationSet('/dolor/sit');
    mockNavigationSet('rhel');
    mockNavigationSet('insights');

    expect(mockWindowHistory.mock.calls).toMatchSnapshot('navigation push');
  });

  it('should strip OIDC params from query and hash during navigation', async () => {
    const mockWindowHistory = jest.fn();
    const { result: navigate } = await renderHook(() =>
      useNavigate({
        useLocation: () => ({
          search: '?lorem=ipsum&state=abc123&code=xyz789',
          hash: '#anchor&session_state=def456'
        }),
        windowHistory: { pushState: mockWindowHistory }
      })
    );

    navigate('rhel');

    const pushedUrl = mockWindowHistory.mock.calls[0][2];
    expect(pushedUrl).toContain('?lorem=ipsum');
    expect(pushedUrl).toContain('#anchor');
    expect(pushedUrl).not.toContain('state=');
    expect(pushedUrl).not.toContain('code=');
    expect(pushedUrl).not.toContain('session_state=');
  });

  it.each([
    {
      productPath: 'rhel',
      disableIsClosestMatch: false,
      description: 'rhel'
    },
    {
      productPath: 'insights',
      disableIsClosestMatch: false,
      description: 'insights, rhel'
    },
    {
      productPath: `${helpers.UI_DISPLAY_NAME}/rhel`,
      disableIsClosestMatch: false,
      description: `${helpers.UI_DISPLAY_NAME} path rhel`
    },
    {
      productPath: `${helpers.UI_DISPLAY_NAME}/usage/rhel`,
      disableIsClosestMatch: false,
      description: `${helpers.UI_DISPLAY_NAME} usage path rhel`
    },
    {
      productPath: 'openshift',
      disableIsClosestMatch: false,
      description: 'openshift'
    },
    {
      productPath: `${helpers.UI_DISPLAY_NAME}/openshift`,
      disableIsClosestMatch: false,
      description: `${helpers.UI_DISPLAY_NAME} path openshift`
    },
    {
      productPath: `${helpers.UI_DISPLAY_NAME}/usage/openshift`,
      disableIsClosestMatch: false,
      description: `${helpers.UI_DISPLAY_NAME} usage path openshift`
    },
    {
      productPath: 'ansible',
      disableIsClosestMatch: false,
      description: 'ansible'
    },
    {
      productPath: `${helpers.UI_DISPLAY_NAME}/ansible`,
      disableIsClosestMatch: false,
      description: `${helpers.UI_DISPLAY_NAME} path ansible`
    },
    {
      productPath: `${helpers.UI_DISPLAY_NAME}/usage/ansible`,
      disableIsClosestMatch: false,
      description: `${helpers.UI_DISPLAY_NAME} usage path ansible`
    },
    {
      productPath: 'l',
      disableIsClosestMatch: false,
      description: 'closest'
    },
    {
      productPath: 'l',
      productVariant: { rhel: RHSM_API_PATH_PRODUCT_TYPES.SATELLITE_SERVER },
      disableIsClosestMatch: true,
      description: 'attempt closest disabled but return exact because of variant selection'
    },
    {
      productPath: 'l',
      disableIsClosestMatch: true,
      description: 'closest disabled'
    }
  ])('should apply a helper with setRouteProduct and return a product configuration match, $description', params => {
    const { firstMatch, isClosest, productGroup, productPath } = setRouteProduct(params);

    expect({
      isClosest,
      productGroup,
      productPath,
      productId: firstMatch?.productId
    }).toMatchSnapshot();
  });

  it('should apply a hook for the helper setRouteProduct with useSetRouteProduct', async () => {
    const mockSetProduct = jest.fn();
    mockSetProduct.memo = mockSetProduct;

    await renderHook(() =>
      useSetRouteProduct({
        setProduct: mockSetProduct,
        useLocation: () => ({ pathname: 'rhel' })
      })
    );

    expect(mockSetProduct.mock.calls).toMatchSnapshot('hook');
  });

  describe('useSanitizeOidcParams', () => {
    const mountWithLocation = async ({ search = '', hash = '' } = {}) => {
      const mockWindowHistory = { replaceState: jest.fn() };
      await renderHook(() =>
        useSanitizeOidcParams({
          useLocation: () => ({ pathname: '/subscriptions/rhel', search, hash }),
          windowHistory: mockWindowHistory
        })
      );
      return mockWindowHistory;
    };

    it('should remove OIDC params while preserving legitimate query and hash params', async () => {
      const windowHistory = await mountWithLocation({
        search: '?lorem=ipsum&state=abc123',
        hash: '#anchor&code=xyz789'
      });
      expect(windowHistory.replaceState).toHaveBeenCalledTimes(1);
      const url = windowHistory.replaceState.mock.calls[0][2];
      expect(url).toContain('?lorem=ipsum');
      expect(url).toContain('#anchor');
      expect(url).not.toContain('state=');
      expect(url).not.toContain('code=');
    });

    it('should not replace an already-clean URL', async () => {
      const windowHistory = await mountWithLocation({ search: '?lorem=ipsum', hash: '#anchor' });
      expect(windowHistory.replaceState).not.toHaveBeenCalled();
    });
  });

  it('should apply a hook for useRouteDetail', async () => {
    const mockUpdateDocumentTitle = jest.fn();

    await renderHook(() =>
      useRouteDetail({
        useChrome: () => ({ updateDocumentTitle: mockUpdateDocumentTitle }),
        useSetRouteProduct: () => ({ productGroup: 'rhel' })
      })
    );

    expect(mockUpdateDocumentTitle.mock.calls).toMatchSnapshot('document title');
  });
});
