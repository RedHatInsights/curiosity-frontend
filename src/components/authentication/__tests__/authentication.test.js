import React from 'react';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { helpers } from '../../../common/helpers';
import { ConnectedAuthentication, Authentication } from '../authentication';

describe('Authorization Component', () => {
  const generateEmptyStore = (obj = {}) => configureMockStore()(obj);

  it('should render a connected component', () => {
    const store = generateEmptyStore({
      user: { session: { authorized: false, error: false, errorMessage: '', pending: false } }
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
  });

  it('should render a non-connected component pending', () => {
    const props = {
      history: {
        listen: helpers.noop,
        push: helpers.noop
      },
      session: {
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
