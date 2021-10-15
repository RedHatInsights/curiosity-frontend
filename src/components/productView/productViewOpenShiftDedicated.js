import React from 'react';
import PropTypes from 'prop-types';
import { useRouteDetail } from '../../hooks/useRouter';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { ProductView } from './productView';
import { ToolbarFieldRangedMonthly } from '../toolbar/toolbarFieldRangedMonthly';

/**
 * An OpenShift Dedicated configured view.
 *
 * @param {object} props
 * @param {Function} props.useRouteDetail
 * @returns {Node}
 */
const ProductViewOpenShiftDedicated = ({ useRouteDetail: useAliasRouteDetail }) => {
  const { productConfig, viewParameter: viewId } = useAliasRouteDetail();
  const { [RHSM_API_QUERY_TYPES.START_DATE]: startDate } = productConfig?.[0].graphTallyQuery;

  return (
    <ProductView
      toolbarProduct={false}
      toolbarGraph={<ToolbarFieldRangedMonthly value={startDate} viewId={viewId} />}
      toolbarGraphDescription
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useRouteDetail: Function}}
 */
ProductViewOpenShiftDedicated.propTypes = {
  useRouteDetail: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useRouteDetail: Function}}
 */
ProductViewOpenShiftDedicated.defaultProps = {
  useRouteDetail
};

export { ProductViewOpenShiftDedicated as default, ProductViewOpenShiftDedicated };
