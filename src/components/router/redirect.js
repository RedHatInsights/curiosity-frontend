import React from 'react';
import PropTypes from 'prop-types';
import { pathJoin, routerHelpers } from './routerHelpers';
import { helpers } from '../../common';
/**
 * A routing redirect.
 *
 * @param {object} props
 * @param {boolean} props.isReplace
 * @param {string} props.route
 * @param {string} props.url
 * @returns {Node}
 */
const Redirect = ({ isReplace, route, url }) => {
  const baseName = routerHelpers.dynamicBaseName();

  /**
   * Bypass router, force the location.
   */
  const forceNavigation = () => {
    const { hash = '', search = '' } = window.location;
    const forcePath = url || (route && `${pathJoin(baseName, route)}${search}${hash}`);

    if (isReplace) {
      window.location.replace(forcePath);
    } else {
      window.location.href = forcePath;
    }
  };

  forceNavigation();

  return (
    (helpers.TEST_MODE && (
      <React.Fragment>
        {(isReplace && 'Replaced') || 'Redirected'} towards {url || route}
      </React.Fragment>
    )) ||
    null
  );
};

/**
 * Prop types.
 *
 * @type {{route: string, isReplace: boolean, url: string}}
 */
Redirect.propTypes = {
  isReplace: PropTypes.bool,
  route: PropTypes.string,
  url: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{route: string, isReplace: boolean, url: string}}
 */
Redirect.defaultProps = {
  isReplace: true,
  route: null,
  url: null
};

export { Redirect as default, Redirect };
