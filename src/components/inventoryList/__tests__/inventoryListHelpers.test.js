import { inventoryListHelpers, parseRowCellsListData } from '../inventoryListHelpers';

describe('InventoryListHelpers', () => {
  it('should have specific functions', () => {
    expect(inventoryListHelpers).toMatchSnapshot('inventoryListHelpers');
  });

  it('parseRowCellsListData should parse and return formatted/filtered table cells.', () => {
    const filters = [];
    const cellData = {
      lorem: 'ipsum',
      dolor: 'sit'
    };

    expect(parseRowCellsListData({ filters, cellData })).toMatchSnapshot('basic cell data');

    filters.push({
      id: 'lorem'
    });

    expect(parseRowCellsListData({ filters, cellData })).toMatchSnapshot('filtered data');

    filters[0] = {
      id: 'lorem',
      cell: {
        title: 'object, cell, lorem',
        props: { textCenter: true }
      }
    };

    expect(parseRowCellsListData({ filters, cellData })).toMatchSnapshot('custom cell data');

    filters[0] = {
      id: 'lorem',
      header: {
        title: 'object, header, lorem',
        props: { textCenter: true }
      }
    };

    expect(parseRowCellsListData({ filters, cellData })).toMatchSnapshot('custom header data');

    filters[0] = {
      header: ({ lorem, dolor }) => `${lorem.title}/${dolor.title}`,
      cell: ({ lorem, dolor }) => `${lorem.value}/${dolor.value}`
    };

    expect(parseRowCellsListData({ filters, cellData })).toMatchSnapshot('custom callback data');
  });
});
