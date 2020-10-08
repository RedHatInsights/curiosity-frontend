import {
  inventoryListHelpers,
  applySortFilters,
  parseInventoryFilters,
  parseRowCellsListData
} from '../inventoryListHelpers';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../../types/rhsmApiTypes';

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

  it('parseInventoryFilters should parse and return updated filters for table cells', () => {
    const filters = [
      {
        id: 'lorem',
        isSortable: false
      }
    ];

    expect(parseInventoryFilters({ filters, onSort: () => {} })).toMatchSnapshot('NOT sortable');

    filters[0].isSortable = true;
    expect(parseInventoryFilters({ filters, onSort: () => {} })).toMatchSnapshot('sortable');
  });

  it('applySortFilters should apply and return updated filters for table sorting', () => {
    const filter = {
      id: 'lorem',
      isSortable: false
    };

    expect(applySortFilters({ filter, onSort: undefined })).toMatchSnapshot('NOT sortable');

    filter.isSortable = true;
    expect(applySortFilters({ filter, onSort: () => {} })).toMatchSnapshot('sortable');

    expect({
      ascending: applySortFilters({
        filter,
        onSort: () => {},
        query: { [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.ASCENDING }
      }),
      descending: applySortFilters({
        filter,
        onSort: () => {},
        query: { [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING }
      })
    }).toMatchSnapshot('sortable, direction');

    expect(
      applySortFilters({
        filter,
        onSort: () => {},
        query: {
          [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.ASCENDING,
          [RHSM_API_QUERY_TYPES.SORT]: 'lorem'
        }
      })
    ).toMatchSnapshot('sortable, active column');
  });
});
