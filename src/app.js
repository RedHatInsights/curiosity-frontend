import React from 'react';
import { useMount } from 'react-use';
import { reduxActions, storeHooks } from './redux';
import { I18n } from './components/i18n/i18n';
import { Notifications } from './components/notifications/notifications';
import { Authentication } from './components/authentication/authentication';
import { Loader } from './components/loader/loader';
const ProductView = React.lazy(() => import('./components/productView/productView'));

/**
 * @memberof Base
 * @module App
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

  useMount(() => {
    if (!locale) {
      dispatch(getLocale());
    }
  });

  return (
    <I18n locale={locale}>
      <Notifications>
        <Authentication>
          <React.Suspense fallback={<Loader variant="title" />}>
            <ProductView />
          </React.Suspense>
        </Authentication>
      </Notifications>
    </I18n>
  );
};

export { App as default, App };
