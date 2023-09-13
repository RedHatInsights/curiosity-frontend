import React from 'react';
import PropTypes from 'prop-types';
import {
  useGetInstancesInventory,
  useInventoryCardActionsInstances,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings
} from './inventoryCardInstancesContext';
import { InventoryCard } from '../inventoryCard/inventoryCard';
import { helpers } from '../../common';
import { translate } from '../i18n/i18nHelpers';

/**
 * @memberof Components
 * @module InventoryCardInstances
 * @property {module} InventoryCardInstancesContext
 */

/**
 * An instances' system inventory component.
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
const InventoryCardInstances = ({ ...props }) => <InventoryCard {...props} />;

/**
 * Prop types.
 *
 * @type {{useOnPage: Function, useParseFiltersSettings: Function, t: Function, useInventoryCardActions: Function,
 *     isDisabled: boolean, useGetInventory: Function, useOnColumnSort: Function}}
 */
InventoryCardInstances.propTypes = {
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
InventoryCardInstances.defaultProps = {
  isDisabled: helpers.UI_DISABLED_TABLE_INSTANCES,
  t: translate,
  useGetInventory: useGetInstancesInventory,
  useInventoryCardActions: useInventoryCardActionsInstances,
  useOnPage: useOnPageInstances,
  useOnColumnSort: useOnColumnSortInstances,
  useParseFiltersSettings: useParseInstancesFiltersSettings
};

export { InventoryCardInstances as default, InventoryCardInstances };
