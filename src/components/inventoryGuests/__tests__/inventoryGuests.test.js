import React from 'react';
import { InventoryGuests } from '../inventoryGuests';

describe('GuestsList Component', () => {
  it('should render a basic component', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 0,
      useGetGuestsInventory: () => ({ pending: true })
    };

    const component = await shallowComponent(<InventoryGuests {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });

  it('should handle variations in data', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 2,
      useGetGuestsInventory: () => ({
        data: [
          { lorem: 'ipsum', dolor: 'sit' },
          { lorem: 'amet', dolor: 'amet' }
        ]
      })
    };

    const component = await shallowComponent(<InventoryGuests {...props} />);
    expect(component).toMatchSnapshot('variable data');

    const filteredData = await component.setProps({
      useProductInventoryGuestsConfig: () => ({
        filters: [{ id: 'lorem', cellWidth: 20 }]
      })
    });

    expect(filteredData).toMatchSnapshot('filtered data');
  });

  it('should handle multiple display states', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 1,
      useGetGuestsInventory: () => ({
        pending: true
      })
    };

    const component = await shallowComponent(<InventoryGuests {...props} />);
    expect(component).toMatchSnapshot('initial pending');

    const componentFulfilled = await component.setProps({
      useGetGuestsInventory: () => ({
        data: [{ lorem: 'ipsum', dolor: 'sit' }]
      })
    });

    expect(componentFulfilled).toMatchSnapshot('fulfilled');
  });

  it('should handle an onScroll event', () => {
    const mockOnScroll = jest.fn();
    const props = {
      id: 'lorem',
      numberOfGuests: 200,
      useOnScroll: () => mockOnScroll,
      useGetGuestsInventory: () => ({
        fulfilled: true,
        data: [{ lorem: 'ipsum', dolor: 'sit' }]
      })
    };

    const component = renderComponent(<InventoryGuests {...props} />);
    const input = component.find('.curiosity-table-scroll-list');
    component.fireEvent.scroll(input, { target: { scrollTop: 100 } });
    expect(mockOnScroll).toHaveBeenCalledTimes(1);
  });
});
