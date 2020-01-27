import { userTypes } from '../types';
import { userServices } from '../../services/userServices';

const authorizeUser = () => dispatch =>
  dispatch({
    type: userTypes.USER_AUTH,
    payload: userServices.authorizeUser()
  });

const getLocale = () => ({
  type: userTypes.USER_LOCALE,
  payload: userServices.getLocale()
});

const userActions = { authorizeUser, getLocale };

export { userActions as default, userActions, authorizeUser, getLocale };
