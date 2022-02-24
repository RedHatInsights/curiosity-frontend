import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Button, Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import moment from 'moment';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_PATH_ID_TYPES
} from '../types/rhsmApiTypes';
import { dateHelpers, helpers } from '../common';
import { translate } from '../components/i18n/i18n';

// ToDo: evaluate the need for "productLabel" or using productId

const productGroup = RHSM_API_PATH_ID_TYPES.OPENSHIFT;

const productId = RHSM_API_PATH_ID_TYPES.OPENSHIFT;

const productLabel = RHSM_API_PATH_ID_TYPES.OPENSHIFT;

const config = {
  productGroup,
  productId,
  productLabel,
  viewId: `view${productGroup}`,
  productContextFilterUom: true,
  query: {
    [RHSM_API_QUERY_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.CORES,
    [RHSM_API_QUERY_TYPES.START_DATE]: dateHelpers.getRangedDateTime(GRANULARITY_TYPES.DAILY).startDate.toISOString(),
    [RHSM_API_QUERY_TYPES.END_DATE]: dateHelpers.getRangedDateTime(GRANULARITY_TYPES.DAILY).endDate.toISOString()
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
  inventorySubscriptionsQuery: {
    [RHSM_API_QUERY_TYPES.SORT]: RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES.NEXT_EVENT_DATE,
    [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_TYPES.OFFSET]: 0
  },
  initialOption: RHSM_API_QUERY_UOM_TYPES.CORES,
  initialGraphFilters: [
    {
      id: 'cores',
      isOptional: true,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value
    },
    {
      id: 'sockets',
      isOptional: true,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value
    },
    { id: 'thresholdSockets', chartType: 'threshold', isOptional: true },
    { id: 'thresholdCores', chartType: 'threshold', isOptional: true }
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
      id: 'sockets',
      header: () => translate('curiosity-inventory.header', { context: ['sockets', 'OpenShift Container Platform'] }),
      isOptional: true,
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: 'cores',
      header: () => translate('curiosity-inventory.header', { context: ['cores', 'OpenShift Container Platform'] }),
      isOptional: true,
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: 'lastSeen',
      cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 25
    }
  ],
  initialInventorySettings: {},
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
      cellWidth: 20,
      isWrappable: true
    },
    {
      id: 'totalCapacity',
      header: data => translate('curiosity-inventory.header', { context: ['subscriptions', data?.uom?.value] }),
      isSortable: true,
      cellWidth: 15,
      isWrappable: true
    },
    {
      id: 'nextEventDate',
      cell: data => (data?.nextEventDate?.value && moment.utc(data?.nextEventDate?.value).format('YYYY-MM-DD')) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_TYPES.SLA
    }
  ]
};

export { config as default, config, productGroup, productId };
