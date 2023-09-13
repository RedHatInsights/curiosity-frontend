import React from 'react';
import PropTypes from 'prop-types';
import {
  useGetSubscriptionsInventory,
  useInventoryCardActionsSubscriptions,
  useOnPageSubscriptions,
  useOnColumnSortSubscriptions,
  useParseSubscriptionsFiltersSettings
} from './inventoryCardSubscriptionsContext';
import { InventoryCard } from '../inventoryCard/inventoryCard';
import { helpers } from '../../common';
import { translate } from '../i18n/i18nHelpers';

/**
 * @memberof Components
 * @module InventoryCardSubscriptions
 * @property {module} InventoryCardSubscriptionsContext
 */

/**
 * A subscriptions' system inventory component.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useGetInventory
 * @param {Function} props.useOnPage
 * @param {Function} props.useOnColumnSort
 * @param {Function} props.useProductInventoryConfig
 * @param {Function} props.useProductInventoryQuery
 * @fires onColumnSort
 * @fires onPage
 * @returns {React.ReactNode}
 */
const InventoryCardSubscriptions = ({ ...props }) => <InventoryCard {...props} />;

/**
 * Prop types.
 *
 * @type {{useOnPage: Function, useParseFiltersSettings: Function, t: Function, useInventoryCardActions: Function,
 *     isDisabled: boolean, useGetInventory: Function, useOnColumnSort: Function}}
 */
InventoryCardSubscriptions.propTypes = {
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useGetInventory: PropTypes.func,
  useInventoryCardActions: PropTypes.func,
  useOnPage: PropTypes.func,
  useOnColumnSort: PropTypes.func,
  useParseFiltersSettings: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnPage: Function, useParseFiltersSettings: Function, t: translate, useInventoryCardActions: Function,
 *     isDisabled: boolean, useGetInventory: Function, useOnColumnSort: Function}}
 */
InventoryCardSubscriptions.defaultProps = {
  isDisabled: helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS,
  t: translate,
  useGetInventory: useGetSubscriptionsInventory,
  useInventoryCardActions: useInventoryCardActionsSubscriptions,
  useOnPage: useOnPageSubscriptions,
  useOnColumnSort: useOnColumnSortSubscriptions,
  useParseFiltersSettings: useParseSubscriptionsFiltersSettings
};

export { InventoryCardSubscriptions as default, InventoryCardSubscriptions };
