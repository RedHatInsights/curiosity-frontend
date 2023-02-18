import React from 'react';
import PropTypes from 'prop-types';
import { useGetHostsInventory, useOnColumnSortHosts } from './inventoryCardContext';
import InventoryCard from './inventoryCard';
import { helpers } from '../../common';

/**
 * @memberof InventoryCard
 * @module InventoryCardHosts
 */

/**
 * A hosts' system inventory component.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useGetInventory
 * @param {Function} props.useOnColumnSort
 * @returns {React.ReactNode}
 */
const InventoryCardHosts = ({ ...props }) => <InventoryCard {...props} />;

/**
 * Prop types.
 *
 * @type {{isDisabled: boolean, useGetInventory: Function, useOnColumnSort: Function}}
 */
InventoryCardHosts.propTypes = {
  isDisabled: PropTypes.bool,
  useGetInventory: PropTypes.func,
  useOnColumnSort: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{isDisabled: boolean, useGetInventory: Function, useOnColumnSort: Function}}
 */
InventoryCardHosts.defaultProps = {
  isDisabled: helpers.UI_DISABLED_TABLE_HOSTS,
  useGetInventory: useGetHostsInventory,
  useOnColumnSort: useOnColumnSortHosts
};

export { InventoryCardHosts as default, InventoryCardHosts };
