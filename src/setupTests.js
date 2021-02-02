import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as pfReactCoreComponents from '@patternfly/react-core';
import * as pfReactChartComponents from '@patternfly/react-charts';

configure({ adapter: new Adapter() });

/**
 * Emulate for component checks
 */
jest.mock('i18next');
jest.mock('lodash/debounce', () => jest.fn);

/**
 * FixMe: Use of arrow functions removes the usefulness of the "displayName" when shallow rendering
 * PF appears to have updated components with a "displayName". Because we potentially have internal
 * components, and other resources that are missing "displayName". We're leaving this test helper active.
 */
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

global.window.insights = {
  chrome: {
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
    getUserPermissions: Function.prototype,
    hideGlobalFilter: Function.prototype,
    identifyApp: Function.prototype,
    init: Function.prototype,
    isBeta: Function.prototype,
    navigation: Function.prototype,
    on: Function.prototype
  }
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

    error.apply(console, [message, ...args]);
  };
});
