import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { PageHeader as RcsPageHeader } from '@redhat-cloud-services/frontend-components/components/PageHeader';

/**
 * Render a platform page header.
 *
 * @param {object} props
 * @param {Node} props.children
 * @returns {Node}
 */
const PageHeader = ({ children }) => (
  <RcsPageHeader>
    <Title headingLevel="h1">{children}</Title>
  </RcsPageHeader>
);

/**
 * Prop types.
 *
 * @type {{children: Node}}
 */
PageHeader.propTypes = {
  children: PropTypes.any
};

/**
 * Default props.
 */
PageHeader.defaultProps = {
  children: null
};

export { PageHeader as default, PageHeader };
