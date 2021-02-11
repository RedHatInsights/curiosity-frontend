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
const PageMessages = ({ children, className, ...props }) => (
  <Section className={`curiosity-page-messages ${className}`} {...props}>
    {children}
  </Section>
);

/**
 * Prop types.
 *
 * @type {{children: Node, className: string}}
 */
PageMessages.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{className: string}}
 */
PageMessages.defaultProps = {
  className: ''
};

export { PageMessages as default, PageMessages };
