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
 * @param {React.ReactNode} props.children
 * @param {Function} props.hideGlobalFilter
 * @param {Function} props.initializeChrome
 * @param {boolean} props.isDisabled
 * @param {Function} props.onNavigation
 * @param {object} props.session
 * @param {Function} props.setAppName
 * @param {Function} props.t
 * @param {Function} props.useDispatch
 * @param {Function} props.useHistory
 * @returns {React.ReactNode}
 */
const Authentication = ({
  appName,
  authorizeUser,
  children,
  hideGlobalFilter,
  initializeChrome,
  isDisabled,
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
  const { errorCodes, pending, status: httpStatus, authorized } = session || {};
  const { [appName]: isAuthorized } = authorized || {};

  useMount(async () => {
    if (!isAuthorized) {
      await dispatch(authorizeUser());
    }

    dispatch([initializeChrome(), setAppName(appName), hideGlobalFilter()]);
    setUnregister(() => dispatch(onNavigation(event => history.push(event.navId))));
  });

  useUnmount(() => {
    unregister();
  });

  if (isDisabled) {
    return (
      <MessageView>
        <Maintenance description={t('curiosity-auth.maintenanceCopy', '...')} />
      </MessageView>
    );
  }

  if (isAuthorized) {
    return children;
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
 *     t: Function, children: React.ReactNode, appName: string, initializeChrome: Function, session: object,
 *     useDispatch: Function, isDisabled: boolean, hideGlobalFilter: Function}}
 */
Authentication.propTypes = {
  appName: PropTypes.string,
  authorizeUser: PropTypes.func,
  children: PropTypes.node.isRequired,
  hideGlobalFilter: PropTypes.func,
  initializeChrome: PropTypes.func,
  isDisabled: PropTypes.bool,
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
 *     isDisabled: boolean, hideGlobalFilter: Function}}
 */
Authentication.defaultProps = {
  appName: routerHelpers.appName,
  authorizeUser: reduxActions.user.authorizeUser,
  hideGlobalFilter: reduxActions.platform.hideGlobalFilter,
  initializeChrome: reduxActions.platform.initializeChrome,
  isDisabled: helpers.UI_DISABLED,
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
