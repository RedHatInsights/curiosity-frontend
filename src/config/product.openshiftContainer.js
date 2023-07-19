import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Button, Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import moment from 'moment';
import {
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_INSTANCES_META_TYPES as INVENTORY_META_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../common';
import { Tooltip } from '../components/tooltip/tooltip';
import { ChartTypeVariant } from '../components/chart/chart';
import { ChartIcon } from '../components/chart/chartIcon';
import { SelectPosition } from '../components/form/select';
import { translate } from '../components/i18n/i18n';

// ToDo: evaluate the need for "productLabel" or using productId

const productGroup = 'openshift';

const productId = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT;

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT;

/**
 * OpenShift Container product config
 *
 * @type {{productLabel: string, productPath: string, initialOption: string, aliases: string[], productId: string,
 *     inventorySubscriptionsQuery: object, query: object, initialSubscriptionsInventoryFilters: {}[],
 *     initialInventorySettings: {}, viewId: string, initialToolbarFilters: {}[], productGroup: string,
 *     graphTallyQuery: object, inventoryHostsQuery: object, productDisplay: string, productContextFilterUom: boolean,
 *     initialGraphFilters: {}[], initialGuestsFilters: {}[], initialGraphSettings: object, initialInventoryFilters: {}[]}}
 */
const config = {
  aliases: [RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT, 'openshift-container', 'container', 'platform', 'shift'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.CAPACITY,
  viewId: `view${productGroup}`,
  productContextFilterUom: true,
  query: {
    [RHSM_API_QUERY_SET_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.CORES,
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
  initialOption: RHSM_API_QUERY_UOM_TYPES.CORES,
  initialGraphFilters: [
    {
      filters: [
        {
          metric: RHSM_API_PATH_METRIC_TYPES.CORES,
          isOptional: true,
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          isOptional: true,
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          chartType: ChartTypeVariant.threshold,
          isOptional: true
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.CORES,
          chartType: ChartTypeVariant.threshold,
          isOptional: true
        }
      ]
    }
  ],
  initialGraphSettings: {
    isCardTitleDescription: true,
    actions: [
      {
        id: RHSM_API_QUERY_SET_TYPES.UOM,
        position: SelectPosition.right
      },
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
        {
          [INVENTORY_TYPES.DISPLAY_NAME]: displayName = {},
          [INVENTORY_TYPES.INSTANCE_ID]: instanceId = {},
          [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests = {}
        } = {},
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

        return (
          <React.Fragment>
            {updatedDisplayName}{' '}
            {(numberOfGuests.value &&
              translate('curiosity-inventory.label', { context: 'numberOfGuests', count: numberOfGuests?.value }, [
                <PfLabel color="blue" />
              ])) ||
              ''}
          </React.Fragment>
        );
      },
      isSortable: true
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.CORES,
      header: (data, session, { [INVENTORY_META_TYPES.UOM]: uom } = {}) =>
        translate('curiosity-inventory.header', { context: [uom, productId] }),
      cell: (data = {}, session, { [INVENTORY_META_TYPES.UOM]: uom } = {}) => data?.[uom]?.value || '--',
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
      cellWidth: 20
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
      cellWidth: 20,
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
      cellWidth: 15,
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
    }
  ]
};

export { config as default, config, productGroup, productId };
