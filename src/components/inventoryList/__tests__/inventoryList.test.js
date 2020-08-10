import React from 'react';
import { shallow } from 'enzyme';
import { InventoryList } from '../inventoryList';
import { rhsmApiTypes } from '../../../types';

describe('InventoryList Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      query: {
        [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: 10,
        [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: 0
      },
      productId: 'lorem'
    };

    const component = shallow(<InventoryList {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle variations in data', () => {
    const props = {
      query: {
        [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: 10,
        [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: 0
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
});
