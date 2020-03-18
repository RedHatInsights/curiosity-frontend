import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';

/**
 * Render a platform toolbar section.
 *
 * @returns {Node}
 */
const PageToolbar = ({ children, ...props }) => <Section {...props}>{children}</Section>;

/**
 * Prop types.
 *
 * @type {{children: Node}}
 */
PageToolbar.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Default props.
 */
PageToolbar.defaultProps = {};

export { PageToolbar as default, PageToolbar };
