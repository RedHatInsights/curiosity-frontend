import React from 'react';
import { InventoryCardInstances } from '../inventoryCardInstances';
import { RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('InventoryCardInstances Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
      })
    };

    const component = await shallowComponent(<InventoryCardInstances {...props} />);
    expect(component).toMatchSnapshot('basic');
  });
});
