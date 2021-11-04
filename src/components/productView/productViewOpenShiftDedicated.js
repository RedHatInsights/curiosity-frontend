import React from 'react';
import { ProductView } from './productView';
import { SelectPosition } from '../form/select';
import { ToolbarFieldRangedMonthly } from '../toolbar/toolbarFieldRangedMonthly';

/**
 * An OpenShift Dedicated configured view.
 *
 * @returns {Node}
 */
const ProductViewOpenShiftDedicated = () => (
  <ProductView toolbarGraph={<ToolbarFieldRangedMonthly position={SelectPosition.right} />} toolbarGraphDescription />
);

/**
 * Prop types.
 *
 * @type {{}}
 */
ProductViewOpenShiftDedicated.propTypes = {};

/**
 * Default props.
 *
 * @type {{}}
 */
ProductViewOpenShiftDedicated.defaultProps = {};

export { ProductViewOpenShiftDedicated as default, ProductViewOpenShiftDedicated };
