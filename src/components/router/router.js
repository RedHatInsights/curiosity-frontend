import React from 'react';
import PropTypes from 'prop-types';
import { Redirect as ReactRouterDomRedirect, Route, Switch } from 'react-router-dom';
import Redirect from './redirect';
import { routerHelpers } from './routerHelpers';
import { routerTypes } from './routerTypes';

class Router extends React.Component {
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
              render={routeProps => {
                const routeDetail = routerHelpers.getRouteDetail({ ...routeProps.match, ...routeProps.location });
                return (
                  <item.component
                    routeDetail={{
                      baseName: routerHelpers.baseName,
                      errorRoute: activateOnErrorRoute,
                      routes,
                      routeItem: { ...item },
                      ...routeDetail
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

  render() {
    const { renderRoutes, redirectRoot } = this.renderRoutes();

    return (
      <div className="curiosity-content">
        <Switch>
          {renderRoutes}
          {redirectRoot}
        </Switch>
      </div>
    );
  }
}

Router.propTypes = {
  routes: PropTypes.array
};

Router.defaultProps = {
  routes: routerTypes.routes
};

export { Router as default, Router, Redirect, routerHelpers, routerTypes };
