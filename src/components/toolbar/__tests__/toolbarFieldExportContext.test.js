import {
  useExport,
  useExportStatus,
  useExistingExports,
  useExistingExportsConfirmation
} from '../toolbarFieldExportContext';
import { store } from '../../../redux/store';
import { PLATFORM_API_EXPORT_STATUS_TYPES } from '../../../services/platform/platformConstants';

describe('ToolbarFieldExport Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest
      .spyOn(store, 'dispatch')
      .mockImplementation(
        type =>
          (Array.isArray(type) && type.map(value => (typeof value === 'function' && value.toString()) || value)) || type
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    {
      description: 'app not loaded',
      id: 'loremIpsum',
      params: {
        useAppLoad: () => () => false,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {}
    },
    {
      description: 'app loaded, no data',
      id: 'loremIpsum',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {}
    },
    {
      description: 'app loaded, different product',
      id: 'loremIpsum',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {
        products: {
          dolorSit: {
            isAnything: true
          }
        }
      }
    },
    {
      description: 'pending notification',
      id: 'loremIpsum',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {
        products: {
          loremIpsum: {
            isAnything: true
          }
        }
      }
    },
    {
      description: 'completed notification',
      id: 'loremIpsum',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {
        products: {
          loremIpsum: {
            completed: [{ id: 'dolorSit', fileName: 'dolorSitFileName' }],
            failed: [],
            isAnything: true,
            isCompleted: true,
            isFailed: false,
            isPending: false,
            pending: []
          }
        }
      }
    },
    {
      description: 'failed notification',
      id: 'loremIpsum',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {
        products: {
          loremIpsum: {
            completed: [],
            failed: [{ id: 'dolorSit', fileName: 'dolorSitFileName' }],
            isAnything: true,
            isCompleted: false,
            isFailed: true,
            isPending: false,
            pending: []
          }
        }
      }
    },
    {
      description: 'multi-status no notification',
      id: 'loremIpsum',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {
        products: {
          loremIpsum: {
            completed: [{ id: 'loremIpsum', fileName: 'loremIpsumFileName' }],
            failed: [{ id: 'dolorSit', fileName: 'dolorSitFileName' }],
            isAnything: true,
            isCompleted: false,
            isFailed: false,
            isPending: true,
            pending: [{ id: 'helloWorld', fileName: 'helloWorldFileName' }]
          }
        }
      }
    }
  ])('should allow and export, and expose polling status confirmation, $description', async ({ id, params, data }) => {
    const mockNotification = jest.fn();
    const getService = jest.fn().mockReturnValue((data && { value: { data: { data } } }) || undefined);

    const { result: createExport, unmount } = await renderHook(() =>
      useExport({
        createExport: getService,
        useNotifications: () => ({
          addNotification: mockNotification
        }),
        ...params
      })
    );

    createExport(id);
    await unmount();

    expect({
      getService: getService.mock.calls,
      notification: mockNotification.mock.calls,
      dispatch: mockDispatch.mock.results
    }).toMatchSnapshot();
  });

  it.each([
    {
      description: 'app not loaded',
      confirmation: 'yes',
      exportResults: ['lorem', 'ipsum'],
      params: {
        useAppLoad: () => () => false
      }
    },
    {
      description: 'confirmation is no',
      confirmation: 'no',
      exportResults: ['dolor', 'sit'],
      params: {
        useAppLoad: () => () => true
      }
    },
    {
      description: 'confirmation is yes with empty results',
      confirmation: 'yes',
      exportResults: [],
      params: {
        useAppLoad: () => () => true
      }
    },
    {
      description: 'confirmation is yes with results',
      confirmation: 'yes',
      exportResults: ['lorem', 'ipsum', 'dolor', 'sit'],
      params: {
        useAppLoad: () => () => true
      },
      data: {
        isAnything: true
      }
    },
    {
      description: 'confirmation is yes with no data in response',
      confirmation: 'yes',
      exportResults: ['lorem', 'ipsum'],
      params: {
        useAppLoad: () => () => true
      },
      data: {
        isAnything: false
      }
    }
  ])(
    'should allow service calls on user confirmation, $description',
    async ({ confirmation, exportResults, params, data }) => {
      const mockNotification = jest.fn();
      const getService = jest.fn().mockReturnValue((data && { value: { data: { data } } }) || undefined);
      const deleteService = jest.fn();

      const { result: onConfirmation, unmount } = await renderHook(() =>
        useExistingExportsConfirmation({
          deleteExistingExports: deleteService,
          getExistingExports: getService,
          useNotifications: () => ({
            addNotification: mockNotification,
            removeNotification: mockNotification
          }),
          ...params
        })
      );

      onConfirmation(confirmation, exportResults);
      await unmount();

      expect({
        getService: getService.mock.calls,
        deleteService: deleteService.mock.calls,
        notification: mockNotification.mock.calls,
        dispatch: mockDispatch.mock.results
      }).toMatchSnapshot();
    }
  );

  it('should dispatch getExistingExportsStatus on mount when no cache', async () => {
    const mockGetExistingExportsStatus = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          Promise.resolve(dispatch(...args))
    );

    const { unmount } = await renderHook(() =>
      useExistingExports({
        cache: { get: () => false, set: jest.fn() },
        getExistingExportsStatus: mockGetExistingExportsStatus,
        useNotifications: () => ({
          addNotification: jest.fn(),
          hasNotification: () => false,
          removeNotification: jest.fn()
        }),
        useSelectorsResponse: () => ({ data: [] })
      })
    );

    await unmount();
    expect(mockGetExistingExportsStatus).toHaveBeenCalledTimes(1);
    expect(mockGetExistingExportsStatus).toHaveBeenCalledWith();
    expect(mockDispatch).toHaveBeenCalledWith(mockGetExistingExportsStatus.mock.results[0].value);
  });

  it('should not dispatch getExistingExportsStatus on mount when cache is set', async () => {
    const mockGetExistingExportsStatus = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          Promise.resolve(dispatch(...args))
    );

    const { unmount } = await renderHook(() =>
      useExistingExports({
        cache: { get: () => true, set: jest.fn() },
        getExistingExportsStatus: mockGetExistingExportsStatus,
        useNotifications: () => ({
          addNotification: jest.fn(),
          hasNotification: () => false,
          removeNotification: jest.fn()
        }),
        useSelectorsResponse: () => ({ data: [] })
      })
    );

    await unmount();
    expect(mockGetExistingExportsStatus).not.toHaveBeenCalled();
  });

  it('should show notification when exports are pending', async () => {
    const mockNotification = jest.fn();
    const mockCache = { get: () => false, set: jest.fn() };

    const { unmount } = await renderHook(() =>
      useExistingExports({
        cache: mockCache,
        getExistingExportsStatus: jest.fn().mockImplementation(
          (...args) =>
            dispatch =>
              Promise.resolve(dispatch(...args))
        ),
        useNotifications: () => ({
          addNotification: mockNotification,
          hasNotification: () => false,
          removeNotification: jest.fn()
        }),
        useSelectorsResponse: () => ({
          data: [
            {
              data: {
                isAnythingPending: true,
                isAnythingCompleted: false,
                pending: [{ id: 'loremIpsum' }],
                completed: []
              }
            }
          ]
        })
      })
    );

    await unmount();
    expect(mockCache.set).toHaveBeenCalledWith('isExistingExports', true);
    expect(mockNotification).toHaveBeenCalledTimes(1);
    expect(mockNotification.mock.calls).toMatchSnapshot('notification');
  });

  it('should not show notification when existing notification is present', async () => {
    const mockNotification = jest.fn();
    const mockCache = { get: () => false, set: jest.fn() };
    const mockGetExistingExportsStatus = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          Promise.resolve(dispatch(...args))
    );

    const { unmount } = await renderHook(() =>
      useExistingExports({
        cache: mockCache,
        getExistingExportsStatus: mockGetExistingExportsStatus,
        useNotifications: () => ({
          addNotification: mockNotification,
          hasNotification: key => key === 'swatch-exports-individual-status' || key === 'swatch-exports-status',
          removeNotification: jest.fn()
        }),
        useSelectorsResponse: () => ({
          data: [
            {
              data: {
                isAnythingPending: false,
                isAnythingCompleted: true,
                pending: [],
                completed: [{ id: 'loremIpsum' }]
              }
            }
          ]
        })
      })
    );

    await unmount();
    expect(mockGetExistingExportsStatus).toHaveBeenCalledTimes(1);
    expect(mockNotification).not.toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it('should not show notification when existing notification is present and exports are pending', async () => {
    const mockNotification = jest.fn();
    const mockCache = { get: () => false, set: jest.fn() };
    const mockGetExistingExportsStatus = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          Promise.resolve(dispatch(...args))
    );

    const { unmount } = await renderHook(() =>
      useExistingExports({
        cache: mockCache,
        getExistingExportsStatus: mockGetExistingExportsStatus,
        useNotifications: () => ({
          addNotification: mockNotification,
          hasNotification: key => key === 'swatch-exports-individual-status' || key === 'swatch-exports-status',
          removeNotification: jest.fn()
        }),
        useSelectorsResponse: () => ({
          data: [
            {
              data: {
                isAnythingPending: true,
                isAnythingCompleted: false,
                pending: [{ id: 'loremIpsum' }],
                completed: []
              }
            }
          ]
        })
      })
    );

    await unmount();
    expect(mockGetExistingExportsStatus).toHaveBeenCalledTimes(1);
    expect(mockNotification).not.toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it('should set cache and show notification when completed exports found', async () => {
    const mockNotification = jest.fn();
    const mockCache = { get: () => false, set: jest.fn() };

    const { unmount } = await renderHook(() =>
      useExistingExports({
        cache: mockCache,
        getExistingExportsStatus: jest.fn().mockImplementation(
          (...args) =>
            dispatch =>
              Promise.resolve(dispatch(...args))
        ),
        useNotifications: () => ({
          addNotification: mockNotification,
          hasNotification: () => false,
          removeNotification: jest.fn()
        }),
        useSelectorsResponse: () => ({
          data: [
            {
              data: {
                isAnythingPending: false,
                isAnythingCompleted: true,
                pending: [],
                completed: [{ id: 'loremIpsum' }]
              }
            }
          ]
        })
      })
    );

    await unmount();
    expect(mockCache.set).toHaveBeenCalledWith('isExistingExports', true);
    expect(mockNotification).toHaveBeenCalledTimes(1);
    expect(mockNotification.mock.calls).toMatchSnapshot('notification');
  });

  it('should not show notification or set cache when no exports found', async () => {
    const mockNotification = jest.fn();
    const mockCache = { get: () => false, set: jest.fn() };

    const { unmount } = await renderHook(() =>
      useExistingExports({
        cache: mockCache,
        getExistingExportsStatus: jest.fn().mockImplementation(
          (...args) =>
            dispatch =>
              Promise.resolve(dispatch(...args))
        ),
        useNotifications: () => ({
          addNotification: mockNotification,
          hasNotification: () => false,
          removeNotification: jest.fn()
        }),
        useSelectorsResponse: () => ({ data: [] })
      })
    );

    await unmount();
    expect(mockNotification).not.toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it('should remove notification on unmount', async () => {
    const mockNotification = jest.fn();
    const mockRemoveNotification = jest.fn();

    const { unmount } = await renderHook(() =>
      useExistingExports({
        cache: { get: () => false, set: jest.fn() },
        getExistingExportsStatus: jest.fn().mockImplementation(
          (...args) =>
            dispatch =>
              Promise.resolve(dispatch(...args))
        ),
        useNotifications: () => ({
          addNotification: mockNotification,
          hasNotification: () => false,
          removeNotification: mockRemoveNotification
        }),
        useSelectorsResponse: () => ({
          data: [
            {
              data: {
                isAnythingPending: false,
                isAnythingCompleted: true,
                pending: [],
                completed: [{ id: 'loremIpsum' }]
              }
            }
          ]
        })
      })
    );

    await unmount();
    expect(mockNotification).toHaveBeenCalledTimes(1);
    expect(mockRemoveNotification).toHaveBeenCalledTimes(1);
    expect(mockRemoveNotification).toHaveBeenCalledWith('swatch-exports-status');
  });

  it('should show notification when exports are both pending and completed', async () => {
    const mockNotification = jest.fn();
    const mockCache = { get: () => false, set: jest.fn() };

    const { unmount } = await renderHook(() =>
      useExistingExports({
        cache: mockCache,
        getExistingExportsStatus: jest.fn().mockImplementation(
          (...args) =>
            dispatch =>
              Promise.resolve(dispatch(...args))
        ),
        useNotifications: () => ({
          addNotification: mockNotification,
          hasNotification: () => false,
          removeNotification: jest.fn()
        }),
        useSelectorsResponse: () => ({
          data: [
            {
              data: {
                isAnythingPending: true,
                isAnythingCompleted: true,
                pending: [{ id: 'loremIpsum' }],
                completed: [{ id: 'dolorSit' }]
              }
            }
          ]
        })
      })
    );

    await unmount();
    expect(mockCache.set).toHaveBeenCalledWith('isExistingExports', true);
    expect(mockNotification).toHaveBeenCalledTimes(1);
    expect(mockNotification.mock.calls).toMatchSnapshot('notification');
  });

  it.each([
    { description: 'confirm', buttonTestId: 'exportButtonConfirm', confirmation: 'yes' },
    { description: 'cancel', buttonTestId: 'exportButtonCancel', confirmation: 'no' }
  ])(
    'should call onConfirmation with combined completed and pending on $description button click',
    async ({ buttonTestId, confirmation }) => {
      const mockOnConfirmation = jest.fn();
      const completed = [{ id: 'dolorSit' }];
      const pending = [{ id: 'loremIpsum' }];
      const mockNotification = jest.fn();

      const { unmount } = await renderHook(() =>
        useExistingExports({
          cache: { get: () => false, set: jest.fn() },
          getExistingExportsStatus: jest.fn().mockImplementation(
            (...args) =>
              dispatch =>
                Promise.resolve(dispatch(...args))
          ),
          useExistingExportsConfirmation: () => mockOnConfirmation,
          useNotifications: () => ({
            addNotification: mockNotification,
            hasNotification: () => false,
            removeNotification: jest.fn()
          }),
          useSelectorsResponse: () => ({
            data: [
              {
                data: {
                  isAnythingPending: true,
                  isAnythingCompleted: true,
                  pending,
                  completed
                }
              }
            ]
          })
        })
      );

      const component = renderComponent(mockNotification.mock.calls[0][0].description);
      component.fireEvent.click(component.find(`[data-test="${buttonTestId}"]`));

      await unmount();

      expect(mockOnConfirmation).toHaveBeenCalledWith(confirmation, [...completed, ...pending]);
    }
  );

  it.each([
    {
      description: 'basic status',
      params: {
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      }
    },
    {
      description: 'polling status',
      params: {
        useProduct: () => ({
          productId: 'loremIpsum'
        }),
        useSelector: () => ({
          isPending: true,
          pending: [
            {
              status: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING,
              format: 'dolorSit'
            }
          ]
        })
      }
    },
    {
      description: 'polling completed',
      params: {
        useProduct: () => ({
          productId: 'loremIpsum'
        }),
        useSelector: () => ({
          isPending: false,
          pending: []
        })
      }
    }
  ])('should aggregate export status, polling status with a hook, $description', async ({ params }) => {
    const { result, unmount } = await renderHook(() => useExportStatus(params));
    await unmount();
    expect(result).toMatchSnapshot();
  });
});
