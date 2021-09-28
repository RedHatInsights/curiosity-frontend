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
              const routeConfig = item.id && routerHelpers.getRouteConfig({ id: item.id });
              const { URLSearchParams, decodeURIComponent } = window;
              const parsedSearch = {};

              [
                ...new Set(
                  [...new URLSearchParams(decodeURIComponent(location.search))].map(
                    ([param, value]) => `${param}~${value}`
                  )
                )
              ].forEach(v => {
                const [param, value] = v.split('~');
                parsedSearch[param] = value;
              });

              const updatedLocation = {
                ...location,
                parsedSearch
              };

              const routeDetail = {
                baseName: routerHelpers.baseName,
                errorRoute: activateOnErrorRoute,
                routes,
                routeItem: { ...item },
                ...routeConfig
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
      activateOnError: PropTypes.boolean,
      component: PropTypes.string.isRequired,
      disabled: PropTypes.boolean,
      exact: PropTypes.boolean,
      id: PropTypes.string,
      path: PropTypes.string.isRequired,
      redirect: PropTypes.string,
      render: PropTypes.boolean,
      strict: PropTypes.boolean
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
