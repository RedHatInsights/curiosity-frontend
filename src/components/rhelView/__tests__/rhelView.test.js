import React from 'react';
import { shallow } from 'enzyme';
import { RhelView } from '../rhelView';
import { parseRowCellsListData } from '../../inventoryList/inventoryListHelpers';

describe('RhelView Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      location: {},
      routeDetail: {
        pathId: 'test_id',
        pathParameter: 'lorem ipsum',
        routeItem: {
          title: 'Dolor sit'
        }
      }
    };

    const component = shallow(<RhelView {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should have a fallback title', () => {
    const props = {
      location: {},
      routeDetail: {
        pathId: 'test_id',
        pathParameter: 'lorem ipsum'
      }
    };

    const component = shallow(<RhelView {...props} />);
    expect(component).toMatchSnapshot('title');
  });

  it('should display an alternate graph on query-string update', () => {
    const props = {
      location: {
        parsedSearch: { c3: '' }
      },
      routeDetail: {
        pathId: 'test_id',
        pathParameter: 'lorem ipsum'
      }
    };

    const component = shallow(<RhelView {...props} />);
    expect(component).toMatchSnapshot('alternate graph');
  });

  it('should have default props that set product configuration', () => {
    const { initialGraphFilters, initialInventoryFilters, query } = RhelView.defaultProps;
    expect({ initialGraphFilters, initialInventoryFilters, query }).toMatchSnapshot('initial configuration');

    const filteredInventoryData = parseRowCellsListData({
      filters: initialInventoryFilters,
      cellData: {
        displayName: 'lorem',
        inventoryId: 'lorem inventory id',
        hardwareType: 'ipsum',
        numberOfGuests: 3,
        sockets: 10,
        cores: 12,
        lastSeen: 'lorem month ago'
      }
    });

    expect(filteredInventoryData).toMatchSnapshot('filter results');
  });
});
