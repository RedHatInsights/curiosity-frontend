import {
  context,
  useLocation,
  useNavigate,
  useRouteDetail,
  useSearchParams,
  useSetRouteDetail
} from '../routerContext';

describe('RouterContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useLocation', async () => {
    const mockLocation = {
      search: '?lorem=ipsum'
    };

    const { result: mockUseLocation } = await mountHook(() =>
      useLocation({ useLocation: () => mockLocation, windowLocation: { lorem: 'ipsum' } })
    );
    expect(mockUseLocation).toMatchSnapshot('location');
  });

  it('should apply a hook for useNavigate', () => {
    const mockDispatch = jest.fn();
    const updatedCalls = [];
    const { result: mockNavigationSet } = shallowHook(() =>
      useNavigate({
        useDispatch: () => mockDispatch,
        useLocation: () => ({
          search: '?lorem=ipsum'
        }),
        useNavigate: () => value => updatedCalls.push(value)
      })
    );

    /**
     * Note: Snapshots for first "mockNavigationSet" are aimed at being what Levenshtein denotes as a "closest match"
     */
    mockNavigationSet('/dolor/sit');
    mockNavigationSet('rhel');
    mockNavigationSet('insights');

    expect(mockDispatch.mock.calls).toMatchSnapshot('navigation dispatch');
    expect(updatedCalls).toMatchSnapshot('navigation push');
  });

  it('should apply a hook for useRouteDetail', async () => {
    const mockUpdateDocumentTitle = jest.fn();
    const { result: exactMatch } = await mountHook(() =>
      useRouteDetail({
        useChrome: () => ({ updateDocumentTitle: mockUpdateDocumentTitle }),
        useSelectors: () => ['rhel']
      })
    );
    expect(mockUpdateDocumentTitle.mock.calls).toMatchSnapshot('document title');
    expect({
      detailProps: Object.keys(exactMatch),
      isClosest: exactMatch.isClosest,
      productGroup: exactMatch.productGroup,
      productPath: exactMatch.productPath,
      firstMatch: Object.keys(exactMatch.firstMatch)
    }).toMatchSnapshot('route details, match');

    const { result: closestMatch } = await mountHook(() => useRouteDetail({ useSelectors: () => ['l'] }));
    expect({
      detailProps: Object.keys(closestMatch),
      isClosest: closestMatch.isClosest,
      productGroup: closestMatch.productGroup,
      productPath: closestMatch.productPath,
      firstMatch: Object.keys(closestMatch.firstMatch)
    }).toMatchSnapshot('route details, closest');
  });

  it('should apply a hook for useSearchParams', async () => {
    const mockSetParams = jest.fn();
    const { result } = await mountHook(() =>
      useSearchParams({
        useLocation: () => ({ search: '?lorem=ipsum' }),
        useSearchParams: () => [undefined, mockSetParams]
      })
    );

    const [value, setValue] = result;
    expect(value).toMatchSnapshot('initial params');
    setValue({ dolor: 'sit' });
    expect(mockSetParams).toHaveBeenCalledTimes(1);
  });

  it('should apply a hook for useSetRouteDetail', async () => {
    const mockDispatch = jest.fn();

    await mountHook(() =>
      useSetRouteDetail({
        useDispatch: () => mockDispatch,
        useSelector: () => ['lorem-ipsum'],
        windowLocation: { pathname: 'dolor-sit' }
      })
    );

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch route config path');
  });
});
