import { context, useToolbarFieldClear, useToolbarFieldClearAll, useToolbarFieldQueries } from '../toolbarContext';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

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

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear single field');
  });

  it('should apply a hook for clearing specific active toolbar fields through redux', () => {
    const { result: onClearAllFields } = shallowHook(() =>
      useToolbarFieldClearAll({
        useProductQuery: () => ({
          lorem: 'ipsum',
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
        useProductQuery: () => ({ lorem: 'ipsum', [RHSM_API_QUERY_TYPES.SLA]: 'testSla' }),
        useProductGraphTallyQuery: () => ({ dolor: 'sit', [RHSM_API_QUERY_TYPES.GRANULARITY]: 'testGranularity' })
      })
    );
    expect(productQuery).toMatchSnapshot('query');
  });
});
