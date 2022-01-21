import React from 'react';
import Table from '../../table/table';
import { InventoryCard } from '../inventoryCard';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('InventoryCard Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useProduct: () => ({ productId: 'lorem' }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      })
    };

    const component = await shallowHookComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });

  it('should return an empty render when disabled', async () => {
    const props = {
      isDisabled: true,
      useProduct: () => ({ productId: 'lorem' }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      }),
      useGetInventory: () => ({
        data: {
          data: [
            { lorem: 'ipsum', dolor: 'sit' },
            { lorem: 'sit', dolor: 'amet' }
          ],
          meta: {
            count: 2
          }
        }
      })
    };
    const component = await shallowHookComponent(<InventoryCard {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle multiple display states, error, pending, fulfilled', async () => {
    const props = {
      useProduct: () => ({ productId: 'lorem' }),
      useProductInventoryQuery: () => ({
        lorem: 'ipsum'
      }),
      useGetInventory: () => ({
        pending: true
      })
    };

    const component = await shallowHookComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('pending');

    component.setProps({
      useGetInventory: () => ({
        pending: false,
        error: true
      })
    });

    expect(component).toMatchSnapshot('error');

    component.setProps({
      useGetInventory: () => ({
        pending: false,
        error: false,
        fulfilled: true,
        data: {
          data: [
            { lorem: 'ipsum', dolor: 'sit' },
            { lorem: 'sit', dolor: 'amet' }
          ],
          meta: {
            count: 2
          }
        }
      })
    });

    expect(component).toMatchSnapshot('fulfilled');
  });

  it('should handle variations in data', async () => {
    const props = {
      useProduct: () => ({ productId: 'lorem' }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      }),
      useGetInventory: () => ({
        fulfilled: true,
        data: {
          data: [
            { lorem: 'ipsum', dolor: 'sit' },
            { lorem: 'sit', dolor: 'amet' }
          ],
          meta: {
            count: 2
          }
        }
      })
    };

    const component = await shallowHookComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('variable data');

    component.setProps({
      useProductInventoryConfig: () => ({ filters: [{ id: 'lorem' }] })
    });

    expect(component).toMatchSnapshot('filtered data');
  });

  it('should handle expandable guests data', async () => {
    const props = {
      useProduct: () => ({ productId: 'lorem' }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      }),
      useGetInventory: () => ({
        fulfilled: true,
        data: {
          data: [{ lorem: 'sit', dolor: 'amet', numberOfGuests: 1 }],
          meta: {
            count: 1
          }
        }
      })
    };

    const component = await shallowHookComponent(<InventoryCard {...props} />);
    expect(component.find(Table)).toMatchSnapshot('number of guests');

    component.setProps({
      ...props,
      useGetInventory: () => ({
        fulfilled: true,
        data: {
          data: [{ lorem: 'sit', dolor: 'amet', numberOfGuests: 1, subscriptionManagerId: 'loremIpsum' }],
          meta: {
            count: 1
          }
        }
      })
    });

    expect(component.find(Table)).toMatchSnapshot('number of guests, and id');

    component.setProps({
      ...props,
      useGetInventory: () => ({
        fulfilled: true,
        data: {
          data: [{ lorem: 'sit', dolor: 'amet', numberOfGuests: 2, subscriptionManagerId: 'loremIpsum' }],
          meta: {
            count: 1
          }
        }
      }),
      useProductInventoryConfig: () => ({
        settings: {
          hasSubTable: data => {
            const { numberOfGuests = 0, subscriptionManagerId = null } = data;
            return numberOfGuests > 2 && subscriptionManagerId;
          }
        }
      })
    });

    expect(component.find(Table)).toMatchSnapshot('number of guests, id, and NO expandable guests display');
  });
});
