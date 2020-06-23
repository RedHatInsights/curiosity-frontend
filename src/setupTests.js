import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as pfReactCoreComponents from '@patternfly/react-core';
import * as pfReactChartComponents from '@patternfly/react-charts';

configure({ adapter: new Adapter() });

/**
 * FixMe: Use of arrow functions removes the usefulness of the "displayName" when shallow rendering
 * Adding a displayName after-the-fact gets around this issue, otherwise components would snapshot out as
 * "Component". This issue appears across the board, and includes internal and PF based components,
 * search "<Component" to find snapshot examples. This work-around potentially increases testing time
 * but provides a more useful result.
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
    if (typeof component === 'function') {
      component.displayName = key;
    }
  });
};

addDisplayName(pfReactCoreComponents);
addDisplayName(pfReactChartComponents);

jest.mock('c3', () => ({
  generate: () => ({
    destroy: jest.fn(),
    focus: jest.fn(),
    hide: jest.fn(),
    load: ({ done }) => done && done(),
    revert: jest.fn(),
    toggle: jest.fn()
  })
}));

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
    identifyApp: Function.prototype,
    init: Function.prototype,
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
