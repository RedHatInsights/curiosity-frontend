import React from 'react';
import { shallow } from 'enzyme';
import {
  ToolbarFieldSelectCategory,
  toolbarFieldOptions,
  useOnSelect,
  useSelectCategoryOptions,
  toolbarFieldOptions as selectCategoryOptions
} from '../toolbarFieldSelectCategory';
import { store } from '../../../redux/store';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('ToolbarFieldSelectCategory Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', () => {
    const props = {
      useSelectCategoryOptions: () => ({
        options: [selectCategoryOptions[4], selectCategoryOptions[5]],
        currentCategory: RHSM_API_QUERY_TYPES.SLA
      })
    };
    const component = shallow(<ToolbarFieldSelectCategory {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating categories through redux state with component', async () => {
    const props = {
      useSelectCategoryOptions: () => ({
        options: [selectCategoryOptions[1]]
      })
    };

    const component = await mountHookComponent(<ToolbarFieldSelectCategory {...props} />);

    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch category, component');
  });

  it('should handle updating categories through redux state with hook', () => {
    const options = {
      useProduct: () => ({ viewId: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);

    onSelect({
      value: 'dolor sit'
    });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch category, hook');
  });

  it('should return options, and an updated current category with a hook', () => {
    const options = {
      useProduct: () => ({ viewId: 'loremIpsum' }),
      useProductToolbarConfig: () => ({
        filters: [{ id: RHSM_API_QUERY_TYPES.USAGE, selected: true }, { id: RHSM_API_QUERY_TYPES.SLA }]
      }),
      useSelector: () => ({ currentFilter: undefined })
    };

    const { result: initialResult } = shallowHook(() => useSelectCategoryOptions(options));

    expect(initialResult).toMatchSnapshot('options, initialCategory, hook');

    const { result: updatedResult } = shallowHook(() =>
      useSelectCategoryOptions({ ...options, useSelector: () => ({ currentFilter: RHSM_API_QUERY_TYPES.SLA }) })
    );

    expect(updatedResult).toMatchSnapshot('options, currentCategory, hook');
  });
});
