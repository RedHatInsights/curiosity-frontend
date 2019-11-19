import React from 'react';
import { shallow } from 'enzyme';
import { TourView } from '../tourView';

describe('TourView Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      routeDetail: {
        routeItem: {
          title: 'Dolor sit'
        }
      }
    };

    const component = shallow(<TourView {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should have a fallback title', () => {
    const props = {};

    const component = shallow(<TourView {...props} />);
    expect(component).toMatchSnapshot('title');
  });
});
