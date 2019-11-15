import React from 'react';
import { shallow } from 'enzyme';
import { RhelView } from '../rhelView';

describe('RhelView Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      routeDetail: {
        pathParameter: 'lorem ipsum'
      }
    };

    const component = shallow(<RhelView {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
