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
 * @type {{PERMISSION: string}}
 */
const PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES = {
  PERMISSION: 'permission',
  RESOURCE_DEFS: 'resourceDefinitions'
};

/**
 * Platform API types.
 *
 * @type {{PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES: {USER: string},
 *     PLATFORM_API_RESPONSE_USER_ENTITLEMENTS: string, PLATFORM_API_RESPONSE_USER_IDENTITY: string,
 *     PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES: {ENTITLED: string},
 *     PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES: {ORG_ADMIN: string}}}
 */
const platformApiTypes = {
  PLATFORM_API_RESPONSE_USER_ENTITLEMENTS,
  PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES,
  PLATFORM_API_RESPONSE_USER_IDENTITY,
  PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES,
  PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES
};

export {
  platformApiTypes as default,
  platformApiTypes,
  PLATFORM_API_RESPONSE_USER_ENTITLEMENTS,
  PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES,
  PLATFORM_API_RESPONSE_USER_IDENTITY,
  PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES,
  PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES
};
