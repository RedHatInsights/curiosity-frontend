import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

/**
 * @memberof PageLayout
 * @module PageSection
 */

/**
 * Render a platform page section.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @returns {React.ReactNode}
 */
const PageSection = ({ children, className, ...props }) => (
  <Section className={`curiosity-page-section ${className}`} {...props}>
    {children}
  </Section>
);

/**
 * Prop types.
 *
 * @type {{children: React.ReactNode, className: string}}
 */
PageSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{className: string}}
 */
PageSection.defaultProps = {
  className: ''
};

export { PageSection as default, PageSection };
