import React from 'react';
import { Toolbar } from '../toolbar';
import { RHSM_API_QUERY_SLA_TYPES, RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';
import { toolbarFieldOptions as selectCategoryOptions } from '../toolbarFieldSelectCategory';

describe('Toolbar Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[4], selectCategoryOptions[5]] })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should return an empty render, or variant filter, when disabled or missing filters', async () => {
    const props = {
      isDisabled: true
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('disabled component');

    const propsVariantFilter = {
      isDisabled: false,
      useSelectCategoryOptions: () => ({ options: [] }),
      useToolbarFields: () => ({ itemFields: [], secondaryFields: [] })
    };
    const componentVariantFilter = await shallowComponent(<Toolbar {...propsVariantFilter} />);
    expect(componentVariantFilter).toMatchSnapshot('missing filters, has variant filter');

    const componentSecondary = await componentVariantFilter.setProps({
      useToolbarFields: () => ({ itemFields: [], secondaryFields: [<span key="lorem">lorem ipsum</span>] })
    });
    expect(componentSecondary).toMatchSnapshot('missing primary, has secondary filters');
  });

  it('should hide categories when a single filter is available', async () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[4]] })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('single filter');
  });

  it('should handle updating toolbar chips', async () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[4]] }),
      useProductToolbarQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.SLA]: RHSM_API_QUERY_SLA_TYPES.PREMIUM })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component.find('.pf-v5-c-chip')).toMatchSnapshot('chips');

    const componentNotClearable = await component.setProps({
      useSelectCategoryOptions: () => ({ options: [{ ...selectCategoryOptions[4], isClearable: false }] })
    });

    expect(componentNotClearable.find('.pf-v5-c-chip')).toMatchSnapshot('chips, not clearable');
  });

  it('should handle displaying secondary components, fields', async () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[4]] }),
      useToolbarFields: () => ({ itemFields: [], secondaryFields: [<span key="lorem">lorem ipsum</span>] })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('secondary');
  });

  it('should handle displaying a group variant field', async () => {
    const props = {
      isGroupVariantDisabled: true,
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[4]] }),
      useToolbarFields: () => ({ itemFields: [], secondaryFields: [<span key="lorem">lorem ipsum</span>] })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('group variant, disabled');

    const componentStandalone = await component.setProps({
      isGroupVariantDisabled: false,
      useSelectCategoryOptions: () => ({ options: [] }),
      useToolbarFields: () => ({ itemFields: [], secondaryFields: [] })
    });

    expect(componentStandalone).toMatchSnapshot('group variant, standalone');
  });
});
