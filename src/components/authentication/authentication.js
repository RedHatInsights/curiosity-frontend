import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BinocularsIcon } from '@patternfly/react-icons';
import { Maintenance } from '@redhat-cloud-services/frontend-components/Maintenance';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useMount, useUnmount } from 'react-use';
import { reduxActions, storeHooks } from '../../redux';
import { routerHooks } from '../../hooks/useRouter';
import { routerHelpers, Redirect } from '../router';
import { rhsmApiTypes } from '../../types';
import { helpers } from '../../common';
import MessageView from '../messageView/messageView';
import { translate } from '../i18n/i18n';
import { AuthenticationContext, useAuth } from './authenticationContext';

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
 * @param {Function} props.setAppName
 * @param {Function} props.t
 * @param {Function} props.useAuth
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
  setAppName,
  t,
  useAuth: useAliasAuth,
  useDispatch: useAliasDispatch,
  useHistory: useAliasHistory
}) => {
  const [unregister, setUnregister] = useState(() => helpers.noop);
  const dispatch = useAliasDispatch();
  const history = useAliasHistory();

  const { pending, data: authData = {} } = useAliasAuth();
  const { authorized = {}, errorCodes, errorStatus } = authData;
  const { [appName]: isAuthorized } = authorized;

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

  const renderContent = () => {
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
      errorStatus === 418
    ) {
      return <Redirect route={routerHelpers.getErrorRoute.path} />;
    }

    return (
      <MessageView>
        <NotAuthorized serviceName={helpers.UI_DISPLAY_NAME} />
      </MessageView>
    );
  };

  return <AuthenticationContext.Provider value={authData}>{renderContent()}</AuthenticationContext.Provider>;
};

/**
 * Prop types.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, useHistory: Function, setAppName: Function, t: Function,
 *     children: React.ReactNode, appName: string, initializeChrome: Function, useDispatch: Function,
 *     isDisabled: boolean, useAuth: Function,hideGlobalFilter: Function}}
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
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useHistory: PropTypes.func,
  useAuth: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{authorizeUser: Function, onNavigation: Function, useHistory: Function, setAppName: Function, t: Function,
 *     appName: string, initializeChrome: Function, useDispatch: Function, isDisabled: boolean, useAuth: Function,
 *     hideGlobalFilter: Function}}
 */
Authentication.defaultProps = {
  appName: routerHelpers.appName,
  authorizeUser: reduxActions.platform.authorizeUser,
  hideGlobalFilter: reduxActions.platform.hideGlobalFilter,
  initializeChrome: reduxActions.platform.initializeChrome,
  isDisabled: helpers.UI_DISABLED,
  onNavigation: reduxActions.platform.onNavigation,
  setAppName: reduxActions.platform.setAppName,
  t: translate,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useHistory: routerHooks.useHistory,
  useAuth
};

export { Authentication as default, Authentication };
