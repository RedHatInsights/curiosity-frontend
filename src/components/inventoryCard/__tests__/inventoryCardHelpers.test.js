import { inventoryCardHelpers, normalizeInventorySettings } from '../inventoryCardHelpers';

describe('InventoryListHelpers', () => {
  it('should have specific functions', () => {
    expect(inventoryCardHelpers).toMatchSnapshot('inventoryListHelpers');
  });

  it('normalizeInventorySettings should return base filters, settings', () => {
    expect(normalizeInventorySettings()).toMatchSnapshot('no filters');

    expect(
      normalizeInventorySettings({
        filters: [{ lorem: 'ipsum' }, { metric: 'dolorSit', dolor: 'sit' }],
        productId: 'loremIpsumTest'
      })
    ).toMatchSnapshot('filters, settings');
  });
});
