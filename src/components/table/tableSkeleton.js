import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/cjs/Skeleton';
import Table from './table';
import { translate } from '../i18n/i18n';

/**
 * Render a table with skeleton loaders.
 *
 * @param {object} props
 * @param {string} props.className
 * @param {boolean} props.borders
 * @param {number} props.colCount
 * @param {boolean} props.isHeader
 * @param {number} props.rowCount
 * @param {Function} props.t
 * @param {string} props.variant
 * @returns {Node}
 */
const TableSkeleton = ({ className, borders, colCount, isHeader, rowCount, t, variant }) => {
  const updatedColumnHeaders = [...new Array(colCount)].map(() => <Skeleton size={SkeletonSize.md} />);

  const updatedRows = [...new Array(rowCount)].map(() => ({
    cells: [...new Array(colCount)].map(() => <Skeleton size={SkeletonSize.md} />)
  }));

  return (
    <Table
      ariaLabel={t('curiosity-inventory.tableSkeletonAriaLabel')}
      borders={borders}
      className={`curiosity-skeleton-table ${className || ''}`}
      columnHeaders={updatedColumnHeaders}
      isHeader={isHeader}
      rows={updatedRows}
      variant={variant}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{borders: boolean, isHeader: boolean, colCount: number, variant: string, className: string, rowCount: number}}
 */
TableSkeleton.propTypes = {
  borders: PropTypes.bool,
  className: PropTypes.string,
  colCount: PropTypes.number,
  isHeader: PropTypes.bool,
  rowCount: PropTypes.number,
  t: PropTypes.func,
  variant: PropTypes.oneOf([...Object.values(TableVariant)])
};

/**
 * Default props.
 *
 * @type {{t: translate, borders: boolean, isHeader: boolean, colCount: number, variant: null, className: null,
 *     rowCount: number}}
 */
TableSkeleton.defaultProps = {
  borders: true,
  className: null,
  colCount: 1,
  isHeader: true,
  rowCount: 5,
  t: translate,
  variant: null
};

export { TableSkeleton as default, TableSkeleton };
