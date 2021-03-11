import React from 'react';
import { shallow } from 'enzyme';
import { ProductViewOpenShiftContainer } from '../productViewOpenShiftContainer';
import { parseRowCellsListData } from '../../inventoryList/inventoryListHelpers';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../../types/rhsmApiTypes';

describe('ProductViewOpenShiftContainer Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      routeDetail: {
        pathParameter: 'lorem ipsum',
        productParameter: 'dolor sit'
      }
    };

    const component = shallow(<ProductViewOpenShiftContainer {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should set multiple product configurations', () => {
    const [productOne, productTwo] = ProductViewOpenShiftContainer.defaultProps.productConfig;
    expect([
      {
        initialGraphFilters: productOne.initialGraphFilters,
        initialInventoryFilters: productOne.initialInventoryFilters,
        query: productOne.query
      },
      {
        initialGraphFilters: productTwo.initialGraphFilters,
        initialInventoryFilters: productTwo.initialInventoryFilters,
        query: productTwo.query
      }
    ]).toMatchSnapshot('initial configuration');

    const inventoryData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      coreHours: 12.53,
      lastSeen: 'lorem date obj',
      loremIpsum: 'hello world'
    };

    const filteredInventoryDataProductOne = parseRowCellsListData({
      filters: productOne.initialInventoryFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryDataProductOne).toMatchSnapshot('filteredInventoryData results, Product One');

    const filteredInventoryDataProductTwo = parseRowCellsListData({
      filters: productTwo.initialInventoryFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryDataProductTwo).toMatchSnapshot('filteredInventoryData results, Product Two');

    const fallbackInventoryData = {
      ...inventoryData,
      coreHours: null,
      inventoryId: null,
      lastSeen: null
    };

    const fallbackFilteredInventoryDataProductOne = parseRowCellsListData({
      filters: productOne.initialInventoryFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryDataProductOne).toMatchSnapshot(
      'filteredInventoryData results, fallback display, Product One'
    );

    const fallbackFilteredInventoryDataProductTwo = parseRowCellsListData({
      filters: productTwo.initialInventoryFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryDataProductTwo).toMatchSnapshot(
      'filteredInventoryData results, fallback display, Product Two'
    );

    expect({
      productOneHostsInventory:
        productOne.inventoryHostsQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING,
      productOneSubscriptionsInventory:
        productOne.inventorySubscriptionsQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING,
      productTwoHostsInventory:
        productTwo.inventoryHostsQuery[RHSM_API_QUERY_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING
    }).toMatchSnapshot('default sort for inventory should descend');
  });
});
