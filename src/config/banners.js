/**
 * Global banner configurations.
 *
 * @example Maintenance banner, add imports and object to the banners list
 * // add these imports above
 * import React from 'react';
 * import { AlertVariant } from '@patternfly/react-core';
 * import { translate } from '../components/i18n/i18n';
 * import { RHSM_API_PATH_PRODUCT_TYPES } from '../services/rhsm/rhsmConstants';
 *
 * // add this object to the banners list below
 * {
 *   id: 'global-maintenance-banner',
 *   // Reference your locale identifiers only
 *   title: () => translate('curiosity-banner.maintenance_title'),
 *   message: () => translate('curiosity-banner.maintenance_description'),
 *
 *   // The type of banner (affects color)
 *   variant: AlertVariant.info,
 *
 *   // Help automated testing
 *   dataTest: 'bannerMaintenance',
 *
 *   // Optional: Add remove associated products via their IDs.
 *   // Remove the entire property to active for all products
 *   productIds: [RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86],
 *
 *   // Optional: Logic to determine if banner should show
 *   // Remove the entire property to always be active
 *   condition: ({ productId }) => state.someGlobalFlag === true,
 *   // Buttons/Actions configuration
 *   actions: [
 *     {
 *       title: () => translate('curiosity-banner.action_learn_more'),
 *       href: 'https://status.redhat.com',
 *       isExternal: true
 *
 *       // Optional properties
 *       // onClick - Button click handler
 *     }
 *   ]
 * }
 *
 * @type {Array<{id: string, title: string, message: string, variant: string, dataTest: string,
 *     productIds: string[], condition: Function, actions: Array<{title: string, href: string,
 *     onClick: Function, isExternal: boolean}>}>}
 */
const banners = [];

export { banners as default, banners };
