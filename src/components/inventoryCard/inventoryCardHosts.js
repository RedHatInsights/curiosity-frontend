import React from 'react';
import PropTypes from 'prop-types';
import { useGetHostsInventory } from './inventoryCardContext';
import InventoryCard from './inventoryCard';
import { helpers } from '../../common';

/**
 * A hosts' system inventory component.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useGetInventory
 * @returns {React.ReactNode}
 */
const InventoryCardHosts = ({ ...props }) => <InventoryCard {...props} />;

/**
 * Prop types.
 *
 * @type {{isDisabled: boolean, useGetInventory: Function}}
 */
InventoryCardHosts.propTypes = {
  isDisabled: PropTypes.bool,
  useGetInventory: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{isDisabled: boolean, useGetInventory: Function}}
 */
InventoryCardHosts.defaultProps = {
  isDisabled: helpers.UI_DISABLED_TABLE_HOSTS,
  useGetInventory: useGetHostsInventory
};

export { InventoryCardHosts as default, InventoryCardHosts };
