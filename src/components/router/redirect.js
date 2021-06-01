import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { Router } from './router';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common';
/**
 * A routing redirect.
 *
 * @param {object} props
 * @param {string} props.baseName
 * @param {boolean} props.isForced
 * @param {string} props.route
 * @param {string} props.routes
 * @param {string} props.url
 * @returns {Node}
 */
const Redirect = ({ baseName, isForced, route, routes, url }) => {
  /**
   * Bypass router, force the location.
   */
  const forceNavigation = () => {
    const { hash = '', search = '' } = window.location;
    const forcePath = url || (route && `${path.join(baseName, route)}${search}${hash}`);

    window.location.replace(forcePath);
  };

  const { path: matchedRoutePath, ...matchedRoute } = routerHelpers.getRouteConfig({ pathName: route, id: route });

  if (!isForced && matchedRoutePath) {
    return <Router routes={[{ ...matchedRoute, path: '*' }, ...routes]} />;
  }

  forceNavigation();

  return (helpers.TEST_MODE && <React.Fragment>Redirected towards {url || route}</React.Fragment>) || null;
};

/**
 * Prop types.
 *
 * @type {{isRedirect: boolean, route: string, routes: Array, isReplace: boolean, baseName: string, url: string,
 *    isForced: boolean}}
 */
Redirect.propTypes = {
  baseName: PropTypes.string,
  isForced: PropTypes.bool,
  route: PropTypes.string,
  routes: PropTypes.array,
  url: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{isRedirect: boolean, route: string, routes: Array, isReplace: boolean, baseName: string, url: string,
 *    isForced: boolean}}
 */
Redirect.defaultProps = {
  baseName: routerHelpers.baseName,
  isForced: false,
  route: null,
  routes: routerHelpers.routes,
  url: null
};

export { Redirect as default, Redirect };
