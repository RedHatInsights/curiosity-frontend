import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark,
  chart_color_orange_100 as chartColorOrangeLight,
  chart_color_orange_300 as chartColorOrangeDark,
  chart_color_purple_100 as chartColorPurpleLight,
  chart_color_purple_300 as chartColorPurpleDark
} from '@patternfly/react-tokens';
import { Button, Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import moment from 'moment';
import {
  RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES,
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES as INVENTORY_META_TYPES
} from '../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../common';
import { Tooltip } from '../components/tooltip/tooltip';
import { ChartIcon } from '../components/chart/chartIcon';
import { ChartTypeVariant } from '../components/chart/chart';
import { SelectPosition } from '../components/form/select';
import { translate } from '../components/i18n/i18n';

/**
 * ToDo: evaluate separating products/product tags into individual configs...
 * or using anArray/List then generating "routes.js"
 */

const productGroup = 'rhel';

const productId = RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86;

const productLabel = 'RHEL';

/**
 * RHEL product config
 *
 * @type {{productLabel: string, productPath: string, aliases: string[], productId: string, inventorySubscriptionsQuery: object,
 *     query: object, initialSubscriptionsInventoryFilters: {}[], initialInventorySettings: object, viewId: string,
 *     initialToolbarFilters: {}[], productGroup: string, graphTallyQuery: object, inventoryHostsQuery: object, productDisplay: string,
 *     productVariants: Array, initialGraphFilters: {}[], initialGuestsFilters: {}[], inventoryGuestsQuery: object,
 *     initialGraphSettings: object, initialInventoryFilters: {}[]}}
 */
const config = {
  aliases: ['insights', 'enterprise', 'linux', 'el', 'x86', 'ibm', 'power'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.CAPACITY,
  viewId: `view${productGroup}`,
  productVariants: [...Object.values(RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES)],
  query: {
    [RHSM_API_QUERY_SET_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.SOCKETS,
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
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          fill: chartColorOrangeLight.value,
          stroke: chartColorOrangeDark.value,
          color: chartColorOrangeDark.value,
          query: {
            [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.HYPERVISOR
          }
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          chartType: ChartTypeVariant.threshold
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
      cell: ({ [INVENTORY_TYPES.DISPLAY_NAME]: displayName, [INVENTORY_TYPES.INSTANCE_ID]: instanceId }, session) => {
        const { inventory: authorized } = session?.authorized || {};

        if (!instanceId) {
          return displayName;
        }

        let updatedDisplayName = displayName || instanceId;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/insights/inventory/${instanceId}/`}
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
      cell: ({ [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests } = {}) => numberOfGuests || '--',
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: INVENTORY_TYPES.CATEGORY,
      cell: ({ [INVENTORY_TYPES.CLOUD_PROVIDER]: cloudProvider, [INVENTORY_TYPES.CATEGORY]: category } = {}) => (
        <React.Fragment>
          {translate('curiosity-inventory.label', { context: [INVENTORY_TYPES.CATEGORY, category] })}{' '}
          {(cloudProvider && (
            <PfLabel color="purple">
              {translate('curiosity-inventory.label', {
                context: [INVENTORY_TYPES.CLOUD_PROVIDER, cloudProvider]
              })}
            </PfLabel>
          )) ||
            ''}
        </React.Fragment>
      ),
      isSort: true,
      width: 20
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.SOCKETS]: sockets } = {}) => sockets || '--',
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
  initialSubscriptionsInventoryFilters: [
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME,
      isSort: true,
      isWrap: true
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL,
      isSort: true,
      isWrap: true,
      width: 15
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.QUANTITY,
      isSort: true,
      isWrap: true,
      width: 10
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY,
      header: (data, session, { [INVENTORY_META_TYPES.UOM]: uom } = {}) =>
        translate('curiosity-inventory.header', { context: ['subscriptions', uom] }),
      cell: ({
        [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY]: hasInfiniteQuantity,
        [SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY]: totalCapacity,
        [SUBSCRIPTIONS_INVENTORY_TYPES.UOM]: uom
      } = {}) => {
        if (hasInfiniteQuantity === true) {
          const content = translate(
            `curiosity-inventory.label_${SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY}`,
            { context: uom }
          );
          return (
            <Tooltip content={content}>
              <ChartIcon symbol="infinity" aria-label={content} />
            </Tooltip>
          );
        }
        return totalCapacity;
      },
      isSort: true,
      isWrap: true,
      width: 10
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE,
      cell: ({ [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: nextEventDate } = {}) =>
        (nextEventDate && moment.utc(nextEventDate).format('YYYY-MM-DD')) || '',
      isSort: true,
      isWrap: true,
      width: 15
    }
  ],
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
    }
  ]
};

export { config as default, config, productGroup, productId };
