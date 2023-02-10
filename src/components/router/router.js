import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useSetRouteDetail } from './routerContext';
import { routerHelpers } from './routerHelpers';
import { Loader } from '../loader/loader';

// ToDo: consider moving the filter for disabled routes towards routerHelpers
/**
 * Create and load routes.
 *
 * @param {object} props
 * @param {object} props.redirectRoute
 * @param {Array} props.routes
 * @returns {React.ReactNode}
 */
const Router = ({ redirectRoute, routes } = {}) => {
  // this bypasses react router all together, its like we don't even need a router
  useSetRouteDetail();
  // const params = useParams();
  // const location = useLocation();
  // console.log('>>>>> ROUTER PARAMS', params);

  const updatedRoutes = routes
    .filter(item => !item.disabled)
    .map(item => {
      const View = routerHelpers.importView(item.component);
      return <Route key={item.path} path={item.path} element={<View />} />;
    });

  return (
    <React.Suspense fallback={<Loader variant="title" />}>
      <Routes>
        {updatedRoutes}
        {redirectRoute && (
          <Route key="redirect" path={redirectRoute.path} element={<Navigate replace to={redirectRoute.redirect} />} />
        )}
      </Routes>
    </React.Suspense>
  );
};

/**
 * Prop types.
 *
 * @type {{routes: Array, redirectRoute: object}}
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
  )
};

/**
 * Default props.
 *
 * @type {{routes: Array, redirectRoute: object}}
 */
Router.defaultProps = {
  redirectRoute: routerHelpers.redirectRoute,
  routes: routerHelpers.routes
};

export { Router as default, Router };
