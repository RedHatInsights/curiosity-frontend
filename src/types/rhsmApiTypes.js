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
 * RHSM response Capacity META type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_CAPACITY_META = 'meta';

/**
 * RHSM response Capacity META types.
 * Schema/map of expected Capacity META response properties.
 *
 * @type {{COUNT: string}}
 */
const RHSM_API_RESPONSE_CAPACITY_META_TYPES = {
  COUNT: 'count'
};

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
 * @type {{OPTIN: string}}
 */
const RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES = {
  OPTIN: 'SUBSCRIPTIONS1004'
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
 * RHSM response Reporting/Tally META type.
 *
 * @type {string}
 */
const RHSM_API_RESPONSE_PRODUCTS_META = 'meta';

/**
 * RHSM response Reporting/Tally META types.
 * Schema/map of expected Reporting/Tally META response properties.
 *
 * @type {{COUNT: string}}
 */
const RHSM_API_RESPONSE_PRODUCTS_META_TYPES = {
  COUNT: 'count'
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
 * RHSM API query/search parameter GRANULARITY type.
 *
 * @type {string}
 */
const RHSM_API_QUERY_GRANULARITY = 'granularity';

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
 * RHSM API query/search parameter results LIMIT type.
 *
 * @type {string}
 */
const RHSM_API_QUERY_LIMIT = 'limit';

/**
 * RHSM API query/search parameter result set OFFSET type.
 *
 * @type {string}
 */
const RHSM_API_QUERY_OFFSET = 'offset';

/**
 * RHSM API query/search parameter OPT-IN TALLY SYNC type.
 *
 * @type {string}
 */
const RHSM_API_QUERY_OPTIN_TALLY_SYNC = 'enable_tally_sync';

/**
 * RHSM API query/search parameter OPT-IN TALLY REPORT type.
 *
 * @type {string}
 */
const RHSM_API_QUERY_OPTIN_TALLY_REPORT = 'enable_tally_reporting';

/**
 * RHSM API query/search parameter OPTIN CONDUIT SYNC type.
 *
 * @type {string}
 */
const RHSM_API_QUERY_OPTIN_CONDUIT_SYNC = 'enable_conduit_sync';

/**
 * RHSM API query/search parameter SLA type.
 *
 * @type {string}
 */
const RHSM_API_QUERY_SLA = 'sla';

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
 * RHSM API query/search parameter START DATE type.
 * Associated with a sequential date prior/before the target date.
 *
 * @type {string}
 */
const RHSM_API_QUERY_START_DATE = 'beginning';

/**
 * RHSM API query/search parameter END DATE type.
 * Associated with a sequential date on or after the target date. Limited by the current date.
 *
 * @type {string}
 */
const RHSM_API_QUERY_END_DATE = 'ending';

/**
 * RHSM API types.
 *
 * @type {{RHSM_API_QUERY_END_DATE: string, RHSM_API_QUERY_GRANULARITY: string, RHSM_API_QUERY_START_DATE: string,
 *    RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES: {OPTIN: string}, RHSM_API_RESPONSE_CAPACITY_DATA: string,
 *    RHSM_API_PATH_ID_TYPES: {RHEL_ARM: string, RHEL_WORKSTATION: string, RHEL_DESKTOP: string, RHEL: string,
 *    RHEL_SERVER: string, RHEL_IBM_Z: string, RHEL_COMPUTE_NODE: string, RHEL_IBM_POWER: string,
 *    RHEL_X86: string, OPENSHIFT: string}, RHSM_API_RESPONSE_ERROR_DATA_TYPES: {CODE: string, DETAIL: string},
 *    RHSM_API_QUERY_OPTIN_TALLY_REPORT: string, RHSM_API_QUERY_OPTIN_TALLY_SYNC: string,
 *    RHSM_API_QUERY_SLA: string, RHSM_API_RESPONSE_CAPACITY_META_TYPES: {COUNT: string},
 *    RHSM_API_QUERY_OPTIN_CONDUIT_SYNC: string, RHSM_API_QUERY_SLA_TYPES: {PREMIUM: string, SELF: string,
 *    NONE: string, STANDARD: string}, RHSM_API_RESPONSE_CAPACITY_DATA_TYPES: {HYPERVISOR_SOCKETS: string,
 *    CORES: string, DATE: string, SOCKETS: string, PHYSICAL_SOCKETS: string, HYPERVISOR_CORES: string,
 *    HAS_INFINITE: string, PHYSICAL_CORES: string}, RHSM_API_QUERY_LIMIT: string,
 *    RHSM_API_RESPONSE_CAPACITY_META: string, RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES: {HYPERVISOR_SOCKETS: string,
 *    CORES: string, DATE: string, SOCKETS: string, HAS_DATA: string, PHYSICAL_SOCKETS: string,
 *    HYPERVISOR_CORES: string, PHYSICAL_CORES: string}, RHSM_API_RESPONSE_PRODUCTS_META: string,
 *    RHSM_API_QUERY_GRANULARITY_TYPES: {WEEKLY: string, QUARTERLY: string, DAILY: string, MONTHLY: string},
 *    RHSM_API_RESPONSE_ERROR_DATA: string, RHSM_API_RESPONSE_PRODUCTS_DATA: string,
 *    RHSM_API_RESPONSE_PRODUCTS_META_TYPES: {COUNT: string}, RHSM_API_QUERY_OFFSET: string}}
 */
const rhsmApiTypes = {
  RHSM_API_RESPONSE_CAPACITY_DATA,
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_CAPACITY_META,
  RHSM_API_RESPONSE_CAPACITY_META_TYPES,
  RHSM_API_RESPONSE_ERROR_DATA,
  RHSM_API_RESPONSE_ERROR_DATA_TYPES,
  RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES,
  RHSM_API_RESPONSE_PRODUCTS_DATA,
  RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
  RHSM_API_RESPONSE_PRODUCTS_META,
  RHSM_API_RESPONSE_PRODUCTS_META_TYPES,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_LIMIT,
  RHSM_API_QUERY_OFFSET,
  RHSM_API_QUERY_OPTIN_TALLY_SYNC,
  RHSM_API_QUERY_OPTIN_TALLY_REPORT,
  RHSM_API_QUERY_OPTIN_CONDUIT_SYNC,
  RHSM_API_QUERY_SLA,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_START_DATE,
  RHSM_API_QUERY_END_DATE
};

export {
  rhsmApiTypes as default,
  rhsmApiTypes,
  RHSM_API_RESPONSE_CAPACITY_DATA,
  RHSM_API_RESPONSE_CAPACITY_DATA_TYPES,
  RHSM_API_RESPONSE_CAPACITY_META,
  RHSM_API_RESPONSE_CAPACITY_META_TYPES,
  RHSM_API_RESPONSE_ERROR_DATA,
  RHSM_API_RESPONSE_ERROR_DATA_TYPES,
  RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES,
  RHSM_API_RESPONSE_PRODUCTS_DATA,
  RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
  RHSM_API_RESPONSE_PRODUCTS_META,
  RHSM_API_RESPONSE_PRODUCTS_META_TYPES,
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_GRANULARITY,
  RHSM_API_QUERY_GRANULARITY_TYPES,
  RHSM_API_QUERY_LIMIT,
  RHSM_API_QUERY_OFFSET,
  RHSM_API_QUERY_OPTIN_TALLY_SYNC,
  RHSM_API_QUERY_OPTIN_TALLY_REPORT,
  RHSM_API_QUERY_OPTIN_CONDUIT_SYNC,
  RHSM_API_QUERY_SLA,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_START_DATE,
  RHSM_API_QUERY_END_DATE
};
