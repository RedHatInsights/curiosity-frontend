import React from 'react';
import PropTypes from 'prop-types';
import { cellWidth, TableVariant } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import Table from './table';
import { translate } from '../i18n/i18n';

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
 * @returns {Node}
 */
const TableSkeleton = ({ className, borders, colCount, colWidth, isHeader, rowCount, t, variant }) => {
  const updatedColumnHeaders = [...new Array(colCount)].map((value, index) => {
    const updatedHeader = { title: <Skeleton size={SkeletonSize.md} /> };

    if (typeof colWidth[index] === 'number') {
      updatedHeader.transforms = [cellWidth(colWidth[index])];
    }

    return updatedHeader;
  });

  const updatedRowCount = rowCount || 1;

  const updatedRows = [...new Array(updatedRowCount)].map(() => ({
    cells: [...new Array(colCount)].map(() => <Skeleton size={SkeletonSize.md} />)
  }));

  return (
    <Table
      ariaLabel={t('curiosity-inventory.tableSkeletonAriaLabel')}
      borders={borders}
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
  isHeader: true,
  rowCount: 5,
  t: translate,
  variant: null
};

export { TableSkeleton as default, TableSkeleton };
