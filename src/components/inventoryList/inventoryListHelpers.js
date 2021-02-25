import React from 'react';
import { cellWidth as PfCellWidth, SortByDirection, wrappable } from '@patternfly/react-table';
import _camelCase from 'lodash/camelCase';
import { translate } from '../i18n/i18n';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';

/**
 * Apply sort filter to filters.
 *
 * @param {object} params
 * @param {{ onSort: Function, sortActive: boolean, sortDirection: string, isSortDefault: boolean,
 *     sortDefaultInitialDirection: string }} params.filter
 * @param {Function} params.onSort
 * @param {object} params.query
 * @returns {object}
 */
const applySortFilters = ({ filter = {}, onSort, query = {} }) => {
  const { id } = filter;
  const updatedFilter = { ...filter };
  const hasSort = updatedFilter.onSort || onSort;

  if (!updatedFilter.onSort && onSort) {
    updatedFilter.onSort = onSort;
  }

  // set fallback for the active sorted column based on query
  if (
    hasSort &&
    typeof updatedFilter.sortActive !== 'boolean' &&
    query?.[RHSM_API_QUERY_TYPES.SORT] &&
    _camelCase(query?.[RHSM_API_QUERY_TYPES.SORT]) === id
  ) {
    updatedFilter.sortActive = true;
  }

  // set sort direction
  if (hasSort && !updatedFilter.sortDirection && query?.[RHSM_API_QUERY_TYPES.DIRECTION]) {
    switch (query?.[RHSM_API_QUERY_TYPES.DIRECTION]) {
      case SORT_DIRECTION_TYPES.DESCENDING:
        updatedFilter.sortDirection = SortByDirection.desc;
        break;
      default:
        updatedFilter.sortDirection = SortByDirection.asc;
        break;
    }
  }

  if (
    hasSort &&
    !updatedFilter.sortActive &&
    !query?.[RHSM_API_QUERY_TYPES.SORT] &&
    updatedFilter.isSortDefault === true
  ) {
    updatedFilter.sortActive = true;

    if (updatedFilter.sortDefaultInitialDirection) {
      updatedFilter.sortDirection = updatedFilter.sortDefaultInitialDirection;
    }
  }

  return updatedFilter;
};

const applyWrappableFilters = ({ filter = {} }) => {
  const updatedFilter = { ...filter };

  if (Array.isArray(updatedFilter.transforms)) {
    updatedFilter.transforms.push(wrappable);
  } else {
    updatedFilter.transforms = [wrappable];
  }

  return updatedFilter;
};

/**
 * Apply additional properties to filters.
 *
 * @param {object} params
 * @param {Array} params.filters
 * @param {Function} params.onSort
 * @param {object} params.query
 * @returns {Array}
 */
const parseInventoryFilters = ({ filters = [], onSort, query = {} }) =>
  [...filters].map(filter => {
    const updatedFilter = { ...filter };

    if (updatedFilter.isSortable) {
      Object.assign(updatedFilter, applySortFilters({ filter: updatedFilter, onSort, query }));
    }

    if (updatedFilter.isWrappable) {
      Object.assign(updatedFilter, applyWrappableFilters({ filter: updatedFilter }));
    }

    return updatedFilter;
  });

/**
 * Parse and return formatted/filtered table cells, and apply table filters.
 *
 * @param {object} params
 * @param {Array} params.filters
 * @param {object} params.cellData
 * @param {object} params.session
 * @returns {{columnHeaders: Array, cells: Array, data: object}}
 */
const parseRowCellsListData = ({ filters = [], cellData = {}, session = {} }) => {
  const updatedColumnHeaders = [];
  const updatedCells = [];
  const allCells = {};

  // Apply basic translation and value
  Object.entries(cellData).forEach(([key, value]) => {
    allCells[key] = {
      title: translate('curiosity-inventory.header', { context: key }),
      value
    };

    updatedColumnHeaders.push(allCells[key].title);
    updatedCells.push(value);
  });

  // Apply filters to header and cell values
  if (filters?.length) {
    updatedColumnHeaders.length = 0;
    updatedCells.length = 0;

    filters.forEach(({ id, cell, cellWidth, header, onSort, sortActive, sortDirection, transforms }) => {
      let headerUpdated;
      let cellUpdated;

      if (allCells[id]) {
        headerUpdated = allCells[id]?.title ?? id;
        cellUpdated = allCells[id]?.value ?? '';
      } else if (id) {
        headerUpdated = translate('curiosity-inventory.header', { context: id });
        cellUpdated = '';
      }

      // set table header cell filter params
      if (header) {
        headerUpdated = (typeof header === 'function' && header({ ...allCells })) || header;
      }

      if (
        typeof headerUpdated === 'string' ||
        typeof headerUpdated === 'number' ||
        React.isValidElement(headerUpdated)
      ) {
        headerUpdated = {
          title: headerUpdated
        };
      }

      if (headerUpdated) {
        headerUpdated.transforms = [];

        if (Array.isArray(transforms)) {
          headerUpdated.transforms = headerUpdated.transforms.concat([...transforms]);
        }

        if (typeof cellWidth === 'number') {
          headerUpdated.transforms.push(PfCellWidth(cellWidth));
        }
      }

      if (typeof onSort === 'function') {
        headerUpdated = {
          ...headerUpdated,
          onSort: obj => onSort({ ...allCells }, { ...obj, id }),
          sortActive,
          sortDirection
        };
      }

      // set table row cell filter params
      if (cell) {
        cellUpdated = (typeof cell === 'function' && cell({ ...allCells }, { ...session })) || cell;
      }

      if (typeof cellUpdated === 'string' || typeof cellUpdated === 'number' || React.isValidElement(cellUpdated)) {
        cellUpdated = {
          title: cellUpdated
        };
      }

      updatedColumnHeaders.push(headerUpdated);
      updatedCells.push(cellUpdated);
    });
  }

  return {
    columnHeaders: updatedColumnHeaders,
    cells: updatedCells,
    data: { ...allCells }
  };
};

const inventoryListHelpers = {
  applySortFilters,
  applyWrappableFilters,
  parseInventoryFilters,
  parseRowCellsListData
};

export {
  inventoryListHelpers as default,
  inventoryListHelpers,
  applySortFilters,
  applyWrappableFilters,
  parseInventoryFilters,
  parseRowCellsListData
};
