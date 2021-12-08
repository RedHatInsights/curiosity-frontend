import React from 'react';
import PropTypes from 'prop-types';
import { BinocularsIcon } from '@patternfly/react-icons';
import { Maintenance } from '@redhat-cloud-services/frontend-components/Maintenance';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useMount, useUnmount } from 'react-use';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { rhsmApiTypes } from '../../types';
import { helpers } from '../../common';
import { routerHelpers, Redirect } from '../router';
import MessageView from '../messageView/messageView';
import { translate } from '../i18n/i18n';

/**
 * An authentication pass-through component.
 *
 * @param {object} props
 * @param {string} props.appName
 * @param {Function} props.authorizeUser
 * @param {Node} props.children
 * @param {Function} props.hideGlobalFilter
 * @param {object} props.history
 * @param {Function} props.initializeChrome
 * @param {Function} props.onNavigation
 * @param {object} props.session
 * @param {Function} props.setAppName
 * @param {Function} props.t
 * @returns {Node}
 */
const Authentication = ({
  appName,
  authorizeUser,
  children,
  hideGlobalFilter,
  history,
  initializeChrome,
  onNavigation,
  session,
  setAppName,
  t
}) => {
  const { errorCodes, pending, status: httpStatus, subscriptions: authorized } = session.authorized || {};
  let removeListeners = helpers.noop;

  useMount(async () => {
    if (!authorized) {
      await authorizeUser();
    }

    initializeChrome();
    setAppName(appName);
    hideGlobalFilter();

    const appNav = onNavigation(event => {
      const { routeHref } = routerHelpers.getRouteConfig({ id: event.navId });
      history.push(routeHref);
    });

    removeListeners = () => {
      appNav();
    };
  });

  useUnmount(() => {
    removeListeners();
  });

  if (helpers.UI_DISABLED) {
    return (
      <MessageView>
        <Maintenance description={t('curiosity-auth.maintenanceCopy', '...')} />
      </MessageView>
    );
  }

  if (authorized) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (pending) {
    return <MessageView pageTitle="&nbsp;" message={t('curiosity-auth.pending', '...')} icon={BinocularsIcon} />;
  }

  if (
    (errorCodes && errorCodes.includes(rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES.OPTIN)) ||
    httpStatus === 418
  ) {
    return <Redirect route={routerHelpers.getErrorRoute.path} />;
  }

  return (
    <MessageView>
      <NotAuthorized serviceName={helpers.UI_DISPLAY_NAME} />
    </MessageView>
  );
};

/**
 * Prop types.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, setAppName: Function, t: Function,
 *     children: Node, initializeChrome: Function, session: object, history: object,
 *     hideGlobalFilter: Function}}
 */
Authentication.propTypes = {
  appName: PropTypes.string,
  authorizeUser: PropTypes.func,
  children: PropTypes.node.isRequired,
  hideGlobalFilter: PropTypes.func,
  history: PropTypes.shape({
    listen: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  initializeChrome: PropTypes.func,
  onNavigation: PropTypes.func,
  setAppName: PropTypes.func,
  session: PropTypes.shape({
    authorized: PropTypes.shape({
      [routerHelpers.appName]: PropTypes.bool
    }),
    errorCodes: PropTypes.arrayOf(PropTypes.string),
    pending: PropTypes.bool,
    status: PropTypes.number
  }),
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, setAppName: Function, t: translate,
 *     initializeChrome: Function, session: {authorized: object, errorCodes: Array, pending: boolean,
 *     status: number}, hideGlobalFilter: Function}}
 */
Authentication.defaultProps = {
  appName: routerHelpers.appName,
  authorizeUser: helpers.noop,
  hideGlobalFilter: helpers.noop,
  initializeChrome: helpers.noop,
  onNavigation: helpers.noop,
  setAppName: helpers.noop,
  session: {
    authorized: {},
    errorCodes: [],
    pending: false,
    status: null
  },
  t: translate
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  authorizeUser: () => dispatch(reduxActions.user.authorizeUser()),
  hideGlobalFilter: isHidden => dispatch(reduxActions.platform.hideGlobalFilter(isHidden)),
  initializeChrome: () => dispatch(reduxActions.platform.initializeChrome()),
  onNavigation: callback => dispatch(reduxActions.platform.onNavigation(callback)),
  setAppName: name => dispatch(reduxActions.platform.setAppName(name))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.user.makeUserSession();

const ConnectedAuthentication = connect(makeMapStateToProps, mapDispatchToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
