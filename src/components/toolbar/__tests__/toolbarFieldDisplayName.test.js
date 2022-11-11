import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldDisplayName } from '../toolbarFieldDisplayName';
import { store } from '../../../redux/store';
import { TextInput } from '../../form/textInput';
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

  it('should render a basic component', () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductInventoryHostsQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: 'lorem ipsum' })
    };
    const component = shallow(<ToolbarFieldDisplayName {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle updating display name through redux state', () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductInventoryHostsQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: 'lorem ipsum' })
    };

    const component = shallow(<ToolbarFieldDisplayName {...props} />);
    component.find(TextInput).simulate('change', { value: '' });
    component.find(TextInput).simulate('keyUp', { value: 'dolor sit' });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch display name');
  });

  it('should handle updating display name using the enter key', async () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductInventoryHostsQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: 'lorem ipsum' })
    };

    const component = await mountHookComponent(<ToolbarFieldDisplayName {...props} />);
    const mockEvent = { keyCode: 13, currentTarget: { value: 'dolor sit' }, persist: helpers.noop };
    component.find(TextInput).instance().onKeyUp(mockEvent);

    expect(mockDispatch.mock.calls).toMatchSnapshot('enter display name');
  });

  it('should handle clearing display name through redux state', async () => {
    const props = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductInventoryHostsQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: 'lorem ipsum' })
    };

    const component = await mountHookComponent(<ToolbarFieldDisplayName {...props} />);
    const mockEvent = { keyCode: 27, currentTarget: { value: '' }, persist: helpers.noop };
    component.find(TextInput).instance().onKeyUp(mockEvent);

    expect(mockDispatch.mock.calls).toMatchSnapshot('clear display name');
  });
});
