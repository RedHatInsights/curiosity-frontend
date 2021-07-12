import React from 'react';
import PropTypes from 'prop-types';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { ProductView } from './productView';
import { ToolbarFieldRangedMonthly } from '../toolbar/toolbarFieldRangedMonthly';

/**
 * An OpenShift Dedicated configured view.
 *
 * @param {object} props
 * @param {object} props.routeDetail
 * @returns {Node}
 */
const ProductViewOpenShiftDedicated = ({ routeDetail }) => {
  const { productConfig, viewParameter: viewId } = routeDetail;
  const { [RHSM_API_QUERY_TYPES.START_DATE]: startDate } = productConfig?.[0].graphTallyQuery;

  return (
    <ProductView
      routeDetail={routeDetail}
      toolbarProduct={false}
      toolbarGraph={<ToolbarFieldRangedMonthly value={startDate} viewId={viewId} />}
      toolbarGraphDescription
    />
  );
};

/**
 * Prop types.
 *
 * @type {{routeDetail: object}}
 */
ProductViewOpenShiftDedicated.propTypes = {
  routeDetail: PropTypes.shape(ProductView.propTypes.routeDetail).isRequired
};

/**
 * Default props.
 */
ProductViewOpenShiftDedicated.defaultProps = {};

export { ProductViewOpenShiftDedicated as default, ProductViewOpenShiftDedicated };
