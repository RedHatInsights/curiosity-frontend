import React from 'react';
import PropTypes from 'prop-types';

/**
 * @memberof InventoryTabs
 * @module InventoryTab
 */

/**
 * A tab pass-through component for passing props to InventoryTabs.
 *
 * @param {object} props
 * @param {boolean} props.active
 * @param {React.ReactNode} props.children
 * @param {string} props.title
 * @returns {React.ReactNode}
 */
// eslint-disable-next-line no-unused-vars
const InventoryTab = ({ active, children, title }) => children;

/**
 * Prop types.
 *
 * @type {{children: React.ReactNode, className: string}}
 */
InventoryTab.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  title: PropTypes.node.isRequired
};

/**
 * Default props.
 *
 * @type {{className: string}}
 */
InventoryTab.defaultProps = {
  active: false
};

export { InventoryTab as default, InventoryTab };
