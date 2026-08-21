import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux';
import './styles/index.scss';

/**
 * @memberof Base
 * @module AppEntry
 */

const App = React.lazy(() => import('./app'));

/**
 * ToDo: review consolidating between this and app.js
 */
/**
 * Application entry.
 * - A platform required file, including how it's cased.
 * App is lazy-loaded so Kessel/auth are not evaluated in the same module pass.
 *
 * @returns {JSX.Element}
 */
const AppEntry = () => (
  <Provider store={store}>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </Provider>
);

export { AppEntry as default, AppEntry };
