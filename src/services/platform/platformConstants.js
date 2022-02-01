/**
 * Platform response entitlements type.
 *
 * @type {string}
 */
const PLATFORM_API_RESPONSE_USER_ENTITLEMENTS = 'entitlements';

/**
 * Platform response of ENTITLEMENTS type values.
 * Schema/map of expected response entitlement types.
 *
 * @type {{ENTITLED: string}}
 */
const PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES = {
  ENTITLED: 'is_entitled'
};

/**
 * Platform response identity type.
 *
 * @type {string}
 */
const PLATFORM_API_RESPONSE_USER_IDENTITY = 'identity';

/**
 * Platform response of IDENTITY type values.
 * Schema/map of expected response identity types.
 *
 * @type {{USER: string}}
 */
const PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES = {
  USER: 'user'
};

/**
 * Platform response of IDENTITY USER type values.
 * Schema/map of expected response identity user types.
 *
 * @type {{ORG_ADMIN: string}}
 */
const PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES = {
  ORG_ADMIN: 'is_org_admin'
};

/**
 * Platform response of USER PERMISSION type values.
 * Schema/map of expected response identity user permission types.
 *
 * @type {{PERMISSION: string, RESOURCE_DEFS: string}}
 */
const PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES = {
  PERMISSION: 'permission',
  RESOURCE_DEFS: 'resourceDefinitions'
};

// ToDo: clean up this app name piece, these facets come through the helpers and src/config/rbac.json
const PLATFORM_API_RESPONSE_USER_PERMISSION_APP_TYPES = {
  SUBSCRIPTIONS: process.env.REACT_APP_UI_NAME
};

const PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES = {
  ALL: '*'
};

const PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES = {
  ALL: '*',
  READ: 'read',
  WRITE: 'write'
};

const platformConstants = {
  PLATFORM_API_RESPONSE_USER_ENTITLEMENTS,
  PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES,
  PLATFORM_API_RESPONSE_USER_IDENTITY,
  PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES,
  PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_APP_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES
};

export {
  platformConstants as default,
  platformConstants,
  PLATFORM_API_RESPONSE_USER_ENTITLEMENTS,
  PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES,
  PLATFORM_API_RESPONSE_USER_IDENTITY,
  PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES,
  PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_APP_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES
};
