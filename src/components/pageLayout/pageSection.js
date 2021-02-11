import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';

/**
 * Render a platform page section.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {string} props.className
 * @returns {Node}
 */
const PageSection = ({ children, className, ...props }) => (
  <Section className={`curiosity-page-section ${className}`} {...props}>
    {children}
  </Section>
);

/**
 * Prop types.
 *
 * @type {{children: Node, className: string}}
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
