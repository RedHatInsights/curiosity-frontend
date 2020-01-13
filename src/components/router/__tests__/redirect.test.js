import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { Redirect, RoutedRedirect } from '../redirect';

describe('Redirect Component', () => {
  it('should render a basic component', () => {
    const props = {
      isRedirect: false
    };
    const component = shallow(<Redirect {...props} />);
    expect(component.render()).toMatchSnapshot('basic');
  });

  it('should render a routed component', () => {
    const props = {
      isRedirect: false
    };
    const component = shallow(
      <BrowserRouter>
        <RoutedRedirect {...props} />
      </BrowserRouter>
    );
    expect(component.render()).toMatchSnapshot('routed');
  });

  it('should handle a redirect with a url', () => {
    const props = {
      isRedirect: true,
      url: '//lorem/ipsum?dolor=sit'
    };
    const component = shallow(<Redirect {...props} />);
    expect(component).toMatchSnapshot('redirect url');
  });

  it('should handle a routed redirect if used outside of withRouter', () => {
    const props = {
      isRedirect: true,
      route: '/lorem-ipsum'
    };
    const component = shallow(<Redirect {...props} />);
    expect(component.render()).toMatchSnapshot('outside of withRouter');
  });

  it('should handle a routed redirect with a route update', () => {
    const props = {
      isRedirect: true,
      route: '/lorem-ipsum'
    };
    const component = shallow(
      <BrowserRouter>
        <RoutedRedirect {...props} />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot('routed redirect route');
  });
});
