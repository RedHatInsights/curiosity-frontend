/**
 * RHSM response Error DATA type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_ERROR_DATA = 'errors';

/**
 * RHSM response Error DATA types.
 * Schema/map of expected Error data response properties.
 *
 * @type {{CODE: string, DETAIL: string}}
 */
const RHSM_API_RESPONSE_ERROR_DATA_TYPES = {
  CODE: 'code',
  DETAIL: 'detail'
};

/**
 * RHSM response Error DATA CODE types.
 *
 * @type {{GENERIC: string, OPTIN: string}}
 */
const RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES = {
  GENERIC: 'SUBSCRIPTIONS1003',
  OPTIN: 'SUBSCRIPTIONS1004'
};

/**
 * RHSM response links type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_LINKS = 'links';

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
 * RHSM response META types.
 * Schema/map of expected META response properties.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_META_TYPES = {
  COUNT: 'count'
};

/**
 * RHSM response Capacity DATA type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_CAPACITY_DATA = 'data';

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
const RHSM_API_RESPONSE_INVENTORY_DATA = 'data';

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
 * RHSM response subscriptions inventory DATA types.
 *
 * @type {{UOM: string, PHYSICAL_CAPACITY: string, USAGE: string, UPCOMING_EVENT_TYPE: string,
 *     UPCOMING_EVENT_DATE: string, SUBSCRIPTION_NUMBERS: string, VIRTUAL_CAPACITY: string,
 *     TOTAL_CAPACITY: string, SKU: string, SERVICE_LEVEL: string}}
 */
const RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES = {
  SKU: 'sku',
  PRODUCT_NAME: 'product_name',
  SERVICE_LEVEL: 'service_level',
  USAGE: 'usage',
  SUBSCRIPTION_NUMBERS: 'subscription_numbers',
  UPCOMING_EVENT_DATE: 'upcoming_event_date',
  UPCOMING_EVENT_TYPE: 'upcoming_event_type',
  PHYSICAL_CAPACITY: 'physical_capacity',
  VIRTUAL_CAPACITY: 'virtual_capacity',
  TOTAL_CAPACITY: 'total_capacity',
  UOM: 'uom'
};

/**
 * RHSM response Reporting/Tally DATA type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_PRODUCTS_DATA = 'data';

/**
 * RHSM response Reporting/Tally DATA types.
 * Schema/map of expected Reporting/Tally DATA response properties.
 *
 * @type {{HYPERVISOR_SOCKETS: string, CORES: string, SOCKETS: string, CLOUD_CORES: string, HAS_DATA: string,
 * PHYSICAL_SOCKETS: string, PHYSICAL_CORES: string, CLOUD_INSTANCES: string, DATE: string, CLOUD_SOCKETS: string,
 * HAS_CLOUDIGRADE_DATA: string, HAS_CLOUDIGRADE_MISMATCH: string, HYPERVISOR_CORES: string}}
 */
const RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES = {
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
  HAS_CLOUDIGRADE_DATA: 'has_cloudigrade_data',
  HAS_CLOUDIGRADE_MISMATCH: 'has_cloudigrade_mismatch',
  HAS_DATA: 'has_data'
};

/**
 * RHSM product id type values.
 *
 * @type {{RHEL_ARM: string, OPENSHIFT_METRICS: string, SATELLITE: string, RHEL_WORKSTATION: string,
 *     RHEL_COMPUTE_NODE: string, RHEL_X86: string, OPENSHIFT: string, SATELLITE_SERVER: string,
 *     OPENSHIFT_DEDICATED_METRICS: string, RHEL_DESKTOP: string, RHEL: string, SATELLITE_CAPSULE: string,
 *     RHEL_SERVER: string, RHEL_IBM_Z: string, RHEL_IBM_POWER: string}}
 */
const RHSM_API_PATH_ID_TYPES = {
  RHEL: 'RHEL',
  RHEL_COMPUTE_NODE: 'RHEL Compute Node',
  RHEL_DESKTOP: 'RHEL Desktop',
  RHEL_SERVER: 'RHEL Server',
  RHEL_WORKSTATION: 'RHEL Workstation',
  RHEL_ARM: 'RHEL for ARM',
  RHEL_IBM_POWER: 'RHEL for IBM Power',
  RHEL_IBM_Z: 'RHEL for IBM z',
  RHEL_X86: 'RHEL for x86',
  OPENSHIFT: 'OpenShift Container Platform',
  OPENSHIFT_METRICS: 'OpenShift-metrics',
  OPENSHIFT_DEDICATED_METRICS: 'OpenShift-dedicated-metrics',
  SATELLITE: 'Satellite',
  SATELLITE_CAPSULE: 'Satellite Capsule',
  SATELLITE_SERVER: 'Satellite Server'
};

/**
 * RHSM API query/search parameter of GRANULARITY type values.
 * Schema/map of expected query/search parameter granularity types.
 *
 * @type {{WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string}}
 */
