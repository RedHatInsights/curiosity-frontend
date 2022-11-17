import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark,
  chart_color_purple_100 as chartColorPurpleLight,
  chart_color_purple_300 as chartColorPurpleDark
} from '@patternfly/react-tokens';
import { Button, Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import moment from 'moment';
import {
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../common';
import { Tooltip } from '../components/tooltip/tooltip';
import { ChartIcon } from '../components/chart/chartIcon';
import { ChartTypeVariant } from '../components/chart/chart';
import { translate } from '../components/i18n/i18n';

/**
 * ToDo: evaluate separating products/product tags into individual configs...
 * or using anArray/List then generating "routes.js"
 */

const productGroup = RHSM_API_PATH_PRODUCT_TYPES.RHEL;

const productId = null;

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.RHEL;

const config = {
  productGroup,
  productId,
  productLabel,
  productDisplay: DISPLAY_TYPES.PARTIAL,
  viewId: `view${productGroup}`,
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
        [RHSM_API_QUERY_SET_TYPES.CATEGORY]: CATEGORY_TYPES.HYPERVISOR
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
      chartType: ChartTypeVariant.threshold
    }
  ],
  initialGraphSettings: {},
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
            href={`${helpers.UI_DEPLOY_PATH_PREFIX}/insights/inventory/${inventoryId.value}/`}
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
      id: 'displayName',
      cell: (data, session) => {
        const { displayName = {}, inventoryId = {}, numberOfGuests = {} } = data;
        const { inventory: authorized } = session?.authorized || {};

        if (!inventoryId.value) {
          return displayName.value;
        }

        let updatedDisplayName = displayName.value || inventoryId.value;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              href={`${helpers.UI_DEPLOY_PATH_PREFIX}/insights/inventory/${inventoryId.value}/`}
            >
              {displayName.value || inventoryId.value}
            </Button>
          );
        }

        return (
          <React.Fragment>
            {updatedDisplayName}{' '}
            {(numberOfGuests.value &&
              translate('curiosity-inventory.label', { context: 'numberOfGuests', count: numberOfGuests.value }, [
                <PfLabel color="blue" />
              ])) ||
              ''}
          </React.Fragment>
        );
      },
      isSortable: true
    },
    {
      id: 'measurementType',
      cell: (data = {}) => {
        const { cloudProvider = {}, measurementType = {} } = data;
        return (
          <React.Fragment>
            {translate('curiosity-inventory.measurementType', { context: measurementType.value })}{' '}
            {(cloudProvider.value && (
              <PfLabel color="purple">
                {translate('curiosity-inventory.cloudProvider', { context: cloudProvider.value })}
              </PfLabel>
            )) ||
              ''}
          </React.Fragment>
        );
      },
      isSortable: true,
      cellWidth: 20
    },
    {
      id: 'sockets',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: 'lastSeen',
      cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialInventorySettings: {},
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
    }
  ],
  initialSecondaryToolbarFilters: [
    {
      id: RHSM_API_QUERY_SET_TYPES.GRANULARITY
    }
  ]
};

export { config as default, config, productGroup, productId };
