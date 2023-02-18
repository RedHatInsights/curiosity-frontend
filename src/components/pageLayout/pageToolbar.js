import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

/**
 * @memberof PageLayout
 * @module PageToolbar
 */

/**
 * Render a platform toolbar section.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @returns {React.ReactNode}
 */
const PageToolbar = ({ children, className, ...props }) => (
  <Section className={`curiosity-page-toolbar ${className}`} {...props}>
    {children}
  </Section>
);

/**
 * Prop types.
 *
 * @type {{children: React.ReactNode, className: string}}
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
