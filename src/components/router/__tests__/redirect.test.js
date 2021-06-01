import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from '../redirect';
import { Router } from '../router';

describe('Redirect Component', () => {
  it('should render a basic component', () => {
    const props = {
      route: '/openshift-dedicated'
    };
    const component = shallow(<Redirect {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle a forced redirect', () => {
    const props = {
      isForced: true,
      route: '/dolor'
    };

    mockWindowLocation(
      () => {
        const mockReplace = jest.spyOn(window.location, 'replace').mockImplementation((type, data) => ({ type, data }));
        const component = shallow(<Redirect {...props} />);

        expect(mockReplace.mock.calls).toMatchSnapshot('forced route, replace');
        expect(component).toMatchSnapshot('forced route');

        mockReplace.mockClear();
      },
      {
        url: 'http://lorem/ipsum?dolor=sit'
      }
    );
  });

  it('should handle a redirect with a url', () => {
    const props = {
      url: '//lorem/ipsum?dolor=sit'
    };
    const component = shallow(<Redirect {...props} />);
    expect(component).toMatchSnapshot('redirect url');
  });

  it('should handle missing routes', () => {
    const props = {
      route: '/lorem-ipsum'
    };
    const component = shallow(<Redirect {...props} />);

    expect(component).toMatchSnapshot('missing route, component');
  });

  it('should handle existing routes', () => {
    const props = {
      route: '/openshift-container'
    };

    const component = shallow(<Redirect {...props} />);
    const { routes } = component.find(Router).props();

    expect(routes[0]).toMatchSnapshot('existing route');
  });
});
