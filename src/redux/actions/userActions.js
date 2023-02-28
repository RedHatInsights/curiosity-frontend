import { userTypes } from '../types';
import { userServices } from '../../services/user/userServices';
import { helpers } from '../../common/helpers';
import { translate } from '../../components/i18n/i18n';

/**
 * User, and RHSM, service wrappers for dispatch, state update.
 *
 * @memberof Actions
 * @module UserActions
 */

/**
 * Get a user's locale.
 *
 * @returns {{payload: Promise<{data: void}>, type: string}}
 */
const getLocale = () => dispatch =>
  dispatch({
    type: userTypes.USER_LOCALE,
    payload: userServices.getLocale()
  });

/**
 * Delete a user's opt-in.
 *
 * @returns {Function}
 */
const deleteAccountOptIn = () => dispatch =>
  dispatch({
    type: userTypes.DELETE_USER_OPTIN,
    payload: userServices.deleteAccountOptIn(),
    meta: {
      notifications: {}
    }
  });

/**
 * Get a user's opt-in config.
 *
 * @returns {Function}
 */
const getAccountOptIn = () => dispatch =>
  dispatch({
    type: userTypes.GET_USER_OPTIN,
    payload: userServices.getAccountOptIn(),
    meta: {
      notifications: {}
    }
  });

/**
 * Update a user's opt-in.
 *
 * @param {object} query
 * @returns {Function}
 */
const updateAccountOptIn =
  (query = {}) =>
  dispatch =>
    dispatch({
      type: userTypes.UPDATE_USER_OPTIN,
      payload: userServices.updateAccountOptIn(query),
      meta: {
        query,
        notifications: {
          rejected: {
            variant: 'danger',
            title: translate('curiosity-optin.notificationsErrorTitle', { appName: helpers.UI_DISPLAY_NAME }),
            description: translate('curiosity-optin.notificationsErrorDescription'),
            dismissable: true
          },
          fulfilled: {
            variant: 'success',
            title: translate('curiosity-optin.notificationsSuccessTitle', { appName: helpers.UI_DISPLAY_NAME }),
            description: translate('curiosity-optin.notificationsSuccessDescription'),
            dismissable: true,
            autoDismiss: false
          }
        }
      }
    });

const userActions = { getLocale, deleteAccountOptIn, getAccountOptIn, updateAccountOptIn };

export { userActions as default, userActions, getLocale, deleteAccountOptIn, getAccountOptIn, updateAccountOptIn };
