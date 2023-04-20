import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldVariant, useToolbarFieldOptions, useOnSelect } from '../toolbarFieldVariant';
import { store } from '../../../redux/store';
import {
  RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES as RHEL_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldVariant Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', () => {
    const props = {
      useProductQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.ARCHITECTURE]: RHEL_TYPES.RHEL_X86 })
    };
    const component = shallow(<ToolbarFieldVariant {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should generate select options', () => {
    const { result: toolbarFieldOptions } = shallowHook(() =>
      useToolbarFieldOptions({
        useProduct: () => ({
          productVariants: ['lorem', 'ipsum', 'dolor', 'sit', '']
        })
      })
    );

    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating through redux state with component', async () => {
    const props = {
      useToolbarFieldOptions: () => [
        {
          selected: false,
          title: 't(curiosity-toolbar.label_variant, {"context":"ipsum"})',
          value: 'ipsum'
        },
        {
          selected: false,
          title: 't(curiosity-toolbar.label_variant, {"context":"lorem"})',
          value: 'lorem'
        }
      ]
    };

    const component = await mountHookComponent(<ToolbarFieldVariant {...props} />);
    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating through redux state with hook', () => {
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
