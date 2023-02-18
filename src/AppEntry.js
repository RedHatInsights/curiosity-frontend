import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux';
import App from './app';
import './styles/index.scss';
import '@patternfly/react-styles/css/components/Select/select.css';

/**
 * @memberof Base
 * @module AppEntry
 */

/**
 * ToDo: review consolidating between this and app.js
 */
/**
 * Application entry.
 * - A platform required file, including how it's cased.
 *
 * @returns {React.ReactNode}
 */
const AppEntry = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export { AppEntry as default, AppEntry };
