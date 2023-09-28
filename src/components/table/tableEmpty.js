import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateHeader
} from '@patternfly/react-core';
import { EmptyTable as PlatformEmptyTableWrapper } from '@redhat-cloud-services/frontend-components/EmptyTable';

/**
 * @memberof Table
 * @module TableEmpty
 */

/**
 * Render an empty table.
 *
 * @param {object} props
 * @param {string} props.ariaLabel
 * @param {React.ReactNode|Function} props.icon
 * @param {React.ReactNode} props.message
 * @param {string} props.tableHeading
 * @param {React.ReactNode} props.title
 * @param {string} props.variant
 * @returns {React.ReactNode}
 */
const TableEmpty = ({ ariaLabel, icon, message, tableHeading, title, variant, ...props }) => (
  <PlatformEmptyTableWrapper>
    <table aria-label={ariaLabel} {...props} />
    <EmptyState variant={variant}>
      {icon && <EmptyStateIcon icon={icon} />}
      <EmptyStateHeader titleText={title} headingLevel={tableHeading} />
      <EmptyStateBody>{message}</EmptyStateBody>
    </EmptyState>
  </PlatformEmptyTableWrapper>
);

/**
 * Prop types.
 *
 * @type {{icon: React.ReactNode|Function, variant: string, message: React.ReactNode, title: React.ReactNode,
 *     tableHeading: string, ariaLabel: string}}
 */
TableEmpty.propTypes = {
  ariaLabel: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  message: PropTypes.node.isRequired,
  tableHeading: PropTypes.string,
  title: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.keys(EmptyStateVariant))
};

/**
 * Default props.
 *
 * @type {{icon: null, variant: EmptyStateVariant.small, tableHeading: string, ariaLabel: null}}
 */
TableEmpty.defaultProps = {
  ariaLabel: null,
  icon: SearchIcon,
  tableHeading: 'h2',
  variant: EmptyStateVariant.sm
};

export { TableEmpty as default, TableEmpty };
