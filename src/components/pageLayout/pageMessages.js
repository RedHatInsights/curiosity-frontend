import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

/**
 * @memberof PageLayout
 * @module PageMessages
 */

/**
 * Render a platform toolbar section.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @returns {React.ReactNode}
 */
const PageMessages = ({ children, className, ...props }) => (
  <Section className={`curiosity-page-messages ${className}`} {...props}>
    {children}
  </Section>
);

/**
 * Prop types.
 *
 * @type {{children: React.ReactNode, className: string}}
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
