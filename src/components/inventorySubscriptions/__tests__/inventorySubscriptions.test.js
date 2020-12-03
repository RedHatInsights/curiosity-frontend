import React from 'react';
import { shallow } from 'enzyme';
import { SortByDirection } from '@patternfly/react-table';
import { InventorySubscriptions } from '../inventorySubscriptions';
import { store } from '../../../redux';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('InventorySubscriptions Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a non-connected component', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem'
    };

    const component = shallow(<InventorySubscriptions {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should return an empty render when disabled', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem',
      listData: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ],
      isDisabled: true
    };
    const component = shallow(<InventorySubscriptions {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });

  it('should handle variations in data', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem',
      listData: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ]
    };

    const component = shallow(<InventorySubscriptions {...props} />);
    expect(component).toMatchSnapshot('variable data');

    component.setProps({
      filterInventoryData: [{ id: 'lorem' }]
    });

    expect(component).toMatchSnapshot('filtered data');
  });

  it('should handle updating sorting through redux state', () => {
    const props = {
      query: {
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      productId: 'lorem',
      listData: [
        { lorem: 'ipsum', dolor: 'sit' },
        { lorem: 'sit', dolor: 'amet' }
      ]
    };

    const component = shallow(<InventorySubscriptions {...props} />);
    const componentInstance = component.instance();

    componentInstance.onColumnSort({}, { direction: SortByDirection.asc, id: 'productName' });
    componentInstance.onColumnSort({}, { direction: SortByDirection.desc, id: 'productName' });
    componentInstance.onColumnSort({}, { direction: SortByDirection.asc, id: 'loremIpsumBrokenOnPurpose' });
    componentInstance.onColumnSort({}, { direction: SortByDirection.asc, id: 'productName' });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch filter');
  });
});
