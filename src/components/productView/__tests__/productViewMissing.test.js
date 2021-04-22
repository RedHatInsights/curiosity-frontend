import React from 'react';
import { shallow } from 'enzyme';
import { ProductViewMissing } from '../productViewMissing';

describe('ProductViewMissing Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ProductViewMissing {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render a predictable set of product cards', () => {
    const props = {
      basePath: '/loremIpsum/dolorSit/',
      products: [
        {
          id: 'test 001',
          isSearchable: true,
          path: '/loremIpsum',
          productParameter: 'loremIpsum'
        },
        {
          id: 'test 002',
          isSearchable: true,
          path: '/dolorSit',
          productParameter: 'dolorSit'
        },
        {
          id: 'test 003',
          isSearchable: false,
          path: '/test003',
          productParameter: 'test003'
        }
      ]
    };
    const component = shallow(<ProductViewMissing {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
