import React from 'react';
import { mount, shallow } from 'enzyme';
import { Toolbar } from '../toolbar';
import { toolbarTypes } from '../toolbarTypes';
import { RHSM_API_QUERY_SLA, RHSM_API_QUERY_USAGE } from '../../../types/rhsmApiTypes';

describe('Toolbar Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(Toolbar.prototype, 'setDispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should return an empty render when disabled', () => {
    const props = {
      isDisabled: true
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should render filters when props are populated', () => {
    const [optionOne] = toolbarTypes.getOptions(RHSM_API_QUERY_SLA).options;

    const props = {
      activeFilters: new Set([RHSM_API_QUERY_SLA]),
      currentFilter: RHSM_API_QUERY_SLA,
      query: {
        [RHSM_API_QUERY_SLA]: optionOne.value
      }
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('props');
  });

  it('should handle adding and clearing filters from redux state', () => {
    const props = {};
    const component = mount(<Toolbar {...props} />);

    const filterMethods = () => {
      const componentInstance = component.instance();

      const filters = [
        { category: RHSM_API_QUERY_SLA, method: 'onSlaSelect' },
        { category: RHSM_API_QUERY_USAGE, method: 'onUsageSelect' }
      ];

      filters.forEach(({ category, method }) => {
        componentInstance.onCategorySelect({ value: category });

        const [optionOne, optionTwo] = toolbarTypes.getOptions(category).options;
        componentInstance[method]({ value: optionOne.value });
        componentInstance[method]({ value: optionTwo.value });

        const { title: categoryTitle } = toolbarTypes.getOptions().options.find(({ value }) => value === category);
        componentInstance.onClearFilter(categoryTitle);
      });

      componentInstance.onClear();
    };

    filterMethods();
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch filter');

    component.setProps({ currentFilter: null, hardFilterReset: true });
    filterMethods();
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch filter, hard reset');
  });
});
