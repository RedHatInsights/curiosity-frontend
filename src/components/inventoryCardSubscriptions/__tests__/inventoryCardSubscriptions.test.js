import React from 'react';
import { InventoryCardSubscriptions } from '../inventoryCardSubscriptions';
import { RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('InventoryCardSubscriptions Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
      })
    };

    const component = await shallowComponent(<InventoryCardSubscriptions {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });
});
