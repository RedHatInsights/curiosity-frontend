import React from 'react';
import { shallow } from 'enzyme';
import { C3Chart } from '../../c3Chart/c3Chart';
import { C3GraphCard } from '../c3GraphCard';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, rhsmApiTypes } from '../../../types/rhsmApiTypes';

describe('C3GraphCard Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      query: { [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: GRANULARITY_TYPES.DAILY },
      productId: 'lorem'
    };
    const component = shallow(<C3GraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render multiple states', () => {
    const props = {
      query: { [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: GRANULARITY_TYPES.DAILY },
      productId: 'lorem',
      graphData: {
        physicalSockets: [
          {
            date: new Date('2019-06-01T00:00:00Z'),
            y: 10,
            x: 0
          },
          {
            date: new Date('2019-06-08T00:00:00Z'),
            y: 12,
            x: 1
          },
          {
            date: new Date('2019-06-25T00:00:00Z'),
            y: 3,
            x: 2
          }
        ]
      }
    };

    const component = shallow(<C3GraphCard {...props} />);

    component.setProps({
      error: true
    });

    expect({
      chartBarData: component.find(C3Chart).prop('config').data
    }).toMatchSnapshot('error passes values');

    component.setProps({
      status: 403
    });

    expect(component).toMatchSnapshot('error with 403 status');

    component.setProps({
      status: 500
    });

    expect(component).toMatchSnapshot('error with 500 status');

    component.setProps({
      error: false,
      pending: true
    });

    expect(component).toMatchSnapshot('pending');

    component.setProps({
      error: false,
      pending: false,
      fulfilled: true
    });

    expect(component).toMatchSnapshot('fulfilled');
  });

  it('should filter result sets', () => {
    const props = {
      filterGraphData: [
        {
          id: 'loremIpsumSockets'
        },
        {
          id: 'thresholdLoremIpsumSockets'
        }
      ],
      query: { [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: GRANULARITY_TYPES.DAILY },
      productId: 'lorem',
      graphData: {
        loremIpsumSockets: [
          {
            date: new Date('2019-06-01T00:00:00Z'),
            y: 10,
            x: 0
          },
          {
            date: new Date('2019-06-08T00:00:00Z'),
            y: 12,
            x: 1
          },
          {
            date: new Date('2019-06-25T00:00:00Z'),
            y: 3,
            x: 2
          }
        ],
        dolorSitSockets: [
          {
            date: new Date('2019-06-01T00:00:00Z'),
            y: 10,
            x: 0
          },
          {
            date: new Date('2019-06-08T00:00:00Z'),
            y: 12,
            x: 1
          },
          {
            date: new Date('2019-06-25T00:00:00Z'),
            y: 3,
            x: 2
          }
        ],
        thresholdLoremIpsumSockets: [
          {
            date: new Date('2019-06-01T00:00:00Z'),
            y: 10,
            x: 0
          },
          {
            date: new Date('2019-06-08T00:00:00Z'),
            y: 12,
            x: 1
          },
          {
            date: new Date('2019-06-25T00:00:00Z'),
            y: 3,
            x: 2
          }
        ]
      }
    };

    const component = shallow(<C3GraphCard {...props} />);
    expect(component.find(C3Chart).prop('config').data).toMatchSnapshot('filtered config');
  });

  it('should render a custom legend', () => {
    const props = {
      query: { [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: GRANULARITY_TYPES.DAILY },
      productId: 'lorem'
    };

    const component = shallow(<C3GraphCard {...props} />);
    const componentInstance = component.instance();

    expect(componentInstance.renderLegend({})).toMatchSnapshot('empty legend');

    expect(
      componentInstance.renderLegend({
        filteredData: [{ id: 'lorem' }, { id: 'thresholdIpsum' }],
        granularity: 'dolor',
        hiddenDataFacets: []
      })
    ).toMatchSnapshot('legend');
  });

  it('should return an empty render when disabled', () => {
    const props = {
      query: { [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: GRANULARITY_TYPES.DAILY },
      isDisabled: true,
      productId: 'lorem'
    };
    const component = shallow(<C3GraphCard {...props} />);

    expect(component).toMatchSnapshot('disabled component');
  });
});
