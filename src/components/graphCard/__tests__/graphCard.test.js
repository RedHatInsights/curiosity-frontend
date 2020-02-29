import React from 'react';
import { shallow } from 'enzyme';
import { ChartArea } from '../../chartArea/chartArea';
import { GraphCard } from '../graphCard';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../../types/rhsmApiTypes';

describe('GraphCard Component', () => {
  it('should render a non-connected component', () => {
    const props = { graphGranularity: GRANULARITY_TYPES.DAILY, productId: 'lorem' };
    const component = shallow(<GraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render multiple states', () => {
    const props = {
      graphGranularity: GRANULARITY_TYPES.DAILY,
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

    const component = shallow(<GraphCard {...props} />);

    component.setProps({
      error: true
    });

    expect({
      chartBarData: component.find(ChartArea).prop('dataSets')
    }).toMatchSnapshot('error passes values');

    component.setProps({
      errorStatus: 403
    });

    expect(component).toMatchSnapshot('error with 403 status');

    component.setProps({
      errorStatus: 500
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
});
