import React from 'react';
import { shallow } from 'enzyme';
import { SortByDirection } from '@patternfly/react-table';
import Table from '../../table/table';
import { InventoryList } from '../inventoryCard';
import { store } from '../../../redux';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('InventoryList Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem'
    };

    const component = shallow(<InventoryList {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should return an empty render when disabled', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem',
      data: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ],
      meta: {
        count: 2
      },
      isDisabled: true
    };
    const component = shallow(<InventoryList {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle multiple display states, error, pending, fulfilled', () => {
    const props = {
      query: {
        lorem: 'ipsum'
      },
      productId: 'lorem',
      pending: true
    };

    const component = shallow(<InventoryList {...props} />);
    expect(component).toMatchSnapshot('pending');

    component.setProps({
      pending: false,
      error: true
    });

    expect(component).toMatchSnapshot('error');

    component.setProps({
      data: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ],
      meta: {
        count: 2
      },
      pending: false,
      error: false,
      fulfilled: true
    });

    expect(component).toMatchSnapshot('fulfilled');
  });

  it('should handle variations in data', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem',
      data: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ],
      meta: {
        count: 2
      }
    };

    const component = shallow(<InventoryList {...props} />);
    expect(component).toMatchSnapshot('variable data');

    component.setProps({
      filterInventoryData: [{ id: 'lorem' }]
    });

    expect(component).toMatchSnapshot('filtered data');
  });

  it('should handle expandable guests data', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem',
      data: [{ lorem: 'sit', dolor: 'amet', numberOfGuests: 1 }],
      meta: {
        count: 1
      }
    };

    const component = shallow(<InventoryList {...props} />);
    expect(component.find(Table)).toMatchSnapshot('number of guests');

    component.setProps({
      ...props,
      data: [{ lorem: 'sit', dolor: 'amet', numberOfGuests: 1, subscriptionManagerId: 'loremIpsum' }]
    });

    expect(component.find(Table)).toMatchSnapshot('number of guests, and id');

    component.setProps({
      ...props,
      data: [{ lorem: 'sit', dolor: 'amet', numberOfGuests: 2, subscriptionManagerId: 'loremIpsum' }],
      settings: {
        hasGuests: data => {
          const { numberOfGuests = 0, subscriptionManagerId = null } = data;
          return numberOfGuests > 2 && subscriptionManagerId;
        }
      }
    });

    expect(component.find(Table)).toMatchSnapshot('number of guests, id, and NO expandable guests display');
  });

  it('should handle updating sorting through redux state', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem',
      data: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ],
      meta: {
        count: 2
      }
    };

    const component = shallow(<InventoryList {...props} />);
    const componentInstance = component.instance();

    componentInstance.onColumnSort({}, { direction: SortByDirection.asc, id: 'sockets' });
    componentInstance.onColumnSort({}, { direction: SortByDirection.desc, id: 'sockets' });
    componentInstance.onColumnSort({}, { direction: SortByDirection.asc, id: 'loremIpsumBrokenOnPurpose' });
    componentInstance.onColumnSort({}, { direction: SortByDirection.asc, id: 'sockets' });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch filter');
  });

  it('should handle updating paging through redux state', () => {
    const props = {
      query: {},
      productId: 'lorem'
    };

    const component = shallow(<InventoryList {...props} />);
    const componentInstance = component.instance();

    componentInstance.onPage({ offset: 10, perPage: 10 });
    componentInstance.onPage({ offset: 20, perPage: 10 });
    componentInstance.onPage({ offset: 0, perPage: 20 });
    componentInstance.onPage({ offset: 0, perPage: 50 });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch onPage');
  });

  it('should handle updating api data when query, or product id is updated', () => {
    const props = {
      query: { lorem: 'ipsum' },
      productId: 'lorem',
      getInstancesInventory: jest.fn()
    };

    const component = shallow(<InventoryList {...props} />);

    component.setProps({
      query: { dolor: 'sit' },
      productId: 'dolor'
    });

    expect(props.getInstancesInventory).toHaveBeenCalledTimes(2);
    expect(props.getInstancesInventory.mock.calls).toMatchSnapshot('getInstancesInventory');
  });
});
