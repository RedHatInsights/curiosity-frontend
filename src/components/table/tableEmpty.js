import React from 'react';
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
 * Render an empty table component. Apply an empty version of an actual HTML table to help with testing.
 *
 * @param {object} props
 * @param {string} [props.ariaLabel]
 * @param {React.ReactNode|Function} [props.icon=SearchIcon]
 * @param {React.ReactNode} props.message
 * @param {string} [props.tableHeading='h2']
 * @param {React.ReactNode} props.title
 * @param {EmptyStateVariant} [props.variant=EmptyStateVariant.sm]
 * @returns {JSX.Element}
 */
const TableEmpty = ({
  ariaLabel,
  icon = SearchIcon,
  message,
  tableHeading = 'h2',
  title,
  variant = EmptyStateVariant.sm,
  ...props
}) => (
  <PlatformEmptyTableWrapper>
    <table aria-label={ariaLabel} {...props} />
    <EmptyState variant={variant} className="fadein">
      {(typeof icon === 'function' && <EmptyStateIcon icon={icon} />) ||
        (icon && <EmptyStateIcon icon={() => icon} />) ||
        null}
      <EmptyStateHeader titleText={title} headingLevel={tableHeading} />
      <EmptyStateBody>{message}</EmptyStateBody>
    </EmptyState>
  </PlatformEmptyTableWrapper>
);

export { TableEmpty as default, TableEmpty };
