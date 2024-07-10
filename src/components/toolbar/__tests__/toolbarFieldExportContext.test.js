import {
  useExport,
  useExportConfirmation,
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

  it('should expose an export polling status confirmation', async () => {
    const { result: statusConfirmation, unmount } = await renderHook(() =>
      useExportConfirmation({
        useAppLoad: () => () => true,
        useProduct: () => ({ productId: 'loremIpsum' })
      })
    );

    statusConfirmation({
      data: {
        data: {
          completed: [{ id: 'helloWorld', fileName: 'helloWorldFileName' }],
          products: {
            loremIpsum: {
              completed: [{ id: 'helloWorld', fileName: 'helloWorldFileName' }],
              isCompleted: true,
              pending: [{ id: 'dolorSit', fileName: 'dolorSitFileName' }]
            }
          }
        }
      }
    });

    await unmount();
    expect(mockDispatch.mock.results).toMatchSnapshot('statusConfirmation');
  });

  it('should allow export service calls', async () => {
    const { result: createExport, unmount } = await renderHook(() => useExport({ createExport: mockService }));
    createExport('mock-product-id', { data: { lorem: 'ipsum' } });

    await unmount();
    expect(mockService).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.results).toMatchSnapshot('createExport');
  });

  it('should allow export service calls on existing exports', async () => {
    const { unmount } = await renderHook((...args) => {
      useExistingExports({
        getExistingExports: mockService,
        getExistingExportsStatus: mockService,
        deleteExistingExports: mockService,
        useSelectorsResponse: () => ({
          data: [{ data: { isAnythingPending: true, pending: [{ lorem: 'ipsum' }] } }],
          fulfilled: true
        }),
        ...args?.[0]
      });
    });

    await unmount();
    expect(mockDispatch.mock.results).toMatchSnapshot('existingExports');
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

  it('should aggregate export status, polling status with a hook', async () => {
    const { result: basic, unmount: unmountBasic } = await renderHook(() =>
      useExportStatus({
        useProduct: () => ({
          productId: 'loremIpsum'
        })
      })
    );
    await unmountBasic();
    expect(basic).toMatchSnapshot('status, basic');

    const { result: polling, unmount: unmountPolling } = await renderHook(() =>
      useExportStatus({
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
      })
    );
    await unmountPolling();
    expect(polling).toMatchSnapshot('status, polling');

    const { result: completed, unmount: unmountCompleted } = await renderHook(() =>
      useExportStatus({
        useProduct: () => ({
          productId: 'loremIpsum'
        }),
        useSelector: () => ({
          isPending: false,
          pending: []
        })
      })
    );
    await unmountCompleted();
    expect(completed).toMatchSnapshot('status, completed');
  });
});
