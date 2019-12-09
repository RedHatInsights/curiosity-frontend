import { userTypes } from '../types';
import userService from '../../services/userServices';

const authorizeUser = () => dispatch =>
  dispatch({
    type: userTypes.USER_AUTH,
    payload: userService.authorizeUser()
  });

const getLocale = () => ({
  type: userTypes.USER_LOCALE,
  payload: userService.getLocale()
});

const userActions = { authorizeUser, getLocale };

export { userActions as default, userActions, authorizeUser, getLocale };
