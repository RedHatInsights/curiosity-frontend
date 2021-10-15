import { rhsmSelectorsHooks, useAppMessages } from '../useRhsmSelectors';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';

describe('useRhsmSelectors', () => {
  it('should return specific properties', () => {
    expect(rhsmSelectorsHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook around a selector for useAppMessages', () => {
    const mockProductId = 'lorem';
    const mockState = {
      messages: {
        report: {
          [mockProductId]: {
            fulfilled: true,
            data: {
              [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: [
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-04T00:00:00.000Z',
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA]: true,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_DATA]: true,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: true
                },
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-05T00:00:00.000Z',
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: 1,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA]: true,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_DATA]: true,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: true
                },
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]: '2019-09-06T00:00:00.000Z',
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES]: 4,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS]: 4,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES]: 2,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS]: null,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA]: true,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_DATA]: true,
                  [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]: true
                }
              ]
            }
          }
        }
      }
    };

    const { result } = shallowHook(() =>
      useAppMessages({
        useRouteDetail: () => ({ pathParameter: mockProductId, productParameter: 'viewIpsum' }),
        useSelector: value => value(mockState)
      })
    );

    expect(result).toMatchSnapshot('selector');
  });
});
