import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark,
  chart_color_purple_100 as chartColorPurpleLight,
  chart_color_purple_300 as chartColorPurpleDark
} from '@patternfly/react-tokens';
import { Button } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import {
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../common';
import { SelectPosition } from '../components/form/select';
import { translate } from '../components/i18n/i18n';

/**
 * Satellite
 *
 * @memberof Products
 * @module Satellite
 */

/**
 * Product group. A variant and dissimilar product configuration grouping identifier.
 *
 * @type {string}
 */
const productGroup = 'rhel';

/**
 * Product ID. The identifier used when querying the API.
 *
 * @type {string}
 */
const productId = RHSM_API_PATH_PRODUCT_TYPES.SATELLITE_SERVER;

/**
 * Product label. An identifier used for display strings.
 *
 * @type {string}
 */
const productLabel = 'Satellite';

/**
 * Product configuration
 *
 * @type {{productLabel: string, productPath: string, aliases: string[], productId: string,
 *     inventorySubscriptionsQuery: object, initialInventorySettings: object, viewId: string, initialToolbarFilters:
 *     Array, productGroup: string, graphTallyQuery: object, inventoryHostsQuery: object, productDisplay: string,
 *     productVariants: Array, initialGraphFilters: Array, initialGuestsFilters: Array, inventoryGuestsQuery: object,
 *     initialGraphSettings: object, initialInventoryFilters:
 *     Array}}
 */
const config = {
  aliases: ['sat', 'server', 'capsule'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.CAPACITY,
  viewId: `view${productGroup}-${productId}`,
  productVariants: [...Object.values(RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES)],
  query: {
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers
      .getRangedDateTime(GRANULARITY_TYPES.DAILY)
      .startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedDateTime(GRANULARITY_TYPES.DAILY).endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  inventoryGuestsQuery: {
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  inventoryHostsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: INVENTORY_SORT_TYPES.LAST_SEEN,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  inventorySubscriptionsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: SUBSCRIPTIONS_SORT_TYPES.NEXT_EVENT_DATE,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  initialGraphFilters: [
    {
      filters: [
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.PHYSICAL
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          fill: chartColorCyanLight.value,
          stroke: chartColorCyanDark.value,
          color: chartColorCyanDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.VIRTUAL
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          fill: chartColorPurpleLight.value,
          stroke: chartColorPurpleDark.value,
          color: chartColorPurpleDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.CLOUD
          }
        }
      ]
    }
  ],
  initialGraphSettings: {
    isDisabledLegendClick: true,
    actions: [
      {
        id: RHSM_API_QUERY_SET_TYPES.GRANULARITY,
        position: SelectPosition.right
      }
    ]
  },
  initialGuestsFilters: [
    {
      metric: INVENTORY_TYPES.DISPLAY_NAME,
      header: () => translate('curiosity-inventory.guestsHeader', { context: [INVENTORY_TYPES.DISPLAY_NAME] }),
      cell: (
        { [INVENTORY_TYPES.DISPLAY_NAME]: displayName, [INVENTORY_TYPES.INVENTORY_ID]: inventoryId } = {},
        session
      ) => {
        const { inventory: authorized } = session?.authorized || {};

        if (!inventoryId) {
          return displayName;
        }

        let updatedDisplayName = displayName || inventoryId;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/insights/inventory/${inventoryId}/`}
            >
              {updatedDisplayName}
            </Button>
          );
        }

        return updatedDisplayName;
      }
    },
    {
      metric: INVENTORY_TYPES.INVENTORY_ID,
      width: 40
    },
    {
      metric: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen } = {}) => (lastSeen && <DateFormat date={lastSeen} />) || '',
      width: 15
    }
  ],
  initialInventoryFilters: [
    {
      metric: INVENTORY_TYPES.DISPLAY_NAME,
      cell: ({ [INVENTORY_TYPES.DISPLAY_NAME]: displayName, [INVENTORY_TYPES.INVENTORY_ID]: inventoryId }, session) => {
        const { inventory: authorized } = session?.authorized || {};

        if (!inventoryId) {
          return displayName;
        }

        let updatedDisplayName = displayName || inventoryId;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/insights/inventory/${inventoryId}/`}
            >
              {updatedDisplayName}
            </Button>
          );
        }

        return updatedDisplayName;
      },
      isSort: true
    },
    {
      metric: INVENTORY_TYPES.NUMBER_OF_GUESTS,
      cell: ({ [INVENTORY_TYPES.NUMBER_OF_GUESTS]: total } = {}) =>
        translate('curiosity-inventory.measurement', {
          context: (total && 'value') || undefined,
          total,
          testId: <span data-test={`instances-cell-${INVENTORY_TYPES.NUMBER_OF_GUESTS}`} data-value={`${total}`} />
        }),
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: INVENTORY_TYPES.CATEGORY,
      cell: ({ [INVENTORY_TYPES.CLOUD_PROVIDER]: cloudProvider, [INVENTORY_TYPES.CATEGORY]: category } = {}) =>
        translate('curiosity-inventory.label', {
          context: (cloudProvider && [INVENTORY_TYPES.CLOUD_PROVIDER, cloudProvider]) || [
            INVENTORY_TYPES.CATEGORY,
            category
          ]
        }),
      isSort: true,
      width: 15
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.SOCKETS]: total } = {}) =>
        translate('curiosity-inventory.measurement', {
          context: (total && 'value') || undefined,
          total,
          testId: <span data-test={`instances-cell-${RHSM_API_PATH_METRIC_TYPES.SOCKETS}`} data-value={`${total}`} />
        }),
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen } = {}) => (lastSeen && <DateFormat date={lastSeen} />) || '',
      isSort: true,
      isWrap: true,
      width: 15
    }
  ],
  initialInventorySettings: {
    actions: [
      {
        id: RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME
      }
    ],
    guestContent: ({
      [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests = {},
      [INVENTORY_TYPES.INSTANCE_ID]: id
    } = {}) => (numberOfGuests > 0 && id && { id, numberOfGuests }) || undefined
  },
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_SET_TYPES.SLA
    },
    {
      id: RHSM_API_QUERY_SET_TYPES.USAGE,
      selected: true
    },
    {
      id: RHSM_API_QUERY_SET_TYPES.CATEGORY
    },
    {
      id: 'export',
      isItem: true
    }
  ]
};

export { config as default, config, productGroup, productId };
