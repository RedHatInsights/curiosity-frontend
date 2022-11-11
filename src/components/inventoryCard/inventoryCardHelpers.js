import React from 'react';
import { cellWidth as PfCellWidth, SortByDirection, wrappable } from '@patternfly/react-table';
import _camelCase from 'lodash/camelCase';
import _isPlainObject from 'lodash/isPlainObject';
import { Tooltip } from '../tooltip/tooltip';
import { translate } from '../i18n/i18n';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';

/**
 * ToDo: review setting up a transformed cell cache for already transformed cells.
 * - review using a simple state and key memoized component
 * - review using lru cache in a inventoryCardContext custom hook
 */

/**
 * Apply product inventory config properties consistently.
 *
 * @param {Function|string|number} prop
 * @param {object} options
 * @param {*[]|*} options.params
 * @returns {React.ReactNode}
 */
const applyConfigProperty = (prop, { params = [] } = {}) => {
  let updatedProp = prop;

  if (typeof prop === 'function') {
    updatedProp = prop(...((Array.isArray(params) && params) || [params]));
  }

  if (typeof updatedProp === 'string' || typeof updatedProp === 'number' || React.isValidElement(updatedProp)) {
    return updatedProp;
  }

  return undefined;
};

/**
 * Generate header and row cell configuration from filters.
 *
 * @param {object} params
 * @param {Array<{id: string, isStandalone: boolean, cell:React.ReactNode|{ title: string }, cellWidth: number,
 *     header:React.ReactNode|{ title: string }, onSort: Function, showEmptyCell: boolean, sortId: string,
 *     sortActive: boolean, sortDirection: string, transforms: Array}>} params.filters
 * @param {object} params.cellData
 * @param {object} params.meta
 * @param {object} params.session
 * @returns {{bodyCells: { title: React.ReactNode }[], headerCells: { title: React.ReactNode }[]}}
 */
const applyHeaderRowCellFilters = ({ filters = [], cellData = {}, meta = {}, session = {} } = {}) => {
  const headerCells = [];
  const bodyCells = [];

  filters.forEach(
    ({
      isStandalone,
      id,
      cell,
      cellWidth,
      header,
      onSort,
      showEmptyCell = true,
      sortId,
      sortActive,
      sortDirection,
      transforms
    }) => {
      const headerCellUpdated = { title: translate('curiosity-inventory.header', { context: id }), transforms: [] };
      const bodyCellUpdated = { title: '' };

      // set filtered base header and body cells, or if filter doesn't exist skip
      if (cellData[id]) {
        headerCellUpdated.title = cellData[id]?.title ?? id;
        bodyCellUpdated.title = cellData[id]?.value ?? '';
      } else if (isStandalone === true) {
        headerCellUpdated.title = '';
        bodyCellUpdated.title = '';
      } else {
        if (helpers.DEV_MODE || helpers.REVIEW_MODE) {
          console.warn(`Warning: Filter "${id}" not found in "table row" response data.`, cellData);
        }
        if (showEmptyCell === false) {
          return;
        }
      }

      // set header cell title
      if (header) {
        const updatedHeaderCellTitle = applyConfigProperty(header, {
          params: [{ ...cellData }, { ...session }, { ...meta }]
        });
        if (updatedHeaderCellTitle) {
          headerCellUpdated.title = updatedHeaderCellTitle;
        } else if (_isPlainObject(header)) {
          Object.assign(headerCellUpdated, { ...header });
        }

        // set header cell tooltip
        if (header.tooltip && headerCellUpdated.title) {
          const updatedHeaderCellTooltip = applyConfigProperty(header.tooltip, {
            params: [{ ...cellData }, { ...session }, { ...meta }]
          });
          if (updatedHeaderCellTooltip) {
            headerCellUpdated.title = <Tooltip content={updatedHeaderCellTooltip}>{headerCellUpdated.title}</Tooltip>;
          }

          delete headerCellUpdated.tooltip;
        }
      }

      // set header cell transforms
      if (Array.isArray(headerCellUpdated.transforms)) {
        if (Array.isArray(transforms)) {
          headerCellUpdated.transforms = headerCellUpdated.transforms.concat([...transforms]);
        }

        if (typeof cellWidth === 'number') {
          headerCellUpdated.transforms.push(PfCellWidth(cellWidth));
        }
      }

      // set header cell onSort
      if (typeof onSort === 'function') {
        headerCellUpdated.onSort = obj => onSort({ ...cellData }, { ...obj, id: sortId || id });
        headerCellUpdated.sortActive = sortActive;
        headerCellUpdated.sortDirection = sortDirection;
      }

      // set body cell title
      if (cell) {
        const updatedBodyCellTitle = applyConfigProperty(cell, {
          params: [{ ...cellData }, { ...session }, { ...meta }]
        });
        if (updatedBodyCellTitle) {
          bodyCellUpdated.title = updatedBodyCellTitle;
        } else if (_isPlainObject(cell)) {
          Object.assign(bodyCellUpdated, { ...cell });
        }

        // set body cell tooltip
        if (cell.tooltip && bodyCellUpdated.title) {
          const updatedBodyCellTooltip = applyConfigProperty(cell.tooltip, {
            params: [{ ...cellData }, { ...session }, { ...meta }]
          });
          if (updatedBodyCellTooltip) {
            bodyCellUpdated.title = <Tooltip content={updatedBodyCellTooltip}>{bodyCellUpdated.title}</Tooltip>;
          }

          delete bodyCellUpdated.tooltip;
        }
      }

      headerCells.push(headerCellUpdated);
      bodyCells.push(bodyCellUpdated);
    }
  );

  return {
    headerCells,
    bodyCells
  };
};

