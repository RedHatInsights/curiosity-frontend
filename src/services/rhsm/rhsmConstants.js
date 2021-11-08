/**
 * ToDo: migrate to using rhsmConstants only!
 * Exporting rhsmConstants through rhsmApiTypes is currently considered a stop-gap during migration to the
 * schema validator.
 */
/**
 * RHSM path IDs for products.
 *
 * @type {{RHEL_ARM: string, OPENSHIFT_METRICS: string, SATELLITE: string, RHEL_WORKSTATION: string,
 *     RHOSAK: string, RHEL_COMPUTE_NODE: string, RHEL_X86: string, OPENSHIFT: string, SATELLITE_SERVER: string,
 *     OPENSHIFT_DEDICATED_METRICS: string, RHEL_DESKTOP: string, RHEL: string, SATELLITE_CAPSULE: string,
 *     RHEL_SERVER: string, RHEL_IBM_Z: string, RHEL_IBM_POWER: string}}
 */
const RHSM_API_PATH_PRODUCT_TYPES = {
  RHEL: 'RHEL',
  RHEL_COMPUTE_NODE: 'RHEL Compute Node',
  RHEL_DESKTOP: 'RHEL Desktop',
  RHEL_SERVER: 'RHEL Server',
  RHEL_WORKSTATION: 'RHEL Workstation',
  RHEL_ARM: 'RHEL for ARM',
  RHEL_IBM_POWER: 'RHEL for IBM Power',
  RHEL_IBM_Z: 'RHEL for IBM z',
  RHEL_X86: 'RHEL for x86',
  RHOSAK: 'rhosak',
  OPENSHIFT: 'OpenShift Container Platform',
  OPENSHIFT_METRICS: 'OpenShift-metrics',
  OPENSHIFT_DEDICATED_METRICS: 'OpenShift-dedicated-metrics',
  SATELLITE: 'Satellite',
  SATELLITE_CAPSULE: 'Satellite Capsule',
  SATELLITE_SERVER: 'Satellite Server'
};

/**
 * RHSM path IDs for metrics.
 *
 * @type {{CORES: string, STORAGE_GIBIBYTES: string, SOCKETS: string, INSTANCE_HOURS: string,
 *     TRANSFER_GIBIBYTES: string, CORE_SECONDS: string}}
 */
const RHSM_API_PATH_METRIC_TYPES = {
  CORES: 'Cores',
  SOCKETS: 'Sockets',
  CORE_SECONDS: 'Core-seconds',
  INSTANCE_HOURS: 'Instance-hours',
  STORAGE_GIBIBYTES: 'Storage-gibibytes',
  TRANSFER_GIBIBYTES: 'Transfer-gibibytes'
};

/**
 * RHSM response meta type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_DATA = 'data';

/**
 * RHSM response meta type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_META = 'meta';

/**
 * RHSM response Tally DATA types.
 *
 * @type {{DATE: string, HAS_DATA: string, VALUE: string}}
 */
const RHSM_API_RESPONSE_TALLY_DATA_TYPES = {
  DATE: 'date',
  VALUE: 'value',
  HAS_DATA: 'has_data'
};

/**
 * RHSM response Tally META types.
 *
 * @type {{TOTAL_MONTHLY: string, DATE: string, HAS_CLOUDIGRADE_DATA: string, PRODUCT: string,
 *     HAS_CLOUDIGRADE_MISMATCH: string, HAS_DATA: string, METRIC_ID: string, COUNT: string, VALUE: string}}
 */
const RHSM_API_RESPONSE_TALLY_META_TYPES = {
  COUNT: 'count',
  DATE: 'date',
  VALUE: 'value',
  HAS_CLOUDIGRADE_DATA: 'has_cloudigrade_data',
  HAS_CLOUDIGRADE_MISMATCH: 'has_cloudigrade_mismatch',
  HAS_DATA: 'has_data',
  METRIC_ID: 'metric_id',
  PRODUCT: 'product',
  TOTAL_MONTHLY: 'total_monthly'
};

/**
 * RHSM response error codes.
 *
 * @type {{GENERIC: string, OPTIN: string}}
 */
const RHSM_API_RESPONSE_ERROR_CODE_TYPES = {
  GENERIC: 'SUBSCRIPTIONS1003',
  OPTIN: 'SUBSCRIPTIONS1004'
};

/**
 * RHSM response, query parameters for GRANULARITY.
 *
 * @type {{WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string}}
 */
const RHSM_API_RESPONSE_GRANULARITY_TYPES = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly'
};

/**
 * RHSM response, query parameters for SLA.
 *
 * @type {{PREMIUM: string, SELF: string, NONE: string, STANDARD: string}}
 */
const RHSM_API_RESPONSE_SLA_TYPES = {
  PREMIUM: 'Premium',
  STANDARD: 'Standard',
  SELF: 'Self-Support',
  NONE: ''
};

/**
 * RHSM response, query parameters for UOM.
 *
 * @type {{CORES: string, SOCKETS: string}}
 */
const RHSM_API_RESPONSE_UOM_TYPES = {
  CORES: 'cores',
  SOCKETS: 'sockets'
};

