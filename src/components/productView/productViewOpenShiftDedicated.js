import React from 'react';
import PropTypes from 'prop-types';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_SORT_TYPES
} from '../../types/rhsmApiTypes';
import { ProductView } from './productView';
import { translate } from '../i18n/i18n';
import { dateHelpers } from '../../common';
import { ToolbarFieldRangedMonthly } from '../toolbar/toolbarFieldRangedMonthly';

/**
 * An OpenShift Dedicated configured view.
 *
 * @param {object} props
 * @param {object} props.productConfig
 * @param {object} props.routeDetail
 * @returns {Node}
 */
const ProductViewOpenShiftDedicated = ({ productConfig, routeDetail }) => {
  const { pathParameter: productId, viewParameter: viewId } = routeDetail;
  const { [RHSM_API_QUERY_TYPES.START_DATE]: startDate } = productConfig.graphTallyQuery;

  return (
    <ProductView
      routeDetail={routeDetail}
      productConfig={productConfig}
      toolbarProduct={false}
      toolbarGraph={<ToolbarFieldRangedMonthly productId={productId} value={startDate} viewId={viewId} />}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{routeDetail: object, productConfig:object}}
 */
ProductViewOpenShiftDedicated.propTypes = {
  productConfig: ProductView.propTypes.productConfig,
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string,
    productParameter: PropTypes.string,
    viewParameter: PropTypes.string
  }).isRequired
};

/**
 * Default props.
 *
 * @type {{ productConfig: object }}
 */
ProductViewOpenShiftDedicated.defaultProps = {
  productConfig: {
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
    initialInventoryFilters: [
      {
        id: 'displayName',
        cell: data => {
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
          (typeof data?.coreHours?.value === 'number' && Number.parseFloat(data?.coreHours?.value).toFixed(2)) ||
          `0.00`,
        isSortable: true,
        isWrappable: true,
        cellWidth: 15
      },
      {
        id: 'lastSeen',
        header: translate('curiosity-inventory.header', { context: 'lastSeen_OpenShift-dedicated-metrics' }),
        cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
        isSortable: true,
        isWrappable: true,
        cellWidth: 15
      }
    ],
    initialToolbarFilters: undefined
  }
};

export { ProductViewOpenShiftDedicated as default, ProductViewOpenShiftDedicated };
