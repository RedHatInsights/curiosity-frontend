import React from 'react';
import { mount, shallow } from 'enzyme';
import { ToolbarFieldUom, toolbarFieldOptions } from '../toolbarFieldUom';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_UOM_TYPES as UOM_TYPES } from '../../../types/rhsmApiTypes';

describe('ToolbarFieldUom Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {
      value: UOM_TYPES.SOCKETS
    };
    const component = shallow(<ToolbarFieldUom {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating uom through redux state', () => {
    const props = {};

    const component = mount(<ToolbarFieldUom {...props} />);

    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch uom');
  });
});
