/**
 * @memberof Rhsm
 * @module RhsmConstants
 */

/**
 * RHSM path IDs for product RHEL variants.
 *
 * @type {{RHEL_ARM: string, RHEL_X86_SAP: string, RHEL_IBM_Z: string, RHEL_IBM_POWER: string, RHEL_X86: string,
 *     RHEL_X86_EUS: string, RHEL_X86_HA: string, RHEL_X86_RS: string}}
 */
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES = {
  RHEL_ARM: 'RHEL for ARM',
  RHEL_IBM_POWER: 'RHEL for IBM Power',
  RHEL_IBM_Z: 'RHEL for IBM z',
  RHEL_X86: 'RHEL for x86',
  RHEL_X86_EUS: 'rhel-for-x86-eus',
  RHEL_X86_HA: 'rhel-for-x86-ha',
  RHEL_X86_RS: 'rhel-for-x86-rs',
  RHEL_X86_SAP: 'rhel-for-sap-x86'
};

/**
 * RHSM path IDs for product Satellite variants.
 *
 * @type {{SATELLITE_SERVER: string, SATELLITE_CAPSULE: string}}
 */
const RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES = {
  SATELLITE_CAPSULE: 'Satellite Capsule',
  SATELLITE_SERVER: 'Satellite Server'
};

/**
 * RHSM path IDs for products.
 *
 * Internally the UI makes a distinction between "variants" and "grouped variants". Variants are considered
 * product ids that utilize the exact same graph and inventory display, and typically are assigned to the
 * [product configuration property "productVariants"]{@link ../config/}, i.e. RHEL and Satellite. Grouped
 * variants are product ids that have been force grouped together, and are considered separate because they use
 * dissimilar graph and inventory displays. Force grouped product ids are grouped with the
 * [product configuration property "productGroup"]{@link ../config/}, i.e. OpenShift et all.
 *
 * @type {{RHEL_ARM: string, OPENSHIFT_METRICS: string, RHEL_X86_EUS: string, RHEL_WORKSTATION: string,
 *     RHEL_X86_SAP: string, RHODS: string, ROSA: string, RHEL_X86: string, RHEL_COMPUTE_NODE: string,
 *     RHEL_X86_ELS_PAYG: string, OPENSHIFT: string, RHEL_X86_RS: string, SATELLITE_SERVER: string,
 *     OPENSHIFT_DEDICATED_METRICS: string, RHEL_X86_HA: string, SATELLITE_CAPSULE: string, RHEL_IBM_Z: string,
 *     RHEL_IBM_POWER: string, RHACS: string}}
 */
const RHSM_API_PATH_PRODUCT_TYPES = {
  ...RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES,
  ...RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES,
  RHACS: 'rhacs',
  RHEL_COMPUTE_NODE: 'RHEL Compute Node',
  RHEL_X86_ELS_PAYG: 'rhel-for-x86-els-payg',
  RHEL_WORKSTATION: 'RHEL Workstation',
  RHODS: 'rhods',
  ROSA: 'rosa',
  OPENSHIFT: 'OpenShift Container Platform',
  OPENSHIFT_METRICS: 'OpenShift-metrics',
  OPENSHIFT_DEDICATED_METRICS: 'OpenShift-dedicated-metrics'
};

/**
 * RHSM path IDs for metrics.
 *
 * @type {{CORES: string, STORAGE_GIBIBYTES: string, SOCKETS: string, INSTANCE_HOURS: string,
 *     TRANSFER_GIBIBYTES: string, VCPUS: string, CORE_SECONDS: string, STORAGE_GIBIBYTE_MONTHS: string}}
 */
