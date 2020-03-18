import React from 'react';
import PropTypes from 'prop-types';
import { Redirect as ReactRouterDomRedirect, Route, Switch } from 'react-router-dom';
import Redirect from './redirect';
import { routerHelpers } from './routerHelpers';
import { routerTypes } from './routerTypes';

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

        if (item.redirect === true) {
          redirectRoot = <ReactRouterDomRedirect to={item.to} />;
        }

        if (item.render === true) {
          return (
            <Route
              exact={item.hasParameters || item.exact}
              key={item.to}
              path={item.to}
              strict={item.strict}
              render={routeProps => {
                const navDetail = routerHelpers.getNavigationDetail({
                  pathname: routeProps.location && routeProps.location.pathname,
                  returnDefault: false
                });

                return (
                  <item.component
                    routeDetail={{
                      baseName: routerHelpers.baseName,
                      errorRoute: activateOnErrorRoute,
                      routes,
                      routeItem: { ...item },
                      ...navDetail
                    }}
                    {...routeProps}
                  />
                );
              }}
            />
          );
        }

        return (
          <Route exact={item.hasParameters || item.exact} key={item.to} path={item.to} component={item.component} />
        );
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
      <Switch>
        {renderRoutes}
        {redirectRoot}
      </Switch>
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
      hasParameters: PropTypes.boolean,
      redirect: PropTypes.boolean,
      render: PropTypes.boolean,
      strict: PropTypes.boolean,
      to: PropTypes.string.isRequired
    })
  )
};

/**
 * Default props.
 *
 * @type {{routes: Array}}
 */
Router.defaultProps = {
  routes: routerTypes.routes
};

export { Router as default, Router, Redirect, routerHelpers, routerTypes };
