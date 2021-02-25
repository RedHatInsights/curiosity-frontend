import React from 'react';
import { shallow } from 'enzyme';
import { OpenshiftView } from '../openshiftView';
import { parseRowCellsListData } from '../../inventoryList/inventoryListHelpers';

describe('OpenshiftView Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      location: {},
      routeDetail: {
        pathId: 'test_id',
        pathParameter: 'lorem ipsum',
        productParameter: 'test label',
        routeItem: {
          title: 'Dolor sit'
        }
      }
    };

    const component = shallow(<OpenshiftView {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should have a fallback title', () => {
    const props = {
      location: {},
      routeDetail: {
        pathId: 'test_id',
        pathParameter: 'lorem ipsum',
        productParameter: 'test label'
      }
    };

    const component = shallow(<OpenshiftView {...props} />);
    expect(component).toMatchSnapshot('title');
  });

  it('should have default props that set product configuration', () => {
    const { initialGraphFilters, initialGuestsFilters, initialInventoryFilters, query } = OpenshiftView.defaultProps;
    expect({ initialGraphFilters, initialGuestsFilters, initialInventoryFilters, query }).toMatchSnapshot(
      'initial configuration'
    );

    const inventoryData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      hardwareType: 'ipsum',
      measurementType: null,
      numberOfGuests: 3,
      sockets: 10,
      cores: 12,
      lastSeen: 'lorem date obj',
      loremIpsum: 'hello world'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialInventoryFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filteredInventoryData results');

    const filteredInventoryDataAuthorized = parseRowCellsListData({
      filters: initialInventoryFilters,
      cellData: inventoryData,
      session: { authorized: { inventory: true } }
    });

    expect(filteredInventoryDataAuthorized).toMatchSnapshot('filteredInventoryData results, authorized');

    const guestsData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      subscriptionManagerId: 'lorem subscription id',
      lastSeen: 'lorem date obj',
      loremIpsum: 'hello world'
    };

    const filteredGuestsData = parseRowCellsListData({
      filters: initialGuestsFilters,
      cellData: guestsData
    });

    expect(filteredGuestsData).toMatchSnapshot('filteredGuestsData results');

    const filteredGuestsDataAuthorized = parseRowCellsListData({
      filters: initialGuestsFilters,
      cellData: guestsData,
      session: { authorized: { inventory: true } }
    });

    expect(filteredGuestsDataAuthorized).toMatchSnapshot('filteredGuestsData results, authorized');
  });
});
