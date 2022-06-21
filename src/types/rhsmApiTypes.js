import { rhsmConstants } from '../services/rhsm/rhsmConstants';

/**
 * ToDo: Clean up params, see userReducer.
 */
/**
 * RHSM response Error DATA type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_ERROR_DATA = rhsmConstants.RHSM_API_RESPONSE_ERRORS;

/**
 * ToDo: Clean up params, see userReducer.
 */
/**
 * RHSM response Error DATA types.
 * Schema/map of expected Error data response properties.
 *
 * @type {{CODE: string, DETAIL: string}}
 */
const RHSM_API_RESPONSE_ERROR_DATA_TYPES = {
  ...rhsmConstants.RHSM_API_RESPONSE_ERRORS_TYPES
};

/**
 * RHSM response Error DATA CODE types.
 *
 * @type {{GENERIC: string, OPTIN: string}}
 */
const RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES = {
  ...rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES
};

/**
 * ToDo: Clean up params, unused.
 */
/**
 * RHSM response links type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_LINKS = 'links';

/**
 * ToDo: Clean up params, unused.
 */
/**
 * RHSM response LINKS type.
 * Schema/map of expected inventory LINKS response properties.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_LINKS_TYPES = {
  FIRST: 'first',
  LAST: 'last',
  PREVIOUS: 'previous',
  NEXT: 'next'
};

/**
 * RHSM response meta type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_META = 'meta';

/**
 * ToDo: Clean up params, used by deprecated graph component selector and deprecated inventory component selector.
 * It appears some of these may need to move over towards rhsmSchemas.js
 */
/**
 * RHSM response META types.
 * Schema/map of expected META response properties.
 *
 * @type {{COUNT: string, TOTAL_INSTANCE_HOURS: string, TOTAL_CORE_HOURS: string}}
 */
const RHSM_API_RESPONSE_META_TYPES = {
  COUNT: 'count',
  TOTAL_CORE_HOURS: 'total_core_hours',
  TOTAL_INSTANCE_HOURS: 'total_instance_hours'
};

/**
 * RHSM response data type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_DATA = 'data';

/**
 * RHSM response Capacity DATA type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_CAPACITY_DATA = RHSM_API_RESPONSE_DATA;

/**
 * ToDo: Clean up params, used by deprecated graph component selector.
 * We may need to relocate this as part of a "capacity" schema some of these params towards rhsmSchemas.js
 */
/**
 * RHSM response Capacity DATA types.
 * Schema/map of expected Capacity data response properties.
 *
 * @type {{HYPERVISOR_SOCKETS: string, CORES: string, DATE: string, SOCKETS: string, PHYSICAL_SOCKETS: string,
 *     HYPERVISOR_CORES: string, HAS_INFINITE: string, PHYSICAL_CORES: string}}
 */
const RHSM_API_RESPONSE_CAPACITY_DATA_TYPES = {
  CLOUD_CORES: 'cloud_cores',
  CLOUD_INSTANCES: 'cloud_instance_count',
  CLOUD_SOCKETS: 'cloud_sockets',
  CORES: 'cores',
  DATE: 'date',
  HYPERVISOR_CORES: 'hypervisor_cores',
  HYPERVISOR_SOCKETS: 'hypervisor_sockets',
  PHYSICAL_CORES: 'physical_cores',
  PHYSICAL_SOCKETS: 'physical_sockets',
  SOCKETS: 'sockets',
  HAS_INFINITE: 'has_infinite_quantity'
};

/**
 * RHSM response inventory DATA type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_INVENTORY_DATA = RHSM_API_RESPONSE_DATA;

/**
 * ToDo: Clean up params, used by deprecated inventory component and related selector.
 */
/**
 * RHSM response inventory DATA types.
 * Schema/map of expected inventory DATA response properties.
 *
 * @type {{CORES: string, CORE_HOURS: string, HARDWARE: string, SOCKETS: string, SUBSCRIPTION_ID: string,
 *     INVENTORY_ID: string, MEASUREMENT: string, ID: string, GUESTS: string, CLOUD_PROVIDER: string,
 *     LAST_SEEN: string, NAME: string}}
 */
const RHSM_API_RESPONSE_INVENTORY_DATA_TYPES = {
  CLOUD_PROVIDER: 'cloud_provider',
  CORES: 'cores',
  CORE_HOURS: 'core_hours',
  GUESTS: 'number_of_guests',
  HARDWARE: 'hardware_type',
  ID: 'insights_id',
  INVENTORY_ID: 'inventory_id',
  LAST_SEEN: 'last_seen',
  MEASUREMENT: 'measurement_type',
  NAME: 'display_name',
  SOCKETS: 'sockets',
  SUBSCRIPTION_ID: 'subscription_manager_id'
};

