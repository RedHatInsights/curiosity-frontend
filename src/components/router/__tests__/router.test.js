import React from 'react';
import { shallow } from 'enzyme';
import { Router, baseName, routes } from '../router';

describe('Router Component', () => {
  it('should export specific properties', () => {
    expect(Router).toBeDefined();
    expect(baseName).toBeDefined();
    expect(routes).toBeDefined();
  });

  it('should render a basic component', () => {
    const component = shallow(<Router />);
    expect(component).toMatchSnapshot('basic');
  });
});
