import React from 'react';
import { mount, shallow } from 'enzyme';
import { store } from '../../../redux';
import { Toolbar } from '../toolbar';
import { toolbarTypes } from '../toolbarTypes';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';
import { paginationHelpers } from '../../pagination/paginationHelpers';

describe('Toolbar Component', () => {
  let mockSetDispatch;

  beforeEach(() => {
    mockSetDispatch = jest.spyOn(Toolbar.prototype, 'setDispatch').mockImplementation((type, data) => ({ type, data }));
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

  it('should render specific filters when the filterOptions prop is used', () => {
    const props = {
      filterOptions: [
        {
          id: RHSM_API_QUERY_TYPES.SLA
        }
      ],
      query: {}
    };
    const component = shallow(<Toolbar {...props} />);

    expect(component).toMatchSnapshot('filterOptions');
  });

  it('should render filters when props are populated', () => {
    const [optionOne] = toolbarTypes.getOptions(RHSM_API_QUERY_TYPES.SLA).options;

    const props = {
      activeFilters: new Set([RHSM_API_QUERY_TYPES.SLA]),
      currentFilter: RHSM_API_QUERY_TYPES.SLA,
      query: {
        [RHSM_API_QUERY_TYPES.SLA]: optionOne.value
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
        { category: RHSM_API_QUERY_TYPES.SLA, method: 'onSelect' },
        { category: RHSM_API_QUERY_TYPES.USAGE, method: 'onSelect' }
      ];

      filters.forEach(({ category, method }) => {
        componentInstance.onCategorySelect({ value: category });

        const [optionOne, optionTwo] = toolbarTypes.getOptions(category).options;
        componentInstance[method]({ event: { value: optionOne.value }, field: category });
        componentInstance[method]({ event: { value: optionTwo.value }, field: category });

        const { title: categoryTitle } = toolbarTypes.getOptions().options.find(({ value }) => value === category);
        componentInstance.onClearFilter(categoryTitle);
      });

      componentInstance.onClear();
    };

    filterMethods();
    expect(mockSetDispatch.mock.calls).toMatchSnapshot('dispatch filter');

    component.setProps({ currentFilter: null, hardFilterReset: true });
    filterMethods();
    expect(mockSetDispatch.mock.calls).toMatchSnapshot('dispatch filter, hard reset');
  });

  it('should dispatch filters towards redux state with paging resets', () => {
    // Restore the original setDispatch functionality for testing
    mockSetDispatch.mockRestore();
    const mockStoreDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
    const mockResetPage = jest
      .spyOn(paginationHelpers, 'resetPage')
      .mockImplementation((type, data) => ({ type, data }));

    const props = {};
    const component = shallow(<Toolbar {...props} />);
    const componentInstance = component.instance();

    componentInstance.setDispatch({
      type: 'lorem ipsum',
      data: { lorem: 'ipsum' }
    });
    expect({ store: mockStoreDispatch.mock.calls }).toMatchSnapshot('NO paging state');

    componentInstance.setDispatch(
      {
        type: 'lorem ipsum',
        data: { lorem: 'ipsum' }
      },
      true
    );
    expect({
      store: mockStoreDispatch.mock.calls[mockStoreDispatch.mock.calls.length - 1],
      resetPage: mockResetPage.mock.calls[mockResetPage.mock.calls.length - 1]
    }).toMatchSnapshot('WITH paging state, NO product id');

    component.setProps({
      productId: 'lorem'
    });
    componentInstance.setDispatch(
      {
        type: 'lorem ipsum',
        data: { lorem: 'ipsum' }
      },
      true
    );
    expect({
      store: mockStoreDispatch.mock.calls[mockStoreDispatch.mock.calls.length - 1],
      resetPage: mockResetPage.mock.calls[mockResetPage.mock.calls.length - 1]
    }).toMatchSnapshot('WITH paging state, WITH product id');
  });
});
