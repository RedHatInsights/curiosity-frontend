import React from 'react';
import { shallow } from 'enzyme';
import { Toolbar } from '../toolbar';
import { RHSM_API_QUERY_SLA_TYPES, RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';
import { toolbarFieldOptions as selectCategoryOptions } from '../toolbarFieldSelectCategory';

describe('Toolbar Component', () => {
  it('should render a basic component', () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[3], selectCategoryOptions[4]] })
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
      useSelectCategoryOptions: () => ({ options: [] })
    });
    expect(component).toMatchSnapshot('missing filters');
  });

  it('should hide categories when a single filter is available', () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[3]] })
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('single filter');
  });

  it('should handle updating toolbar chips', () => {
    const props = {
      useSelectCategoryOptions: () => ({ options: [selectCategoryOptions[3]] }),
      useToolbarFieldQueries: () => ({ [RHSM_API_QUERY_TYPES.SLA]: RHSM_API_QUERY_SLA_TYPES.PREMIUM })
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('chips');
  });
});
