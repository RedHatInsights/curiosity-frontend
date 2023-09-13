import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';
import { Table } from './table';
import { translate } from '../i18n/i18n';

/**
 * @memberof Table
 * @module TableSkeleton
 */

/**
 * Render a table with skeleton loaders.
 *
 * @param {object} props
 * @param {string} props.className
 * @param {boolean} props.borders
 * @param {number} props.colCount
 * @param {Array} props.colWidth
 * @param {boolean} props.isHeader
 * @param {number} props.rowCount
 * @param {Function} props.t
 * @param {string} props.variant
 * @returns {React.ReactNode}
 */
const TableSkeleton = ({ className, borders, colCount, colWidth, isHeader, rowCount, t, variant }) => {
  const updatedColumnHeaders = [...new Array(colCount)].map((value, index) => {
    const updatedHeader = { content: <Skeleton size={SkeletonSize.md} /> };

    if (typeof colWidth[index] === 'number') {
      updatedHeader.width = colWidth[index];
    }

    return updatedHeader;
  });

  const updatedRowCount = rowCount || 1;

  const updatedRows = [...new Array(updatedRowCount)].map(() => ({
    cells: [...new Array(colCount)].map((value, index) => {
      const updatedCell = { content: <Skeleton size={SkeletonSize.md} /> };

      if (typeof colWidth[index] === 'number') {
        updatedCell.width = colWidth[index];
      }

      return updatedCell;
    })
  }));

  return (
    <Table
      ariaLabel={t('curiosity-inventory.tableSkeletonAriaLabel')}
      isBorders={borders}
      className={`curiosity-skeleton-table${(!rowCount && ' curiosity-skeleton-table__hidden-rows') || ''} ${
        className || ''
      }`}
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
 * @type {{borders: boolean, isHeader: boolean, colCount: number, colWidth: Array, variant: string,
 *     className: string, rowCount: number}}
 */
TableSkeleton.propTypes = {
  borders: PropTypes.bool,
  className: PropTypes.string,
  colCount: PropTypes.number,
  colWidth: PropTypes.arrayOf(PropTypes.number),
  isHeader: PropTypes.bool,
  rowCount: PropTypes.number,
  t: PropTypes.func,
  variant: PropTypes.oneOf([...Object.values(TableVariant)])
};

/**
 * Default props.
 *
 * @type {{t: translate, borders: boolean, isHeader: boolean, colCount: number, colWidth: Array, variant: null,
 *     className: null, rowCount: number}}
 */
TableSkeleton.defaultProps = {
  borders: true,
  className: null,
  colCount: 1,
  colWidth: [],
  isHeader: false,
  rowCount: 5,
  t: translate,
  variant: null
};

export { TableSkeleton as default, TableSkeleton };
