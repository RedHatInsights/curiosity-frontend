import React from 'react';
import { InventoryCardSubscriptions } from '../inventoryCardSubscriptions';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('InventoryCardSubscriptions Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useProduct: () => ({ productId: 'lorem' }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      })
    };

    const component = await shallowHookComponent(<InventoryCardSubscriptions {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });
});