const RHSM_API_PATH_METRIC_TYPES = {
  CORES: 'Cores',
  SOCKETS: 'Sockets',
  CORE_SECONDS: 'Core-seconds',
  INSTANCE_HOURS: 'Instance-hours',
  STORAGE_GIBIBYTES: 'Storage-gibibytes',
  STORAGE_GIBIBYTE_MONTHS: 'Storage-gibibyte-months',
  TRANSFER_GIBIBYTES: 'Transfer-gibibytes',
  VCPUS: 'vCPUs'
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
 * RHSM combined response Instance and Instance Guests DATA types.
 * "INSTANCE_ID" and "SUBSCRIPTION_MANAGER_ID" are associated with instance guests.
 *
 * @type {{MEASUREMENTS: string, BILLING_ACCOUNT_ID: string, CATEGORY: string,
 *     SUBSCRIPTION_MANAGER_ID: string, INVENTORY_ID: string, NUMBER_OF_GUESTS: string, BILLING_PROVIDER: string,
 *     DISPLAY_NAME: string, CLOUD_PROVIDER: string, INSTANCE_ID: string, LAST_SEEN: string}}
 */
const RHSM_API_RESPONSE_INSTANCES_DATA_TYPES = {
  BILLING_PROVIDER: 'billing_provider',
  BILLING_ACCOUNT_ID: 'billing_account_id',
  CLOUD_PROVIDER: 'cloud_provider',
  CATEGORY: 'category',
  DISPLAY_NAME: 'display_name',
  INSTANCE_ID: 'instance_id',
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
 *     NUMBER_OF_GUESTS: string, METRIC_ID: string, HAS_INFINITE_QUANTITY: string, TOTAL_CAPACITY: string,
 *     PRODUCT_NAME: string, SERVICE_LEVEL: string, DISPLAY_NAME: string, INSTANCE_ID: string, MEASUREMENTS: string,
 *     CATEGORY: string, NEXT_EVENT_DATE: string, BILLING_PROVIDER: string, CLOUD_PROVIDER: string, LAST_SEEN:
 *     string}}
 */
const RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES = {
  ...RHSM_API_RESPONSE_INSTANCES_DATA_TYPES,
  HAS_INFINITE_QUANTITY: 'has_infinite_quantity',
  NEXT_EVENT_DATE: 'next_event_date',
  PRODUCT_NAME: 'product_name',
  QUANTITY: 'quantity',
  SERVICE_LEVEL: 'service_level',
  TOTAL_CAPACITY: 'total_capacity',
  METRIC_ID: 'metric_id'
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
 * @type {{DATE: string, HAS_DATA: string, VALUE: string, HAS_INFINITE_QUANTITY: string}}
 */
const RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES = {
  DATE: 'date',
  VALUE: 'value',
  HAS_DATA: 'has_data',
  HAS_INFINITE_QUANTITY: 'has_infinite_quantity'
};

/**
 * RHSM response Tally META types.
 *
 * @type {{TOTAL_MONTHLY: string, DATE: string, PRODUCT: string, HAS_CLOUDIGRADE_DATA: string,
 *     HAS_CLOUDIGRADE_MISMATCH: string, HAS_DATA: string, METRIC_ID: string, COUNT: string, VALUE: string}}
 */
const RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES = {
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
  AWS: 'aws',
  // GCP: 'gcp',
  AZURE: 'azure'
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
 * @type {{CLOUD: string, PHYSICAL: string, ON_DEMAND: string, HYPERVISOR: string, PREPAID: string, VIRTUAL: string}}
 */
const RHSM_API_QUERY_CATEGORY_TYPES = {
  CLOUD: 'cloud',
  HYPERVISOR: 'hypervisor',
  ON_DEMAND: 'on-demand',
  PHYSICAL: 'physical',
  PREPAID: 'prepaid',
  VIRTUAL: 'virtual'
};

const RHSM_API_QUERY_GRANULARITY_TYPES = RHSM_API_RESPONSE_GRANULARITY_TYPES;

/**
 * RHSM API query/search parameter SORT type values for general inventory displays.
 *
 * @type {{CORES: string, SOCKETS: string, INSTANCE_HOURS: string, NUMBER_OF_GUESTS: string, CORE_SECONDS: string,
 *     NAME: string, STORAGE_GIBIBYTES: string, CATEGORY: string, TRANSFER_GIBIBYTES: string, VCPUS: string,
 *     BILLING_PROVIDER: string, STORAGE_GIBIBYTE_MONTHS: string, LAST_SEEN:
 *     string}}
 */
const RHSM_API_QUERY_INVENTORY_SORT_TYPES = {
  ...RHSM_API_PATH_METRIC_TYPES,
  BILLING_PROVIDER: 'billing_provider',
  CATEGORY: 'category',
  LAST_SEEN: 'last_seen',
  NAME: 'display_name',
  NUMBER_OF_GUESTS: 'number_of_guests'
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

const RHSM_API_QUERY_USAGE_TYPES = RHSM_API_RESPONSE_USAGE_TYPES;

/**
 * RHSM API query/search parameter INVENTORY type values.
 *
 * @type {{BILLING_ACCOUNT_ID: string, DIRECTION: string, END_DATE: string, METRIC_ID: string, SLA: string,
 *     LIMIT: string, START_DATE: string, DISPLAY_NAME: string, USAGE: string, CATEGORY: string, SORT: string, OFFSET:
 *     string, BILLING_PROVIDER: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_TYPES = {
  BILLING_PROVIDER: 'billing_provider',
  BILLING_ACCOUNT_ID: 'billing_account_id',
  CATEGORY: 'category',
  DIRECTION: 'dir',
  DISPLAY_NAME: 'display_name_contains',
  END_DATE: 'ending',
  LIMIT: 'limit',
  OFFSET: 'offset',
  METRIC_ID: 'metric_id',
  SLA: 'sla',
  SORT: 'sort',
  START_DATE: 'beginning',
  USAGE: 'usage'
};

/**
 * RHSM query parameter options for TALLY, CAPACITY endpoints.
 *
 * @type {{GRANULARITY: string, USAGE: string, CATEGORY: string, END_DATE: string, SLA: string,
 *     START_DATE: string, BILLING_PROVIDER: string, USE_RUNNING_TOTALS_FORMAT: string, BILLING_CATEGORY: string}}
 */
const RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES = {
  BILLING_CATEGORY: 'billing_category',
  BILLING_PROVIDER: 'billing_provider',
  CATEGORY: 'category',
  END_DATE: 'ending',
  GRANULARITY: 'granularity',
  SLA: 'sla',
  START_DATE: 'beginning',
  USAGE: 'usage',
  USE_RUNNING_TOTALS_FORMAT: 'use_running_totals_format'
};

/**
 * Aggregate all query set types.
 *
 * @type {{GRANULARITY: string, BILLING_ACCOUNT_ID: string, DIRECTION: string, END_DATE: string, SLA: string,
 *     LIMIT: string, START_DATE: string, DISPLAY_NAME: string, USE_RUNNING_TOTALS_FORMAT: string,
 *     BILLING_CATEGORY: string, METRIC_ID: string, USAGE: string, CATEGORY: string, SORT: string, OFFSET: string,
 *     BILLING_PROVIDER: string}}
 */
const RHSM_API_QUERY_SET_TYPES = {
  ...RHSM_API_QUERY_SET_INVENTORY_TYPES,
  ...RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES
};

/**
 * Product display types.
 *
 * @type {{CAPACITY: string, LEGACY: string, DUAL_AXES: string, PARTIAL: string, HOURLY: string}}
 */
const RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES = {
  DUAL_AXES: 'dual-axes',
  HOURLY: 'hourly',
  LEGACY: 'legacy',
  PARTIAL: 'partial',
  CAPACITY: 'capacity'
};

/**
 * RHSM constants.
 *
 * @type {{RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES: {GRANULARITY: string, USAGE: string, CATEGORY: string,
 *     END_DATE: string, SLA: string, START_DATE: string, BILLING_PROVIDER: string, USE_RUNNING_TOTALS_FORMAT: string,
 *     BILLING_CATEGORY: string}, RHSM_API_RESPONSE_DATA: string, RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES: {PRODUCT:
 *     string, SUBSCRIPTION_TYPE: string, COUNT: string}, RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES:
 *     {SATELLITE_SERVER: string, SATELLITE_CAPSULE: string}, RHSM_API_PATH_METRIC_TYPES: {CORES: string,
 *     STORAGE_GIBIBYTES: string, SOCKETS: string, INSTANCE_HOURS: string, TRANSFER_GIBIBYTES: string, VCPUS: string,
 *     CORE_SECONDS: string, STORAGE_GIBIBYTE_MONTHS: string}, RHSM_API_RESPONSE_INSTANCES_META_TYPES: {MEASUREMENTS:
 *     string, PRODUCT: string, COUNT: string}, RHSM_API_RESPONSE_INSTANCES_DATA_TYPES: {MEASUREMENTS: string,
 *     BILLING_ACCOUNT_ID: string, CATEGORY: string, SUBSCRIPTION_MANAGER_ID: string, INVENTORY_ID: string,
 *     NUMBER_OF_GUESTS: string, BILLING_PROVIDER: string, DISPLAY_NAME: string, CLOUD_PROVIDER: string, INSTANCE_ID:
 *     string, LAST_SEEN: string}, RHSM_API_RESPONSE_SLA_TYPES: {PREMIUM: string, SELF: string, NONE: string, STANDARD:
 *     string}, RHSM_API_RESPONSE_META_TYPES: {PRODUCT: string, COUNT: string}, RHSM_API_RESPONSE_ERRORS_CODE_TYPES:
 *     {GENERIC: string, OPTIN: string}, RHSM_API_QUERY_GRANULARITY_TYPES: {WEEKLY: string, QUARTERLY: string, DAILY:
 *     string, MONTHLY: string}, RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES: {RHEL_ARM: string, RHEL_X86_SAP: string,
 *     RHEL_IBM_Z: string, RHEL_IBM_POWER: string, RHEL_X86: string, RHEL_X86_EUS: string, RHEL_X86_HA: string,
 *     RHEL_X86_RS: string}, RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES: {BILLING_ACCOUNT_ID: string, QUANTITY: string,
 *     SUBSCRIPTION_MANAGER_ID: string, INVENTORY_ID: string, NUMBER_OF_GUESTS: string, METRIC_ID: string,
 *     HAS_INFINITE_QUANTITY: string, TOTAL_CAPACITY: string, PRODUCT_NAME: string, SERVICE_LEVEL: string,
 *     DISPLAY_NAME: string, INSTANCE_ID: string, MEASUREMENTS: string, CATEGORY: string, NEXT_EVENT_DATE: string,
 *     BILLING_PROVIDER: string, CLOUD_PROVIDER: string, LAST_SEEN: string},
 *     RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES: {ASCENDING: string, DESCENDING: string},
 *     RHSM_API_RESPONSE_SUBSCRIPTION_TYPES: {ANNUAL: string, ON_DEMAND: string}, RHSM_API_QUERY_INVENTORY_SORT_TYPES:
 *     {CORES: string, SOCKETS: string, INSTANCE_HOURS: string, NUMBER_OF_GUESTS: string, CORE_SECONDS: string, NAME:
 *     string, STORAGE_GIBIBYTES: string, CATEGORY: string, TRANSFER_GIBIBYTES: string, VCPUS: string,
 *     BILLING_PROVIDER: string, STORAGE_GIBIBYTE_MONTHS: string, LAST_SEEN: string}, RHSM_API_PATH_PRODUCT_TYPES:
 *     {RHEL_ARM: string, OPENSHIFT_METRICS: string, RHEL_X86_EUS: string, RHEL_WORKSTATION: string, RHEL_X86_SAP:
 *     string, RHODS: string, ROSA: string, RHEL_X86: string, RHEL_COMPUTE_NODE: string, RHEL_X86_ELS_PAYG: string,
 *     OPENSHIFT: string, RHEL_X86_RS: string, SATELLITE_SERVER: string, OPENSHIFT_DEDICATED_METRICS: string,
 *     RHEL_X86_HA: string, SATELLITE_CAPSULE: string, RHEL_IBM_Z: string, RHEL_IBM_POWER: string, RHACS: string},
 *     RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES: {AZURE: string, GCP: string, RED_HAT: string, NONE: string, AWS:
 *     string, ORACLE: string}, RHSM_API_RESPONSE_ERRORS_TYPES: {CODE: string},
 *     RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES: {DATE: string, HAS_DATA: string, VALUE: string,
 *     HAS_INFINITE_QUANTITY: string}, RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES: {TOTAL_MONTHLY: string, DATE:
 *     string, PRODUCT: string, HAS_CLOUDIGRADE_DATA: string, HAS_CLOUDIGRADE_MISMATCH: string, HAS_DATA: string,
 *     METRIC_ID: string, COUNT: string, VALUE: string}, RHSM_API_QUERY_BILLING_PROVIDER_TYPES: {AZURE: string, GCP:
 *     string, RED_HAT: string, NONE: string, AWS: string, ORACLE: string}, RHSM_API_QUERY_CATEGORY_TYPES: {CLOUD:
 *     string, PHYSICAL: string, ON_DEMAND: string, HYPERVISOR: string, PREPAID: string, VIRTUAL: string},
 *     RHSM_API_QUERY_USAGE_TYPES: {UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string},
 *     RHSM_API_QUERY_SLA_TYPES: {PREMIUM: string, SELF: string, NONE: string, STANDARD: string},
 *     RHSM_API_QUERY_SET_INVENTORY_TYPES: {BILLING_ACCOUNT_ID: string, DIRECTION: string, END_DATE: string, METRIC_ID:
 *     string, SLA: string, LIMIT: string, START_DATE: string, DISPLAY_NAME: string, USAGE: string, CATEGORY: string,
 *     SORT: string, OFFSET: string, BILLING_PROVIDER: string}, RHSM_API_RESPONSE_ERRORS: string,
 *     RHSM_API_RESPONSE_META: string, RHSM_API_RESPONSE_GRANULARITY_TYPES: {WEEKLY: string, QUARTERLY: string, DAILY:
 *     string, MONTHLY: string}, RHSM_API_QUERY_SET_TYPES: {GRANULARITY: string, BILLING_ACCOUNT_ID: string, DIRECTION:
 *     string, END_DATE: string, SLA: string, LIMIT: string, START_DATE: string, DISPLAY_NAME: string,
 *     USE_RUNNING_TOTALS_FORMAT: string, BILLING_CATEGORY: string, METRIC_ID: string, USAGE: string, CATEGORY: string,
 *     SORT: string, OFFSET: string, BILLING_PROVIDER: string}, RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES:
 *     {QUANTITY: string, USAGE: string, NEXT_EVENT_TYPE: string, NEXT_EVENT_DATE: string, TOTAL_CAPACITY: string,
 *     PRODUCT_NAME: string, SKU: string, SERVICE_LEVEL: string}, RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES: {CAPACITY:
 *     string, LEGACY: string, DUAL_AXES: string, PARTIAL: string, HOURLY: string}, RHSM_API_RESPONSE_USAGE_TYPES:
 *     {UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION:
 *     string}}}
 */
const rhsmConstants = {
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES,
  RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
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
  RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES,
  RHSM_API_RESPONSE_GRANULARITY_TYPES,
  RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES,
  RHSM_API_RESPONSE_SLA_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTION_TYPES,
  RHSM_API_RESPONSE_USAGE_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_BILLING_PROVIDER_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
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
  RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES,
  RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
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
  RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES,
  RHSM_API_RESPONSE_GRANULARITY_TYPES,
  RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES,
  RHSM_API_RESPONSE_SLA_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTION_TYPES,
  RHSM_API_RESPONSE_USAGE_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_BILLING_PROVIDER_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_TYPES,
  RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES
};
