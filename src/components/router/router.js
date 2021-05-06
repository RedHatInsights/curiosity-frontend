import React from 'react';
import PropTypes from 'prop-types';
import { Redirect as ReactRouterDomRedirect, Route, Switch } from 'react-router-dom';
import Redirect from './redirect';
import { routerHelpers } from './routerHelpers';
import { Loader } from '../loader/loader';

/**
 * Load routes.
 *
 * @augments React.Component
 */
class Router extends React.Component {
  /**
   * Parse settings array with route options.
   *
   * @returns {{redirectRoot: Node, renderRoutes: Array}}
   */
  renderRoutes() {
    const { routes } = this.props;
    const activateOnErrorRoute = routes.find(route => route.activateOnError === true);
    let redirectRoot = null;

    return {
      renderRoutes: routes.map(item => {
        if (item.disabled) {
          return null;
        }

        if (item.redirect) {
          redirectRoot = <ReactRouterDomRedirect to={item.redirect} />;
        }

        if (item.render === true) {
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

                return (
                  <item.component
                    routeDetail={{
                      baseName: routerHelpers.baseName,
                      errorRoute: activateOnErrorRoute,
                      routes,
                      routeItem: { ...item },
                      ...routeConfig
                    }}
                    location={updatedLocation}
                    {...routeProps}
                  />
                );
              }}
            />
          );
        }

        return <Route exact={item.exact} key={item.path} path={item.path} component={item.component} />;
      }),
      redirectRoot
    };
  }

  /**
   * Render router.
   *
   * @returns {Node}
   */
  render() {
    const { renderRoutes, redirectRoot } = this.renderRoutes();

    return (
      <React.Suspense fallback={<Loader variant="title" />}>
        <Switch>
          {renderRoutes}
          {redirectRoot}
        </Switch>
      </React.Suspense>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{routes: Array}}
 */
Router.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      activateOnError: PropTypes.boolean,
      component: PropTypes.any.isRequired,
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

export { Router as default, Router, Redirect, routerHelpers };
