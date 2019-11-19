import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import { baseName, getRouteDetail, navigation, routes } from './routerTypes';

class Router extends React.Component {
  renderRoutes() {
    const { routesType } = this.props;

    let redirectRoot = null;

    return {
      renderRoutes: routesType.map(item => {
        if (item.disabled) {
          return null;
        }

        if (item.redirect === true) {
          redirectRoot = <Redirect to={item.to} />;
        }

        if (item.render === true) {
          return (
            <Route
              exact={item.hasParameters || item.exact}
              key={item.to}
              path={item.to}
              render={routeProps => {
                const routeDetail = getRouteDetail(routeProps.match.params);
                return (
                  <item.component
                    routeDetail={{
                      baseName,
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
  routesType: PropTypes.array
};

Router.defaultProps = {
  routesType: routes
};

export { Router as default, Router, baseName, navigation, routes };
