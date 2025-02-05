import React from 'react';
import { ToolbarFieldExport, toolbarFieldOptions, useOnSelect } from '../toolbarFieldExport';

describe('ToolbarFieldExport Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useExistingExports: () => jest.fn()
    };
    const component = await shallowComponent(<ToolbarFieldExport {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating export through redux action with component', () => {
    const mockOnSelect = jest.fn();
    const props = {
      useOnSelect: () => mockOnSelect,
      useExistingExports: () => jest.fn()
    };

    const component = renderComponent(<ToolbarFieldExport {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('button.curiosity-select-pf__option');
    component.fireEvent.click(inputMenuItem);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('should handle updating export through redux action with hook', () => {
    const mockExport = jest.fn();
    const options = {
      useExport: () => mockExport,
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductExportQuery: () => ({})
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockExport.mock.calls).toMatchSnapshot('dispatch, hook');
  });
});
