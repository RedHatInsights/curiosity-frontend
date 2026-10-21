import {
  context,
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFields,
  SEPARATE_SLA_TYPE_USAGE_FILTERS_FLAG,
  useSeparateSlaTypeUsageFiltersEnabled
} from '../toolbarContext';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_SET_TYPES as RHSM_API_QUERY_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ToolbarContext', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it.each([
    [false, false, false],
    [false, true, false],
    [true, false, false],
    [true, true, true]
  ])(
    'should require both flags for separate filters: resolved=%s, separate=%s',
    async (defaultFilteringEnabled, separateFiltersEnabled, expected) => {
      const featureFlag = jest.fn(() => separateFiltersEnabled);
      const { result } = await renderHook(() =>
        useSeparateSlaTypeUsageFiltersEnabled({
          useChrome: () => ({ visibilityFunctions: { featureFlag } }),
          useProductViewContext: () => ({ defaultFilteringEnabled })
        })
      );

      expect(result).toBe(expected);
      expect(featureFlag).toHaveBeenCalledWith(SEPARATE_SLA_TYPE_USAGE_FILTERS_FLAG, true);
    }
  );

  it('should keep separate filters disabled when feature flags are unavailable', async () => {
    const { result } = await renderHook(() =>
      useSeparateSlaTypeUsageFiltersEnabled({
        useChrome: () => ({}),
        useProductViewContext: () => ({ defaultFilteringEnabled: true })
      })
    );

    expect(result).toBe(false);
  });

  it('should apply a hook for clearing a toolbar field through redux', async () => {
    const { result: onClearField } = await renderHook(() => useToolbarFieldClear());
    onClearField('lorem');

    onClearField(RHSM_API_QUERY_TYPES.BILLING_PROVIDER);

    onClearField(RHSM_API_QUERY_TYPES.CATEGORY);

    onClearField(RHSM_API_QUERY_TYPES.SLA);

    onClearField(RHSM_API_QUERY_TYPES.USAGE);

    onClearField(RHSM_API_QUERY_TYPES.VARIANT);

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear single field');
  });

  it('should apply a hook for clearing specific active toolbar fields through redux', async () => {
    const { result: onClearAllFields } = await renderHook(() =>
      useToolbarFieldClearAll({
        useProductQuery: () => ({
          lorem: 'ipsum',
          [RHSM_API_QUERY_TYPES.BILLING_PROVIDER]: 'testBillingProvider',
          [RHSM_API_QUERY_TYPES.CATEGORY]: 'testCategory',
          [RHSM_API_QUERY_TYPES.SLA]: 'testSla',
          [RHSM_API_QUERY_TYPES.USAGE]: 'testUsage',
          [RHSM_API_QUERY_TYPES.METRIC_ID]: 'testUomNowMetricId'
        })
      })
    );

    onClearAllFields();

    onClearAllFields(true);

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear all fields');
  });

  it('should apply a hook for retrieving secondary toolbar field components', async () => {
    const { result: secondaryFields } = await renderHook(() =>
      useToolbarFields({
        useProductToolbarConfig: () => ({
          filters: [
            {
              id: 'rangedMonthly',
              isSecondary: true
            }
          ]
        })
      })
    );
    expect(secondaryFields).toMatchSnapshot('secondary field, rangedMonthly');
  });
});
