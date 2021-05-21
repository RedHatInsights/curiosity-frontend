import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux';
import { Router, Redirect, routerHelpers } from '../router';

describe('Router Component', () => {
  it('should export specific properties', () => {
    expect(Router).toBeDefined();
    expect(Redirect).toBeDefined();
    expect(routerHelpers).toBeDefined();
  });

  it('should render a basic component', () => {
    const component = shallow(<Router />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle unique route settings', () => {
    const props = {
      routes: [
        {
          path: '/lorem',
          redirect: '/loremIpsum',
          component: 'loremComponent',
          exact: false,
          disabled: false
        },
        {
          path: '/ipsum',
          component: 'ipsumComponent',
          activateOnError: true,
          exact: false,
          disabled: false
        }
      ]
    };

    const component = shallow(<Router {...props} />);
    expect(component).toMatchSnapshot('settings');
  });

  it('should load a specific route', async () => {
    const props = {};

    const component = await mountHookComponent(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/rhel-arm?ipsum=1%202&dolor=sit&dolor=sit&dolor']}>
          <Router {...props} />
        </MemoryRouter>
      </Provider>
    );
    const specificRoute = component.find(Route);
    expect(specificRoute.length).toBe(1);
    expect(specificRoute.props().path).toBe('/rhel-arm');
  });
});
