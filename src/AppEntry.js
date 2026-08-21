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
 * Application entry.
 * - A platform required file, including how it's cased.
 * Function declaration is hoisted so Chrome can resolve this export during circular init.
 * App is lazy-loaded so Kessel/auth are not evaluated in the same module pass.
 *
 * @returns {JSX.Element}
 */
function AppEntry() {
  return (
    <Provider store={store}>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </Provider>
  );
}

export { AppEntry as default, AppEntry };
