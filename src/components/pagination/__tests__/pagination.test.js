import React from 'react';
import { mount, shallow } from 'enzyme';
import { Pagination } from '../pagination';
import { reduxTypes, store } from '../../../redux';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('Pagination Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {
      productId: 'lorem',
      limitType: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
      offsetType: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 20,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      }
    };

    const component = shallow(<Pagination {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle per-page limit, and page offset updates through props', () => {
    const props = {
      productId: 'lorem',
      limitType: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
      offsetType: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
      itemCount: 39,
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 20,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      }
    };

    const component = shallow(<Pagination {...props} />);
    const { offset: perPageOffset, page: perPagePage, perPage: perPagePerPage } = component.props();
    expect({
      perPageOffset,
      perPagePage,
      perPagePerPage
    }).toMatchSnapshot('per-page, limit');

    component.setProps({
      query: {
        ...props.query,
        [RHSM_API_QUERY_TYPES.OFFSET]: 20
      }
    });

    const { offset: pageOffset, page: pagePage, perPage: pagePerPage } = component.props();
    expect({
      pageOffset,
      pagePage,
      pagePerPage
    }).toMatchSnapshot('page, offset');
  });

  it('should reset offset/pages when per-page limit is adjusted through redux state', () => {
    const props = {
      productId: 'lorem',
      limitType: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
      offsetType: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
      itemCount: 11,
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 10
      }
    };

    const component = mount(<Pagination {...props} />);
    const componentInstance = component.instance();
    componentInstance.onPerPage({ perPage: 100 });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch per-page');
  });

  it('should handle updating paging for redux state', () => {
    const props = {
      productId: 'lorem',
      limitType: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
      offsetType: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
      itemCount: 39,
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      }
    };
    const component = mount(<Pagination {...props} />);

    const filterMethods = () => {
      const componentInstance = component.instance();

      const filters = [
        { method: 'onPage', value: { page: 2 } },
        { method: 'onPerPage', value: { perPage: 20 } }
      ];

      filters.forEach(({ method, value }) => {
        componentInstance[method](value);
      });
    };

    filterMethods();
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch filter');
  });
});
