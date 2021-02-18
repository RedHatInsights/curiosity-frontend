import React from 'react';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Button, Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import moment from 'moment';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_UOM_TYPES
} from '../../types/rhsmApiTypes';
import { ConnectedProductView, ProductView } from './productView';
import { translate } from '../i18n/i18n';
import { helpers } from '../../common';
import { useRouteDetail } from '../router/routerContext';
import { ToolbarFieldUom } from '../toolbar/toolbarFieldUom';

/**
 * An OpenShift configured view, and related system variations.
 *
 * @param {object} props
 * @param {object} props.productConfig
 * @param {object} props.routeDetail
 * @returns {Node}
 */
const ProductViewOpenShift = ({ productConfig, routeDetail }) => {
  const { viewParameter: viewId } = useRouteDetail(routeDetail);
  const filterOption = RHSM_API_QUERY_UOM_TYPES.CORES;

  return (
    <ConnectedProductView
      graphCardToolbar={<ToolbarFieldUom value={filterOption} viewId={viewId} />}
      productConfig={{ ...productConfig, productContextFilterUom: filterOption }}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{routeDetail:object, productConfig:object}}
 */
ProductViewOpenShift.propTypes = {
  productConfig: ProductView.propTypes.productConfig,
  routeDetail: ProductView.propTypes.routeDetail
};

/**
 * Default props.
 *
 * @type {{routeDetail:object, productConfig:object}}
 */
ProductViewOpenShift.defaultProps = {
  productConfig: {
    query: {
      [RHSM_API_QUERY_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.CORES
    },
    graphTallyQuery: {
      [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
    },
    inventoryHostsQuery: {
      [RHSM_API_QUERY_TYPES.SORT]: RHSM_API_QUERY_SORT_TYPES.LAST_SEEN,
      [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.ASCENDING,
      [RHSM_API_QUERY_TYPES.LIMIT]: 100,
      [RHSM_API_QUERY_TYPES.OFFSET]: 0
    },
    inventorySubscriptionsQuery: {
      [RHSM_API_QUERY_TYPES.SORT]: RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES.UPCOMING_EVENT_DATE,
      [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.ASCENDING,
      [RHSM_API_QUERY_TYPES.LIMIT]: 100,
      [RHSM_API_QUERY_TYPES.OFFSET]: 0
    },
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
      { id: 'thresholdSockets', isOptional: true },
      { id: 'thresholdCores', isOptional: true }
    ],
    initialGuestsFilters: [
      {
        id: 'displayName',
        header: translate('curiosity-inventory.header', { context: 'guestsDisplayName' }),
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
              target="_blank"
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
                target="_blank"
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
        cell: data => {
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
        isOptional: true,
        isSortable: true,
        isWrappable: true,
        cellWidth: 15
      },
      {
        id: 'cores',
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
        cellWidth: 15
      }
    ],
    initialInventorySettings: {},
    initialSubscriptionsInventoryFilters: [
      {
        id: 'productName',
        isSortable: true
      },
      {
        id: 'serviceLevel',
        isSortable: true,
        isWrappable: true,
        cellWidth: 15
      },
      {
        id: 'upcomingEventDate',
        cell: data =>
          (data?.upcomingEventDate?.value && moment.utc(data?.upcomingEventDate?.value).format('YYYY-DD-MM')) || '',
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
  },
  routeDetail: {}
};

export { ProductViewOpenShift as default, ProductViewOpenShift };
