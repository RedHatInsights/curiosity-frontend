import React from 'react';
import {
  ToolbarFieldExport,
  toolbarFieldOptions,
  useExport,
  useExportStatus,
  useOnSelect
} from '../toolbarFieldExport';
import { store } from '../../../redux/store';
import { PLATFORM_API_EXPORT_STATUS_TYPES } from '../../../services/platform/platformConstants';

describe('ToolbarFieldExport Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useExport: () => jest.fn()
    };
    const component = await shallowComponent(<ToolbarFieldExport {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating export through redux state with component', () => {
    const props = {
      useOnSelect: () => jest.fn(),
      useExport: () => jest.fn()
    };

    const component = renderComponent(<ToolbarFieldExport {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('a.pf-v5-c-dropdown__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating export through redux state with hook', () => {
    const options = {
      useExport: () => jest.fn(),
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductInventoryQuery: () => ({})
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
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
          data: {
            data: {
              isAnythingPending: true,
              loremIpsum: [
                {
                  status: PLATFORM_API_EXPORT_STATUS_TYPES.PENDING,
                  format: 'dolorSit'
                }
              ]
            }
          }
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
          app: {
            exports: {
              data: {
                data: {
                  isAnythingPending: false,
                  loremIpsum: {
                    status: PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETED,
                    format: 'dolorSit'
                  }
                }
              }
            }
          }
        })
      })
    );
    await unmountCompleted();
    expect(completed).toMatchSnapshot('status, completed');
  });

  it('should aggregate export service calls', async () => {
    // confirm attempt at creating an export
    const createExport = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          dispatch(...args)
    );
    const { result: create, unmount: unmountCreate } = await renderHook(() =>
      useExport({
        createExport
      })
    );
    create({ data: { lorem: 'ipsum' } });
    await unmountCreate();
    expect(createExport).toHaveBeenCalledTimes(1);
    expect(createExport.mock.calls).toMatchSnapshot('createExport');

    // confirm attempt at getting an export
    const getExport = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          dispatch(...args)
    );
    const { result: get, unmount: unmountGet } = await renderHook(() =>
      useExport({
        getExport
      })
    );
    get({ id: 'dolorSit' });
    await unmountGet();
    expect(getExport).toHaveBeenCalledTimes(1);
    expect(getExport.mock.calls).toMatchSnapshot('getExport');

    // confirm attempt at getting an export status
    const getExportStatus = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          dispatch(...args)
    );
    const { result: status, unmount: unmountStatus } = await renderHook(() =>
      useExport({
        getExportStatus
      })
    );
    status();
    await unmountStatus();
    expect(getExportStatus).toHaveBeenCalledTimes(1);
    expect(getExportStatus.mock.calls).toMatchSnapshot('getStatus');

    // confirm attempt at getting an export status when there is already polling
    const getExportStatusAgain = jest.fn().mockImplementation(
      (...args) =>
        dispatch =>
          dispatch(...args)
    );
    const { result: statusAgain, unmount: unmountStatusAgain } = await renderHook(() =>
      useExport({
        getExportStatus: getExportStatusAgain,
        useExportStatus: () => ({ isPolling: true })
      })
    );
    statusAgain();
    await unmountStatusAgain();
    expect(getExportStatusAgain).toHaveBeenCalledTimes(0);
    expect(getExportStatusAgain.mock.calls).toMatchSnapshot('getStatus, existing polling');
  });
});
