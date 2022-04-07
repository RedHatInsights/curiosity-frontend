import React from 'react';
import PropTypes from 'prop-types';
import { useMount } from 'react-use';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { reduxActions, storeHooks } from './redux';
import { I18n } from './components/i18n/i18n';
import { Router } from './components/router';
import Authentication from './components/authentication/authentication';

/**
 * Application
 *
 * @param {object} props
 * @param {Function} props.getLocale
 * @param {Function} props.useDispatch
 * @param {Function} props.useSelector
 * @returns {Node}
 */
const App = ({ getLocale, useDispatch: useAliasDispatch, useSelector: useAliasSelector }) => {
  const dispatch = useAliasDispatch();
  const { value: locale } = useAliasSelector(({ user }) => user?.locale?.data, {});

  useMount(() => {
    dispatch(getLocale());
  });

  return (
    <I18n locale={locale || null}>
      <NotificationsPortal />
      <Authentication>
        <Router />
      </Authentication>
    </I18n>
  );
};

/**
 * Prop types.
 *
 * @type {{useSelector: Function, useDispatch: Function, getLocale: Function}}
 */
App.propTypes = {
  getLocale: PropTypes.func,
  useDispatch: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useSelector: Function, useDispatch: Function, getLocale: Function}}
 */
App.defaultProps = {
  getLocale: reduxActions.user.getLocale,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useSelector: storeHooks.reactRedux.useSelector
};

export { App as default, App };
