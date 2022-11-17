import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark
} from '@patternfly/react-tokens';
import { Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import {
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_HOSTS_DATA_TYPES as INVENTORY_TYPES,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES
} from '../services/rhsm/rhsmConstants';
import { ChartTypeVariant } from '../components/chart/chart';
import { dateHelpers, helpers } from '../common';
import { translate } from '../components/i18n/i18n';

const productGroup = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT_DEDICATED_METRICS;

const productId = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT_DEDICATED_METRICS;

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT_DEDICATED_METRICS;

const config = {
  productGroup,
  productId,
  productLabel,
  productDisplay: DISPLAY_TYPES.DUAL_AXES,
  viewId: `view${productGroup}`,
  query: {
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
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
  initialGraphFilters: [
    {
      metric: RHSM_API_PATH_METRIC_TYPES.CORES,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value,
      chartType: ChartTypeVariant.line,
      isStacked: false,
      yAxisUseDataSet: true
    },
    {
      metric: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
      fill: chartColorCyanLight.value,
      stroke: chartColorCyanDark.value,
      color: chartColorCyanDark.value,
      chartType: ChartTypeVariant.line,
      isStacked: false,
      yAxisUseDataSet: true
    }
  ],
  initialGraphSettings: {
    isCardTitleDescription: true,
    actionDisplay: ({ data = [] } = {}) => {
      const { id, meta = {} } = data.find(({ metric }) => metric === RHSM_API_PATH_METRIC_TYPES.CORES) || {};
      const { totalMonthlyValue } = meta;
      let displayContent;

      if (totalMonthlyValue) {
        displayContent = translate('curiosity-graph.cardActionTotal', {
          context: id,
          total: helpers
            .numberDisplay(totalMonthlyValue)
            ?.format({ average: true, mantissa: 2, trimMantissa: true, lowPrecision: false })
            ?.toUpperCase()
        });
      }

      return <div className="curiosity-usage-graph__total">{displayContent || null}</div>;
    }
  },
  initialInventoryFilters: [
    {
      id: INVENTORY_TYPES.DISPLAY_NAME,
      cell: ({
        [INVENTORY_TYPES.DISPLAY_NAME]: displayName = {},
        [INVENTORY_TYPES.INVENTORY_ID]: inventoryId = {},
        [INVENTORY_TYPES.NUMBER_OF_GUESTS]: numberOfGuests = {}
      } = {}) => {
        if (!inventoryId.value) {
          return displayName.value;
        }

        const updatedDisplayName = displayName.value || inventoryId.value;

        return (
          <React.Fragment>
            {updatedDisplayName}{' '}
            {(numberOfGuests.value &&
              translate(
                'curiosity-inventory.label',
                { context: INVENTORY_TYPES.NUMBER_OF_GUESTS, count: numberOfGuests.value },
                [<PfLabel color="blue" />]
              )) ||
              ''}
          </React.Fragment>
        );
      },
      isSortable: true
    },
    {
      id: INVENTORY_TYPES.CORE_HOURS,
      cell: ({ [INVENTORY_TYPES.CORE_HOURS]: coreHours }) =>
        (typeof coreHours?.value === 'number' && Number.parseFloat(coreHours?.value).toFixed(2)) || `0.00`,
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: INVENTORY_TYPES.INSTANCE_HOURS,
      cell: ({ [INVENTORY_TYPES.INSTANCE_HOURS]: instanceHours } = {}) =>
        (typeof instanceHours?.value === 'number' && Number.parseFloat(instanceHours?.value).toFixed(2)) || `0.00`,
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
  initialToolbarFilters: undefined,
  initialSecondaryToolbarFilters: [
    {
      id: 'rangedMonthly'
    }
  ]
};

export { config as default, config, productGroup, productId };
