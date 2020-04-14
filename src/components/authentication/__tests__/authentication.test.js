import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { helpers } from '../../../common/helpers';
import { ConnectedAuthentication, Authentication } from '../authentication';

describe('Authorization Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({
      user: { session: { admin: false, authorized: false, error: false, errorMessage: '', pending: false } }
    });

    const component = shallow(
      <ConnectedAuthentication>
        <span className="test">lorem</span>
      </ConnectedAuthentication>,
      { context: { store } }
    );

    expect(component).toMatchSnapshot('connected');
  });

  it('should render a non-connected component error', () => {
    const props = {
      history: {
        listen: helpers.noop,
        push: helpers.noop
      },
      session: {
        admin: false,
        authorized: false,
        error: true,
        errorMessage: 'Authentication credentials were not provided.',
        pending: false
      }
    };
    const component = mount(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('non-connected error');

    component.setProps({
      session: {
        ...props.session,
        admin: true
      }
    });

    expect(component).toMatchSnapshot('non-connected admin error');
  });

  it('should return a redirect on 418 error', () => {
    const props = {
      history: {
        listen: helpers.noop,
        push: helpers.noop
      },
      session: {
        admin: false,
        authorized: false,
        error: true,
        errorStatus: 418,
        errorMessage: `I'm a teapot`,
        pending: false
      }
    };
    const component = mount(
      <BrowserRouter>
        <Authentication {...props}>
          <span className="test">lorem</span>
        </Authentication>
      </BrowserRouter>
    );

    expect(component.html()).toMatchSnapshot('418 error');

    component.setProps({
      session: {
        ...props.session,
        admin: true
      }
    });

    expect(component.html()).toMatchSnapshot('418 admin error');
  });

  it('should return a redirect on 403 error', () => {
    const props = {
      history: {
        listen: helpers.noop,
        push: helpers.noop
      },
      session: {
        admin: false,
        authorized: false,
        error: true,
        errorStatus: 403,
        errorMessage: `Forbidden`,
        pending: false
      }
    };
    const component = mount(
      <BrowserRouter>
        <Authentication {...props}>
          <span className="test">lorem</span>
        </Authentication>
      </BrowserRouter>
    );

    expect(component.html()).toMatchSnapshot('403 error');

    component.setProps({
      session: {
        ...props.session,
        admin: true
      }
    });

    expect(component.html()).toMatchSnapshot('403 admin error');
  });

  it('should return a message on 401 error', () => {
    const props = {
      history: {
        listen: helpers.noop,
        push: helpers.noop
      },
      session: {
        admin: false,
        authorized: false,
        errorStatus: 401
      }
    };
    const component = mount(
      <BrowserRouter>
        <Authentication {...props}>
          <span className="test">lorem</span>
        </Authentication>
      </BrowserRouter>
    );

    expect(component.html()).toMatchSnapshot('401 error');
  });

  it('should return a message on 401 admin error', () => {
    const props = {
      history: {
        listen: helpers.noop,
        push: helpers.noop
      },
      session: {
        admin: true,
        authorized: false,
        errorStatus: 401
      }
    };
    const component = mount(
      <BrowserRouter>
        <Authentication {...props}>
          <span className="test">lorem</span>
        </Authentication>
      </BrowserRouter>
    );

    expect(component.find('PageLayout')).toMatchSnapshot('401 admin error');
  });

  it('should render a non-connected component pending', () => {
    const props = {
      history: {
        listen: helpers.noop,
        push: helpers.noop
      },
      session: {
        admin: false,
        authorized: false,
        error: false,
        errorMessage: '',
        pending: true
      }
    };
    const component = shallow(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('non-connected pending');
  });

  it('should render a non-connected component authorized', () => {
    const props = {
      history: {
        listen: helpers.noop,
        push: helpers.noop
      },
      session: {
        admin: true,
        authorized: true,
        error: false,
        errorMessage: '',
        pending: false
      }
    };
    const component = mount(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('non-connected authorized');
  });
});
