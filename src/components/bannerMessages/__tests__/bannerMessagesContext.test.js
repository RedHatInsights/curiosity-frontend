import { context, useGetAppMessages } from '../bannerMessagesContext';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

describe('BannerMessagesContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for retrieving messages data from a selectors', () => {
    const { result: errorResponse } = shallowHook(() =>
      useGetAppMessages({
        useSelectorsResponse: () => ({
          error: true,
          data: {
            messages: {}
          }
        })
      })
    );

    expect(errorResponse).toMatchSnapshot('error response');

    const { result: successResponse } = shallowHook(() =>
      useGetAppMessages({
        useSelectorsResponse: () => ({
          fulfilled: true,
          data: {
            messages: {}
          }
        })
      })
    );

    expect(successResponse).toMatchSnapshot('success response');

    const { result: mockStoreSuccessResponse } = shallowHook(
      () =>
        useGetAppMessages({
          useProduct: () => ({ productId: 'loremIpsum' })
        }),
      {
        state: {
          messages: {
            report: {
              loremIpsum: {
                fulfilled: true,
                data: {
                  data: [
                    {
                      [rhsmConstants.RHSM_API_RESPONSE_TALLY_META_TYPES.HAS_CLOUDIGRADE_MISMATCH]: true
                    }
                  ]
                }
              }
            }
          }
        }
      }
    );

    expect(mockStoreSuccessResponse).toMatchSnapshot('mock store success response');

    const { result: mockStoreErrorResponse } = shallowHook(
      () =>
        useGetAppMessages({
          useProduct: () => ({ productId: 'loremIpsum' })
        }),
      {
        state: {
          messages: {
            report: {
              loremIpsum: {
                error: true,
                data: {
                  data: []
                }
              }
            }
          }
        }
      }
    );

    expect(mockStoreErrorResponse).toMatchSnapshot('mock store error response');
  });
});
