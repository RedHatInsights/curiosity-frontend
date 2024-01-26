import React, { useContext } from 'react';
import { useMount } from 'react-use';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { reduxActions, storeHooks } from '../../redux';
import { helpers } from '../../common';
import { routerHelpers } from '../router';

/**
 * @memberof Authentication
 * @module AuthenticationContext
 */

/**
 * Authentication context.
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
 * @param {Function} options.useChrome
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: {errorCodes, errorStatus: *, locale}, pending: boolean, fulfilled: boolean, error: boolean}}
 */
const useGetAuthorization = ({
  appName = routerHelpers.appName,
  authorizeUser = reduxActions.platform.authorizeUser,
  hideGlobalFilter = reduxActions.platform.hideGlobalFilter,
  useChrome: useAliasChrome = useChrome,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const dispatch = useAliasDispatch();
  const { updateDocumentTitle = helpers.noop } = useAliasChrome();
  const { data, error, fulfilled, pending, responses } = useAliasSelectorsResponse([
    { id: 'auth', selector: ({ app }) => app?.auth },
    { id: 'locale', selector: ({ app }) => app?.locale },
    {
      id: 'errors',
      selector: ({ app }) => (app?.errors?.error === true && app.errors) || { fulfilled: true, data: [] }
    }
  ]);

  useMount(async () => {
    await dispatch(authorizeUser());
    updateDocumentTitle(appName);
    dispatch([hideGlobalFilter()]);
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
