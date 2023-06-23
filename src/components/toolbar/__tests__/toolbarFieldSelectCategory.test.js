import React from 'react';
import {
  ToolbarFieldSelectCategory,
  toolbarFieldOptions,
  useOnSelect,
  useSelectCategoryOptions,
  toolbarFieldOptions as selectCategoryOptions
} from '../toolbarFieldSelectCategory';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldSelectCategory Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useSelectCategoryOptions: () => ({
        options: [selectCategoryOptions[4], selectCategoryOptions[5]],
        currentCategory: RHSM_API_QUERY_SET_TYPES.SLA
      })
    };
    const component = await shallowComponent(<ToolbarFieldSelectCategory {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating categories through redux state with component', () => {
    const props = {
      useSelectCategoryOptions: () => ({
        options: [selectCategoryOptions[1]]
      })
    };

    const component = renderComponent(<ToolbarFieldSelectCategory {...props} />);
    const input = component.find('button');
    component.fireEvent.click(input);

    const inputMenuItem = component.find('button.pf-c-select__menu-item');
    component.fireEvent.click(inputMenuItem);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating categories through redux state with hook', () => {
    const options = {
      useProduct: () => ({ viewId: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });

  it('should return options, and an updated current category with a hook', async () => {
    const options = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductToolbarConfig: () => ({
        filters: [{ id: RHSM_API_QUERY_SET_TYPES.USAGE, selected: true }, { id: RHSM_API_QUERY_SET_TYPES.SLA }]
      }),
      useSelector: () => ({ currentFilter: undefined })
    };

    const { result: initialResult } = await renderHook(() => useSelectCategoryOptions(options));

    expect(initialResult).toMatchSnapshot('options, initialCategory, hook');

    const { result: updatedResult } = await renderHook(() =>
      useSelectCategoryOptions({ ...options, useSelector: () => ({ currentFilter: RHSM_API_QUERY_SET_TYPES.SLA }) })
    );

    expect(updatedResult).toMatchSnapshot('options, currentCategory, hook');
  });
});
