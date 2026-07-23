import React from 'react';
import { Authentication } from '../authentication';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

describe('Authentication Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useGetAuthorization: () => ({
        error: false,
        pending: false,
        data: {
          errorCodes: [],
          errorStatus: undefined
        }
      }),
      useHasRelation: () => ({ has: false, isLoading: false })
    };

    const component = await shallowComponent(
      <Authentication {...props}>
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
          errorCodes: [],
          errorStatus: undefined
        }
      }),
      useHasRelation: () => ({ has: false, isLoading: false })
    };
    const component = await shallowComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('error');
  });

  it('should allow being disabled', async () => {
    const props = {
      isDisabled: true,
      useGetAuthorization: () => ({
        error: false,
        pending: false,
        data: {
          errorCodes: [],
          errorStatus: undefined
        }
      }),
      useHasRelation: () => ({ has: false, isLoading: false })
    };
    const component = await shallowComponent(
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
          errorCodes: [],
          errorStatus: 418
        }
      }),
      useHasRelation: () => ({ has: false, isLoading: false })
    };
    const component = await shallowComponent(
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
          errorCodes: [rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES.OPTIN],
          errorStatus: 403
        }
      }),
      useHasRelation: () => ({ has: false, isLoading: false })
    };
    const component = await shallowComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('403 redirect error');

    const propsUpdated = await component.setProps({
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          errorCodes: [],
          errorStatus: 403
        }
      }),
      useHasRelation: () => ({ has: false, isLoading: false })
    });

    expect(propsUpdated).toMatchSnapshot('403 error');
  });

  it('should return a message on 401 error', async () => {
    const props = {
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          errorCodes: [],
          errorStatus: 401
        }
      }),
      useHasRelation: () => ({ has: false, isLoading: false })
    };
    const component = await shallowComponent(
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
          errorCodes: [],
          errorStatus: undefined
        }
      }),
      useHasRelation: () => ({ has: false, isLoading: false })
    };
    const component = await shallowComponent(
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
          errorCodes: [],
          errorStatus: undefined
        }
      }),
      useHasRelation: () => ({ has: true, isLoading: false })
    };
    const component = await shallowComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('authorized');
  });
});
