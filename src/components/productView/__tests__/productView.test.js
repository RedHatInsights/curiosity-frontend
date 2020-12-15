import React from 'react';
import { shallow } from 'enzyme';
import { ProductView } from '../productView';

describe('ProductView Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      productConfig: {},
      routeDetail: {
        pathParameter: 'lorem ipsum',
        productParameter: 'lorem ipsum product label',
        viewParameter: 'dolor sit'
      }
    };

    const component = shallow(<ProductView {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render nothing if path and product parameters are empty', () => {
    const props = {
      productConfig: {},
      routeDetail: {
        pathParameter: null,
        viewParameter: null
      }
    };

    const component = shallow(<ProductView {...props} />);
    expect(component).toMatchSnapshot('empty');
  });
});
