import React from 'react';
import { InventoryCard } from '../inventoryCard';

describe('InventoryCard Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useGetInventory: () => ({
        pending: true
      }),
      useInventoryCardActions: () => undefined,
      useOnPage: () => {},
      useOnColumnSort: () => {},
      useParseFiltersSettings: () => ({ filters: [{ metric: 'loremIpsum' }] })
    };

    const component = await shallowComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });

  it('should return an empty render when disabled', async () => {
    const props = {
      isDisabled: true,
      useGetInventory: () => ({
        pending: true
      }),
      useInventoryCardActions: () => undefined,
      useOnPage: () => {},
      useOnColumnSort: () => {},
      useParseFiltersSettings: () => ({ filters: [{ metric: 'loremIpsum' }] })
    };

    const component = await shallowComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('disabled');

    const componentMissingFilters = await component.setProps({
      isDisabled: false,
      useParseFiltersSettings: () => ({ filters: [] })
    });

    expect(componentMissingFilters).toMatchSnapshot('missing filters');
  });

  it('should handle multiple display states, error, pending, fulfilled', async () => {
    const props = {
      useGetInventory: () => ({
        error: true
      }),
      useInventoryCardActions: () => undefined,
      useOnPage: () => {},
      useOnColumnSort: () => {},
      useParseFiltersSettings: () => ({ filters: [{ metric: 'loremIpsum' }] })
    };

    const component = await shallowComponent(<InventoryCard {...props} />);
    expect(component).toMatchSnapshot('error');

    const componentPending = await component.setProps({
      useGetInventory: () => ({
        pending: true
      })
    });

    expect(componentPending).toMatchSnapshot('pending');

    const componentFulfilled = await component.setProps({
      useGetInventory: () => ({
        fulfilled: true
      })
    });

    expect(componentFulfilled).toMatchSnapshot('fulfilled');
  });
});
