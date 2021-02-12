import React from 'react';
import { shallow } from 'enzyme';
import { ProductContext, useProductContext } from '../productContext';

describe('RouterContext', () => {
  // eslint-disable-next-line
  const Hook = ({ hook }) => <React.Fragment>{JSON.stringify(hook(), null, 2)}</React.Fragment>;
  const setContext = (value = {}) => jest.spyOn(React, 'useContext').mockImplementation(() => value);

  it('should return specific properties', () => {
    expect(ProductContext).toBeDefined();
    expect(useProductContext).toBeDefined();
  });

  it('should apply a hook for useProductContext', () => {
    const spy = setContext([{ lorem: 'ipsum' }, { dolor: 'sit' }]);

    const component = shallow(<Hook hook={useProductContext} />);
    expect(component).toMatchSnapshot('useProductContext');
    spy.mockClear();
  });
});
