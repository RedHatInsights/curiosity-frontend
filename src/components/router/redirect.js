import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route } from 'react-router-dom';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common';

const Redirect = ({ baseName, history, isRedirect, isReplace, url, route }) => {
  const forceNavigation = urlRoute => {
    if (!helpers.DEV_MODE && !helpers.TEST_MODE) {
      if (isReplace) {
        window.location.replace(urlRoute);
      } else {
        window.location.href = urlRoute;
      }
    }
  };

  if (isRedirect === true) {
    if (route && history) {
      const routeDetail = routerHelpers.getRouteDetail({ pathname: route });
      return <Route path="*">{routeDetail && <routeDetail.component />}</Route>;
    }

    const forcePath = url || (route && path.join(baseName, route));
    forceNavigation(forcePath);

    return (
      ((helpers.DEV_MODE || helpers.TEST_MODE) && <React.Fragment>Redirected towards {forcePath}</React.Fragment>) ||
      null
    );
  }

  return null;
};

Redirect.propTypes = {
  history: PropTypes.object,
  isRedirect: PropTypes.bool.isRequired,
  isReplace: PropTypes.bool,
  url: PropTypes.string,
  baseName: PropTypes.string,
  route: PropTypes.string
};

Redirect.defaultProps = {
  history: null,
  isReplace: false,
  url: null,
  baseName: routerHelpers.baseName,
  route: null
};

const RoutedRedirect = withRouter(Redirect);

export { RoutedRedirect as default, RoutedRedirect, Redirect };
