import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';

/**
 * Render a platform toolbar section.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {string} props.className
 * @returns {Node}
 */
const PageToolbar = ({ children, className, ...props }) => (
  <Section className={`curiosity-page-toolbar ${className}`} {...props}>
    {children}
  </Section>
);

/**
 * Prop types.
 *
 * @type {{children: Node, className: string}}
 */
PageToolbar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{className: string}}
 */
PageToolbar.defaultProps = {
  className: ''
};

export { PageToolbar as default, PageToolbar };
