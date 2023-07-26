import React from 'react';
import { InventoryCard } from '../inventoryCard';
import { RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('InventoryCard Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
      }),
      useGetInventory: () => ({
        pending: true
      })
    };

    const component = await shallowComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });

  it('should return an empty render when disabled', async () => {
    const props = {
      isDisabled: true,
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
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
    const component = await shallowComponent(<InventoryCard {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle multiple display states, error, pending, fulfilled', async () => {
    const props = {
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        lorem: 'ipsum'
      }),
      useGetInventory: () => ({
        pending: true
      })
    };

    const component = await shallowComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('pending');

    const componentError = await component.setProps({
      useGetInventory: () => ({
        pending: false,
        error: true
      })
    });

    expect(componentError).toMatchSnapshot('error');

    const componentFulfilled = await component.setProps({
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

    expect(componentFulfilled).toMatchSnapshot('fulfilled');
  });

  it('should handle variations in data', async () => {
    const props = {
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
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

    const component = await shallowComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('variable data');

    const componentFiltered = await component.setProps({
      useProductInventoryConfig: () => ({ filters: [{ id: 'lorem' }] })
    });

    expect(componentFiltered.find('table')).toMatchSnapshot('filtered data');
  });

  it('should handle expandable guests data', async () => {
    const props = {
      useProductInventoryConfig: () => ({ filters: [], settings: {} }),
      useProductInventoryQuery: () => ({
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
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

    const component = await shallowComponent(<InventoryCard {...props} />);
    expect(component.find('tbody')).toMatchSnapshot('number of guests');

    const componentGuests = await component.setProps({
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

    expect(componentGuests.find('tbody')).toMatchSnapshot('number of guests, and id');

    const componentNoGuests = await component.setProps({
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

    expect(componentNoGuests.find('tbody')).toMatchSnapshot('number of guests, id, and NO expandable guests display');
  });
});
