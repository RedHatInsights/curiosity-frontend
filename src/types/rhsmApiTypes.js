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
 * @type {{CORES: string, HARDWARE: string, SOCKETS: string, ID: string, NAME: string, LAST_SEEN: string}}
 */
const RHSM_API_RESPONSE_INVENTORY_DATA_TYPES = {
  CORES: 'cores',
  GUESTS: 'number_of_guests',
  HARDWARE: 'hardware_type',
  ID: 'insights_id',
  INVENTORY_ID: 'inventory_id',
  LAST_SEEN: 'last_seen',
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
 * RHSM response Reporting/Tally DATA type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_PRODUCTS_DATA = 'data';

/**
 * RHSM response Reporting/Tally DATA types.
 * Schema/map of expected Reporting/Tally DATA response properties.
 *
 * @type {{HYPERVISOR_SOCKETS: string, CORES: string, DATE: string, SOCKETS: string, HAS_DATA: string,
 *     PHYSICAL_SOCKETS: string, HYPERVISOR_CORES: string, PHYSICAL_CORES: string}}
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
  HAS_DATA: 'has_data'
};

/**
 * RHSM product id type values.
 *
 * @type {{RHEL_ARM: string, RHEL_WORKSTATION: string, RHEL_DESKTOP: string, RHEL: string,
 *     RHEL_SERVER: string, RHEL_IBM_Z: string, RHEL_COMPUTE_NODE: string, RHEL_IBM_POWER: string,
 *     RHEL_X86: string, OPENSHIFT: string}}
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
  OPENSHIFT: 'OpenShift Container Platform'
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

const RHSM_API_QUERY_SET_OPTIN_TYPES = {
  CONDUIT_SYNC: 'enable_conduit_sync',
  TALLY_REPORT: 'enable_tally_reporting',
  TALLY_SYNC: 'enable_tally_sync'
};

const RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES = {
  END_DATE: 'ending',
  GRANULARITY: 'granularity',
  SLA: 'sla',
  START_DATE: 'beginning',
  USAGE: 'usage'
};

const RHSM_API_QUERY_SET_INVENTORY_TYPES = {
  LIMIT: 'limit',
  OFFSET: 'offset',
  SLA: 'sla',
  USAGE: 'usage'
};

const RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES = {
  LIMIT: 'limit',
  OFFSET: 'offset'
};

const RHSM_API_QUERY_TYPES = {
  ...RHSM_API_QUERY_SET_OPTIN_TYPES,
  ...RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES,
  ...RHSM_API_QUERY_SET_INVENTORY_TYPES,
  ...RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES
};

/**
 * RHSM API types.
 *
 * @type {{RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES: {OFFSET: string, LIMIT: string},
 *     RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES: {GENERIC: string, OPTIN: string},
 *     RHSM_API_RESPONSE_INVENTORY_DATA: string, RHSM_API_RESPONSE_CAPACITY_DATA: string,
 *     RHSM_API_PATH_ID_TYPES: {RHEL_ARM: string, RHEL_WORKSTATION: string, RHEL_DESKTOP: string, RHEL: string,
 *     RHEL_SERVER: string, RHEL_IBM_Z: string, RHEL_COMPUTE_NODE: string, RHEL_IBM_POWER: string,
 *     RHEL_X86: string, OPENSHIFT: string}, RHSM_API_RESPONSE_ERROR_DATA_TYPES: {CODE: string, DETAIL: string},
 *     RHSM_API_QUERY_SET_OPTIN_TYPES: {TALLY_SYNC: string, TALLY_REPORT: string, CONDUIT_SYNC: string},
 *     RHSM_API_QUERY_USAGE_TYPES: {UNSPECIFIED: string, DISASTER: string, DEVELOPMENT: string, PRODUCTION: string},
 *     RHSM_API_QUERY_SLA_TYPES: {PREMIUM: string, SELF: string, NONE: string, STANDARD: string},
 *     RHSM_API_QUERY_SET_INVENTORY_TYPES: {USAGE: string, OFFSET: string, SLA: string, LIMIT: string},
 *     RHSM_API_RESPONSE_CAPACITY_DATA_TYPES: {HYPERVISOR_SOCKETS: string, CORES: string, DATE: string, SOCKETS: string,
 *     PHYSICAL_SOCKETS: string, HYPERVISOR_CORES: string, HAS_INFINITE: string, PHYSICAL_CORES: string},
 *     RHSM_API_RESPONSE_META_TYPES: string, RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES: {HYPERVISOR_SOCKETS: string,
 *     CORES: string, DATE: string, SOCKETS: string, HAS_DATA: string, PHYSICAL_SOCKETS: string,
 *     HYPERVISOR_CORES: string, PHYSICAL_CORES: string}, RHSM_API_RESPONSE_LINKS_TYPES: string,
 *     RHSM_API_RESPONSE_INVENTORY_GUESTS_DATA_TYPES: {SUBSCRIPTION_ID: string, ID: string, NAME: string,
 *     LAST_SEEN: string}, RHSM_API_QUERY_GRANULARITY_TYPES: {WEEKLY: string, QUARTERLY: string, DAILY: string,
 *     MONTHLY: string}, RHSM_API_RESPONSE_ERROR_DATA: string, RHSM_API_RESPONSE_META: string,
 *     RHSM_API_RESPONSE_PRODUCTS_DATA: string, RHSM_API_QUERY_TYPES: {GRANULARITY: string, TALLY_SYNC: string,
 *     TALLY_REPORT: string, USAGE: string, END_DATE: string, SLA: string, OFFSET: string, START_DATE: string,
 *     LIMIT: string, CONDUIT_SYNC: string}, RHSM_API_RESPONSE_INVENTORY_DATA_TYPES: {CORES: string,
 *     HARDWARE: string, SOCKETS: string, ID: string, NAME: string, LAST_SEEN: string},
 *     RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES: {GRANULARITY: string, USAGE: string, END_DATE: string, SLA: string,
 *     START_DATE: string}, RHSM_API_RESPONSE_LINKS: string}}
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
  RHSM_API_RESPONSE_PRODUCTS_DATA,
  RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_SET_OPTIN_TYPES,
  RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES
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
  RHSM_API_RESPONSE_PRODUCTS_DATA,
  RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_SET_OPTIN_TYPES,
  RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_TYPES,
  RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES
};
