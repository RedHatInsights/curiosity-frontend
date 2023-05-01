import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
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
import { dateHelpers, helpers } from '../common';
import { SelectPosition } from '../components/form/select';
import { translate } from '../components/i18n/i18n';

// ToDo: evaluate the need for "productLabel" or using productId

const productGroup = 'openshift';

const productId = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT_METRICS;

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT_METRICS;

const config = {
  aliases: [RHSM_API_PATH_PRODUCT_TYPES.OPENSHIFT_METRICS, 'metrics'],
  productGroup,
  productId,
  productLabel,
  productPath: productGroup.toLowerCase(),
  productDisplay: DISPLAY_TYPES.PARTIAL,
  viewId: `view${productGroup}-${productId}`,
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
      isStacked: false
    }
  ],
  initialGraphSettings: {
    isCardTitleDescription: true,
    actions: [
      {
        content: ({ data = [] } = {}) => {
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
      {
        id: 'rangedMonthly',
        position: SelectPosition.right
      }
    ]
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
      id: INVENTORY_TYPES.CORE_HOURS,
      cell: ({ [INVENTORY_TYPES.CORE_HOURS]: coreHours } = {}) =>
        (typeof coreHours?.value === 'number' && Number.parseFloat(coreHours?.value).toFixed(2)) || `0.00`,
      isSortable: true,
      isWrappable: true,
      cellWidth: 20
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
  initialToolbarFilters: undefined
};

export { config as default, config, productGroup, productId };
