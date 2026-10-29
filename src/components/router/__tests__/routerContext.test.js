import {
  context,
  setRouteProduct,
  useNavigate,
  useNavigateVariant,
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
      productPath: `${helpers.UI_DISPLAY_NAME}/usage/${RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM}`,
      disableIsClosestMatch: true,
      description: 'variant path, resolved from the url'
    },
    {
      productPath: `${helpers.UI_DISPLAY_NAME}/usage/${encodeURIComponent(
        RHSM_API_PATH_PRODUCT_TYPES.SATELLITE_SERVER
      )}`,
      disableIsClosestMatch: true,
      description: 'encoded variant path, resolved from the url'
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

  describe('setRouteProduct, last viewed variant', () => {
    const lastViewed = { rhel: RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM };

    it('should restore the last viewed variant when the path stops at a group', () => {
      const { firstMatch, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/rhel',
        productVariant: lastViewed,
        isRestoreVariant: true
      });

      expect(firstMatch?.productId).toBe(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM);
      expect(restoreVariantPath).toBe('/subscriptions/usage/rhel/RHEL%20for%20ARM');
    });

    it('should restore the last viewed variant when the path stops at an alias', () => {
      const { firstMatch, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/insights',
        productVariant: lastViewed,
        isRestoreVariant: true
      });

      expect(firstMatch?.productId).toBe(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM);
      expect(restoreVariantPath).toBe('/subscriptions/usage/rhel/RHEL%20for%20ARM');
    });

    it('should let a variant named in the path outrank the last viewed variant', () => {
      const { firstMatch, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/rhel/RHEL%20for%20x86',
        productVariant: lastViewed,
        isRestoreVariant: true
      });

      expect(firstMatch?.productId).toBe(RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86);
      expect(restoreVariantPath).toBeUndefined();
    });

    it('should let an existing flat variant path outrank the last viewed variant', () => {
      const { firstMatch, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/RHEL%20for%20x86',
        productVariant: lastViewed,
        isRestoreVariant: true
      });

      expect(firstMatch?.productId).toBe(RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86);
      // the variant is honored, the flat path is canonicalized below its group
      expect(restoreVariantPath).toBe('/subscriptions/usage/rhel/RHEL%20for%20x86');
    });

    it('should not restore the last viewed variant for browser back and forward', () => {
      const { firstMatch, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/rhel',
        productVariant: lastViewed,
        isRestoreVariant: false
      });

      expect(firstMatch?.productId).toBe(RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86);
      expect(restoreVariantPath).toBe('/subscriptions/usage/rhel/RHEL%20for%20x86');
    });

    it('should not restore across product groups', () => {
      const { firstMatch, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/openshift',
        productVariant: lastViewed,
        isRestoreVariant: true
      });

      expect(firstMatch?.productGroup).toBe('openshift');
      expect(restoreVariantPath).toBe(`/subscriptions/usage/openshift/${encodeURIComponent(firstMatch?.productId)}`);
    });

    it('should use the default variant without a stored selection', () => {
      const { firstMatch, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/rhel',
        productVariant: {},
        isRestoreVariant: true
      });

      expect(firstMatch?.productId).toBe(RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86);
      expect(restoreVariantPath).toBe('/subscriptions/usage/rhel/RHEL%20for%20x86');
    });

    it('should canonicalize a group path to its default variant', () => {
      const { restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/rhel',
        isRestoreVariant: true
      });

      expect(restoreVariantPath).toBe('/subscriptions/usage/rhel/RHEL%20for%20x86');
    });

    it('should canonicalize an alias path to its default variant', () => {
      const { restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/insights',
        isRestoreVariant: true
      });

      expect(restoreVariantPath).toBe('/subscriptions/usage/rhel/RHEL%20for%20x86');
    });

    it('should leave a path that already names the resolved variant alone', () => {
      const { restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/rhel/RHEL%20for%20x86',
        isRestoreVariant: true
      });

      expect(restoreVariantPath).toBeUndefined();
    });

    it('should not restore a stored variant on top of a closest match', () => {
      const { isClosest, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/rhel-for-arm',
        productVariant: lastViewed,
        isRestoreVariant: true
      });

      expect(isClosest).toBe(true);
      expect(restoreVariantPath).toBeUndefined();
    });

    it('should not restore a stored variant on the bare mount point', () => {
      const { isClosest, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage',
        productVariant: lastViewed,
        isRestoreVariant: true
      });

      expect(isClosest).toBe(true);
      expect(restoreVariantPath).toBeUndefined();
    });

    it('should not canonicalize a closest match, a fuzzy guess is never written back', () => {
      const { isClosest, restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage/rhel-for-arm',
        isRestoreVariant: true
      });

      expect(isClosest).toBe(true);
      expect(restoreVariantPath).toBeUndefined();
    });

    it('should leave the bare mount point alone', () => {
      const { restoreVariantPath } = setRouteProduct({
        productPath: '/subscriptions/usage',
        isRestoreVariant: true
      });

      expect(restoreVariantPath).toBeUndefined();
    });
  });

  describe('useRouteDetail, restored variant url', () => {
    it('should align the url with a restored variant using replaceState', async () => {
      const windowHistory = { replaceState: jest.fn() };

      await renderHook(() =>
        useRouteDetail({
          useChrome: () => ({}),
          useSetRouteProduct: () => ({
            productGroup: 'rhel',
            restoreVariantPath: '/subscriptions/usage/rhel/RHEL%20for%20ARM'
          }),
          windowHistory
        })
      );

      expect(windowHistory.replaceState).toHaveBeenCalledTimes(1);
      expect(windowHistory.replaceState.mock.calls[0][2]).toContain('/subscriptions/usage/rhel/RHEL%20for%20ARM');
    });

    it('should not touch the url without a restored variant', async () => {
      const windowHistory = { replaceState: jest.fn() };

      await renderHook(() =>
        useRouteDetail({
          useChrome: () => ({}),
          useSetRouteProduct: () => ({ productGroup: 'rhel' }),
          windowHistory
        })
      );

      expect(windowHistory.replaceState).not.toHaveBeenCalled();
    });
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

  describe('useNavigateVariant', () => {
    const mountWithLocation = async ({
      pathname = '/subscriptions/usage/rhel',
      search = '',
      hash = '',
      chromeHistory
    } = {}) => {
      const windowHistory = { pushState: jest.fn() };
      const { result: navigateVariant } = await renderHook(() =>
        useNavigateVariant({
          useChrome: () => ({ chromeHistory }),
          useLocation: () => ({ pathname, search, hash }),
          windowHistory
        })
      );

      return { navigateVariant, windowHistory };
    };

    it('should push a variant nested below its product group', async () => {
      const { navigateVariant, windowHistory } = await mountWithLocation();
      navigateVariant(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM);

      expect(windowHistory.pushState).toHaveBeenCalledTimes(1);
      expect(windowHistory.pushState.mock.calls[0][2]).toBe('/subscriptions/usage/rhel/RHEL%20for%20ARM');
    });

    it('should replace an existing variant instead of appending', async () => {
      const { navigateVariant, windowHistory } = await mountWithLocation({
        pathname: '/subscriptions/usage/rhel/RHEL%20for%20ARM'
      });
      navigateVariant('rhel-for-x86-els-payg');

      expect(windowHistory.pushState.mock.calls[0][2]).toBe('/subscriptions/usage/rhel/rhel-for-x86-els-payg');
    });

    it('should preserve application search and hash params', async () => {
      const { navigateVariant, windowHistory } = await mountWithLocation({
        search: '?lorem=ipsum',
        hash: '#anchor'
      });
      navigateVariant(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM);

      expect(windowHistory.pushState.mock.calls[0][2]).toBe(
        '/subscriptions/usage/rhel/RHEL%20for%20ARM?lorem=ipsum#anchor'
      );
    });

    it('should strip OIDC params while navigating', async () => {
      const { navigateVariant, windowHistory } = await mountWithLocation({
        search: '?lorem=ipsum&state=abc123&code=xyz789',
        hash: '#anchor&session_state=def456'
      });
      navigateVariant(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM);

      const pushedUrl = windowHistory.pushState.mock.calls[0][2];
      expect(pushedUrl).toContain('?lorem=ipsum');
      expect(pushedUrl).toContain('#anchor');
      expect(pushedUrl).not.toContain('state=');
      expect(pushedUrl).not.toContain('code=');
    });

    it('should not push a duplicate entry for the variant already in the url', async () => {
      const { navigateVariant, windowHistory } = await mountWithLocation({
        pathname: '/subscriptions/usage/rhel/RHEL%20for%20ARM'
      });
      navigateVariant(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM);

      expect(windowHistory.pushState).not.toHaveBeenCalled();
    });

    it('should ignore an empty variant', async () => {
      const { navigateVariant, windowHistory } = await mountWithLocation();
      navigateVariant(null);

      expect(windowHistory.pushState).not.toHaveBeenCalled();
    });

    it('should prefer chrome history when the platform provides it', async () => {
      const chromeHistory = { push: jest.fn() };
      const { navigateVariant, windowHistory } = await mountWithLocation({ chromeHistory });
      navigateVariant(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM);

      expect(chromeHistory.push).toHaveBeenCalledWith('/subscriptions/usage/rhel/RHEL%20for%20ARM');
      expect(windowHistory.pushState).not.toHaveBeenCalled();
    });

    it('should fall back to window history when chrome is unavailable', async () => {
      const { navigateVariant, windowHistory } = await mountWithLocation({ chromeHistory: {} });
      navigateVariant(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM);

      expect(windowHistory.pushState).toHaveBeenCalledTimes(1);
    });

    it.each([
      { pathname: '/subscriptions/usage', expected: '/subscriptions/usage/rhel/RHEL%20for%20ARM' },
      { pathname: '/insights/subscriptions', expected: '/insights/subscriptions/rhel/RHEL%20for%20ARM' },
      { pathname: '/openshift/subscriptions/rhel', expected: '/openshift/subscriptions/rhel/RHEL%20for%20ARM' },
      { pathname: '/beta/subscriptions/usage/insights', expected: '/beta/subscriptions/usage/rhel/RHEL%20for%20ARM' }
    ])('should keep the mount point intact for $pathname', async ({ pathname, expected }) => {
      const { navigateVariant, windowHistory } = await mountWithLocation({ pathname });
      navigateVariant(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM);

      expect(windowHistory.pushState.mock.calls[0][2]).toBe(expected);
    });

    it('should keep the group path prefix so chrome navigation stays matched', async () => {
      const { navigateVariant, windowHistory } = await mountWithLocation();
      navigateVariant(RHSM_API_PATH_PRODUCT_TYPES.RHACM);

      expect(windowHistory.pushState.mock.calls[0][2]).toBe('/subscriptions/usage/openshift/rhacm');
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
