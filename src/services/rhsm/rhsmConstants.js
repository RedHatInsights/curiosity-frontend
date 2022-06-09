/**
 * ToDo: migrate to using rhsmConstants only!
 * Exporting rhsmConstants through rhsmApiTypes is currently considered a stop-gap during migration to the
 * schema validator.
 */
/**
 * RHSM path IDs for products.
 *
 * @type {{RHEL_ARM: string, OPENSHIFT_METRICS: string, SATELLITE: string, RHEL_WORKSTATION: string, RHODS: string, RHOSAK: string,
 *     RHEL_COMPUTE_NODE: string, RHEL_X86: string, OPENSHIFT: string, SATELLITE_SERVER: string, OPENSHIFT_DEDICATED_METRICS: string,
 *     RHEL_DESKTOP: string, RHEL: string, SATELLITE_CAPSULE: string, RHEL_SERVER: string, RHEL_IBM_Z: string, RHACS: string,
 *     RHEL_IBM_POWER: string}}
 */
const RHSM_API_PATH_PRODUCT_TYPES = {
  RHACS: 'rhacs',
  RHEL: 'RHEL',
  RHEL_COMPUTE_NODE: 'RHEL Compute Node',
  RHEL_DESKTOP: 'RHEL Desktop',
  RHEL_SERVER: 'RHEL Server',
  RHEL_WORKSTATION: 'RHEL Workstation',
  RHEL_ARM: 'RHEL for ARM',
  RHEL_IBM_POWER: 'RHEL for IBM Power',
  RHEL_IBM_Z: 'RHEL for IBM z',
  RHEL_X86: 'RHEL for x86',
  RHODS: 'rhods',
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
 *     TRANSFER_GIBIBYTES: string, CORE_SECONDS: string, STORAGE_GIBIBYTE_MONTHS: string}}
 */
const RHSM_API_PATH_METRIC_TYPES = {
  CORES: 'Cores',
  SOCKETS: 'Sockets',
  CORE_SECONDS: 'Core-seconds',
  INSTANCE_HOURS: 'Instance-hours',
  STORAGE_GIBIBYTES: 'Storage-gibibytes',
  STORAGE_GIBIBYTE_MONTHS: 'Storage-gibibyte-months',
  TRANSFER_GIBIBYTES: 'Transfer-gibibytes'
};

/**
 * RHSM response data type.
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
 * RHSM response general meta types.
 *
 * @type {{PRODUCT: string, COUNT: string}}
 */
const RHSM_API_RESPONSE_META_TYPES = {
  COUNT: 'count',
  PRODUCT: 'product'
};

/**
 * RHSM response errors type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_ERRORS = 'errors';

/**
 * RHSM response errors types.
 *
 * @type {{CODE: string}}
 */
const RHSM_API_RESPONSE_ERRORS_TYPES = {
  CODE: 'code'
};

/**
 * RHSM response error codes.
 *
 * @type {{GENERIC: string, OPTIN: string}}
 */
const RHSM_API_RESPONSE_ERRORS_CODE_TYPES = {
  GENERIC: 'SUBSCRIPTIONS1003',
  OPTIN: 'SUBSCRIPTIONS1004'
};

/**
 * FixMe: Appears we combined future guests used with instances. Investigate moving "INVENTORY_ID" and "SUBSCRIPTION_MANAGER_ID".
 * They're current associated with "hosts" guests. Need to also determine if this is something that needs to be added to "instances"
 * or if keeping them added to guests only is enough.
 */
/**
 * RHSM response Instance DATA types.
 *
 * @type {{MEASUREMENTS: string, BILLING_ACCOUNT_ID: string, SUBSCRIPTION_MANAGER_ID: string, INVENTORY_ID: string,
 *     NUMBER_OF_GUESTS: string, BILLING_PROVIDER: string, DISPLAY_NAME: string, LAST_SEEN: string}}
 */
const RHSM_API_RESPONSE_INSTANCES_DATA_TYPES = {
  BILLING_PROVIDER: 'billing_provider',
  BILLING_ACCOUNT_ID: 'billing_account_id',
  DISPLAY_NAME: 'display_name',
  INVENTORY_ID: 'inventory_id',
  LAST_SEEN: 'last_seen',
  MEASUREMENTS: 'measurements',
  NUMBER_OF_GUESTS: 'number_of_guests',
  SUBSCRIPTION_MANAGER_ID: 'subscription_manager_id'
};

