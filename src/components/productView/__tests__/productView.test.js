import React from 'react';
import { shallow } from 'enzyme';
import { ProductView } from '../productView';

describe('ProductView Component', () => {
  const setContext = (value = {}) => jest.spyOn(React, 'useContext').mockImplementation(() => value);

  it('should render a non-connected component', () => {
    const context = {
      productId: 'lorem ipsum',
      productLabel: 'lorem ipsum product label',
      viewId: 'dolor sit'
    };

    const spy = setContext(context);
    const component = shallow(<ProductView />);
    expect(component).toMatchSnapshot('non-connected');
    spy.mockClear();
  });

  it('should render nothing if path and product parameters are empty', () => {
    const context = {
      productId: null,
      viewId: null
    };

    const spy = setContext(context);
    const component = shallow(<ProductView />);
    expect(component).toMatchSnapshot('empty');
    spy.mockClear();
  });
});
