/**
 * Used for standalone local run only.
 */
import './styles/standalone.scss';
import '@patternfly/react-core/dist/styles/base.css';
import('./bootstrap');

window.insights = {
  chrome: {
    appNavClick: (...args) => console.log(`Emulated appNavClick: ${JSON.stringify(args)}`),
    auth: {
      getUser: () =>
        new Promise(resolve => {
          resolve({
            identity: {
              account_number: '0',
              type: 'User'
            }
          });
        })
    },
    getUserPermissions: () => [],
    hideGlobalFilter: Function.prototype,
    identifyApp: Function.prototype,
    init: Function.prototype,
    isBeta: Function.prototype,
    on: Function.prototype
  }
};
