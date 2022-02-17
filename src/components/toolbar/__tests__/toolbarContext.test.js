import {
  context,
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFieldQueries,
  useToolbarSecondaryFields
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

  it('should apply a hook for clearing a toolbar field through redux', () => {
    const { result: onClearField } = shallowHook(() => useToolbarFieldClear());
    onClearField('lorem');

    onClearField(RHSM_API_QUERY_TYPES.SLA);

    onClearField(RHSM_API_QUERY_TYPES.USAGE);

    onClearField(RHSM_API_QUERY_TYPES.BILLING_PROVIDER);

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear single field');
  });

  it('should apply a hook for clearing specific active toolbar fields through redux', () => {
    const { result: onClearAllFields } = shallowHook(() =>
      useToolbarFieldClearAll({
        useProductQuery: () => ({
          lorem: 'ipsum',
          [RHSM_API_QUERY_TYPES.BILLING_PROVIDER]: 'testBillingProvider',
          [RHSM_API_QUERY_TYPES.SLA]: 'testSla',
          [RHSM_API_QUERY_TYPES.USAGE]: 'testUsage',
          [RHSM_API_QUERY_TYPES.UOM]: 'testUom'
        })
      })
    );

    onClearAllFields();

    onClearAllFields(true);

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear all fields');
  });

  it('should apply a hook for retrieving api queries specific to toolbar', () => {
    const { result: productQuery } = shallowHook(() =>
      useToolbarFieldQueries({
        useProductQuery: () => ({
          lorem: 'ipsum',
          [RHSM_API_QUERY_TYPES.SLA]: 'testSla',
          [RHSM_API_QUERY_TYPES.USAGE]: 'testUsage',
          [RHSM_API_QUERY_TYPES.BILLING_PROVIDER]: 'testProvider'
        }),
        useProductGraphTallyQuery: () => ({ dolor: 'sit', [RHSM_API_QUERY_TYPES.GRANULARITY]: 'testGranularity' })
      })
    );
    expect(productQuery).toMatchSnapshot('query');
  });

  it('should apply a hook for retrieving secondary toolbar field components', () => {
    const { result: secondaryFields } = shallowHook(() =>
      useToolbarSecondaryFields({
        useProductToolbarConfig: () => ({
          secondaryFilters: [
            {
              id: 'rangedMonthly'
            }
          ]
        })
      })
    );
    expect(secondaryFields).toMatchSnapshot('secondary field, rangedMonthly');
  });
});
