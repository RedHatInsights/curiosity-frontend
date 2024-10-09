// eslint-disable-next-line no-unused-vars
import React from 'react';

/**
 * @memberof InventoryTabs
 * @module InventoryTab
 */

/**
 * A tab pass-through component for passing props to the parent InventoryTabs.
 * There are two props, "active" and "title", that don't appear to be used in the immediate component. Instead, those
 * props are consumed at the parent level.
 *
 * @param {object} props
 * @param {boolean} [props.active=false] The active tab to display
 * @param {React.ReactNode} props.children
 * @param {string} props.title Tab title/copy to display
 * @returns {React.ReactNode}
 */
// eslint-disable-next-line no-unused-vars
const InventoryTab = ({ active = false, children, title }) => children;

export { InventoryTab as default, InventoryTab };
