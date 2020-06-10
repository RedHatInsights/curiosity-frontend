import React from 'react';
import PropTypes from 'prop-types';
import {
  PageHeader as RcsPageHeader,
  PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/components/PageHeader';

/**
 * Render a platform page header.
 *
 * @param {object} props
 * @param {Node} props.children
 * @returns {Node}
 */
const PageHeader = ({ children }) => (
  <RcsPageHeader>
    <PageHeaderTitle title={children} />
  </RcsPageHeader>
);

/**
 * Prop types.
 *
 * @type {{children: Node}}
 */
PageHeader.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Default props.
 */
PageHeader.defaultProps = {};

export { PageHeader as default, PageHeader };
