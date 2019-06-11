import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import { baseName, routes } from './routerTypes';

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
          redirectRoot = <Redirect from="/" to={item.to} />;
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
      <div className="subscriptions-insights-content">
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

export { Router as default, Router, baseName, routes };
