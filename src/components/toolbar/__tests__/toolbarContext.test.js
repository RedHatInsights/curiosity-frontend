import { context, useToolbarFieldClear, useToolbarFieldClearAll, useToolbarFields } from '../toolbarContext';
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
          [RHSM_API_QUERY_TYPES.UOM]: 'testUom',
          [RHSM_API_QUERY_TYPES.VARIANT]: 'testVariant'
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
