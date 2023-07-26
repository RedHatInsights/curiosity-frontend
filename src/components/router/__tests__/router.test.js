import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../../redux';
import { Router } from '../router';

describe('Router Component', () => {
  it('should export specific properties', () => {
    expect(Router).toBeDefined();
  });

  it('should render a basic component', async () => {
    const component = await shallowComponent(<Router />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle unique route settings', async () => {
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
        },
        {
          path: '/hello',
          component: 'helloWorld',
          activateOnError: false,
          exact: false,
          disabled: true
        },
        {
          path: '/loremDolorHello',
          component: 'loremDolorHello',
          activateOnError: false,
          exact: false,
          disabled: false
        }
      ]
    };

    const component = await shallowComponent(<Router {...props} />);
    expect(component).toMatchSnapshot('settings');
  });

  it('should attempt to set route details', () => {
    const mockSetRouteDetail = jest.fn();
    const props = {
      useSetRouteDetail: mockSetRouteDetail
    };

    renderComponent(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/rhods']}>
          <Router {...props} />
        </MemoryRouter>
      </Provider>
    );

    expect(mockSetRouteDetail).toHaveBeenCalledTimes(1);
  });
});
