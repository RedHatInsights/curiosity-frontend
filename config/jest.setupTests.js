import React from 'react';
import { fireEvent, queries, render, screen } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import { act } from 'react-dom/test-utils';
import * as pfReactCoreComponents from '@patternfly/react-core';
import * as pfReactChartComponents from '@patternfly/react-charts';
import * as reactRedux from 'react-redux';
import { TextEncoder } from 'util';
import { setupDotenvFilesForEnv } from './build.dotenv';

/**
 * Set dotenv params.
 */
setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

/**
 * Conditionally skip "it" test statements.
 * Ex:
 *   skipIt(true)('should do a thing...', () => { ... });
 *
 * @param {*|boolean} value Any truthy value, typically used with environment variables
 *
 * @returns {*|jest.It}
 */
global.skipIt = value => (value && it?.skip) || it;

/**
 * Emulate browser for component checks
 *
 * @type {TextEncoder}
 */
global.TextEncoder = TextEncoder;

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
 * Emulate react router dom useLocation
 */
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ hash: '', search: '' })
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
    getBundleData: Function.prototype,
    getUserPermissions: () => [],
    hideGlobalFilter: Function.prototype,
    identifyApp: Function.prototype,
    init: Function.prototype,
    isBeta: Function.prototype,
    on: Function.prototype,
    updateDocumentTitle: Function.prototype
  }
};

/**
 * Emulate frontend-components hooks
 */
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    ...global.window.insights
  })
}));

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
 * React testing for components. Add a screen render function that outputs HTML.
 * Used by "renderComponent".
 *
 * @type {{render: Function}} The render output allows the use querySelector, querySelectorALl, but the
 *     caveat is the "found" elements are not usable with other testing methods since they are recreated HTML.
 */
global.screenRender = {
  ...screen,
  render: (containerElement = screen) => {
    const screenContainer = document.createElement('screen');
    screenContainer.innerHTML = prettyDOM(containerElement.innerHTML, undefined, { highlight: false })
      .replace(/(\s)+/g, ' ')
      .replace(/>\s</g, '><');

    return screenContainer;
  }
};

/**
 * React testing for components.
 * try "shallowComponent" if results are not expected... see "shallowComponent"
 *
 * try "renderComponent" if
 * - hooks are used, and are not being passed in as mock props, and/or you want to skip writing mocks for hooks
 * - html output is required
 * - events are involved
 *
 * @param {React.ReactNode} testComponent
 * @param {object} options
 * @param {boolean} options.includeInstanceRef The component includes an instance ref for class components. If the component instance
 *     includes functions, they are wrapped in "act" for convenience.
 * @returns {HTMLElement}
 */
global.renderComponent = (testComponent, options = {}) => {
  const updatedOptions = { includeInstanceRef: true, ...options };
  const getDisplayName = reactComponent =>
    reactComponent?.displayName ||
    reactComponent?.$$typeof?.displayName ||
    reactComponent?.$$typeof?.name ||
    reactComponent?.name ||
    reactComponent?.type?.displayName ||
    reactComponent?.type?.name;

  const componentInfo = {
    displayName: getDisplayName(testComponent),
    props: {
      ...testComponent?.props,
      children: React.Children.toArray(testComponent?.props?.children).map(child => ({
        displayName: getDisplayName(child),
        props: child?.props,
        type: child?.type
      }))
    }
  };

  const containerElement = document.createElement(componentInfo?.displayName || 'element');
  try {
    containerElement.setAttribute('props', JSON.stringify(componentInfo?.props || {}, null, 2));
  } catch (e) {
    //
  }
  containerElement.props = componentInfo.props;

  const updatedTestComponent = { ...testComponent };
  let elementInstance;

  if (updatedTestComponent?.type?.prototype?.isReactComponent && updatedOptions.includeInstanceRef === true) {
    updatedTestComponent.ref = element => {
      const updatedElement = element;

      if (element) {
        Object.entries(element).forEach(([key, value]) => {
          if (typeof value === 'function') {
            try {
              updatedElement[key] = (...args) => {
                let output;
                act(() => {
                  output = value.call(element, ...args);
                });
                return output;
              };
            } catch (e) {
              //
            }
          }
        });

        elementInstance = updatedElement;
      }
    };
  }

  const { container, ...renderRest } = render(updatedTestComponent, {
    container: containerElement,
    queries,
    ...updatedOptions
  });

  const appendProps = obj => {
    Object.entries(renderRest).forEach(([key, value]) => {
      obj[key] = value; // eslint-disable-line
    });
  };

  const updatedContainer = container;
  updatedContainer.act = act;
  updatedContainer.screen = global.screenRender;
  updatedContainer.instance = elementInstance;
  updatedContainer.find = selector => container?.querySelector(selector);
  updatedContainer.fireEvent = fireEvent;
  updatedContainer.setProps = updatedProps => {
    const updatedComponent = { ...updatedTestComponent, props: { ...updatedTestComponent?.props, ...updatedProps } };
    let rerender = renderRest.rerender(updatedComponent);

    if (rerender === undefined) {
      rerender = global.renderComponent(updatedComponent, { queries, ...updatedOptions });
    }

    if (rerender) {
      rerender.find = selector => rerender?.querySelector(selector);
      rerender.fireEvent = fireEvent;
      rerender.setProps = updatedContainer.setProps;
      appendProps(rerender);
    }

    return rerender;
  };

  appendProps(updatedContainer);

  return updatedContainer;
};

