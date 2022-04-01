import React from 'react';
import { helpers } from '../../../common';
import { Authentication } from '../authentication';
import { rhsmApiTypes } from '../../../types';

describe('Authentication Component', () => {
  it('should render a basic component', async () => {
    const component = await shallowHookComponent(
      <Authentication>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should render a component error', async () => {
    const props = {
      session: {
        authorized: {},
        error: true,
        pending: false
      }
    };
    const component = await mountHookComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('error');
  });

  it('should allow being disabled', async () => {
    const props = {
      isDisabled: true
    };
    const component = await shallowHookComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('disabled');
  });

  it('should return a redirect on 418 error', async () => {
    const props = {
      session: {
        authorized: {},
        error: true,
        status: 418,
        errorMessage: `I'm a teapot`,
        pending: false
      }
    };
    const component = await shallowHookComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('418 error');
  });

  it('should return a redirect on a specific 403 error and error code', async () => {
    const props = {
      session: {
        authorized: {},
        error: true,
        status: 403,
        errorCodes: [rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES.OPTIN],
        errorMessage: `Forbidden`,
        pending: false
      }
    };
    const component = await shallowHookComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('403 redirect error');

    component.setProps({
      session: {
        ...props.session,
        errorCodes: []
      }
    });

    expect(component).toMatchSnapshot('403 error');
  });

  it('should return a message on 401 error', async () => {
    const props = {
      session: {
        authorized: {},
        status: 401
      }
    };
    const component = await shallowHookComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('401 error');
  });

  it('should render a component pending', async () => {
    const props = {
      session: {
        authorized: {},
        error: false,
        errorMessage: '',
        pending: true
      }
    };
    const component = await shallowHookComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('pending');
  });

  it('should render a component authorized', async () => {
    const props = {
      session: {
        authorized: {
          [helpers.UI_NAME]: true
        },
        error: false,
        pending: false
      }
    };
    const component = await mountHookComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('authorized');
  });
});