/**
 * ToDo: Clean up params, used by deprecated guests component selector.
 */
/**
 * RHSM response inventory guests DATA types.
 * Schema/map of expected inventory guests DATA response properties.
 *
 * @type {{SUBSCRIPTION_ID: string, ID: string, NAME: string, LAST_SEEN: string}}
 */
const RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES = {
  ID: 'insights_id',
  NAME: 'display_name',
  SUBSCRIPTION_ID: 'subscription_manager_id',
  LAST_SEEN: 'last_seen'
};

/**
 * RHSM response Reporting/Tally DATA type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_PRODUCTS_DATA = RHSM_API_RESPONSE_DATA;

/**
 * ToDo: Clean up params, used by app message component, deprecated graph component, and Tally response selectors.
 * May need to move part of this towards rhsmConstants.js
 */
/**
 * RHSM response Reporting/Tally DATA types.
 * Schema/map of expected Reporting/Tally DATA response properties.
 *
 * @type {{HYPERVISOR_SOCKETS: string, CORES: string, INSTANCE_HOURS: string, SOCKETS: string, CLOUD_CORES: string,
 *     HAS_DATA: string, PHYSICAL_SOCKETS: string, PHYSICAL_CORES: string, CLOUD_INSTANCES: string, DATE: string,
 *     CORE_HOURS: string, CLOUD_SOCKETS: string, HAS_CLOUDIGRADE_DATA: string, HAS_CLOUDIGRADE_MISMATCH: string,
 *     HYPERVISOR_CORES: string}}
 */
const RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES = {
  CLOUD_CORES: 'cloud_cores',
  CLOUD_INSTANCES: 'cloud_instance_count',
  CLOUD_SOCKETS: 'cloud_sockets',
  CORE_HOURS: 'core_hours',
  CORES: 'cores',
  DATE: 'date',
  HYPERVISOR_CORES: 'hypervisor_cores',
  HYPERVISOR_SOCKETS: 'hypervisor_sockets',
  INSTANCE_HOURS: 'instance_hours',
  PHYSICAL_CORES: 'physical_cores',
  PHYSICAL_SOCKETS: 'physical_sockets',
  SOCKETS: 'sockets',
  HAS_CLOUDIGRADE_DATA: 'has_cloudigrade_data',
  HAS_CLOUDIGRADE_MISMATCH: 'has_cloudigrade_mismatch',
  HAS_DATA: 'has_data'
};

/**
 * RHSM product id type values.
 *
 * @type {{RHEL_ARM: string, OPENSHIFT_METRICS: string, SATELLITE: string, RHEL_WORKSTATION: string,
 *     RHOSAK: string, RHEL_COMPUTE_NODE: string, RHEL_X86: string, OPENSHIFT: string, SATELLITE_SERVER: string,
 *     OPENSHIFT_DEDICATED_METRICS: string, RHEL_DESKTOP: string, RHEL: string, SATELLITE_CAPSULE: string,
 *     RHEL_SERVER: string, RHEL_IBM_Z: string, RHEL_IBM_POWER: string}}
 */
const RHSM_API_PATH_ID_TYPES = {
  ...rhsmConstants.RHSM_API_PATH_PRODUCT_TYPES
};

/**
 * RHSM API query/search parameter of GRANULARITY type values.
 * Schema/map of expected query/search parameter granularity types.
 *
 * @type {{WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string}}
 */
const RHSM_API_QUERY_GRANULARITY_TYPES = {
  ...rhsmConstants.RHSM_API_QUERY_GRANULARITY_TYPES
};

/**
 * ToDo: Clean up sort params since they're hosts API specific.
 * Hosts is being deprecated in favor of instances API. Instances sort params
 * can be found in /services/rhsm/rhsmConstants.js
 */
/**
 * RHSM API query/search parameter SORT type values for HOSTS.
 *
 * @type {{CORES: string, CORE_HOURS: string, HARDWARE: string, SOCKETS: string, MEASUREMENT: string,
 *     LAST_SEEN: string, NAME: string}}
 */
const RHSM_API_QUERY_SORT_TYPES = {
  CORES: 'cores',
  CORE_HOURS: 'core_hours',
  HARDWARE: 'hardware_type',
  INSTANCE_HOURS: 'instance_hours',
  LAST_SEEN: 'last_seen',
  MEASUREMENT: 'measurement_type',
  NAME: 'display_name',
  SOCKETS: 'sockets'
};

/**
 * RHSM API query/search parameter SORT DIRECTION type values.
 *
 * @type {{ASCENDING: string, DESCENDING: string}}
 */
