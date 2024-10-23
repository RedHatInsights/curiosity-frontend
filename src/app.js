import React from 'react';
import { useMount } from 'react-use';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { reduxActions, storeHooks } from './redux';
import { I18n } from './components/i18n/i18n';
import { Authentication } from './components/authentication/authentication';
import { Loader } from './components/loader/loader';
import { helpers } from './common';
const ProductView = React.lazy(() => import('./components/productView/productView'));

/**
 * @memberof Base
 * @module App
 */

/**
 * ToDo: Investigate replacing NotificationsPortal
 * NotificationsPortal takes down the entire app when the parent Redux store is unavailable.
 */
/**
 * Curiosity application start.
 * - Loads locale
 * - Provides authentication
 *
 * @param {object} props
 * @param {reduxActions.user.getLocale} [props.getLocale=reduxActions.user.getLocale]
 * @param {storeHooks.reactRedux.useDispatch} [props.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {storeHooks.reactRedux.useSelector} [props.useSelector=storeHooks.reactRedux.useSelector]
 * @returns {JSX.Element}
 */
const App = ({
  getLocale = reduxActions.user.getLocale,
  useDispatch = storeHooks.reactRedux.useDispatch,
  useSelector = storeHooks.reactRedux.useSelector
}) => {
  const dispatch = useDispatch();
  const { value: locale } = useSelector(({ app }) => app?.locale?.data, {});
  let platformNotifications = null;

  useMount(() => {
    if (!locale) {
      dispatch(getLocale());
    }
  });

  if (!helpers.UI_DISABLED_NOTIFICATIONS) {
    platformNotifications = <NotificationsPortal />;
  }

  return (
    <I18n locale={locale}>
      {platformNotifications}
      <Authentication>
        <React.Suspense fallback={<Loader variant="title" />}>
          <ProductView />
        </React.Suspense>
      </Authentication>
    </I18n>
  );
};

export { App as default, App };
