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
import moment from 'moment';
import { RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES } from '../types/rhsmApiTypes';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_METRIC_TYPES
} from '../services/rhsm/rhsmConstants';
import { dateHelpers, helpers } from '../common';
import { translate, EMPTY_CONTEXT } from '../components/i18n/i18n';

/**
 * ToDo: evaluate separating products/product tags into individual configs...
 * or using anArray/List then generating "routes.js"
 */

const productGroup = RHSM_API_PATH_PRODUCT_TYPES.RHOSAK;

const productId = RHSM_API_PATH_PRODUCT_TYPES.RHOSAK;

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.RHOSAK;

const config = {
  productGroup,
  productId,
  productLabel,
  viewId: `view${productGroup}`,
  query: {
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  inventoryHostsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: RHSM_API_QUERY_INVENTORY_SORT_TYPES.LAST_SEEN,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  inventorySubscriptionsQuery: {
    [RHSM_API_QUERY_SET_TYPES.SORT]: RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES.NEXT_EVENT_DATE,
    [RHSM_API_QUERY_SET_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0
  },
  initialGraphFilters: [
    {
      id: RHSM_API_PATH_METRIC_TYPES.TRANSFER_GIBIBYTES,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value,
      chartType: 'line',
      isStacked: false,
      isStandalone: true,
      yAxisChartLabel: ({ id }) => translate('curiosity-graph.label_axisY', { context: id })
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.STORAGE_GIBIBYTE_MONTHS,
      fill: chartColorPurpleLight.value,
      stroke: chartColorPurpleDark.value,
      color: chartColorPurpleDark.value,
      chartType: 'line',
      isStacked: false,
      isStandalone: true,
      yAxisChartLabel: ({ id }) => translate('curiosity-graph.label_axisY', { context: id })
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
      fill: chartColorCyanLight.value,
      stroke: chartColorCyanDark.value,
      color: chartColorCyanDark.value,
      chartType: 'line',
      isStacked: false,
      isStandalone: true,
      yAxisChartLabel: ({ id }) => translate('curiosity-graph.label_axisY', { context: id })
    }
  ],
  initialGraphSettings: {
    isCardTitleDescription: true,
    xAxisChartLabel: () => translate('curiosity-graph.label_axisX', { context: GRANULARITY_TYPES.DAILY }),
    yAxisTickFormat: ({ tick }) => {
      if (tick > 1) {
        return helpers
          .numberDisplay(tick)
          ?.format({ average: true, mantissa: 1, trimMantissa: true, lowPrecision: false })
          ?.toUpperCase();
      }
      return helpers
        .numberDisplay(tick)
        ?.format({ average: true, mantissa: 5, trimMantissa: true, lowPrecision: true })
        ?.toUpperCase();
    }
  },
  initialInventoryFilters: [
    {
      id: INVENTORY_TYPES.DISPLAY_NAME,
      cell: (
        { [INVENTORY_TYPES.DISPLAY_NAME]: displayName = {}, [INVENTORY_TYPES.INVENTORY_ID]: inventoryId = {} },
        session
      ) => {
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

        return updatedDisplayName;
      },
      isSortable: true
    },
    {
      id: INVENTORY_TYPES.BILLING_PROVIDER,
      cell: ({ [INVENTORY_TYPES.BILLING_PROVIDER]: provider }) =>
        translate(`curiosity-inventory.measurement_${INVENTORY_TYPES.BILLING_PROVIDER}`, {
          context: provider?.value || 'none'
        }),
      isSortable: true,
      isWrappable: false,
      cellWidth: 15
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.TRANSFER_GIBIBYTES,
      header: {
        tooltip: () =>
          translate('curiosity-inventory.header', {
            context: ['tooltip', RHSM_API_PATH_METRIC_TYPES.TRANSFER_GIBIBYTES]
          })
      },
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.TRANSFER_GIBIBYTES]: total }) =>
        translate('curiosity-inventory.measurement', {
          context: RHSM_API_PATH_METRIC_TYPES.TRANSFER_GIBIBYTES,
          total: helpers.numberDisplay(total?.value)?.format({ mantissa: 5, trimMantissa: true }) || 0
        }),
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.STORAGE_GIBIBYTE_MONTHS,
      header: {
        tooltip: () =>
          translate('curiosity-inventory.header', {
            context: ['tooltip', RHSM_API_PATH_METRIC_TYPES.STORAGE_GIBIBYTE_MONTHS]
          })
      },
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.STORAGE_GIBIBYTE_MONTHS]: total }) =>
        translate('curiosity-inventory.measurement', {
          context: RHSM_API_PATH_METRIC_TYPES.STORAGE_GIBIBYTE_MONTHS,
          total: helpers.numberDisplay(total?.value)?.format({ mantissa: 5, trimMantissa: true }) || 0
        }),
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
      cell: ({ [RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS]: total }) =>
        translate('curiosity-inventory.measurement', {
          context: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
          total: helpers.numberDisplay(total?.value)?.format({ mantissa: 5, trimMantissa: true }) || 0
        }),
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: INVENTORY_TYPES.LAST_SEEN,
      cell: ({ [INVENTORY_TYPES.LAST_SEEN]: lastSeen }) =>
        (lastSeen?.value && <DateFormat date={lastSeen?.value} />) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialSubscriptionsInventoryFilters: [
    {
      id: 'productName',
      isSortable: true,
      isWrappable: true
    },
    {
      id: 'serviceLevel',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: 'quantity',
      isSortable: true,
      cellWidth: 10,
      isWrappable: true
    },
    {
      id: 'subscriptionType',
      cell: (data, session, meta) =>
        translate('curiosity-inventory.label_subscriptionType', {
          context: meta?.subscriptionType || EMPTY_CONTEXT
        }),
      isSortable: false,
      cellWidth: 15,
      isWrappable: true
    },
    {
      id: 'nextEventDate',
      cell: data =>
        (data?.nextEventDate?.value &&
          helpers.isDate(data?.nextEventDate?.value) &&
          moment.utc(data?.nextEventDate?.value).format('YYYY-MM-DD')) ||
        '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER
    }
  ],
  initialSecondaryToolbarFilters: [
    {
      id: 'rangedMonthly'
    }
  ]
};

export { config as default, config, productGroup, productId };
