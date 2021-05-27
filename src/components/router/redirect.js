import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route } from 'react-router-dom';
import { routerHelpers } from './routerHelpers';
import { helpers } from '../../common';
import { Loader } from '../loader/loader';
import MessageView from '../messageView/messageView';
import { translate } from '../i18n/i18n';

/**
 * A routing redirect.
 *
 * @param {object} props
 * @param {string} props.baseName
 * @param {object} props.history
 * @param {boolean} props.isRedirect
 * @param {boolean} props.isReplace
 * @param {string} props.route
 * @param {string} props.t
 * @param {string} props.url
 * @returns {Node}
 */
const Redirect = ({ baseName, history, isRedirect, isReplace, route, t, url }) => {
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
      const routeDetail = routerHelpers.getRouteConfigByPath({ pathName: route }).firstMatch;
      const View =
        (routeDetail && routerHelpers.importView(routeDetail.component)) ||
        (() => <MessageView message={`${t('curiosity-view.redirectError')}, ${route}`} />);

      return (
        <React.Suspense fallback={<Loader variant="title" />}>
          <Route path="*">
            <View />
          </Route>
        </React.Suspense>
      );
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

/**
 * Prop types.
 *
 * @type {{isRedirect: boolean, route: string, t: Function, isReplace: boolean, history: object,
 *     baseName: string, url: string}}
 */
Redirect.propTypes = {
  baseName: PropTypes.string,
  history: PropTypes.object,
  isRedirect: PropTypes.bool.isRequired,
  isReplace: PropTypes.bool,
  route: PropTypes.string,
  t: PropTypes.func,
  url: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{route: null, t: translate, isReplace: boolean, history: null, baseName: string, url: null}}
 */
Redirect.defaultProps = {
  baseName: routerHelpers.baseName,
  history: null,
  isReplace: false,
  route: null,
  t: translate,
  url: null
};

const RoutedRedirect = withRouter(Redirect);

export { RoutedRedirect as default, RoutedRedirect, Redirect };