/**
 * Fire a hook, return the result.
 *
 * @param {Function} useHook
 * @param {object} options
 * @param {boolean} options.includeInstanceContext The hook result, if it includes functions, is wrapped in "act" for convenience.
 * @param {object} options.state An object representing a mock Redux store's state.
 * @returns {*}
 */
global.renderHook = async (useHook = Function.prototype, options = {}) => {
  const updatedOptions = { includeInstanceContext: true, ...options };
  let result;
  let spyUseSelector;
  let unmountHook;

  const Hook = () => {
    result = useHook();
    return null;
  };

  const unmount = async () => {
    await act(async () => unmountHook());
  };

  await act(async () => {
    if (updatedOptions.state) {
      spyUseSelector = jest.spyOn(reactRedux, 'useSelector').mockImplementation(_ => _(updatedOptions.state));
    }
    const { unmount: unmountRender } = await render(<Hook />);
    unmountHook = unmountRender;
  });

  if (updatedOptions.state) {
    spyUseSelector.mockClear();
  }

  const updatedResult = result;

  if (result && updatedOptions.includeInstanceContext === true) {
    Object.entries(result).forEach(([key, value]) => {
      if (typeof value === 'function') {
        try {
          updatedResult[key] = (...args) => {
            let output;
            act(() => {
              output = value.call(result, ...args);
            });
            return output;
          };
        } catch (e) {
          //
        }
      }
    });
  }

  return { unmount, result: updatedResult, act };
};

/**
 * Quick React function component results testing. Results may not be helpful.
 * try "renderComponent" if results are not expected... see "renderComponent"
 *
 * use "shallowComponent" if
 * - the component is a function, class results may not be expected
 * - all hooks are passed in as props
 * - you want a quick component response typically determined by a condition
 * - snapshot size needs to be reduced
 *
 * @param {React.ReactNode} testComponent
 * @returns {*}
 */
global.shallowComponent = async testComponent => {
  const localRenderHook = async (component, updatedProps) => {
    if (typeof component?.type === 'function') {
      try {
        const { unmount, result } = await global.renderHook(
          () => component.type({ ...component.type.defaultProps, ...component.props, ...updatedProps }),
          { includeInstanceContext: false }
        );

        if (!result || typeof result === 'string' || typeof result === 'number') {
          return result;
        }

        const querySelector = (sel, _internalRender = result) => {
          const { container } = render(_internalRender);
          return container.querySelector(sel);
        };

        const querySelectorAll = (sel, _internalRender = result) => {
          const { container } = render(_internalRender);
          return container.querySelectorAll(sel);
        };

        const setProps = async p => localRenderHook(component, p);

        const renderResult = () => global.renderComponent(result);

        if (Array.isArray(result)) {
          const updatedR = result;
          updatedR.unmount = unmount;
          updatedR.render = renderResult;
          updatedR.find = querySelector;
          updatedR.querySelector = querySelector;
          updatedR.querySelectorAll = querySelectorAll;
          updatedR.setProps = setProps;
          return updatedR;
        }

        return {
          ...result,
          unmount,
          render: renderResult,
          find: querySelector,
          querySelector,
          querySelectorAll,
          setProps
        };
      } catch (e) {
        //
      }
    }

    return component;
  };

  return localRenderHook(testComponent);
};

// ToDo: revisit squashing log and group messaging, redux leaks log messaging
// ToDo: revisit squashing PF4 "popper" alerts
// ToDo: revisit squashing PF4 "validateDOMNesting" select alerts
// ToDo: revisit squashing PF4 "validateDOMNesting" table alerts
/*
 * For applying a global Jest "beforeAll", based on
 * - consoledot/platform console messaging
 * - jest-prop-type-error, https://www.npmjs.com/package/jest-prop-type-error
 * - renderComponent, test function testComponent messaging
 * - SVG syntax
 * - PF4 popper alerts and validateDOMNesting for select, table
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

    // ignore SVG and other xml
    if (
      /<testComponent/gi.test(message) ||
      args?.[0] === 'testComponent' ||
      /<foreignObject/gi.test(message) ||
      args?.[0] === 'foreignObject' ||
      /<g/gi.test(message) ||
      args?.[0] === 'g' ||
      (/validateDOMNesting/gi.test(message) && args?.[0] === '<div>' && args?.[1] === 'select') ||
      (/validateDOMNesting/gi.test(message) && args?.[0] === '<div>' && args?.[1] === 'table')
    ) {
      return false;
    }

    return !/(Not implemented: navigation)/gi.test(message) && !/Popper/gi.test(args?.[0]);
  });
});
