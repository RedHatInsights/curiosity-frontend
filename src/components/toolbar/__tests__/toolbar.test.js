import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFilter } from '@patternfly/react-core';
import { Toolbar } from '../toolbar';
import { RHSM_API_QUERY_SLA_TYPES, RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';
import { toolbarFieldOptions as selectCategoryOptions } from '../toolbarFieldSelectCategory';

describe('Toolbar Component', () => {
  it('should render a basic component', () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[4], selectCategoryOptions[5]] })
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should return an empty render when disabled or missing filters', () => {
    const props = {
      isDisabled: true
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('disabled component');

    component.setProps({
      isDisabled: false,
      useSelectCategoryOptions: () => ({ options: [] }),
      useToolbarSecondaryFields: () => []
    });
    expect(component).toMatchSnapshot('missing filters');

    component.setProps({
      useToolbarSecondaryFields: () => [<span key="lorem">lorem ipsum</span>]
    });
    expect(component).toMatchSnapshot('missing primary, has secondary filters');
  });

  it('should hide categories when a single filter is available', () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[4]] })
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('single filter');
  });

  it('should handle updating toolbar chips', () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[4]] }),
      useToolbarFieldQueries: () => ({ [RHSM_API_QUERY_TYPES.SLA]: RHSM_API_QUERY_SLA_TYPES.PREMIUM })
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component.find(ToolbarFilter).props()).toMatchSnapshot('chips');

    component.setProps({
      useSelectCategoryOptions: () => ({ options: [{ ...selectCategoryOptions[4], isClearable: false }] })
    });

    expect(component.find(ToolbarFilter).props()).toMatchSnapshot('chips, not clearable');
  });

  it('should handle displaying secondary components, fields', () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[4]] }),
      useToolbarSecondaryFields: () => [<span key="lorem">lorem ipsum</span>]
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('secondary');
  });
});
