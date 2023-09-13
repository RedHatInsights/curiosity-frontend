import React from 'react';
import { InventoryGuests } from '../inventoryGuests';

describe('InventoryGuests Component', () => {
  it('should render a basic component', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 0,
      useGetInventory: () => ({ pending: true })
    };

    const component = await shallowComponent(<InventoryGuests {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle multiple display states, error, pending, fulfilled', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 10,
      useGetInventory: () => ({
        error: true
      })
    };

    const component = await shallowComponent(<InventoryGuests {...props} />);
    expect(component).toMatchSnapshot('error');

    const componentPending = await component.setProps({
      useGetInventory: () => ({
        pending: true
      })
    });

    expect(componentPending).toMatchSnapshot('pending');

    const componentFulfilled = await component.setProps({
      useGetInventory: () => ({
        fulfilled: true,
        dataSetColumnHeaders: ['lorem', 'dolor'],
        dataSetRows: [{ cells: ['ipsum', 'sit'] }]
      })
    });

    expect(componentFulfilled).toMatchSnapshot('fulfilled');
  });
});
