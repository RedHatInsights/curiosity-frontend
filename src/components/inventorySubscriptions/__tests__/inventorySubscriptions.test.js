import React from 'react';
import { InventorySubscriptions } from '../inventorySubscriptions';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('InventorySubscriptions Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useProduct: () => ({ productId: 'lorem' }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      })
    };

    const component = await shallowHookComponent(<InventorySubscriptions {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });
});
