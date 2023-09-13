import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateIcon, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import { EmptyTable as PlatformEmptyTableWrapper } from '@redhat-cloud-services/frontend-components/EmptyTable';
import { translate } from '../i18n/i18n';

/**
 * @memberof Table
 * @module TableEmpty
 */

/**
 * Render an empty table.
 *
 * @param {object} props
 * @param {React.ReactNode|Function} props.icon
 * @param {React.ReactNode} props.message
 * @param {Function} props.t
 * @param {string} props.tableHeading
 * @param {React.ReactNode} props.title
 * @param {string} props.variant
 * @returns {React.ReactNode}
 */
const TableEmpty = ({ icon, message, t, tableHeading, title, variant }) => (
  <PlatformEmptyTableWrapper>
    <EmptyState variant={variant}>
      {icon && <EmptyStateIcon icon={icon} />}
      <Title headingLevel={tableHeading} size="lg">
        {title || t('table.empty-state_title', 'No results found')}
      </Title>
      <EmptyStateBody>
        {message || t('table.empty-state_description', 'Clear all filters and try again.')}
      </EmptyStateBody>
    </EmptyState>
  </PlatformEmptyTableWrapper>
);

/**
 * Prop types.
 *
 * @type {{icon: React.ReactNode|Function, variant: string, message: React.ReactNode, title: React.ReactNode,
 *     tableHeading: string}}
 */
TableEmpty.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  message: PropTypes.node,
  t: PropTypes.func,
  tableHeading: PropTypes.string,
  title: PropTypes.node,
  variant: PropTypes.oneOf(Object.keys(EmptyStateVariant))
};

/**
 * Default props.
 *
 * @type {{icon: null, variant: EmptyStateVariant.small, tableHeading: string}}
 */
TableEmpty.defaultProps = {
  icon: null,
  message: null,
  t: translate,
  tableHeading: 'h2',
  title: null,
  variant: EmptyStateVariant.small
};

export { TableEmpty as default, TableEmpty };
