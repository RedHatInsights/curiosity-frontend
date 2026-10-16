import rhsmConstants, * as allRhsmConstants from '../rhsmConstants';

const expectedMetricTypes = {
  CORES: 'Cores',
  CORE_SECONDS: 'Core-seconds',
  INSTANCE_HOURS: 'Instance-hours',
  MANAGED_NODES: 'Managed-nodes',
  SOCKETS: 'Sockets',
  STORAGE_GIBIBYTES: 'Storage-gibibytes',
  STORAGE_GIBIBYTE_MONTHS: 'Storage-gibibyte-months',
  TRANSFER_GIBIBYTES: 'Transfer-gibibytes',
  VCPUS: 'vCPUs',
  VCPUS_SELF_MANAGED: 'vCPUs-self-managed'
};

const expectedRhsmConstants = {
  RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES: {
    RHEL_ARM: 'RHEL for ARM',
    RHEL_AUS_ADDON: 'rhel-aus-addon',
    RHEL_IBM_POWER: 'RHEL for IBM Power',
    RHEL_IBM_Z: 'RHEL for IBM z',
    RHEL_X86: 'RHEL for x86',
    RHEL_X86_EUS: 'rhel-for-x86-eus',
    RHEL_X86_HA: 'rhel-for-x86-ha',
    RHEL_X86_RS: 'rhel-for-x86-rs',
    RHEL_X86_ELS_UNCONVERTED: 'rhel-for-x86-els-unconverted',
    RHEL_X86_SAP: 'rhel-for-sap-x86'
  },
  RHSM_API_PATH_PRODUCT_VARIANT_RHEL_ELS_TYPES: {
    RHEL_X86_ELS_PAYG: 'rhel-for-x86-els-payg',
    RHEL_X86_ELS_PAYG_ADDON: 'rhel-for-x86-els-payg-addon'
  },
  RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES: {
    SATELLITE_CAPSULE: 'Satellite Capsule',
    SATELLITE_SERVER: 'Satellite Server'
  },
  RHSM_API_PATH_PRODUCT_TYPES: {
    RHEL_ARM: 'RHEL for ARM',
    RHEL_AUS_ADDON: 'rhel-aus-addon',
    RHEL_IBM_POWER: 'RHEL for IBM Power',
    RHEL_IBM_Z: 'RHEL for IBM z',
    RHEL_X86: 'RHEL for x86',
    RHEL_X86_EUS: 'rhel-for-x86-eus',
    RHEL_X86_HA: 'rhel-for-x86-ha',
    RHEL_X86_RS: 'rhel-for-x86-rs',
    RHEL_X86_ELS_UNCONVERTED: 'rhel-for-x86-els-unconverted',
    RHEL_X86_SAP: 'rhel-for-sap-x86',
    RHEL_X86_ELS_PAYG: 'rhel-for-x86-els-payg',
    RHEL_X86_ELS_PAYG_ADDON: 'rhel-for-x86-els-payg-addon',
    SATELLITE_CAPSULE: 'Satellite Capsule',
    SATELLITE_SERVER: 'Satellite Server',
    ANSIBLE: 'ansible-aap-managed',
    RHACM: 'rhacm',
    RHACS: 'rhacs',
    RHEL_COMPUTE_NODE: 'RHEL Compute Node',
    RHEL_WORKSTATION: 'RHEL Workstation',
    RHODS: 'rhods',
    ROSA: 'rosa',
    OPENSHIFT: 'OpenShift Container Platform',
    OPENSHIFT_METRICS: 'OpenShift-metrics',
    OPENSHIFT_DEDICATED_METRICS: 'OpenShift-dedicated-metrics'
  },
  RHSM_API_PATH_METRIC_TYPES: expectedMetricTypes,
  RHSM_API_RESPONSE_DATA: 'data',
  RHSM_API_RESPONSE_ID: 'ids',
  RHSM_API_RESPONSE_META: 'meta',
  RHSM_API_RESPONSE_META_TYPES: { COUNT: 'count', PRODUCT: 'product' },
  RHSM_API_RESPONSE_ERRORS: 'errors',
  RHSM_API_RESPONSE_ERRORS_TYPES: { CODE: 'code' },
  RHSM_API_RESPONSE_ERRORS_CODE_TYPES: {
    GENERIC: 'SUBSCRIPTIONS1003',
    OPTIN: 'SUBSCRIPTIONS1004'
  },
  RHSM_API_RESPONSE_BILLING_ACCOUNT_ID_TYPES: {
    BILLING_ACCOUNT_ID: 'billing_account_id',
    BILLING_PROVIDER: 'billing_provider',
    ORG_ID: 'org_id',
    PRODUCT_TAG: 'product_tag'
  },
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES: {
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
  },
  RHSM_API_RESPONSE_INSTANCES_META_TYPES: {
    COUNT: 'count',
    PRODUCT: 'product',
    MEASUREMENTS: 'measurements'
  },
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES: {
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
    SUBSCRIPTION_MANAGER_ID: 'subscription_manager_id',
    HAS_INFINITE_QUANTITY: 'has_infinite_quantity',
    NEXT_EVENT_DATE: 'next_event_date',
    PRODUCT_NAME: 'product_name',
    QUANTITY: 'quantity',
    SERVICE_LEVEL: 'service_level'
  },
  RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES: {
    COUNT: 'count',
    PRODUCT: 'product',
    MEASUREMENTS: 'measurements',
    SUBSCRIPTION_TYPE: 'subscription_type'
  },
  RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES: {
    DATE: 'date',
    VALUE: 'value',
    HAS_DATA: 'has_data',
    HAS_INFINITE_QUANTITY: 'has_infinite_quantity'
  },
  RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES: {
    COUNT: 'count',
    PRODUCT: 'product',
    DATE: 'date',
    VALUE: 'value',
    HAS_CLOUDIGRADE_DATA: 'has_cloudigrade_data',
    HAS_CLOUDIGRADE_MISMATCH: 'has_cloudigrade_mismatch',
    HAS_DATA: 'has_data',
    METRIC_ID: 'metric_id',
    TOTAL_MONTHLY: 'total_monthly'
  },
  RHSM_API_RESPONSE_GRANULARITY_TYPES: {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    QUARTERLY: 'Quarterly'
  },
  RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES: { AWS: 'aws', AZURE: 'azure' },
  RHSM_API_RESPONSE_SLA_TYPES: {
    PREMIUM: 'Premium',
    STANDARD: 'Standard',
    SELF: 'Self-Support',
    NONE: ''
  },
  RHSM_API_RESPONSE_SUBSCRIPTION_TYPES: { ANNUAL: 'Annual', ON_DEMAND: 'On-demand' },
  RHSM_API_RESPONSE_USAGE_TYPES: {
    PRODUCTION: 'Production',
    DEVELOPMENT: 'Development/Test',
    DISASTER: 'Disaster Recovery',
    UNSPECIFIED: ''
  },
  RHSM_API_QUERY_CATEGORY_TYPES: {
    CLOUD: 'cloud',
    HYPERVISOR: 'hypervisor',
    ON_DEMAND: 'on-demand',
    PHYSICAL: 'physical',
    PREPAID: 'prepaid',
    VIRTUAL: 'virtual'
  },
  RHSM_API_QUERY_GRANULARITY_TYPES: {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    QUARTERLY: 'Quarterly'
  },
  RHSM_API_QUERY_INVENTORY_SORT_TYPES: {
    ...expectedMetricTypes,
    BILLING_PROVIDER: 'billing_provider',
    CATEGORY: 'category',
    LAST_SEEN: 'last_seen',
    NAME: 'display_name',
    NUMBER_OF_GUESTS: 'number_of_guests'
  },
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES: { ASCENDING: 'asc', DESCENDING: 'desc' },
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES: {
    NEXT_EVENT_DATE: 'next_event_date',
    NEXT_EVENT_TYPE: 'next_event_type',
    PRODUCT_NAME: 'product_name',
    QUANTITY: 'quantity',
    SKU: 'sku',
    SERVICE_LEVEL: 'service_level',
    TOTAL_CAPACITY: 'total_capacity',
    USAGE: 'usage'
  },
  RHSM_API_QUERY_BILLING_PROVIDER_TYPES: { AWS: 'aws', AZURE: 'azure' },
  RHSM_API_QUERY_SLA_TYPES: {
    PREMIUM: 'Premium',
    STANDARD: 'Standard',
    SELF: 'Self-Support',
    NONE: ''
  },
  RHSM_API_QUERY_USAGE_TYPES: {
    PRODUCTION: 'Production',
    DEVELOPMENT: 'Development/Test',
    DISASTER: 'Disaster Recovery',
    UNSPECIFIED: ''
  },
  RHSM_API_QUERY_SET_BILLING_ACCOUNT_ID_TYPES: { PRODUCT_TAG: 'product_tag', ORG_ID: 'org_id' },
  RHSM_API_QUERY_SET_INVENTORY_TYPES: {
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
  },
  RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES: {
    BILLING_CATEGORY: 'billing_category',
    BILLING_PROVIDER: 'billing_provider',
    BILLING_ACCOUNT_ID: 'billing_account_id',
    CATEGORY: 'category',
    END_DATE: 'ending',
    GRANULARITY: 'granularity',
    SLA: 'sla',
    START_DATE: 'beginning',
    USAGE: 'usage',
    USE_RUNNING_TOTALS_FORMAT: 'use_running_totals_format'
  },
  RHSM_API_QUERY_SET_TYPES: {
    PRODUCT_TAG: 'product_tag',
    ORG_ID: 'org_id',
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
    USAGE: 'usage',
    BILLING_CATEGORY: 'billing_category',
    GRANULARITY: 'granularity',
    USE_RUNNING_TOTALS_FORMAT: 'use_running_totals_format'
  },
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES: {
    DUAL_AXES: 'dual-axes',
    HOURLY: 'hourly',
    LEGACY: 'legacy',
    PARTIAL: 'partial',
    CAPACITY: 'capacity'
  }
};

describe('RHSM constants', () => {
  it('exposes the expected API identifier for each supported metric', () => {
    expect(rhsmConstants.RHSM_API_PATH_METRIC_TYPES).toEqual(expectedMetricTypes);
  });

  it('exports all RHSM constant values through named and default exports', () => {
    expect(allRhsmConstants).toEqual({
      ...expectedRhsmConstants,
      default: expectedRhsmConstants,
      rhsmConstants: expectedRhsmConstants
    });
    expect(allRhsmConstants.default).toBe(rhsmConstants);
    expect(allRhsmConstants.rhsmConstants).toBe(rhsmConstants);
  });
});
