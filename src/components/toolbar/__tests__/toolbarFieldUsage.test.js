import React from 'react';
import { ToolbarFieldUsage, toolbarFieldOptions, useOnSelect } from '../toolbarFieldUsage';
import { store } from '../../../redux/store';
import {
  RHSM_API_QUERY_USAGE_TYPES as USAGE_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldSla Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useProductQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.USAGE]: USAGE_TYPES.DEVELOPMENT })
    };
    const component = await shallowComponent(<ToolbarFieldUsage {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should hide blank and unspecified Usage options', async () => {
    const options = [
      ...toolbarFieldOptions,
      { title: 'Whitespace', value: '  ', isSelected: false },
      { title: 'Missing', value: null, isSelected: false }
    ];
    const component = await shallowComponent(
      <ToolbarFieldUsage
        options={options}
        useOnSelect={() => jest.fn()}
        useProductQuery={() => ({ [RHSM_API_QUERY_SET_TYPES.USAGE]: USAGE_TYPES.PRODUCTION })}
      />
    );

    expect(component.props.options.map(({ value }) => value)).toEqual([
      USAGE_TYPES.PRODUCTION,
      USAGE_TYPES.DEVELOPMENT,
      USAGE_TYPES.DISASTER
    ]);
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating usage through redux state with component', () => {
    const props = {};

    const component = renderComponent(<ToolbarFieldUsage {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.screen.getAllByRole('option').pop();
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating usage through redux state with hook', () => {
    const options = {
      useProduct: () => ({ productId: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });

  it('should clear the Usage filter to its default', () => {
    const onSelect = useOnSelect({
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'loremIpsum' })
    });

    onSelect();

    expect(mockDispatch.mock.calls[0][0][1]).toMatchObject({
      filter: RHSM_API_QUERY_SET_TYPES.USAGE,
      value: null
    });
  });
});