const RHSM_API_QUERY_GRANULARITY_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly'
};

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
  LAST_SEEN: 'last_seen',
  MEASUREMENT: 'measurement_type',
  NAME: 'display_name',
  SOCKETS: 'sockets'
};

/**
 * RHSM API query/search parameter SORT type values for SUBSCRIPTIONS.
 *
 * @type {{UOM: string, PHYSICAL_CAPACITY: string, USAGE: string, UPCOMING_EVENT_DATE: string,
 *     VIRTUAL_CAPACITY: string, TOTAL_CAPACITY: string, SKU: string, PRODUCT_NAME: string,
 *     SERVICE_LEVEL: string}}
 */
const RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES = {
  SKU: 'sku',
  PRODUCT_NAME: 'product_name',
  SERVICE_LEVEL: 'service_level',
  USAGE: 'usage',
  UPCOMING_EVENT_DATE: 'upcoming_event_date',
  PHYSICAL_CAPACITY: 'physical_capacity',
  VIRTUAL_CAPACITY: 'virtual_capacity',
  TOTAL_CAPACITY: 'total_capacity',
  UOM: 'uom'
};

/**
 * RHSM API query/search parameter SORT DIRECTION type values.
 *
 * @type {{ASCENDING: string, DESCENDING: string}}
 */
const RHSM_API_QUERY_SORT_DIRECTION_TYPES = {
  ASCENDING: 'asc',
  DESCENDING: 'desc'
};

/**
 * RHSM API query/search parameter SLA type values.
 *
 * @type {{PREMIUM: string, SELF: string, NONE: string, STANDARD: string}}
 */
const RHSM_API_QUERY_SLA_TYPES = {
  PREMIUM: 'premium',
  STANDARD: 'standard',
  SELF: 'self-support',
  NONE: ''
};

/**
 * RHSM API query/search parameter UOM type values.
 *
 * @type {{CORES: string, SOCKETS: string}}
 */
const RHSM_API_QUERY_UOM_TYPES = {
  CORES: 'cores',
  SOCKETS: 'sockets'
};

/**
 * RHSM API query/search parameter USAGE type values.
 *
 * @type {{UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string}}
 */
const RHSM_API_QUERY_USAGE_TYPES = {
  PRODUCTION: 'Production',
  DEVELOPMENT: 'Development/Test',
  DISASTER: 'Disaster Recovery',
  UNSPECIFIED: ''
};

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
  END_DATE: 'ending',
  GRANULARITY: 'granularity',
  SLA: 'sla',
  START_DATE: 'beginning',
  USAGE: 'usage'
};

/**
 * RHSM API query/search parameter INVENTORY type values.
 *
 * @type {{UOM: string, USAGE: string, DIRECTION: string, SORT: string, OFFSET: string,
 *     SLA: string, LIMIT: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_TYPES = {
  DIRECTION: 'dir',
  DISPLAY_NAME: 'display_name_contains',
  LIMIT: 'limit',
  OFFSET: 'offset',
  SLA: 'sla',
  SORT: 'sort',
  UOM: 'uom',
  USAGE: 'usage'
};

/**
 * RHSM API query/search parameter GUESTS INVENTORY type values.
 *
 * @type {{OFFSET: string, LIMIT: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES = {
  LIMIT: 'limit',
  OFFSET: 'offset'
};

/**
 * RHSM API query/search parameter SUBSCRIPTIONS INVENTORY type values.
 *
 * @type {{UOM: string, USAGE: string, DIRECTION: string, SORT: string, OFFSET: string, SLA: string,
 *     LIMIT: string}}
 */
const RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES = {
  ...RHSM_API_QUERY_SET_INVENTORY_TYPES
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
 * @type {{RHSM_API_QUERY_SET_INVENTORY_SUBSCRIPTIONS_TYPES: {UOM: string, USAGE: string, DIRECTION: string, SORT: string,
 *     OFFSET: string, SLA: string, LIMIT: string}, RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES: {UOM: string,
 *     PHYSICAL_CAPACITY: string, USAGE: string, UPCOMING_EVENT_TYPE: string, UPCOMING_EVENT_DATE: string,
 *     SUBSCRIPTION_NUMBERS: string, VIRTUAL_CAPACITY: string, TOTAL_CAPACITY: string, SKU: string,
 *     SERVICE_LEVEL: string}, RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES: {GENERIC: string, OPTIN: string},
 *     RHSM_API_RESPONSE_INVENTORY_DATA: string, RHSM_API_RESPONSE_CAPACITY_DATA: string,
 *     RHSM_API_RESPONSE_ERROR_DATA_TYPES: {CODE: string, DETAIL: string},
 *     RHSM_API_RESPONSE_CAPACITY_DATA_TYPES: {HYPERVISOR_SOCKETS: string, CORES: string, DATE: string, SOCKETS: string,
 *     PHYSICAL_SOCKETS: string, HYPERVISOR_CORES: string, HAS_INFINITE: string, PHYSICAL_CORES: string},
 *     RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES: {UOM: string, PHYSICAL_CAPACITY: string, USAGE: string,
 *     UPCOMING_EVENT_DATE: string, VIRTUAL_CAPACITY: string, TOTAL_CAPACITY: string, SKU: string, PRODUCT_NAME: string,
 *     SERVICE_LEVEL: string}, RHSM_API_RESPONSE_META_TYPES: string, RHSM_API_QUERY_GRANULARITY_TYPES: {WEEKLY: string,
 *     QUARTERLY: string, DAILY: string, MONTHLY: string}, RHSM_API_QUERY_SORT_DIRECTION_TYPES: {ASCENDING: string,
 *     DESCENDING: string}, RHSM_API_RESPONSE_PRODUCTS_DATA: string, RHSM_API_QUERY_TYPES: {GRANULARITY: string,
 *     TALLY_SYNC: string, DIRECTION: string, END_DATE: string, SLA: string, START_DATE: string, LIMIT: string,
 *     UOM: string, TALLY_REPORT: string, USAGE: string, SORT: string, OFFSET: string, CONDUIT_SYNC: string},
 *     RHSM_API_RESPONSE_LINKS: string, RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES: {OFFSET: string, LIMIT: string},
 *     RHSM_API_PATH_ID_TYPES: {RHEL_ARM: string, SATELLITE: string, RHEL_WORKSTATION: string, RHEL_DESKTOP: string,
 *     RHEL: string, SATELLITE_CAPSULE: string, RHEL_SERVER: string, RHEL_IBM_Z: string, RHEL_COMPUTE_NODE: string,
 *     RHEL_IBM_POWER: string, RHEL_X86: string, OPENSHIFT: string},
 *     RHSM_API_QUERY_SET_OPTIN_TYPES: {TALLY_SYNC: string, TALLY_REPORT: string, CONDUIT_SYNC: string},
 *     RHSM_API_QUERY_USAGE_TYPES: {UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string},
 *     RHSM_API_QUERY_SLA_TYPES: {PREMIUM: string, SELF: string, NONE: string, STANDARD: string},
 *     RHSM_API_QUERY_SET_INVENTORY_TYPES: {UOM: string, USAGE: string, DIRECTION: string, SORT: string,
 *     OFFSET: string, SLA: string, LIMIT: string}, RHSM_API_QUERY_SORT_TYPES: {CORES: string, HARDWARE: string,
 *     SOCKETS: string, MEASUREMENT: string, LAST_SEEN: string, NAME: string},
 *     RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES: {HYPERVISOR_SOCKETS: string, CORES: string, SOCKETS: string,
 *     CLOUD_CORES: string, HAS_DATA: string, PHYSICAL_SOCKETS: string, PHYSICAL_CORES: string,
 *     CLOUD_INSTANCES: string, DATE: string, CLOUD_SOCKETS: string, HAS_CLOUDIGRADE_DATA: string,
 *     HAS_CLOUDIGRADE_MISMATCH: string, HYPERVISOR_CORES: string}, RHSM_API_QUERY_UOM_TYPES: {CORES: string,
 *     SOCKETS: string}, RHSM_API_RESPONSE_LINKS_TYPES: string,
 *     RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES: {SUBSCRIPTION_ID: string, ID: string, NAME: string,
 *     LAST_SEEN: string}, RHSM_API_RESPONSE_ERROR_DATA: string, RHSM_API_RESPONSE_META: string,
 *     RHSM_API_RESPONSE_INVENTORY_DATA_TYPES: {CORES: string, HARDWARE: string, SOCKETS: string,
 *     SUBSCRIPTION_ID: string, INVENTORY_ID: string, MEASUREMENT: string, ID: string, GUESTS: string,
 *     CLOUD_PROVIDER: string, LAST_SEEN: string, NAME: string},
 *     RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES: {GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string,
 *     START_DATE: string}}}
 */
const rhsmApiTypes = {
  RHSM_API_RESPONSE_ERROR_DATA,
  RHSM_API_RESPONSE_ERROR_DATA_TYPES,
  RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES,
  RHSM_API_RESPONSE_LINKS,
  RHSM_API_RESPONSE_LINKS_TYPES,
  RHSM_API_RESPONSE_META,
  RHSM_API_RESPONSE_META_TYPES,
  RHSM_API_RESPONSE_CAPACITY_DATA,
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_DATA,
  RHSM_API_RESPONSE_INVENTORY_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES,
  RHSM_API_RESPONSE_PRODUCTS_DATA,
  RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES,
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
  RHSM_API_RESPONSE_CAPACITY_DATA,
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_DATA,
  RHSM_API_RESPONSE_INVENTORY_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES,
  RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES,
  RHSM_API_RESPONSE_PRODUCTS_DATA,
  RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES,
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