const RHSM_API_QUERY_SORT_DIRECTION_TYPES = {
  ...rhsmConstants.RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES
};

/**
 * RHSM API query/search parameter SLA type values.
 *
 * @type {{PREMIUM: string, SELF: string, NONE: string, STANDARD: string}}
 */
const RHSM_API_QUERY_SLA_TYPES = {
  ...rhsmConstants.RHSM_API_QUERY_SLA_TYPES
};

/**
 * RHSM API query/search parameter UOM type values.
 *
 * @type {{CORES: string, SOCKETS: string}}
 */
const RHSM_API_QUERY_UOM_TYPES = {
  ...rhsmConstants.RHSM_API_QUERY_UOM_TYPES
};

/**
 * RHSM API query/search parameter USAGE type values.
 *
 * @type {{UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string}}
 */
const RHSM_API_QUERY_USAGE_TYPES = {
  ...rhsmConstants.RHSM_API_QUERY_USAGE_TYPES
};

/**
 * ToDo: Clean up params, unused.
 */
/**
 * RHSM API query/search parameter OPTIN type values.
 *
 * @type {{TALLY_SYNC: string, TALLY_REPORT: string, CONDUIT_SYNC: string}}
 */
const RHSM_API_QUERY_SET_OPTIN_TYPES = {
  CONDUIT_SYNC: 'enable_conduit_sync',
  TALLY_REPORT: 'enable_tally_reporting',
  TALLY_SYNC: 'enable_tally_sync'
};

/**
 * RHSM API query/search parameter CAPACITY type values.
 *
 * @type {{GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string, START_DATE: string}}
 */
const RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES = {
  ...rhsmConstants.RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES
};

/**
 * RHSM API query/search parameter INVENTORY type values.
 *
 * @type {{UOM: string, USAGE: string, DIRECTION: string, SORT: string, OFFSET: string,
 *     SLA: string, LIMIT: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_TYPES = {
  ...rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES
};

/**
 * RHSM API query/search parameter GUESTS INVENTORY type values.
 *
 * @type {{OFFSET: string, LIMIT: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES = {
  ...rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES
};

/**
 * RHSM API query/search parameter SUBSCRIPTIONS INVENTORY type values.
 *
 * @type {{UOM: string, USAGE: string, DIRECTION: string, SORT: string, OFFSET: string, SLA: string,
 *     LIMIT: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES = {
  ...rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES
};

/**
 * RHSM API query/search parameter values.
 *
 * @type {{GRANULARITY: string, TALLY_SYNC: string, DIRECTION: string, END_DATE: string,
 *     SLA: string, START_DATE: string, LIMIT: string, UOM: string, TALLY_REPORT: string,
 *     USAGE: string, SORT: string, OFFSET: string, CONDUIT_SYNC: string}}
 */
const RHSM_API_QUERY_TYPES = {
  ...RHSM_API_QUERY_SET_OPTIN_TYPES,
  ...RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES,
  ...RHSM_API_QUERY_SET_INVENTORY_TYPES,
  ...RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES,
  ...RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES
};

