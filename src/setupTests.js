import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { act } from 'react-dom/test-utils';
import * as pfReactCoreComponents from '@patternfly/react-core';
import * as pfReactChartComponents from '@patternfly/react-charts';

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
  return mountedComponent;
};

/**
 * Fire a hook, return the result.
 *
 * @param {Function} useHook
 * @returns {*}
 */
global.mockHook = (useHook = Function.prototype) => {
  let result;
  const Hook = () => {
    result = useHook();
    return null;
  };
  shallow(<Hook />);
  return result;
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

/*
 * For applying a global Jest "beforeAll", based on
 * jest-prop-type-error, https://www.npmjs.com/package/jest-prop-type-error
 */
beforeAll(() => {
  const { error } = console;

  console.error = (message, ...args) => {
    if (/(Invalid prop|Failed prop type)/gi.test(message)) {
      throw new Error(message);
    }

    if (!/(Not implemented: navigation)/gi.test(message)) {
      error.apply(console, [message, ...args]);
    }
  };
});
