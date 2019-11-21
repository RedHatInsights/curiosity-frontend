import React from 'react';
import { shallow } from 'enzyme';
import { ChartArea } from '../../chartArea/chartArea';
import { RhelGraphCard } from '../rhelGraphCard';

describe('RhelGraphCard Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<RhelGraphCard {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render multiple states', () => {
    const props = {
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-30T23:59:59Z'),
      graphData: {
        sockets: [
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

    const component = shallow(<RhelGraphCard {...props} />);

    component.setProps({
      error: true
    });

    expect({
      chartBarData: component.find(ChartArea).prop('dataSets')
    }).toMatchSnapshot('error shows zeroed bar values');

    component.setProps({
      errorStatus: 403,
      errorRoute: {
        to: '/lorem-error-403-route'
      }
    });

    expect(component).toMatchSnapshot('error with 403 status redirects');

    component.setProps({
      errorStatus: 500,
      errorRoute: {
        to: '/lorem-error-500-route'
      }
    });

    expect(component).toMatchSnapshot('error with 500 status redirects');

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
