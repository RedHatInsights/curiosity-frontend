import React from 'react';
import { helpers } from '../../../common';
import { Authentication } from '../authentication';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

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
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
          errorCodes: [],
          errorStatus: undefined
        }
      })
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
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
          errorCodes: [],
          errorStatus: 418
        }
      })
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
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
          errorCodes: [rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES.OPTIN],
          errorStatus: 403
        }
      })
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
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
          errorCodes: [],
          errorStatus: 401
        }
      })
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
      useGetAuthorization: () => ({
        error: false,
        pending: true,
        data: {
          authorized: {},
          errorCodes: [],
          errorStatus: undefined
        }
      })
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
      useGetAuthorization: () => ({
        error: false,
        pending: false,
        data: {
          authorized: {
            [helpers.UI_NAME]: true
          },
          errorCodes: [],
          errorStatus: undefined
        }
      })
    };
    const component = await mountHookComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('authorized');
  });
});
