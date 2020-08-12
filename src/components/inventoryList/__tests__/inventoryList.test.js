import React from 'react';
import { shallow } from 'enzyme';
import Table from '../../table/table';
import { InventoryList } from '../inventoryList';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('InventoryList Component', () => {
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
  });
});