/**
 * RHSM response Instances META types.
 *
 * @type {{MEASUREMENTS: string, PRODUCT: string, COUNT: string}}
 */
const RHSM_API_RESPONSE_INSTANCES_META_TYPES = {
  ...RHSM_API_RESPONSE_META_TYPES,
  MEASUREMENTS: 'measurements'
};

/**
 * RHSM response Subscriptions DATA types.
 *
 * @type {{BILLING_ACCOUNT_ID: string, QUANTITY: string, SUBSCRIPTION_MANAGER_ID: string, INVENTORY_ID: string,
 *     NUMBER_OF_GUESTS: string, HAS_INFINITE_QUANTITY: string, TOTAL_CAPACITY: string, PRODUCT_NAME: string,
 *     SERVICE_LEVEL: string, DISPLAY_NAME: string, MEASUREMENTS: string, UOM: string, NEXT_EVENT_DATE: string,
 *     BILLING_PROVIDER: string, LAST_SEEN: string}}
 */
const RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES = {
  ...RHSM_API_RESPONSE_INSTANCES_DATA_TYPES,
  HAS_INFINITE_QUANTITY: 'has_infinite_quantity',
  NEXT_EVENT_DATE: 'next_event_date',
  PRODUCT_NAME: 'product_name',
  QUANTITY: 'quantity',
  SERVICE_LEVEL: 'service_level',
  TOTAL_CAPACITY: 'total_capacity',
  UOM: 'uom'
};

/**
 * RHSM response Subscriptions META types.
 *
 * @type {{PRODUCT: string, SUBSCRIPTION_TYPE: string, COUNT: string}}
 */
const RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES = {
  ...RHSM_API_RESPONSE_META_TYPES,
  SUBSCRIPTION_TYPE: 'subscription_type'
};

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
 * RHSM response Capacity DATA types.
 *
 * @type {{CORES: string, DATE: string, SOCKETS: string, HAS_INFINITE_QUANTITY: string}}
 */
const RHSM_API_RESPONSE_CAPACITY_DATA_TYPES = {
  CORES: 'cores',
  DATE: 'date',
  HAS_INFINITE_QUANTITY: 'has_infinite_quantity',
  SOCKETS: 'sockets'
};

/**
 * RHSM response Tally META types.
 *
 * @type {{TOTAL_MONTHLY: string, DATE: string, PRODUCT: string, HAS_CLOUDIGRADE_DATA: string,
 *     HAS_CLOUDIGRADE_MISMATCH: string, HAS_DATA: string, METRIC_ID: string, COUNT: string, VALUE: string}}
 */
const RHSM_API_RESPONSE_TALLY_META_TYPES = {
  ...RHSM_API_RESPONSE_META_TYPES,
  DATE: 'date',
  VALUE: 'value',
  HAS_CLOUDIGRADE_DATA: 'has_cloudigrade_data',
  HAS_CLOUDIGRADE_MISMATCH: 'has_cloudigrade_mismatch',
  HAS_DATA: 'has_data',
  METRIC_ID: 'metric_id',
  TOTAL_MONTHLY: 'total_monthly'
};

/**
 * RHSM response Capacity META types.
 *
 * @type {{PRODUCT: string, METRIC_ID: string, COUNT: string}}
 */
