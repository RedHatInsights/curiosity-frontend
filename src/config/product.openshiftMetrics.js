import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import numbro from 'numbro';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_PATH_ID_TYPES
} from '../types/rhsmApiTypes';
import { dateHelpers } from '../common';
import { translate } from '../components/i18n/i18n';

// ToDo: evaluate the need for "productLabel" or using productId

const productGroup = RHSM_API_PATH_ID_TYPES.OPENSHIFT_METRICS;

const productId = RHSM_API_PATH_ID_TYPES.OPENSHIFT_METRICS;

const productLabel = 'OpenShift Metric';

const config = {
  productGroup,
  productId,
  productLabel,
  viewId: `view${productGroup}`,
  query: {
    [RHSM_API_QUERY_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  inventoryHostsQuery: {
    [RHSM_API_QUERY_TYPES.SORT]: RHSM_API_QUERY_SORT_TYPES.LAST_SEEN,
    [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_TYPES.OFFSET]: 0
  },
  initialGraphFilters: [
    {
      id: 'coreHours',
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value
    }
  ],
  initialGraphSettings: {
    actionDisplay: (data = {}) => {
      const {
        meta: { totalCoreHours }
      } = data;
      let displayContent;

      if (totalCoreHours) {
        displayContent = translate('curiosity-graph.card-action-total', {
          context: 'coreHours',
          total: numbro(totalCoreHours)
            .format({ average: true, mantissa: 2, trimMantissa: true, lowPrecision: false })
            .toUpperCase()
        });
      }

      return <div className="curiosity-usage-graph__total">{displayContent || null}</div>;
    }
  },
  initialInventoryFilters: [
    {
      id: 'displayName',
      cell: (data = {}) => {
        const { displayName = {}, inventoryId = {}, numberOfGuests = {} } = data;

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
      id: 'coreHours',
      cell: data =>
        (typeof data?.coreHours?.value === 'number' && Number.parseFloat(data?.coreHours?.value).toFixed(2)) || `0.00`,
      isSortable: true,
      isWrappable: true,
      cellWidth: 20
    },
    {
      id: 'lastSeen',
      cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 25
    }
  ],
  initialToolbarFilters: undefined
};

export { config as default, config, productGroup, productId };
