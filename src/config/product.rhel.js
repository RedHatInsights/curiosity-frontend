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
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
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

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.RHEL;

/**
 * RHEL product config
 *
 * @type {{aliases: string[], productGroup: string, productId: string, productLabel: string, productDisplay: string, viewId: string,
 *     productVariants: string[], query: object, graphTallyQuery: object, inventoryHostQuery: object, inventorySubscriptionsQuery: object,
 *     initialGraphFilters: {}[], initialGraphSettings: object, initialGuestsFilters: {}[], initialInventoryFilters: {}[],
 *     initialSubscriptionsInventoryFilters: {}[], initialToolbarFilters: {}[]}}
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
      id: 'displayName',
      header: () => translate('curiosity-inventory.header', { context: 'guestsDisplayName' }),
      cell: (data, session) => {
        const { displayName, inventoryId } = data;
        const { inventory: authorized } = session?.authorized || {};

        if (!inventoryId?.value) {
          return displayName?.value;
        }

        if (!authorized) {
          return displayName?.value || inventoryId?.value;
        }

        return (
          <Button
            isInline
            component="a"
            variant="link"
            href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/insights/inventory/${inventoryId.value}/`}
          >
            {displayName.value || inventoryId.value}
          </Button>
        );
      }
    },
    {
      id: 'inventoryId',
      cellWidth: 40
    },
    {
      id: 'lastSeen',
      cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
      cellWidth: 15
    }
  ],
  initialInventoryFilters: [
    {
      id: INVENTORY_TYPES.DISPLAY_NAME,
      cell: (
        { [INVENTORY_TYPES.DISPLAY_NAME]: displayName = {}, [INVENTORY_TYPES.INSTANCE_ID]: instanceId = {} },
        session
      ) => {
        const { inventory: authorized } = session?.authorized || {};

        if (!instanceId.value) {
          return displayName.value;
        }

        let updatedDisplayName = displayName.value || instanceId.value;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              href={`${helpers.UI_DEPLOY_PATH_LINK_PREFIX}/insights/inventory/${instanceId.value}/`}
            >
              {displayName.value || instanceId.value}
            </Button>
          );
        }

        return updatedDisplayName;
      },
      isSortable: true
    },
    {
      id: INVENTORY_TYPES.NUMBER_OF_GUESTS,
      cell: ({ [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests } = {}) => numberOfGuests?.value || '--',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: INVENTORY_TYPES.CATEGORY,
      cell: ({ [INVENTORY_TYPES.CLOUD_PROVIDER]: cloudProvider, [INVENTORY_TYPES.CATEGORY]: category } = {}) => (
        <React.Fragment>
          {translate('curiosity-inventory.label', { context: [INVENTORY_TYPES.CATEGORY, category?.value] })}{' '}
          {(cloudProvider?.value && (
            <PfLabel color="purple">
              {translate('curiosity-inventory.label', {
                context: [INVENTORY_TYPES.CLOUD_PROVIDER, cloudProvider?.value]
              })}
            </PfLabel>
          )) ||
            ''}
        </React.Fragment>
      ),
      isSortable: true,
      cellWidth: 20
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.SOCKETS]: sockets } = {}) => sockets?.value || '--',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen } = {}) =>
        (lastSeen?.value && <DateFormat date={lastSeen?.value} />) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialInventorySettings: {
    guestContent: ({
      [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests = {},
      [INVENTORY_TYPES.SUBSCRIPTION_MANAGER_ID]: subscriptionManagerId
    } = {}) => (numberOfGuests > 0 && subscriptionManagerId) || undefined
  },
  initialSubscriptionsInventoryFilters: [
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME,
      isSortable: true,
      isWrappable: true
    },
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL,
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.QUANTITY,
      isSortable: true,
      cellWidth: 10,
      isWrappable: true
    },
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY,
      header: ({ [SUBSCRIPTIONS_INVENTORY_TYPES.UOM]: uom } = {}) =>
        translate('curiosity-inventory.header', { context: ['subscriptions', uom?.value] }),
      cell: ({
        [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY]: hasInfiniteQuantity,
        [SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY]: totalCapacity,
        [SUBSCRIPTIONS_INVENTORY_TYPES.UOM]: uom
      } = {}) => {
        if (hasInfiniteQuantity?.value === true) {
          const content = translate(
            `curiosity-inventory.label_${SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY}`,
            { context: uom?.value }
          );
          return (
            <Tooltip content={content}>
              <ChartIcon symbol="infinity" aria-label={content} />
            </Tooltip>
          );
        }
        return totalCapacity?.value;
      },
      isSortable: true,
      cellWidth: 10,
      isWrappable: true
    },
    {
      id: SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE,
      cell: ({ [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: nextEventDate } = {}) =>
        (nextEventDate?.value && moment.utc(nextEventDate?.value).format('YYYY-MM-DD')) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
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
