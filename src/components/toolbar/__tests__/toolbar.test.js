import React from 'react';
import { Toolbar } from '../toolbar';
import {
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../../services/rhsm/rhsmConstants';
import { toolbarFieldOptions as selectCategoryOptions } from '../toolbarFieldSelectCategory';

describe('Toolbar Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[3], selectCategoryOptions[4]] })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should render separate SLA, Usage and Type filters inside the existing toggle group', async () => {
    const props = {
      isGroupVariantDisabled: true,
      useSeparateSlaTypeUsageFiltersEnabled: () => true,
      useProductToolbarQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.SLA]: RHSM_API_QUERY_SLA_TYPES.PREMIUM,
        [RHSM_API_QUERY_SET_TYPES.USAGE]: RHSM_API_QUERY_USAGE_TYPES.PRODUCTION,
        [RHSM_API_QUERY_SET_TYPES.CATEGORY]: RHSM_API_QUERY_CATEGORY_TYPES.PHYSICAL
      }),
      useSelectCategoryOptions: () => ({
        options: [RHSM_API_QUERY_SET_TYPES.SLA, RHSM_API_QUERY_SET_TYPES.CATEGORY, RHSM_API_QUERY_SET_TYPES.USAGE].map(
          filter => selectCategoryOptions.find(({ value }) => value === filter)
        )
      }),
      useToolbarFields: () => ({ itemFields: [], secondaryFields: [] })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('separate filters');
  });

  it('should keep separate and combined filters inside the same toggle group', async () => {
    const props = {
      isGroupVariantDisabled: true,
      useSeparateSlaTypeUsageFiltersEnabled: () => true,
      useProductToolbarQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.SLA]: RHSM_API_QUERY_SLA_TYPES.PREMIUM }),
      useSelectCategoryOptions: () => ({
        currentCategory: RHSM_API_QUERY_SET_TYPES.SLA,
        initialCategory: RHSM_API_QUERY_SET_TYPES.SLA,
        options: [
          RHSM_API_QUERY_SET_TYPES.SLA,
          RHSM_API_QUERY_SET_TYPES.GRANULARITY,
          RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME
        ].map(filter => selectCategoryOptions.find(({ value }) => value === filter))
      }),
      useToolbarFields: () => ({ itemFields: [], secondaryFields: [] })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('separate and combined filters');
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
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[3]] })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('single filter');
  });

  it('should handle updating toolbar chips/labels', async () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[3]] }),
      useProductToolbarQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.SLA]: RHSM_API_QUERY_SLA_TYPES.PREMIUM })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component.find('.pf-v6-c-label-group')).toMatchSnapshot('chips/labels');

    const componentNotClearable = await component.setProps({
      useSelectCategoryOptions: () => ({ options: [{ ...selectCategoryOptions[3], isClearable: false }] })
    });

    expect(componentNotClearable.find('.pf-v6-c-label-group')).toMatchSnapshot('chips, not clearable');
  });

  it('should handle displaying secondary components, fields', async () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[3]] }),
      useToolbarFields: () => ({ itemFields: [], secondaryFields: [<span key="lorem">lorem ipsum</span>] })
    };
    const component = await shallowComponent(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('secondary');
  });

  it('should handle displaying a group variant field', async () => {
    const props = {
      isGroupVariantDisabled: true,
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[3]] }),
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
