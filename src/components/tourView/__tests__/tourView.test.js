import React from 'react';
import { shallow } from 'enzyme';
import { TourView } from '../tourView';

describe('TourView Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = shallow(<TourView {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should have a fallback title', () => {
    const props = {};

    const component = shallow(<TourView {...props} />);
    expect(component).toMatchSnapshot('title');
  });

  it('should handle an error http status', () => {
    const props = {
      session: {
        status: 418
      }
    };

    const component = shallow(<TourView {...props} />);
    expect(component).toMatchSnapshot('error http status');
  });
});
