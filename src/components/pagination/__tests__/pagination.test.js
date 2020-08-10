import React from 'react';
import { mount, shallow } from 'enzyme';
import { Pagination } from '../pagination';
import { store } from '../../../redux';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';

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
      productId: 'lorem'
    };

    const component = shallow(<Pagination {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle per-page limit, and page offset updates', () => {
    const props = {
      productId: 'lorem',
      itemCount: 39,
      query: {
        [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: 20
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
        [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: 20
      }
    });

    const { offset: pageOffset, page: pagePage, perPage: pagePerPage } = component.props();
    expect({
      pageOffset,
      pagePage,
      pagePerPage
    }).toMatchSnapshot('page, offset');
  });

  it('should handle updating paging for redux state', () => {
    const props = {
      productId: 'lorem',
      itemCount: 39,
      query: {
        [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: 10,
        [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: 0
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