/**
 * RHSM API types.
 *
 * @type {{RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES: {UOM: string, USAGE: string, DIRECTION: string, SORT: string, OFFSET: string,
 *     SLA: string, LIMIT: string}, RHSM_API_RESPONSE_DATA: string, RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES: {GENERIC: string, OPTIN: string},
 *     RHSM_API_RESPONSE_INVENTORY_DATA: string, RHSM_API_RESPONSE_CAPACITY_DATA: string, RHSM_API_RESPONSE_ERROR_DATA_TYPES: {CODE: string,
 *     DETAIL: string}, RHSM_API_RESPONSE_CAPACITY_DATA_TYPES: {HYPERVISOR_SOCKETS: string, CORES: string, DATE: string, SOCKETS: string,
 *     PHYSICAL_SOCKETS: string, HYPERVISOR_CORES: string, HAS_INFINITE: string, PHYSICAL_CORES: string},
 *     RHSM_API_RESPONSE_META_TYPES: {COUNT: string, TOTAL_INSTANCE_HOURS: string, TOTAL_CORE_HOURS: string},
 *     RHSM_API_QUERY_GRANULARITY_TYPES: {WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string},
 *     RHSM_API_QUERY_SORT_DIRECTION_TYPES: {ASCENDING: string, DESCENDING: string}, RHSM_API_RESPONSE_PRODUCTS_DATA: string,
 *     RHSM_API_QUERY_TYPES: {GRANULARITY: string, TALLY_SYNC: string, DIRECTION: string, END_DATE: string, SLA: string, START_DATE: string,
 *     LIMIT: string, UOM: string, TALLY_REPORT: string, USAGE: string, SORT: string, OFFSET: string, CONDUIT_SYNC: string},
 *     RHSM_API_RESPONSE_LINKS: string, RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES: {OFFSET: string, LIMIT: string},
 *     RHSM_API_PATH_ID_TYPES: {RHEL_ARM: string, OPENSHIFT_METRICS: string, SATELLITE: string, RHEL_WORKSTATION: string, RHOSAK: string,
 *     RHEL_COMPUTE_NODE: string, RHEL_X86: string, OPENSHIFT: string, SATELLITE_SERVER: string, OPENSHIFT_DEDICATED_METRICS: string,
 *     RHEL_DESKTOP: string, RHEL: string, SATELLITE_CAPSULE: string, RHEL_SERVER: string, RHEL_IBM_Z: string, RHEL_IBM_POWER: string},
 *     RHSM_API_QUERY_SET_OPTIN_TYPES: {TALLY_SYNC: string, TALLY_REPORT: string, CONDUIT_SYNC: string},
 *     RHSM_API_QUERY_USAGE_TYPES: {UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string},
 *     RHSM_API_QUERY_SLA_TYPES: {PREMIUM: string, SELF: string, NONE: string, STANDARD: string},
 *     RHSM_API_QUERY_SET_INVENTORY_TYPES: {UOM: string, USAGE: string, DIRECTION: string, SORT: string, OFFSET: string, SLA: string,
 *     LIMIT: string}, RHSM_API_QUERY_SORT_TYPES: {CORES: string, CORE_HOURS: string, HARDWARE: string, SOCKETS: string,
 *     MEASUREMENT: string, LAST_SEEN: string, NAME: string}, RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES: {HYPERVISOR_SOCKETS: string,
 *     CORES: string, INSTANCE_HOURS: string, SOCKETS: string, CLOUD_CORES: string, HAS_DATA: string, PHYSICAL_SOCKETS: string,
 *     PHYSICAL_CORES: string, CLOUD_INSTANCES: string, DATE: string, CORE_HOURS: string, CLOUD_SOCKETS: string,
 *     HAS_CLOUDIGRADE_DATA: string, HAS_CLOUDIGRADE_MISMATCH: string, HYPERVISOR_CORES: string}, RHSM_API_QUERY_UOM_TYPES: {CORES: string,
 *     SOCKETS: string}, RHSM_API_RESPONSE_LINKS_TYPES: string, RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES: {SUBSCRIPTION_ID: string,
 *     ID: string, NAME: string, LAST_SEEN: string}, RHSM_API_RESPONSE_ERROR_DATA: string, RHSM_API_RESPONSE_META: string,
 *     RHSM_API_RESPONSE_INVENTORY_DATA_TYPES: {CORES: string, CORE_HOURS: string, HARDWARE: string, SOCKETS: string, SUBSCRIPTION_ID: string,
 *     INVENTORY_ID: string, MEASUREMENT: string, ID: string, GUESTS: string, CLOUD_PROVIDER: string, LAST_SEEN: string, NAME: string},
 *     RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES: {GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string, START_DATE: string}}}
 */
const rhsmApiTypes = {
  RHSM_API_RESPONSE_ERROR_DATA,
  RHSM_API_RESPONSE_ERROR_DATA_TYPES,
  RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES,
  RHSM_API_RESPONSE_LINKS,
  RHSM_API_RESPONSE_LINKS_TYPES,
  RHSM_API_RESPONSE_META,
  RHSM_API_RESPONSE_META_TYPES,
  RHSM_API_RESPONSE_DATA,
  RHSM_API_RESPONSE_CAPACITY_DATA,
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_DATA,
  RHSM_API_RESPONSE_INVENTORY_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES,
  RHSM_API_RESPONSE_PRODUCTS_DATA,
  RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_SET_OPTIN_TYPES,
  RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES
};

export {
  rhsmApiTypes as default,
  rhsmApiTypes,
  RHSM_API_RESPONSE_ERROR_DATA,
  RHSM_API_RESPONSE_ERROR_DATA_TYPES,
  RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES,
  RHSM_API_RESPONSE_LINKS,
  RHSM_API_RESPONSE_LINKS_TYPES,
  RHSM_API_RESPONSE_META,
  RHSM_API_RESPONSE_META_TYPES,
  RHSM_API_RESPONSE_DATA,
  RHSM_API_RESPONSE_CAPACITY_DATA,
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_DATA,
  RHSM_API_RESPONSE_INVENTORY_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES,
  RHSM_API_RESPONSE_PRODUCTS_DATA,
  RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_SET_OPTIN_TYPES,
  RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES
};
