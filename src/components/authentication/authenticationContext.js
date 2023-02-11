import React, { useContext, useState } from 'react';
import { useMount, useUnmount } from 'react-use';
import { reduxActions, storeHooks } from '../../redux';
import { helpers } from '../../common';
import { routerContext, routerHelpers } from '../router';

/**
 * Base context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{}, helpers.noop];

const AuthenticationContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated authentication context.
 *
 * @returns {React.Context<{}>}
 */
const useAuthContext = () => useContext(AuthenticationContext);

/**
 * Initialize an app, and return a combined state store that includes authorization, locale, and API errors
 *
 * @param {object} options
 * @param {string} options.appName
 * @param {Function} options.authorizeUser
 * @param {Function} options.hideGlobalFilter
 * @param {Function} options.onNavigation
 * @param {Function} options.setAppName
 * @param {Function} options.useDispatch
 * @param {Function} options.useHistory
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: {errorCodes, errorStatus: *, locale}, pending: boolean, fulfilled: boolean, error: boolean}}
 */
const useGetAuthorization = ({
  appName = routerHelpers.appName,
  authorizeUser = reduxActions.platform.authorizeUser,
  hideGlobalFilter = reduxActions.platform.hideGlobalFilter,
  onNavigation = reduxActions.platform.onNavigation,
  setAppName = reduxActions.platform.setAppName,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useHistory: useAliasHistory = routerContext.useHistory,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const [unregister, setUnregister] = useState(() => helpers.noop);
  const history = useAliasHistory();
  const dispatch = useAliasDispatch();
  const { data, error, fulfilled, pending, responses } = useAliasSelectorsResponse([
    { id: 'auth', selector: ({ user }) => user?.auth },
    { id: 'locale', selector: ({ user }) => user?.locale },
    {
      id: 'errors',
      selector: ({ user }) => (user?.errors?.error === true && user.errors) || { fulfilled: true, data: [] }
    }
  ]);

  useMount(async () => {
    await dispatch(authorizeUser());
    dispatch([setAppName(appName), hideGlobalFilter()]);
    setUnregister(() => dispatch(onNavigation(event => history.push(event.navId))));
  });

  useUnmount(() => {
    unregister();
  });

  const [user = {}, app = {}] = (Array.isArray(data.auth) && data.auth) || [];
  const errorStatus = (error && responses?.id?.errors?.status) || null;

  return {
    data: {
      ...user,
      ...app,
      locale: data.locale,
      errorCodes: data.errors,
      errorStatus
    },
    error,
    fulfilled,
    pending
  };
};

/**
 * Return session data from authentication context.
 *
 * @param {Function} useAliasAuthContext
 * @returns {{errorCodes, errorStatus: *, locale}}
 */
const useSession = ({ useAuthContext: useAliasAuthContext = useAuthContext } = {}) => {
  const session = useAliasAuthContext();
  return {
    ...session
  };
};

const context = {
  AuthenticationContext,
  DEFAULT_CONTEXT,
  useAuthContext,
  useGetAuthorization,
  useSession
};

export {
  context as default,
  context,
  AuthenticationContext,
  DEFAULT_CONTEXT,
  useAuthContext,
  useGetAuthorization,
  useSession
};
