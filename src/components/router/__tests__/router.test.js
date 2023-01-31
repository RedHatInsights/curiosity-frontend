import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux';
import { Router } from '../router';
import * as routerContext from '../routerContext';

describe('Router Component', () => {
  it('should export specific properties', () => {
    expect(Router).toBeDefined();
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

    const component = shallow(<Router {...props} />);
    expect(component).toMatchSnapshot('settings');
  });

  it('should load a specific route', async () => {
    const props = {};

    const component = await mountHookComponent(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/rhods?ipsum=1%202&dolor=sit&dolor=sit&dolor']}>
          <Router {...props} />
        </MemoryRouter>
      </Provider>
    );
    const specificRoute = component.find(Route);
    expect(specificRoute.length).toBe(1);
    expect(specificRoute.props().path).toBe('/rhods');
  });

  it('should pass route context', async () => {
    const props = {};

    const mockValue = jest.fn();
    const mock = mockObjectProperty(routerContext.RouterContext, 'Provider', value => {
      mockValue(value);
      return null;
    });

    await mountHookComponent(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/rhods']}>
          <Router {...props} />
        </MemoryRouter>
      </Provider>
    );
    const mockCalls = mockValue.mock.calls.map(value => value?.[0]?.value || value);

    expect({
      pathParameter: mockCalls?.[0]?.routeDetail?.pathParameter,
      productParameter: mockCalls?.[0]?.routeDetail?.productParameter,
      viewParameter: mockCalls?.[0]?.routeDetail?.viewParameter
    }).toMatchSnapshot('context');
    mock.mockClear();
  });
});
