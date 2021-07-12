import React from 'react';
import { shallow } from 'enzyme';
import { ProductViewDefault } from '../productViewDefault';

describe('ProductViewDefault Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      routeDetail: {
        pathParameter: 'lorem ipsum',
        productConfig: [{ lorem: 'ipsum' }],
        productParameter: 'lorem ipsum product label',
        viewParameter: 'dolor sit'
      }
    };

    const component = shallow(<ProductViewDefault {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
