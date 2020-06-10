import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';

/**
 * Render a platform page section.
 *
 * @param {object} props
 * @param {Node} props.children
 * @returns {Node}
 */
const PageSection = ({ children, ...props }) => <Section {...props}>{children}</Section>;

/**
 * Prop types.
 *
 * @type {{children: Node}}
 */
PageSection.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Default props.
 */
PageSection.defaultProps = {};

export { PageSection as default, PageSection };
