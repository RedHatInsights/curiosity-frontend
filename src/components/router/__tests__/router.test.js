import React from 'react';
import { shallow } from 'enzyme';
import { Router, baseName, navigation, routes } from '../router';

describe('Router Component', () => {
  it('should export specific properties', () => {
    expect(Router).toBeDefined();
    expect(baseName).toBeDefined();
    expect(navigation).toBeDefined();
    expect(routes).toBeDefined();
  });

  it('should render a basic component', () => {
    const component = shallow(<Router />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle unique route settings', () => {
    const props = {
      routesType: [
        {
          title: 'Lorem',
          to: '/lorem',
          redirect: false,
          component: () => <div>Lorem</div>,
          exact: false,
          render: false,
          disabled: false
        },
        {
          title: 'Ipsum',
          to: '/ipsum',
          redirect: false,
          component: () => <div>Ipsum</div>,
          activateOnError: true,
          exact: false,
          render: false,
          disabled: false
        }
      ]
    };

    const component = shallow(<Router {...props} />);
    expect(component).toMatchSnapshot('settings');
  });
});
