import { context, useNavigate, useRouteDetail, useSetRouteProduct } from '../routerContext';

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

  it('should apply a hook for useSetRouteProduct', async () => {
    const { result: exactMatch } = await renderHook(() =>
      useSetRouteProduct({
        useLocation: () => ({ pathname: 'rhel' })
      })
    );

    expect({
      detailProps: Object.keys(exactMatch),
      isClosest: exactMatch.isClosest,
      productGroup: exactMatch.productGroup,
      productPath: exactMatch.productPath,
      firstMatch: Object.keys(exactMatch.firstMatch)
    }).toMatchSnapshot('route details, match');

    const { result: closestMatch } = await renderHook(() =>
      useSetRouteProduct({ useLocation: () => ({ pathname: 'l' }) })
    );
    expect({
      detailProps: Object.keys(closestMatch),
      isClosest: closestMatch.isClosest,
      productGroup: closestMatch.productGroup,
      productPath: closestMatch.productPath,
      firstMatch: Object.keys(closestMatch.firstMatch)
    }).toMatchSnapshot('route details, closest');
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
