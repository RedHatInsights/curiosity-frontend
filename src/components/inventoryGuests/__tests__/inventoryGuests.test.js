import React from 'react';
import { InventoryGuests } from '../inventoryGuests';

describe('GuestsList Component', () => {
  it('should render a basic component', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 0
    };

    const component = await shallowHookComponent(<InventoryGuests {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });

  it('should handle variations in data', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 2,
      useGetGuestsInventory: () => ({
        data: {
          data: [
            { lorem: 'ipsum', dolor: 'sit' },
            { lorem: 'amet', dolor: 'amet' }
          ]
        }
      })
    };

    const component = await shallowHookComponent(<InventoryGuests {...props} />);
    expect(component).toMatchSnapshot('variable data');

    component.setProps({
      useProductInventoryGuestsConfig: () => ({
        filters: [{ id: 'lorem', cellWidth: 20 }]
      })
    });

    expect(component).toMatchSnapshot('filtered data');
  });

  it('should handle multiple display states', async () => {
    const props = {
      id: 'lorem',
      numberOfGuests: 1,
      useGetGuestsInventory: () => ({
        pending: true
      })
    };

    const component = await shallowHookComponent(<InventoryGuests {...props} />);
    expect(component).toMatchSnapshot('initial pending');

    component.setProps({
      useGetGuestsInventory: () => ({
        fulfilled: true,
        data: {
          data: [{ lorem: 'ipsum', dolor: 'sit' }]
        }
      })
    });

    expect(component).toMatchSnapshot('fulfilled');
  });

  it('should handle an onScroll event', async () => {
    const mockOnScroll = jest.fn();
    const props = {
      id: 'lorem',
      numberOfGuests: 200,
      useOnScroll: () => mockOnScroll,
      useGetGuestsInventory: () => ({
        fulfilled: true,
        data: {
          data: [{ lorem: 'ipsum', dolor: 'sit' }]
        }
      })
    };

    const component = await shallowHookComponent(<InventoryGuests {...props} />);
    component
      .find('.curiosity-table-scroll-list')
      .simulate('scroll', { target: { scrollHeight: 200, scrollTop: 100, clientHeight: 100 } });

    component.setProps({
      useGetGuestsInventory: () => ({
        pending: true
      })
    });

    expect(mockOnScroll.mock.calls).toMatchSnapshot('scroll event');
  });
});