const RHSM_API_RESPONSE_CAPACITY_META_TYPES = {
  ...RHSM_API_RESPONSE_META_TYPES,
  METRIC_ID: 'metric_id'
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
 * ToDo: Activate available provider type as it becomes available 202205
 * (just uncomment)
 */
/**
 * RHSM response, query parameters for BILLING_PROVIDER
 *
 * @type {{AZURE: string, GCP: string, RED_HAT: string, NONE: string, AWS: string, ORACLE: string}}
 */
const RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES = {
  RED_HAT: 'red hat',
  AWS: 'aws'
  // GCP: 'gcp',
  // AZURE: 'azure',
  // ORACLE: 'oracle',
  // NONE: ''
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
 * RHSM response, general parameters for subscription types
 *
 * @type {{ANNUAL: string, ON_DEMAND: string}}
 */
const RHSM_API_RESPONSE_SUBSCRIPTION_TYPES = {
  ANNUAL: 'Annual',
  ON_DEMAND: 'On-demand'
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

/**
 * RHSM query/search parameter CATEGORY type values for TALLY/CAPACITY.
 *
 * @type {{CLOUD: string, PHYSICAL: string, HYPERVISOR: string, VIRTUAL: string}}
 */
const RHSM_API_QUERY_CATEGORY_TYPES = {
  CLOUD: 'cloud',
  HYPERVISOR: 'hypervisor',
  PHYSICAL: 'physical',
  VIRTUAL: 'virtual'
};

const RHSM_API_QUERY_GRANULARITY_TYPES = RHSM_API_RESPONSE_GRANULARITY_TYPES;

/**
 * ToDo: Clean up sort params once hosts is fully deprecated
 * These sort params are focused on the instances api NOT hosts. Since there
 * are minor differences, hosts sort params are maintained in /types/rhsmApiTypes.js as
 * we migrate towards hosts deprecation. Subscriptions sorts
 */
/**
 * RHSM API query/search parameter SORT type values for HOSTS.
 *
 * @type {{CORES: string, STORAGE_GIBIBYTES: string, SOCKETS: string, INSTANCE_HOURS: string,
 *     TRANSFER_GIBIBYTES: string, BILLING_PROVIDER: string, CORE_SECONDS: string, LAST_SEEN: string, NAME: string}}
 */
const RHSM_API_QUERY_INVENTORY_SORT_TYPES = {
  ...RHSM_API_PATH_METRIC_TYPES,
  BILLING_PROVIDER: 'billing_provider',
  LAST_SEEN: 'last_seen',
  NAME: 'display_name'
};

/**
 * RHSM API query/search parameter SORT DIRECTION type values.
 *
 * @type {{ASCENDING: string, DESCENDING: string}}
 */
const RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES = {
  ASCENDING: 'asc',
  DESCENDING: 'desc'
};

/**
 * RHSM API query/search parameter SORT type values for SUBSCRIPTIONS.
 *
 * @type {{QUANTITY: string, USAGE: string, NEXT_EVENT_TYPE: string, NEXT_EVENT_DATE: string,
 *     TOTAL_CAPACITY: string, PRODUCT_NAME: string, SKU: string, SERVICE_LEVEL: string}}
 */
const RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES = {
  NEXT_EVENT_DATE: 'next_event_date',
  NEXT_EVENT_TYPE: 'next_event_type',
  PRODUCT_NAME: 'product_name',
  QUANTITY: 'quantity',
  SKU: 'sku',
  SERVICE_LEVEL: 'service_level',
  TOTAL_CAPACITY: 'total_capacity',
  USAGE: 'usage'
};

const RHSM_API_QUERY_BILLING_PROVIDER_TYPES = RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES;

const RHSM_API_QUERY_SLA_TYPES = RHSM_API_RESPONSE_SLA_TYPES;

const RHSM_API_QUERY_UOM_TYPES = RHSM_API_RESPONSE_UOM_TYPES;

const RHSM_API_QUERY_USAGE_TYPES = RHSM_API_RESPONSE_USAGE_TYPES;

/**
 * RHSM API query/search parameter INVENTORY type values.
 *
 * @type {{UOM: string, BILLING_ACCOUNT_ID: string, USAGE: string, DIRECTION: string, SORT: string,
 *     END_DATE: string, OFFSET: string, SLA: string, LIMIT: string, START_DATE: string,
 *     BILLING_PROVIDER: string, DISPLAY_NAME: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_TYPES = {
  BILLING_PROVIDER: 'billing_provider',
  BILLING_ACCOUNT_ID: 'billing_account_id',
  DIRECTION: 'dir',
  DISPLAY_NAME: 'display_name_contains',
  END_DATE: 'ending',
  LIMIT: 'limit',
  OFFSET: 'offset',
  SLA: 'sla',
  SORT: 'sort',
  START_DATE: 'beginning',
  UOM: 'uom',
  USAGE: 'usage'
};

/**
 * RHSM query parameter options for TALLY, CAPACITY endpoints.
 *
 * @type {{GRANULARITY: string, USAGE: string, CATEGORY: string, END_DATE: string, SLA: string, START_DATE: string,
 *     BILLING_PROVIDER: string}}
 */
const RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES = {
  BILLING_PROVIDER: 'billing_provider',
  CATEGORY: 'category',
  END_DATE: 'ending',
  GRANULARITY: 'granularity',
  SLA: 'sla',
  START_DATE: 'beginning',
  USAGE: 'usage'
};

/**
 * Aggregate all query set types.
 *
 * @type {{UOM: string, GRANULARITY: string, USAGE: string, DIRECTION: string, SORT: string, END_DATE: string,
 *     OFFSET: string, SLA: string, LIMIT: string, START_DATE: string, DISPLAY_NAME: string}}
 */
const RHSM_API_QUERY_SET_TYPES = {
  ...RHSM_API_QUERY_SET_INVENTORY_TYPES,
  ...RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES
};

/**
 * Product display types.
 *
 * @type {{DUAL_AXES: string, LEGACY: string, HOURLY: string}}
 */
const RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES = {
  DUAL_AXES: 'dual-axes',
  HOURLY: 'hourly',
  LEGACY: 'legacy'
};

/**
 * RHSM constants.
 *
 * @type {{RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES: {GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string, START_DATE: string,
 *     BILLING_PROVIDER: string}, RHSM_API_RESPONSE_DATA: string, RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES: {PRODUCT: string,
 *     SUBSCRIPTION_TYPE: string, COUNT: string}, RHSM_API_PATH_METRIC_TYPES: {CORES: string, STORAGE_GIBIBYTES: string, SOCKETS: string,
 *     INSTANCE_HOURS: string, TRANSFER_GIBIBYTES: string, CORE_SECONDS: string, STORAGE_GIBIBYTE_MONTHS: string},
 *     RHSM_API_RESPONSE_TALLY_DATA_TYPES: {DATE: string, HAS_DATA: string, VALUE: string},
 *     RHSM_API_RESPONSE_INSTANCES_META_TYPES: {MEASUREMENTS: string, PRODUCT: string, COUNT: string},
 *     RHSM_API_RESPONSE_INSTANCES_DATA_TYPES: {MEASUREMENTS: string, BILLING_ACCOUNT_ID: string, SUBSCRIPTION_MANAGER_ID: string,
 *     INVENTORY_ID: string, NUMBER_OF_GUESTS: string, BILLING_PROVIDER: string, DISPLAY_NAME: string, LAST_SEEN: string},
 *     RHSM_API_RESPONSE_SLA_TYPES: {PREMIUM: string, SELF: string, NONE: string, STANDARD: string},
 *     RHSM_API_RESPONSE_CAPACITY_META_TYPES: {PRODUCT: string, METRIC_ID: string, COUNT: string},
 *     RHSM_API_RESPONSE_CAPACITY_DATA_TYPES: {CORES: string, DATE: string, SOCKETS: string, HAS_INFINITE_QUANTITY: string},
 *     RHSM_API_RESPONSE_META_TYPES: {PRODUCT: string, COUNT: string}, RHSM_API_RESPONSE_ERRORS_CODE_TYPES: {GENERIC: string,
 *     OPTIN: string}, RHSM_API_QUERY_GRANULARITY_TYPES: {WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string},
 *     RHSM_API_RESPONSE_UOM_TYPES: {CORES: string, SOCKETS: string},
 *     RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES: {BILLING_ACCOUNT_ID: string, QUANTITY: string, SUBSCRIPTION_MANAGER_ID: string,
 *     INVENTORY_ID: string, NUMBER_OF_GUESTS: string, HAS_INFINITE_QUANTITY: string, TOTAL_CAPACITY: string, PRODUCT_NAME: string,
 *     SERVICE_LEVEL: string, DISPLAY_NAME: string, MEASUREMENTS: string, UOM: string, NEXT_EVENT_DATE: string, BILLING_PROVIDER: string,
 *     LAST_SEEN: string}, RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES: {ASCENDING: string, DESCENDING: string},
 *     RHSM_API_RESPONSE_SUBSCRIPTION_TYPES: {ANNUAL: string, ON_DEMAND: string}, RHSM_API_QUERY_INVENTORY_SORT_TYPES: {CORES: string,
 *     STORAGE_GIBIBYTES: string, SOCKETS: string, INSTANCE_HOURS: string, TRANSFER_GIBIBYTES: string, BILLING_PROVIDER: string,
 *     CORE_SECONDS: string, LAST_SEEN: string, NAME: string}, RHSM_API_PATH_PRODUCT_TYPES: {RHEL_ARM: string, OPENSHIFT_METRICS: string,
 *     SATELLITE: string, RHEL_WORKSTATION: string, RHODS: string, RHOSAK: string, RHEL_COMPUTE_NODE: string, RHEL_X86: string,
 *     OPENSHIFT: string, SATELLITE_SERVER: string, OPENSHIFT_DEDICATED_METRICS: string, RHEL_DESKTOP: string, RHEL: string,
 *     SATELLITE_CAPSULE: string, RHEL_SERVER: string, RHEL_IBM_Z: string, RHACS: string, RHEL_IBM_POWER: string},
 *     RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES: {AZURE: string, GCP: string, RED_HAT: string, NONE: string, AWS: string, ORACLE: string},
 *     RHSM_API_RESPONSE_ERRORS_TYPES: {CODE: string}, RHSM_API_QUERY_BILLING_PROVIDER_TYPES: {AZURE: string, GCP: string, RED_HAT: string,
 *     NONE: string, AWS: string, ORACLE: string}, RHSM_API_QUERY_USAGE_TYPES: {UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string,
 *     PRODUCTION: string}, RHSM_API_QUERY_SLA_TYPES: {PREMIUM: string, SELF: string, NONE: string, STANDARD: string},
 *     RHSM_API_QUERY_SET_INVENTORY_TYPES: {UOM: string, BILLING_ACCOUNT_ID: string, USAGE: string, DIRECTION: string, SORT: string,
 *     END_DATE: string, OFFSET: string, SLA: string, LIMIT: string, START_DATE: string, BILLING_PROVIDER: string, DISPLAY_NAME: string},
 *     RHSM_API_RESPONSE_ERRORS: string, RHSM_API_RESPONSE_TALLY_META_TYPES: {TOTAL_MONTHLY: string, DATE: string, PRODUCT: string,
 *     HAS_CLOUDIGRADE_DATA: string, HAS_CLOUDIGRADE_MISMATCH: string, HAS_DATA: string, METRIC_ID: string, COUNT: string, VALUE: string},
 *     RHSM_API_QUERY_UOM_TYPES: {CORES: string, SOCKETS: string}, RHSM_API_RESPONSE_META: string,
 *     RHSM_API_RESPONSE_GRANULARITY_TYPES: {WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string},
 *     RHSM_API_QUERY_SET_TYPES: {UOM: string, GRANULARITY: string, USAGE: string, DIRECTION: string, SORT: string, END_DATE: string,
 *     OFFSET: string, SLA: string, LIMIT: string, START_DATE: string, DISPLAY_NAME: string},
 *     RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES: {QUANTITY: string, USAGE: string, NEXT_EVENT_TYPE: string,
 *     NEXT_EVENT_DATE: string, TOTAL_CAPACITY: string, PRODUCT_NAME: string, SKU: string, SERVICE_LEVEL: string},
 *     RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES: {DUAL_AXES: string, LEGACY: string, HOURLY: string},
 *     RHSM_API_RESPONSE_USAGE_TYPES: {UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string}}}
 */
const rhsmConstants = {
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_CAPACITY_META_TYPES,
  RHSM_API_RESPONSE_DATA,
  RHSM_API_RESPONSE_META,
  RHSM_API_RESPONSE_META_TYPES,
  RHSM_API_RESPONSE_ERRORS,
  RHSM_API_RESPONSE_ERRORS_TYPES,
  RHSM_API_RESPONSE_ERRORS_CODE_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES,
  RHSM_API_RESPONSE_TALLY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_META_TYPES,
  RHSM_API_RESPONSE_GRANULARITY_TYPES,
  RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES,
  RHSM_API_RESPONSE_SLA_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTION_TYPES,
  RHSM_API_RESPONSE_UOM_TYPES,
  RHSM_API_RESPONSE_USAGE_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_BILLING_PROVIDER_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_TYPES,
  RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES
};

export {
  rhsmConstants as default,
  rhsmConstants,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_CAPACITY_META_TYPES,
  RHSM_API_RESPONSE_DATA,
  RHSM_API_RESPONSE_META,
  RHSM_API_RESPONSE_META_TYPES,
  RHSM_API_RESPONSE_ERRORS,
  RHSM_API_RESPONSE_ERRORS_TYPES,
  RHSM_API_RESPONSE_ERRORS_CODE_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES,
  RHSM_API_RESPONSE_TALLY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_META_TYPES,
  RHSM_API_RESPONSE_GRANULARITY_TYPES,
  RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES,
  RHSM_API_RESPONSE_SLA_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTION_TYPES,
  RHSM_API_RESPONSE_UOM_TYPES,
  RHSM_API_RESPONSE_USAGE_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_BILLING_PROVIDER_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_TYPES,
  RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES
};
