import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect as ReactRouterDomRedirect } from 'react-router-dom';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common';

const Redirect = ({ baseName, history, isRedirect, isReplace, url, route }) => {
  const navigate = p => {
    if (!helpers.DEV_MODE && !helpers.TEST_MODE) {
      if (isReplace) {
        window.location.replace(p);
      } else {
        window.location.href = p;
      }
    }
  };

  if (isRedirect === true) {
    if (url) {
      navigate(url);
      return (
        ((helpers.DEV_MODE || helpers.TEST_MODE) && <React.Fragment>Redirected towards {url}</React.Fragment>) || null
      );
    }

    if (route) {
      if (history) {
        return <ReactRouterDomRedirect to={route} />;
      }
      navigate(path.join(baseName, route));
    }
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
  route: routerHelpers.getErrorRoute.to
};

const RoutedRedirect = withRouter(Redirect);

export { RoutedRedirect as default, RoutedRedirect, Redirect };