/**
 * Shallow clone filter, and apply a column sort filter.
 *
 * @param {object} params
 * @param {{onSort: Function, sortActive: boolean, sortDirection: string, isSortDefault: boolean,
 *     sortDefaultInitialDirection: string}} params.filter
 * @param {Function} params.onSort
 * @param {object} params.query
 * @returns {{}}
 */
const applySortFilters = ({ filter = {}, onSort, query = {} } = {}) => {
  const { id, sortId } = filter;
  const updatedId = sortId || id;
  const updatedFilter = { ...filter };
  const hasSort = updatedFilter.onSort || onSort;

  if (!updatedFilter.onSort && onSort) {
    updatedFilter.onSort = onSort;
  }

  // set fallback for the active sorted column based on query
  if (
    hasSort &&
    typeof updatedFilter.sortActive !== 'boolean' &&
    query?.[RHSM_API_QUERY_SET_TYPES.SORT] &&
    (query?.[RHSM_API_QUERY_SET_TYPES.SORT] === updatedId ||
      _camelCase(query?.[RHSM_API_QUERY_SET_TYPES.SORT]) === updatedId)
  ) {
    updatedFilter.sortActive = true;
  }

  // set sort direction
  if (hasSort && !updatedFilter.sortDirection && query?.[RHSM_API_QUERY_SET_TYPES.DIRECTION]) {
    switch (query?.[RHSM_API_QUERY_SET_TYPES.DIRECTION]) {
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
    !query?.[RHSM_API_QUERY_SET_TYPES.SORT] &&
    updatedFilter.isSortDefault === true
  ) {
    updatedFilter.sortActive = true;

    if (updatedFilter.sortDefaultInitialDirection) {
      updatedFilter.sortDirection = updatedFilter.sortDefaultInitialDirection;
    }
  }

  return updatedFilter;
};

/**
 * Shallow clone and apply a consistent PF "wrappable" transformation config allowing column content to wrap.
 *
 * @param {object} params
 * @param {object} params.filter
 * @returns {{}}
 */
const applyWrappableFilters = ({ filter = {} } = {}) => {
  const updatedFilter = { ...filter };

  if (Array.isArray(updatedFilter.transforms)) {
    updatedFilter.transforms.push(wrappable);
  } else {
    updatedFilter.transforms = [wrappable];
  }

  return updatedFilter;
};

/**
 * Shallow clone and apply, sequence specific, additional properties to filters.
 *
 * @param {object} params
 * @param {Array<{id: string, cell:*, cellWidth: number, header:*, onSort: Function,
 *     showEmptyCell: boolean, sortId: string, sortActive: boolean,
 *     sortDirection: string, transforms: Array, isSortDefault: boolean,
 *     sortDefaultInitialDirection: string}>} params.filters
 * @param {Function} params.onSort
 * @param {object} params.query
 * @returns {*[]}
 */
const parseInventoryFilters = ({ filters = [], onSort, query = {} } = {}) =>
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
 * @param {Array<{id: string, cell:React.ReactNode|{ title: string }, cellWidth: number,
 *     header:React.ReactNode|{ title: string }, onSort: Function, showEmptyCell: boolean,
 *     sortId: string, sortActive: boolean, sortDirection: string,
 *     transforms: Array}>} params.filters
 * @param {object} params.cellData
 * @param {object} params.meta
 * @param {object} params.session
 * @returns {{columnHeaders: { title: React.ReactNode }[], cells: { title: React.ReactNode }[], data: {}}}
 */
const parseRowCellsListData = ({ filters = [], cellData = {}, meta = {}, session = {} } = {}) => {
  const updatedColumnHeaders = [];
  const updatedCells = [];
  const allCells = {};

  // Apply basic translation and value
  Object.entries(cellData).forEach(([key, value = '']) => {
    allCells[key] = {
      title: translate('curiosity-inventory.header', { context: key }),
      value
    };

    updatedColumnHeaders.push(allCells[key].title);
    updatedCells.push(value || '...');
  });

  // Apply filters to header and cell values
  if (filters?.length && Object.keys(allCells).length) {
    updatedColumnHeaders.length = 0;
    updatedCells.length = 0;

    const { headerCells = [], bodyCells = [] } = applyHeaderRowCellFilters({
      filters,
      cellData: allCells,
      meta,
      session
    });

    updatedColumnHeaders.push(...headerCells);
    updatedCells.push(...bodyCells);
  }

  return {
    columnHeaders: updatedColumnHeaders,
    cells: updatedCells,
    data: { ...allCells }
  };
};

const inventoryCardHelpers = {
  applyConfigProperty,
  applyHeaderRowCellFilters,
  applySortFilters,
  applyWrappableFilters,
  parseInventoryFilters,
  parseRowCellsListData
};

export {
  inventoryCardHelpers as default,
  inventoryCardHelpers,
  applyConfigProperty,
  applyHeaderRowCellFilters,
  applySortFilters,
  applyWrappableFilters,
  parseInventoryFilters,
  parseRowCellsListData
};
