import React from 'react';
import { shallow } from 'enzyme';
import { SortByDirection } from '@patternfly/react-table';
import Table from '../../table/table';
import { InventoryList } from '../inventoryList';
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
      listData: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ],
      isDisabled: true
    };
    const component = shallow(<InventoryList {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle variations in data', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem',
      listData: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ]
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
      listData: [{ lorem: 'sit', dolor: 'amet', numberOfGuests: 1 }]
    };

    const component = shallow(<InventoryList {...props} />);
    expect(component.find(Table)).toMatchSnapshot('number of guests');

    component.setProps({
      ...props,
      listData: [{ lorem: 'sit', dolor: 'amet', numberOfGuests: 1, subscriptionManagerId: 'loremipsum' }]
    });

    expect(component.find(Table)).toMatchSnapshot('number of guests, and id');

    component.setProps({
      ...props,
      listData: [{ lorem: 'sit', dolor: 'amet', numberOfGuests: 2, subscriptionManagerId: 'loremipsum' }],
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
      listData: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ]
    };

    const component = shallow(<InventoryList {...props} />);
    const componentInstance = component.instance();

    componentInstance.onColumnSort({}, { direction: SortByDirection.asc, id: 'sockets' });
    componentInstance.onColumnSort({}, { direction: SortByDirection.desc, id: 'sockets' });
    componentInstance.onColumnSort({}, { direction: SortByDirection.asc, id: 'loremIpsumBrokenOnPurpose' });
    componentInstance.onColumnSort({}, { direction: SortByDirection.asc, id: 'sockets' });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch filter');
  });
});
