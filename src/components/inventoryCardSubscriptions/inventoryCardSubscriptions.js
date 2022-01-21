import React from 'react';
import PropTypes from 'prop-types';
import {
  useProductInventorySubscriptionsConfig,
  useProductInventorySubscriptionsQuery
} from '../productView/productViewContext';
import {
  useGetSubscriptionsInventory,
  useOnPageSubscriptions,
  useOnColumnSortSubscriptions
} from './inventoryCardSubscriptionsContext';
import InventoryCard from '../inventoryCard/inventoryCard';
import { helpers } from '../../common';

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
 * @fires onUpdateInventoryData
 * @returns {Node}
 */
const InventoryCardSubscriptions = ({
  isDisabled,
  useGetInventory: useAliasGetInventory,
  useOnPage: useAliasOnPage,
  useOnColumnSort: useAliasOnColumnSort,
  useProductInventoryConfig: useAliasProductInventoryConfig,
  useProductInventoryQuery: useAliasProductInventoryQuery
}) => (
  <InventoryCard
    cardActions={null}
    isDisabled={isDisabled}
    useGetInventory={useAliasGetInventory}
    useOnPage={useAliasOnPage}
    useOnColumnSort={useAliasOnColumnSort}
    useProductInventoryConfig={useAliasProductInventoryConfig}
    useProductInventoryQuery={useAliasProductInventoryQuery}
  />
);

/**
 * Prop types.
 *
 * @type {{useOnPage: Function, isDisabled: boolean, useProductInventoryConfig: Function, useGetInventory: Function,
 *     useOnColumnSort: Function, useProductInventoryQuery: Function}}
 */
InventoryCardSubscriptions.propTypes = {
  isDisabled: PropTypes.bool,
  useGetInventory: PropTypes.func,
  useOnPage: PropTypes.func,
  useOnColumnSort: PropTypes.func,
  useProductInventoryConfig: PropTypes.func,
  useProductInventoryQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnPage: Function, isDisabled: boolean, useProductInventoryConfig: Function, useGetInventory: Function,
 *     useOnColumnSort: Function, useProductInventoryQuery: Function}}
 */
InventoryCardSubscriptions.defaultProps = {
  isDisabled: helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS,
  useGetInventory: useGetSubscriptionsInventory,
  useOnPage: useOnPageSubscriptions,
  useOnColumnSort: useOnColumnSortSubscriptions,
  useProductInventoryConfig: useProductInventorySubscriptionsConfig,
  useProductInventoryQuery: useProductInventorySubscriptionsQuery
};

export { InventoryCardSubscriptions as default, InventoryCardSubscriptions };
