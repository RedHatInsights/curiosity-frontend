import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect as ReactRouterDomRedirect, Route, Switch } from 'react-router-dom';
import { useMount } from 'react-use';
import { RouterContext } from './routerContext';
import { routerHelpers } from './routerHelpers';
import { Loader } from '../loader/loader';

/**
 * Load routes.
 *
 * @param {object} props
 * @param {Array} props.routes
 * @returns {Node}
 */
const Router = ({ routes } = {}) => {
  const [updatedRoutes, setUpdatedRoutes] = useState([]);
  const [redirectDefault, setRedirectDefault] = useState(null);

  /**
   * Initialize routes.
   */
  useMount(async () => {
    const activateOnErrorRoute = routes.find(route => route.activateOnError === true);

    const results = await Promise.all(
      routes.map(async item => {
        if (item.disabled) {
          return null;
        }

        const View = await routerHelpers.importView(item.component);

        return (
          <Route
            exact={item.exact}
            key={item.path}
            path={item.path}
            strict={item.strict}
            render={({ location, ...routeProps }) => {
              const updatedLocation = {
                ...location,
                parsedSearch: routerHelpers.parseSearchParams(location.search)
              };

              const routeDetail = {
                ...item,
                baseName: routerHelpers.dynamicBaseName(),
                errorRoute: activateOnErrorRoute,
                routes,
                routeItem: { ...item }
              };

              return (
                <RouterContext.Provider value={{ routeDetail }}>
                  <View routeDetail={routeDetail} location={updatedLocation} {...routeProps} />
                </RouterContext.Provider>
              );
            }}
          />
        );
      })
    );

    setUpdatedRoutes(results);
    setRedirectDefault(routes.find(({ disabled, redirect }) => !disabled && redirect) ?? null);
  });

  return (
    <React.Suspense fallback={<Loader variant="title" />}>
      <Switch>
        {updatedRoutes}
        {redirectDefault && <ReactRouterDomRedirect to={redirectDefault.redirect} />}
      </Switch>
    </React.Suspense>
  );
};

/**
 * Prop types.
 *
 * @type {{routes: Array}}
 */
Router.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      activateOnError: PropTypes.bool,
      component: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      exact: PropTypes.bool,
      path: PropTypes.string.isRequired,
      redirect: PropTypes.string,
      render: PropTypes.bool,
      strict: PropTypes.bool
    })
  )
};

/**
 * Default props.
 *
 * @type {{routes: Array}}
 */
Router.defaultProps = {
  routes: routerHelpers.routes
};

export { Router as default, Router };
