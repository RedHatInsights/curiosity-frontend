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
    const mockLocation = {
      search: '?lorem=ipsum'
    };

    const updatedCalls = [];
    const { result: mockNavigationSet } = shallowHook(() =>
      useNavigate({
        useLocation: () => mockLocation,
        useNavigate: () => value => updatedCalls.push(value)
      })
    );

    mockNavigationSet('/dolor/sit');
    mockNavigationSet('rhel');
    mockNavigationSet('insights');

    expect(updatedCalls).toMatchSnapshot('navigation push');
  });

  it('should apply a hook for useRouteDetail', async () => {
    const { result: exactMatch } = await mountHook(() => useRouteDetail({ useSelector: () => ['rhel'] }));
    expect({
      detailProps: Object.keys(exactMatch),
      isClosest: exactMatch.isClosest,
      productGroup: exactMatch.productGroup,
      productPath: exactMatch.productPath,
      firstMatch: Object.keys(exactMatch.firstMatch)
    }).toMatchSnapshot('route details, match');

    const { result: closestMatch } = await mountHook(() => useRouteDetail({ useSelector: () => ['l'] }));
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
