import {
  useExport,
  useExportConfirmation,
  useExportRejection,
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
      params: {
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {}
    },
    {
      description: 'app loaded, no data',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {}
    },
    {
      description: 'pending notification',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {
        isAnything: true
      },
      retryCount: -1
    },
    {
      description: 'completed notification',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {
        completed: [{ id: 'dolorSit', fileName: 'dolorSitFileName' }],
        failed: [],
        isAnything: true,
        isCompleted: true,
        isFailed: false,
        isPending: false,
        pending: []
      }
    },
    {
      description: 'failed notification',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {
        completed: [],
        failed: [{ id: 'dolorSit', fileName: 'dolorSitFileName' }],
        isAnything: true,
        isCompleted: false,
        isFailed: true,
        isPending: false,
        pending: []
      }
    },
    {
      description: 'multi-status no notification',
      params: {
        useAppLoad: () => () => true,
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      },
      data: {
        completed: [{ id: 'loremIpsum', fileName: 'loremIpsumFileName' }],
        failed: [{ id: 'dolorSit', fileName: 'dolorSitFileName' }],
        isAnything: true,
        isCompleted: false,
        isFailed: false,
        isPending: true,
        pending: [{ id: 'helloWorld', fileName: 'helloWorldFileName' }]
      }
    }
  ])('should expose an export polling status confirmation, $description', async ({ data, params, retryCount }) => {
    const mockNotification = jest.fn();
    const { result: statusConfirmation, unmount } = await renderHook(() =>
      useExportConfirmation({
        useNotifications: () => ({
          addNotification: mockNotification
        }),
        ...params
      })
    );

    statusConfirmation({ data: { data } }, retryCount);
    await unmount();
    expect({
      notification: mockNotification.mock.calls,
      dispatch: mockDispatch.mock.calls
    }).toMatchSnapshot();
  });

  it('should expose an export polling status rejection', async () => {
    const mockNotification = jest.fn();
    const { result: statusRejection, unmount } = await renderHook(() =>
      useExportRejection({
        useNotifications: () => ({
          addNotification: mockNotification
        })
      })
    );

    statusRejection();
    await unmount();
    expect(mockNotification.mock.calls).toMatchSnapshot('status rejection');
  });

  it('should allow export service calls', async () => {
    const { result: createExport, unmount } = await renderHook(() => useExport({ createExport: mockService }));
    createExport('mock-product-id', { data: { lorem: 'ipsum' } });

    await unmount();
    expect(mockService).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.results).toMatchSnapshot('createExport');
  });

  it('should allow export service calls on existing exports', async () => {
    const mockNotification = jest.fn();

    const { unmount } = await renderHook((...args) => {
      useExistingExports({
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

  it('should allow service calls on user confirmation', async () => {
    const { result: onConfirmation, unmount } = await renderHook(() =>
      useExistingExportsConfirmation({
        deleteExistingExports: mockService,
        getExistingExports: mockService,
        useAppLoad: () => () => true
      })
    );
    onConfirmation('no', ['dolor', 'sit']);
    onConfirmation('yes', ['lorem', 'ipsum', 'dolor', 'sit']);
    await unmount();
    expect(mockService.mock.calls).toMatchSnapshot('confirmation');
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
