import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { act } from 'react-dom/test-utils';
import * as pfReactCoreComponents from '@patternfly/react-core';
import * as pfReactChartComponents from '@patternfly/react-charts';
import { setupDotenvFilesForEnv } from './build.dotenv';

/**
 * Set dotenv params.
 */
setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

/**
 * Set enzyme adapter.
 */
configure({ adapter: new Adapter() });

/**
 * Emulate for component checks
 */
jest.mock('i18next', () => {
  const Test = function () { // eslint-disable-line
    this.use = () => this;
    this.init = () => Promise.resolve();
    this.changeLanguage = () => Promise.resolve();
  };
  return new Test();
});

/**
 * Emulate for component checks
 */
jest.mock('lodash/debounce', () => jest.fn);

/**
 * We currently use a wrapper for useSelector, emulate for component checks
 */
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

/**
 * Add the displayName property to function based components. Makes sure that snapshot tests have named components
 * instead of displaying a generic "<Component.../>".
 *
 * @param {object} components
 */
const addDisplayName = components => {
  Object.keys(components).forEach(key => {
    const component = components[key];
    if (typeof component === 'function' && !component.displayName) {
      component.displayName = key;
    }
  });
};

addDisplayName(pfReactCoreComponents);
addDisplayName(pfReactChartComponents);

/**
 * Apply a global insights chroming object.
 *
 * @type {{chrome: {init: Function, navigation: Function, auth: {getUser: Function}, identifyApp: Function,
 *     getUserPermissions: Function, isBeta: Function, hideGlobalFilter: Function, on: Function}}}
 */
global.window.insights = {
  chrome: {
    appNavClick: Function.prototype,
    auth: {
      getUser: () =>
        new Promise(resolve =>
          resolve({
            identity: {
              account_number: '0',
              type: 'User'
            }
          })
        )
    },
    getUserPermissions: () => [],
    hideGlobalFilter: Function.prototype,
    identifyApp: Function.prototype,
    init: Function.prototype,
    isBeta: Function.prototype,
    on: Function.prototype
  }
};

/**
 * Mock an object property, restore with mockClear.
 * A consistent object property mock for scenarios where the property is not a function/Jest fails.
 *
 * @param {object} object
 * @param {string} property
 * @param {*} mockValue
 * @returns {{mockClear: Function}}
 */
global.mockObjectProperty = (object = {}, property, mockValue) => {
  const updatedObject = object;
  const originalProperty = updatedObject[property];
  updatedObject[property] = mockValue;

  return {
    mockClear: () => {
      updatedObject[property] = originalProperty;
    }
  };
};

/**
 * Enzyme for components using hooks.
 *
 * @param {Node} component
 * @param {object} options
 *
 * @returns {Promise<null>}
 */
global.mountHookComponent = async (component, options = {}) => {
  let mountedComponent = null;
  await act(async () => {
    mountedComponent = mount(component, options);
  });
  mountedComponent?.update();

  if (typeof options?.callback === 'function') {
    await act(async () => {
      await options?.callback({ component: mountedComponent });
    });
    mountedComponent?.update();
  }

  return mountedComponent;
};

global.mountHookWrapper = global.mountHookComponent;

/**
 * Enzyme for components using hooks.
 *
 * @param {Node} component
 * @param {object} options
 *
 * @returns {Promise<null>}
 */
global.shallowHookComponent = async (component, options = {}) => {
  let mountedComponent = null;
  await act(async () => {
    mountedComponent = shallow(component, options);
  });
  mountedComponent?.update();

  if (typeof options?.callback === 'function') {
    await act(async () => {
      await options?.callback({ component: mountedComponent });
    });
    mountedComponent?.update();
  }

  return mountedComponent;
};

global.shallowHookWrapper = global.shallowHookComponent;

/**
 * Fire a hook, return the result.
 *
 * @param {Function} useHook
 * @returns {*}
 */
global.mountHook = async (useHook = Function.prototype) => {
  let result;
  let mountedHook;
  const Hook = () => {
    result = useHook();
    return null;
  };
  await act(async () => {
    mountedHook = mount(<Hook />);
  });
  mountedHook?.update();

  const unmount = async () => {
    await act(async () => mountedHook.unmount());
  };

  return { unmount, result };
};

/**
 * Fire a hook, return the result.
 *
 * @param {Function} useHook
 * @returns {*}
 */
global.shallowHook = (useHook = Function.prototype) => {
  let result;
  const Hook = () => {
    result = useHook();
    return null;
  };

  const shallowHook = shallow(<Hook />);
  const unmount = () => shallowHook.unmount();

  return { unmount, result };
};

/**
 * Generate a mock window location object, allow async.
 *
 * @param {Function} callback
 * @param {object} options
 * @param {string} options.url
 * @param {object} options.location
 * @returns {Promise<void>}
 */
global.mockWindowLocation = async (
  callback = Function.prototype,
  { url = 'https://ci.foo.redhat.com/subscriptions/rhel', location: locationProps = {} } = {}
) => {
  const updatedUrl = new URL(url);
  const { location } = window;
  delete window.location;
  // mock
  window.location = {
    href: updatedUrl.href,
    search: updatedUrl.search,
    hash: updatedUrl.hash,
    pathname: updatedUrl.pathname,
    replace: Function.prototype,
    ...locationProps
  };
  await callback(window.location);
  // restore
  window.location = location;
};

// FixMe: revisit squashing log and group messaging, redux leaks log messaging
// ToDo: revisit squashing "popper" alerts
/*
 * For applying a global Jest "beforeAll", based on
 * jest-prop-type-error, https://www.npmjs.com/package/jest-prop-type-error
 */
beforeAll(() => {
  const { error, group, log } = console;

  const interceptConsoleMessaging = (method, callback) => {
    console[method.name] = (message, ...args) => {
      const isValid = callback(message, ...args);
      if (isValid === true) {
        method.apply(console, [message, ...args]);
      }
    };
  };

  interceptConsoleMessaging(group, () => process.env.CI !== 'true');

  interceptConsoleMessaging(log, () => process.env.CI !== 'true');

  interceptConsoleMessaging(error, (message, ...args) => {
    if (/(Invalid prop|Failed prop type)/gi.test(message)) {
      throw new Error(message);
    }

    return !/(Not implemented: navigation)/gi.test(message) && !/Popper/gi.test(args?.[0]);
  });
});
