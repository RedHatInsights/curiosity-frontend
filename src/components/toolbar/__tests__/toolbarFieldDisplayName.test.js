import React from 'react';
import { ToolbarFieldDisplayName } from '../toolbarFieldDisplayName';
import { store } from '../../../redux/store';
import { helpers } from '../../../common/helpers';
import { RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldDisplayName Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductInventoryHostsQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: 'lorem ipsum' })
    };
    const component = await shallowComponent(<ToolbarFieldDisplayName {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle updating display name through redux state', () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductInventoryHostsQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: 'lorem ipsum' })
    };

    const component = renderComponent(<ToolbarFieldDisplayName {...props} />);
    const input = component.find('input[type="text"]');
    component.fireEvent.change(input, { target: { value: '' } });
    component.fireEvent.keyUp(input, { target: { value: 'dolor sit' } });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch display name');
  });

  it('should handle updating display name using the enter key', () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductInventoryHostsQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: 'lorem ipsum' })
    };

    const component = renderComponent(<ToolbarFieldDisplayName {...props} />);
    const mockEvent = { keyCode: 13, target: { value: 'dolor sit' }, persist: helpers.noop };
    const input = component.find('input[type="text"]');
    component.fireEvent.keyUp(input, mockEvent);

    expect(mockDispatch.mock.calls).toMatchSnapshot('enter display name');
  });

  it('should handle clearing display name through redux state', () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductInventoryHostsQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: 'lorem ipsum' })
    };

    const component = renderComponent(<ToolbarFieldDisplayName {...props} />);
    const mockEvent = { keyCode: 27, target: { value: '' }, persist: helpers.noop };
    const input = component.find('input[type="text"]');
    component.fireEvent.keyUp(input, mockEvent);

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear display name');
  });
});
