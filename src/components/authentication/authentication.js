import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BinocularsIcon } from '@patternfly/react-icons';
import { Maintenance } from '@redhat-cloud-services/frontend-components/Maintenance';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useMount, useUnmount } from 'react-use';
import { connect, reduxActions, reduxSelectors, storeHooks } from '../../redux';
import { routerHooks } from '../../hooks/useRouter';
import { routerHelpers, Redirect } from '../router';
import { rhsmApiTypes } from '../../types';
import { helpers } from '../../common';
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
 * @param {Function} props.initializeChrome
 * @param {Function} props.onNavigation
 * @param {object} props.session
 * @param {Function} props.setAppName
 * @param {Function} props.t
 * @param {Function} props.useDispatch
 * @param {Function} props.useHistory
 * @returns {Node}
 */
const Authentication = ({
  appName,
  authorizeUser,
  children,
  hideGlobalFilter,
  initializeChrome,
  onNavigation,
  session,
  setAppName,
  t,
  useDispatch: useAliasDispatch,
  useHistory: useAliasHistory
}) => {
  const [unregister, setUnregister] = useState(() => helpers.noop);
  const dispatch = useAliasDispatch();
  const history = useAliasHistory();
  const { errorCodes, pending, status: httpStatus, subscriptions: authorized } = session.authorized || {};

  useMount(async () => {
    if (!authorized) {
      await dispatch(authorizeUser());
    }

    dispatch([initializeChrome(), setAppName(appName), hideGlobalFilter()]);
    setUnregister(() => dispatch(onNavigation(event => history.push(event.navId))));
  });

  useUnmount(() => {
    unregister();
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
 * @type {{authorizeUser: Function, onNavigation: Function, useHistory: Function, setAppName: Function,
 *     t: Function, children: Node, appName: string, initializeChrome: Function, session: object,
 *     useDispatch: Function, hideGlobalFilter: Function}}
 */
Authentication.propTypes = {
  appName: PropTypes.string,
  authorizeUser: PropTypes.func,
  children: PropTypes.node.isRequired,
  hideGlobalFilter: PropTypes.func,
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
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useHistory: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, useHistory: Function, setAppName: Function,
 *     t: Function, appName: string, initializeChrome: Function, session: object, useDispatch: Function,
 *     hideGlobalFilter: Function}}
 */
Authentication.defaultProps = {
  appName: routerHelpers.appName,
  authorizeUser: reduxActions.user.authorizeUser,
  hideGlobalFilter: reduxActions.platform.hideGlobalFilter,
  initializeChrome: reduxActions.platform.initializeChrome,
  onNavigation: reduxActions.platform.onNavigation,
  setAppName: reduxActions.platform.setAppName,
  session: {
    authorized: {},
    errorCodes: [],
    pending: false,
    status: null
  },
  t: translate,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useHistory: routerHooks.useHistory
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.user.makeUserSession();

const ConnectedAuthentication = connect(makeMapStateToProps)(Authentication);

export { ConnectedAuthentication as default, ConnectedAuthentication, Authentication };
