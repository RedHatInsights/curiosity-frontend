import { userTypes } from '../types';
import { userServices } from '../../services/userServices';

/**
 * Get an emulated API response from the platforms "getUser" method.
 *
 * @returns {Function}
 */
const authorizeUser = () => dispatch =>
  dispatch({
    type: userTypes.USER_AUTH,
    payload: userServices.authorizeUser()
  });

/**
 * Get a user's locale.
 *
 * @returns {{payload: Promise<{data: void}>, type: string}}
 */
const getLocale = () => ({
  type: userTypes.USER_LOCALE,
  payload: userServices.getLocale()
});

const userActions = { authorizeUser, getLocale };

export { userActions as default, userActions, authorizeUser, getLocale };
