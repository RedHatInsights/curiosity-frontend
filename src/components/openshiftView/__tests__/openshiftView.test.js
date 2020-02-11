import React from 'react';
import { shallow } from 'enzyme';
import { OpenshiftView } from '../openshiftView';

describe('OpenshiftView Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      routeDetail: {
        pathId: 'test_id',
        pathParameter: 'lorem ipsum',
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
      routeDetail: {
        pathId: 'test_id',
        pathParameter: 'lorem ipsum'
      }
    };

    const component = shallow(<OpenshiftView {...props} />);
    expect(component).toMatchSnapshot('title');
  });
});
