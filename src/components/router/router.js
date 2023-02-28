import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useSetRouteDetail } from './routerContext';
import { routerHelpers } from './routerHelpers';
import { Loader } from '../loader/loader';

/**
 * Route component loader.
 *
 * @memberof Components
 * @module Router
 * @property {module} RouterContext
 * @property {module} RouterHelpers
 */

/**
 * Create and load routes. Start cycle for loading product configuration via hook by setting route details.
 *
 * @param {object} props
 * @param {object} props.redirectRoute
 * @param {Array} props.routes
 * @param {Function} props.useSetRouteDetail
 * @returns {React.ReactNode}
 */
const Router = ({ redirectRoute, routes, useSetRouteDetail: useAliasSetRouteDetail } = {}) => {
  useAliasSetRouteDetail();

  const updatedRoutes = routes.map(item => {
    const View = routerHelpers.importView(item.component);
    return <Route key={item.path} path={item.path} element={<View />} />;
  });

  return (
    <React.Suspense fallback={<Loader variant="title" />}>
      <Routes>
        {updatedRoutes}
        {redirectRoute?.path && redirectRoute?.redirect && (
          <Route key="redirect" path={redirectRoute.path} element={<Navigate replace to={redirectRoute.redirect} />} />
        )}
      </Routes>
    </React.Suspense>
  );
};

/**
 * Prop types.
 *
 * @type {{routes: Array<{component: string, path: string}>, redirectRoute: { path: string, redirect: string },
 *     useSetRouteDetail: Function}}
 */
Router.propTypes = {
  redirectRoute: PropTypes.shape({
    path: PropTypes.string.isRequired,
    redirect: PropTypes.string.isRequired
  }),
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      path: PropTypes.string.isRequired
    })
  ),
  useSetRouteDetail: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{routes: Array, redirectRoute: object, useSetRouteDetail: Function}}
 */
Router.defaultProps = {
  redirectRoute: routerHelpers.redirectRoute,
  routes: routerHelpers.routes,
  useSetRouteDetail
};

export { Router as default, Router };
