import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';
import { Table } from './table';

/**
 * @memberof Table
 * @module TableSkeleton
 */

/**
 * Render a table with skeleton loaders.
 *
 * @param {object} props
 * @param {string} props.ariaLabel
 * @param {boolean} props.borders
 * @param {string} props.className
 * @param {number} props.colCount
 * @param {Array} props.colWidth
 * @param {boolean} props.isHeader
 * @param {number} props.rowCount
 * @param {string} props.summary
 * @param {string} props.variant
 * @returns {React.ReactNode}
 */
const TableSkeleton = ({ ariaLabel, borders, className, colCount, colWidth, isHeader, rowCount, summary, variant }) => {
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
      ariaLabel={ariaLabel}
      isBorders={borders}
      className={`curiosity-skeleton-table${(!rowCount && ' curiosity-skeleton-table__hidden-rows') || ''} ${
        className || ''
      }`}
      columnHeaders={updatedColumnHeaders}
      isHeader={isHeader}
      rows={updatedRows}
      summary={summary}
      variant={variant}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{summary: string, borders: boolean, isHeader: boolean, colCount: number, colWidth: Array, variant: string,
 *     className: string, rowCount: string, ariaLabel: string}}
 */
TableSkeleton.propTypes = {
  ariaLabel: PropTypes.string,
  borders: PropTypes.bool,
  className: PropTypes.string,
  colCount: PropTypes.number,
  colWidth: PropTypes.arrayOf(PropTypes.number),
  isHeader: PropTypes.bool,
  rowCount: PropTypes.number,
  summary: PropTypes.string,
  variant: PropTypes.oneOf([...Object.values(TableVariant)])
};

/**
 * Default props.
 *
 * @type {{summary: null, borders: boolean, isHeader: boolean, colCount: number, colWidth: any[], variant: null,
 *     className: null, rowCount: number, ariaLabel: null}}
 */
TableSkeleton.defaultProps = {
  ariaLabel: null,
  borders: true,
  className: null,
  colCount: 1,
  colWidth: [],
  isHeader: false,
  rowCount: 5,
  summary: null,
  variant: null
};

export { TableSkeleton as default, TableSkeleton };
