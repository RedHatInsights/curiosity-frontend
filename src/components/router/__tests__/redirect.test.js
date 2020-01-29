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

  it('should handle missing routes with and without withRouter', () => {
    const props = {
      isRedirect: true,
      route: '/lorem-ipsum'
    };
    const component = shallow(<Redirect {...props} />);

    expect(component).toMatchSnapshot('missing route: outside of withRouter');

    const componentWithRouter = shallow(
      <BrowserRouter>
        <RoutedRedirect {...props} />
      </BrowserRouter>
    );

    expect(componentWithRouter).toMatchSnapshot('missing route: routed redirect route');
  });

  it('should handle existing routes with and without withRouter', () => {
    const props = {
      isRedirect: true,
      route: '/openshift-sw'
    };
    const component = shallow(<Redirect {...props} />);

    expect(component).toMatchSnapshot('existing route: outside of withRouter');

    const componentWithRouter = shallow(
      <BrowserRouter>
        <RoutedRedirect {...props} />
      </BrowserRouter>
    );

    expect(componentWithRouter).toMatchSnapshot('existing route: routed redirect route');
  });
});
