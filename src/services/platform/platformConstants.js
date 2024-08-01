/**
 * @memberof Platform
 * @module PlatformConstants
 */

/**
 * Platform Export response data type.
 *
 * @type {string}
 */
const PLATFORM_API_EXPORT_RESPONSE_DATA = 'data';

/**
 * Platform Export response meta type.
 *
 * @type {string}
 */
const PLATFORM_API_EXPORT_RESPONSE_META = 'meta';

/**
 * Platform Export, available application types.
 *
 * @type {{SUBSCRIPTIONS: string}}
 */
const PLATFORM_API_EXPORT_APPLICATION_TYPES = {
  SUBSCRIPTIONS: 'subscriptions'
};

/**
 * Platform Export, available resource types for related application types.
 *
 * @type {{SUBSCRIPTIONS: string, INSTANCES: string}}
 */
const PLATFORM_API_EXPORT_RESOURCE_TYPES = {
  INSTANCES: 'instances',
  SUBSCRIPTIONS: 'subscriptions'
};

/**
 * Platform Export, available content types.
 *
 * @type {{CSV: string, JSON: string}}
 */
const PLATFORM_API_EXPORT_CONTENT_TYPES = {
  CSV: 'csv',
  JSON: 'json'
};

/**
 * Platform Export, export filename prefix
 *
 * @type {string}
 */
const PLATFORM_API_EXPORT_FILENAME_PREFIX = 'swatch';

/**
 * Platform Export, available status types.
 *
 * @type {{COMPLETE: string, FAILED: string, RUNNING: string, PARTIAL: string, PENDING: string}}
 */
const PLATFORM_API_EXPORT_STATUS_TYPES = {
  FAILED: 'failed',
  COMPLETE: 'complete',
  PARTIAL: 'partial',
  PENDING: 'pending',
  RUNNING: 'running'
};

/**
 * Platform Export, available response, POST source types.
 *
 * @type {{APPLICATION: string, FILTERS: string, RESOURCE: string}}
 */
const PLATFORM_API_EXPORT_SOURCE_TYPES = {
  APPLICATION: 'application',
  FILTERS: 'filters',
  RESOURCE: 'resource'
};

/**
 * Platform Export, available POST types.
 *
 * @type {{SOURCES: string, FORMAT: string, EXPIRES_AT: string, NAME: string}}
 */
const PLATFORM_API_EXPORT_POST_TYPES = {
  EXPIRES_AT: 'expires_at',
  FORMAT: 'format',
  NAME: 'name',
  SOURCES: 'sources'
};

/**
 * Platform Export, available SUBSCRIPTION FILTER POST types.
 *
 * @type {{BILLING_ACCOUNT_ID: string, USAGE: string, CATEGORY: string, METRIC_ID: string, SLA: string,
 *     BILLING_PROVIDER: string, PRODUCT_ID: string}}
 */
const PLATFORM_API_EXPORT_POST_SUBSCRIPTIONS_FILTER_TYPES = {
  BILLING_PROVIDER: 'billing_provider',
  BILLING_ACCOUNT_ID: 'billing_account_id',
  CATEGORY: 'category',
  METRIC_ID: 'metric_id',
  PRODUCT_ID: 'product_id',
  SLA: 'sla',
  USAGE: 'usage'
};

/**
 * Platform Export, available response types.
 *
 * @type {{STATUS: string, FORMAT: string, EXPIRES_AT: string, ID: string, NAME: string}}
 */
const PLATFORM_API_EXPORT_RESPONSE_TYPES = {
  EXPIRES_AT: 'expires_at',
  FORMAT: 'format',
  ID: 'id',
  NAME: 'name',
  STATUS: 'status'
};

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
  PLATFORM_API_EXPORT_APPLICATION_TYPES,
  PLATFORM_API_EXPORT_CONTENT_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX,
  PLATFORM_API_EXPORT_POST_TYPES,
  PLATFORM_API_EXPORT_POST_SUBSCRIPTIONS_FILTER_TYPES,
  PLATFORM_API_EXPORT_RESOURCE_TYPES,
  PLATFORM_API_EXPORT_RESPONSE_DATA,
  PLATFORM_API_EXPORT_RESPONSE_META,
  PLATFORM_API_EXPORT_RESPONSE_TYPES,
  PLATFORM_API_EXPORT_SOURCE_TYPES,
  PLATFORM_API_EXPORT_STATUS_TYPES,
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
  PLATFORM_API_EXPORT_APPLICATION_TYPES,
  PLATFORM_API_EXPORT_CONTENT_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX,
  PLATFORM_API_EXPORT_POST_TYPES,
  PLATFORM_API_EXPORT_POST_SUBSCRIPTIONS_FILTER_TYPES,
  PLATFORM_API_EXPORT_RESOURCE_TYPES,
  PLATFORM_API_EXPORT_RESPONSE_DATA,
  PLATFORM_API_EXPORT_RESPONSE_META,
  PLATFORM_API_EXPORT_RESPONSE_TYPES,
  PLATFORM_API_EXPORT_SOURCE_TYPES,
  PLATFORM_API_EXPORT_STATUS_TYPES,
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
