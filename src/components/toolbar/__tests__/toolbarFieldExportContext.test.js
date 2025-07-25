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
  let mockService;

  beforeEach(() => {
    mockDispatch = jest
      .spyOn(store, 'dispatch')
      .mockImplementation(
        type =>
          (Array.isArray(type) && type.map(value => (typeof value === 'function' && value.toString()) || value)) || type
      );

    mockService = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          Promise.resolve(dispatch(...args))
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

  it('should allow export service calls on existing exports', async () => {
    const mockNotification = jest.fn();

    const { unmount } = await renderHook((...args) => {
      useExistingExports({
        addNotification: mockService,
        getExistingExports: mockService,
        getExistingExportsStatus: mockService,
        deleteExistingExports: mockService,
        useNotifications: () => ({
          addNotification: mockNotification,
          hasNotification: () => false,
          removeNotification: () => mockNotification
        }),
        useSelectorsResponse: () => ({
          data: [
            {
              data: {
                isAnythingPending: false,
                isAnythingCompleted: true,
                pending: [],
                completed: [{ dolor: 'sit' }]
              }
            }
          ],
          fulfilled: true
        }),
        ...args?.[0]
      });
    });

    await unmount();
    expect(mockNotification.mock.calls).toMatchSnapshot('existingExports');
  });

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
