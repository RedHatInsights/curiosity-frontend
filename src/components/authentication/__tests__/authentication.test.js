import React from 'react';
import { helpers } from '../../../common';
import { Authentication } from '../authentication';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';

describe('Authentication Component', () => {
  const mockUseChrome = () => ({ visibilityFunctions: { featureFlag: () => false } });

  it('should render a basic component', async () => {
    const props = {
      useChrome: mockUseChrome,
      useGetAuthorization: () => ({
        error: false,
        pending: false,
        data: {
          authorized: {},
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
      useChrome: mockUseChrome,
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
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
      useChrome: mockUseChrome,
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
      useChrome: mockUseChrome,
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
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
      useChrome: mockUseChrome,
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
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
      useChrome: mockUseChrome,
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
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
      useChrome: mockUseChrome,
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
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
      useChrome: mockUseChrome,
      useGetAuthorization: () => ({
        error: false,
        pending: true,
        data: {
          authorized: {},
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
      useChrome: mockUseChrome,
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
      }),
      useHasRelation: () => ({ has: false, isLoading: false })
    };
    const component = await shallowComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('authorized');
  });

  const mockUseChromeKesselOn = () => ({ visibilityFunctions: { featureFlag: () => true } });

  it('should render authorized via kessel when flag is on', async () => {
    const props = {
      useChrome: mockUseChromeKesselOn,
      useGetAuthorization: () => ({
        error: false,
        pending: false,
        data: {
          authorized: {},
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

    expect(component).toMatchSnapshot('kessel authorized');
  });

  it('should render not authorized via kessel when flag is on', async () => {
    const props = {
      useChrome: mockUseChromeKesselOn,
      useGetAuthorization: () => ({
        error: false,
        pending: false,
        data: {
          authorized: {},
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

    expect(component).toMatchSnapshot('kessel not authorized');
  });

  it('should render pending via kessel when flag is on and loading', async () => {
    const props = {
      useChrome: mockUseChromeKesselOn,
      useGetAuthorization: () => ({
        error: false,
        pending: false,
        data: {
          authorized: {},
          errorCodes: [],
          errorStatus: undefined
        }
      }),
      useHasRelation: () => ({ has: false, isLoading: true })
    };
    const component = await shallowComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('kessel pending');
  });

  it('should show optin when kessel authorized but optin required', async () => {
    const props = {
      useChrome: mockUseChromeKesselOn,
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
          errorCodes: [rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES.OPTIN],
          errorStatus: 403
        }
      }),
      useHasRelation: () => ({ has: true, isLoading: false })
    };
    const component = await shallowComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('kessel authorized optin required');
  });

  it('should show optin when kessel authorized and 418 error', async () => {
    const props = {
      useChrome: mockUseChromeKesselOn,
      useGetAuthorization: () => ({
        error: true,
        pending: false,
        data: {
          authorized: {},
          errorCodes: [],
          errorStatus: 418
        }
      }),
      useHasRelation: () => ({ has: true, isLoading: false })
    };
    const component = await shallowComponent(
      <Authentication {...props}>
        <span className="test">lorem</span>
      </Authentication>
    );

    expect(component).toMatchSnapshot('kessel authorized 418 optin');
  });

  it('should use kessel over legacy rbac when flag is on', async () => {
    const props = {
      useChrome: mockUseChromeKesselOn,
      useGetAuthorization: () => ({
        error: false,
        pending: false,
        data: {
          authorized: {
            [helpers.UI_NAME]: false
          },
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

    expect(component).toMatchSnapshot('kessel overrides legacy');
  });
});
