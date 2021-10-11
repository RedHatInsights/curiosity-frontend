import React from 'react';
import { useRouteDetail } from '../../hooks/useRouter';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { ProductView } from './productView';
import { ToolbarFieldRangedMonthly } from '../toolbar/toolbarFieldRangedMonthly';

/**
 * An OpenShift Dedicated configured view.
 *
 * @returns {Node}
 */
const ProductViewOpenShiftDedicated = () => {
  const { productConfig, viewParameter: viewId } = useRouteDetail();
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
 */
ProductViewOpenShiftDedicated.propTypes = {};

/**
 * Default props.
 */
ProductViewOpenShiftDedicated.defaultProps = {};

export { ProductViewOpenShiftDedicated as default, ProductViewOpenShiftDedicated };