/**
 * RHSM response, query parameters for USAGE.
 *
 * @type {{UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string}}
 */
const RHSM_API_RESPONSE_USAGE_TYPES = {
  PRODUCTION: 'Production',
  DEVELOPMENT: 'Development/Test',
  DISASTER: 'Disaster Recovery',
  UNSPECIFIED: ''
};

const RHSM_API_QUERY_GRANULARITY_TYPES = RHSM_API_RESPONSE_GRANULARITY_TYPES;

const RHSM_API_QUERY_SLA_TYPES = RHSM_API_RESPONSE_SLA_TYPES;

const RHSM_API_QUERY_UOM_TYPES = RHSM_API_RESPONSE_UOM_TYPES;

const RHSM_API_QUERY_USAGE_TYPES = RHSM_API_RESPONSE_USAGE_TYPES;

/**
 * RHSM query parameter options for TALLY, CAPACITY endpoints.
 *
 * @type {{GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string, START_DATE: string}}
 */
const RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES = {
  END_DATE: 'ending',
  GRANULARITY: 'granularity',
  SLA: 'sla',
  START_DATE: 'beginning',
  USAGE: 'usage'
};

/**
 * Aggregate all query set types.
 *
 * @type {{GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string, START_DATE: string}}
 */
const RHSM_API_QUERY_SET_TYPES = {
  ...RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES
};

/**
 * RHSM constants.
 *
 * @type {{RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES: {GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string,
 *     START_DATE: string}, RHSM_API_RESPONSE_DATA: string, RHSM_API_PATH_PRODUCT_TYPES: {RHEL_ARM: string,
 *     OPENSHIFT_METRICS: string, SATELLITE: string, RHEL_WORKSTATION: string, RHOSAK: string, RHEL_COMPUTE_NODE: string,
 *     RHEL_X86: string, OPENSHIFT: string, SATELLITE_SERVER: string, OPENSHIFT_DEDICATED_METRICS: string,
 *     RHEL_DESKTOP: string, RHEL: string, SATELLITE_CAPSULE: string, RHEL_SERVER: string, RHEL_IBM_Z: string,
 *     RHEL_IBM_POWER: string}, RHSM_API_PATH_METRIC_TYPES: {CORES: string, STORAGE_GIBIBYTES: string, SOCKETS: string,
 *     INSTANCE_HOURS: string, TRANSFER_GIBIBYTES: string, CORE_SECONDS: string},
 *     RHSM_API_RESPONSE_TALLY_DATA_TYPES: {DATE: string, HAS_DATA: string, VALUE: string},
 *     RHSM_API_RESPONSE_SLA_TYPES: {PREMIUM: string, SELF: string, NONE: string, STANDARD: string},
 *     RHSM_API_QUERY_USAGE_TYPES: {UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string},
 *     RHSM_API_RESPONSE_ERROR_CODE_TYPES: {GENERIC: string, OPTIN: string}, RHSM_API_QUERY_SLA_TYPES: {PREMIUM: string,
 *     SELF: string, NONE: string, STANDARD: string}, RHSM_API_RESPONSE_TALLY_META_TYPES: {TOTAL_MONTHLY: string,
 *     DATE: string, HAS_CLOUDIGRADE_DATA: string, PRODUCT: string, HAS_CLOUDIGRADE_MISMATCH: string, HAS_DATA: string,
 *     METRIC_ID: string, COUNT: string, VALUE: string}, RHSM_API_QUERY_UOM_TYPES: {CORES: string, SOCKETS: string},
 *     RHSM_API_QUERY_GRANULARITY_TYPES: {WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string},
 *     RHSM_API_RESPONSE_META: string, RHSM_API_RESPONSE_UOM_TYPES: {CORES: string, SOCKETS: string},
 *     RHSM_API_RESPONSE_GRANULARITY_TYPES: {WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string},
 *     RHSM_API_QUERY_SET_TYPES: {GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string, START_DATE: string},
 *     RHSM_API_RESPONSE_USAGE_TYPES: {UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string}}}
 */
const rhsmConstants = {
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_RESPONSE_DATA,
  RHSM_API_RESPONSE_META,
  RHSM_API_RESPONSE_TALLY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_META_TYPES,
  RHSM_API_RESPONSE_ERROR_CODE_TYPES,
  RHSM_API_RESPONSE_GRANULARITY_TYPES,
  RHSM_API_RESPONSE_SLA_TYPES,
  RHSM_API_RESPONSE_UOM_TYPES,
  RHSM_API_RESPONSE_USAGE_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_TYPES
};

export {
  rhsmConstants as default,
  rhsmConstants,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_RESPONSE_DATA,
  RHSM_API_RESPONSE_META,
  RHSM_API_RESPONSE_TALLY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_META_TYPES,
  RHSM_API_RESPONSE_ERROR_CODE_TYPES,
  RHSM_API_RESPONSE_GRANULARITY_TYPES,
  RHSM_API_RESPONSE_SLA_TYPES,
  RHSM_API_RESPONSE_UOM_TYPES,
  RHSM_API_RESPONSE_USAGE_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_TYPES
};
