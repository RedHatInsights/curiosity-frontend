import React from 'react';
import { ToolbarFieldUom, toolbarFieldOptions, useOnSelect } from '../toolbarFieldUom';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_UOM_TYPES as UOM_TYPES, RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldUom Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useProductQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.UOM]: UOM_TYPES.SOCKETS })
    };
    const component = await shallowComponent(<ToolbarFieldUom {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating uom through redux state with component', () => {
    const props = {};

    const component = renderComponent(<ToolbarFieldUom {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('button.pf-v5-c-select__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating uom through redux state with hook', () => {
    const options = {
      useProduct: () => ({ viewId: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });
});
