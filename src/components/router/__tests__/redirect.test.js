import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from '../redirect';

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
      route: '/dolor'
    };
    const mockReplace = jest.fn();
    const { mockClear } = mockObjectProperty(window, 'location', { replace: mockReplace });
    const component = shallow(<Redirect {...props} />);

    expect(mockReplace.mock.calls).toMatchSnapshot('forced route, replace');
    expect(component).toMatchSnapshot('forced route');

    mockReplace.mockClear();
    mockClear();
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

  it('should handle forwarding paths', () => {
    const props = {
      isReplace: false,
      route: '/openshift-container'
    };

    const component = shallow(<Redirect {...props} />);

    expect(component).toMatchSnapshot('forward path');
  });
});
