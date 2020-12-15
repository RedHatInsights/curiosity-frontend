import React from 'react';
import { shallow } from 'enzyme';
import { ProductView } from '../productView';

describe('ProductView Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      productConfig: {},
      routeDetail: {
        pathParameter: 'lorem ipsum',
        productParameter: 'dolor sit'
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
        productParameter: null
      }
    };

    const component = shallow(<ProductView {...props} />);
    expect(component).toMatchSnapshot('empty');
  });
});
