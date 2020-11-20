import React from 'react';
import PropTypes from 'prop-types';

/**
 * A tab pass-through component for passing props to InventoryTabs.
 *
 * @param {object} props
 * @param {boolean} props.active
 * @param {Node} props.children
 * @param {string} props.title
 * @returns {Node}
 */
// eslint-disable-next-line no-unused-vars
const InventoryTab = ({ active, children, title }) => <React.Fragment>{children}</React.Fragment>;

/**
 * Prop types.
 *
 * @type {{children: Node, className: string}}
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
