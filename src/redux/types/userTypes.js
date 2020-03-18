const USER_AUTH = 'USER_AUTH';
const USER_LOCALE = 'USER_LOCALE';
const USER_LOGOUT = 'USER_LOGOUT';

/**
 * User action, reducer types.
 *
 * @type {{USER_LOGOUT: string, USER_AUTH: string, USER_LOCALE: string}}
 */
const userTypes = { USER_AUTH, USER_LOCALE, USER_LOGOUT };

export { userTypes as default, userTypes, USER_AUTH, USER_LOCALE, USER_LOGOUT };
