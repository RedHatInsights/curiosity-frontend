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
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../common';
import { Tooltip } from '../components/tooltip/tooltip';
import { ChartTypeVariant } from '../components/chart/chart';
import { ChartIcon } from '../components/chart/chartIcon';
import { SelectPosition } from '../components/form/select';
import { translate } from '../components/i18n/i18n';

/**
 * OpenShift Container
 *
 * @memberof Products
 * @module OpenShiftContainer
 */

// ToDo: evaluate the need for "productLabel" or using productId

/**
 * Product group. A variant and dissimilar product configuration grouping identifier.
 *
 * @type {string}
 */
const productGroup = 'openshift';

/**
 * Product ID. The identifier used when querying the API.
 *
 * @type {string}
 */
const productId = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT;

/**
 * Product label. An identifier used for display strings.
 *
 * @type {string}
 */
const productLabel = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT;

/**
 * Product configuration
 *
 * @type {{productLabel: string, productPath: string, initialOption: string, aliases: string[], productId: string,
 *     inventorySubscriptionsQuery: object, query: object, initialSubscriptionsInventoryFilters: Array,
 *     initialInventorySettings: object, viewId: string, initialToolbarFilters: Array, productGroup: string,
 *     graphTallyQuery: object, inventoryHostsQuery: object, productDisplay: string,
 *     initialGraphFilters: Array, initialGuestsFilters: Array, inventoryGuestsQuery: object, initialGraphSettings:
 *     object, initialInventoryFilters: Array}}
 */
const config = {
  aliases: [RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT, 'openshift-container', 'container', 'platform', 'shift'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.CAPACITY,
  viewId: `view${productGroup}`,
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
          metric: RHSM_API_PATH_METRIC_TYPES.CORES,
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.CORES,
          chartType: ChartTypeVariant.threshold
        }
      ]
    },
    {
      filters: [
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value
        },
        {
          metric: RHSM_API_PATH_METRIC_TYPES.SOCKETS,
          chartType: ChartTypeVariant.threshold
        }
      ]
    }
  ],
  initialGraphSettings: {
    isCardTitleDescription: true
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
      cell: (
        {
          [INVENTORY_TYPES.DISPLAY_NAME]: displayName,
          [INVENTORY_TYPES.INVENTORY_ID]: inventoryId,
          [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests
        } = {},
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

        return (
          <React.Fragment>
            {updatedDisplayName}{' '}
            {(numberOfGuests &&
              translate('curiosity-inventory.label', { context: 'numberOfGuests', count: numberOfGuests }, [
                <PfLabel color="blue" />
              ])) ||
              ''}
          </React.Fragment>
        );
      },
      isSort: true
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.CORES,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.CORES]: total } = {}) =>
        translate('curiosity-inventory.measurement', {
          context: (total && 'value') || undefined,
          total,
          testId: <span data-test={`instances-cell-${RHSM_API_PATH_METRIC_TYPES.CORES}`} data-value={`${total}`} />
        }),
      isSort: true,
      isWrap: true,
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
      cell: ({ [SUBSCRIPTIONS_INVENTORY_TYPES.QUANTITY]: total } = {}) =>
        translate('curiosity-inventory.measurement', {
          context: (total && 'value') || undefined,
          total,
          testId: (
            <span data-test={`subscriptions-cell-${SUBSCRIPTIONS_INVENTORY_TYPES.QUANTITY}`} data-value={`${total}`} />
          )
        }),
      isSort: true,
      isWrap: true,
      width: 10
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY,
      header: () =>
        translate('curiosity-inventory.header', { context: ['subscriptions', RHSM_API_PATH_METRIC_TYPES.CORES] }),
      cell: ({ hasInfiniteCores: hasInfiniteQuantity, [RHSM_API_PATH_METRIC_TYPES.CORES]: total } = {}) => {
        if (hasInfiniteQuantity === true) {
          const content = translate(`curiosity-inventory.label`, {
            context: [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY, RHSM_API_PATH_METRIC_TYPES.CORES]
          });
          return (
            <Tooltip content={content}>
              <ChartIcon symbol="infinity" size="md" aria-label={content} />
            </Tooltip>
          );
        }
        return translate('curiosity-inventory.measurement', {
          context: (total && 'value') || undefined,
          total,
          testId: (
            <span
              data-test={`subscriptions-cell-${SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY}-${RHSM_API_PATH_METRIC_TYPES.CORES}`}
              data-value={`${total}`}
            />
          )
        });
      },
      isWrap: true,
      width: 10
    },
    {
      metric: SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY,
      header: () =>
        translate('curiosity-inventory.header', { context: ['subscriptions', RHSM_API_PATH_METRIC_TYPES.SOCKETS] }),
      cell: ({ hasInfiniteSockets: hasInfiniteQuantity, [RHSM_API_PATH_METRIC_TYPES.SOCKETS]: total } = {}) => {
        if (hasInfiniteQuantity === true) {
          const content = translate(`curiosity-inventory.label`, {
            context: [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY, RHSM_API_PATH_METRIC_TYPES.SOCKETS]
          });
          return (
            <Tooltip content={content}>
              <ChartIcon symbol="infinity" size="md" aria-label={content} />
            </Tooltip>
          );
        }
        return translate('curiosity-inventory.measurement', {
          context: (total && 'value') || undefined,
          total,
          testId: (
            <span
              data-test={`subscriptions-cell-${SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY}-${RHSM_API_PATH_METRIC_TYPES.SOCKETS}`}
              data-value={`${total}`}
            />
          )
        });
      },
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
      id: RHSM_API_QUERY_SET_TYPES.GRANULARITY,
      isSecondary: true,
      position: SelectPosition.right
    }
  ]
};

export { config as default, config, productGroup, productId };
