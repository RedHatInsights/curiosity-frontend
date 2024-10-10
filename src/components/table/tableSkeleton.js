import React from 'react';
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
 * @param {string} [props.ariaLabel]
 * @param {boolean} [props.borders=true]
 * @param {string} [props.className]
 * @param {number} [props.colCount=1]
 * @param {Array<number>} [props.colWidth=[]]
 * @param {boolean} [props.isHeader=false]
 * @param {number} [props.rowCount=5]
 * @param {string} [props.summary]
 * @param {TableVariant} [props.variant]
 * @returns {JSX.Element}
 */
const TableSkeleton = ({
  ariaLabel,
  borders = true,
  className = '',
  colCount = 1,
  colWidth = [],
  isHeader = false,
  rowCount = 5,
  summary,
  variant
}) => {
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
      ariaLabelTable={ariaLabel}
      isBorders={borders}
      className={`curiosity-skeleton-table${(!rowCount && ' curiosity-skeleton-table__hidden-rows') || ''} ${
        className
      }`}
      columnHeaders={updatedColumnHeaders}
      isHeader={isHeader}
      rows={updatedRows}
      summary={summary}
      variant={variant}
    />
  );
};

export { TableSkeleton as default, TableSkeleton, TableVariant };
