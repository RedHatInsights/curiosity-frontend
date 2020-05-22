import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Router, Redirect, routerHelpers, routerTypes } from '../router';

describe('Router Component', () => {
  it('should export specific properties', () => {
    expect(Router).toBeDefined();
    expect(Redirect).toBeDefined();
    expect(routerHelpers).toBeDefined();
    expect(routerTypes).toBeDefined();
  });

  it('should render a basic component', () => {
    const component = shallow(<Router />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle unique route settings', () => {
    const props = {
      routes: [
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

  it('should pass customized props to routed components', () => {
    const props = {
      routes: [
        {
          title: 'Lorem',
          to: '/lorem',
          redirect: false,
          component: () => <div>Lorem</div>,
          exact: false,
          render: true,
          disabled: false
        }
      ]
    };

    const component = mount(
      <MemoryRouter initialEntries={['/lorem?ipsum=1%202&dolor=sit&dolor=sit&dolor']}>
        <Router {...props} />
      </MemoryRouter>
    );

    const routedComponentProps = component.find(props.routes[0].component).props();
    expect({
      routeDetail: routedComponentProps.routeDetail,
      locationParsedSearch: routedComponentProps.location.parsedSearch
    }).toMatchSnapshot('routeDetail and location parsedSearch props');
  });
});
