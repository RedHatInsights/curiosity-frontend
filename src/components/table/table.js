import React, { useState } from 'react';
import { useShallowCompareEffect } from 'react-use';
import _cloneDeep from 'lodash/cloneDeep';
import { Grid, GridItem } from '@patternfly/react-core';
import {
  ExpandableRowContent,
  SortByDirection,
  Table as PfTable,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patternfly/react-table';
import { TableEmpty } from './tableEmpty';
import { tableHelpers } from './tableHelpers';

/**
 * PF table wrapper, normalize table use.
 *
 * @memberof Components
 * @module Table
 * @property {module} TableEmpty
 * @property {module} TableHelpers
 * @property {module} TableSkeleton
 */

/**
 * Available table class names used as defaults.
 *
 * @type {{tdExpanded: string, trExpand: string, trExpandedContent: string, tdExpandedWrapper: string,
 *     tdAction: string, tdExpand: string, td: string, trExpanded: string, th: string, tdSelect: string,
 *     tdExpandedContent: string, table: string, tr: string}}
 */
const TableClassNames = {
  table: 'curiosity-table',
  td: 'curiosity-table__td',
  tdAction: 'curiosity-table__td-action',
  tdSelect: 'curiosity-table__td-select',
  th: 'curiosity-table__th',
  tr: 'curiosity-table__tr',
  trExpand: 'curiosity-table__tr-expand',
  trExpanded: 'curiosity-table__tr-expand-expanded',
  trExpandedContent: 'curiosity-table__tr-expand-content',
  tdExpand: 'curiosity-table__td-expand',
  tdExpanded: 'curiosity-table__td-expand-expanded',
  tdExpandedWrapper: 'curiosity-table__td-expand-wrapper',
  tdExpandedContent: 'curiosity-table__td-expand-content'
};

/**
 * Default empty table props
 *
 * @type {{className: (string|undefined), title: React.ReactNode, message: React.ReactNode}}
 */
const TableEmptyProps = {
  title: 'No results found',
  message: 'Clear all filters and try again'
};

/**
 * FixMe: PF bug for select column. PF requires a Th used for select field in the primary Thead...
 * BUT also allows a partially working Td. Any attempt to update the Td selected object props is
 * met with a partially-functioning field, hair pulling, and the question "is my state working?"
 * ... it is, PF is the problem, this is a bug. HTML markup does allow the use of both td and th within
 * thead and tbody, and not every cell in a thead requires the use of th. Solutions include
 *   - minimally updating the documentation to reflect that a Th is ABSOLUTELY required!
 *   - allow Td cells the same functionality as Th in Thead
 *   - completely warn/block the ability to use Td in the Thead component
 */
/**
 * A PF Composable table wrapper
 *
 * @param {object} props
 * @param {string} [props.ariaLabelSelectTheadColumn='Select row column']
 * @param {string} [props.ariaLabelTable]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {Array<(Function|React.ReactNode|{ content: (Function|React.ReactNode),
 *     isSort: (boolean|undefined), isSortActive: (boolean|undefined),
 *     sortDirection: (SortByDirection|undefined) })>} [props.columnHeaders=[]]
 * @param {TableClassNames} [props.componentClassNames=TableClassNames]
 * @param {TableEmptyProps} [props.emptyTable=TableEmptyProps]
 * @param {boolean} [props.isBorders=true]
 * @param {boolean} [props.isHeader=false]
 * @param {boolean} [props.isStriped=false]
 * @param {Function} [props.onExpand]
 * @param {Function} [props.onSelect]
 * @param {Function} [props.onSort]
 * @param {Array<{
 *     cells: (React.ReactNode|Function|Date|{
 *         content: (React.ReactNode|Function|Date),
 *         isTHeader: (boolean|undefined),
 *         isExpanded: (boolean|undefined),
 *         expandedContent: (React.ReactNode|Function|undefined)
 *     }),
 *     isDisabled: (boolean|undefined),
 *     isExpanded: (boolean|undefined),
 *     isSelected: (boolean|undefined),
 *     expandedContent: (React.ReactNode|Function|undefined) }>} props.rows
 * @param {string} props.summary
 * @param {TableVariant} [props.variant=TableVariant.compact]
 * @fires onExpandTable
 * @fires onSelectTable
 * @fires onSortTable
 * @returns {React.ReactNode}
 */
const Table = ({
  ariaLabelSelectTheadColumn = 'Select row column',
  ariaLabelTable,
  children,
  className = '',
  columnHeaders = [],
  componentClassNames = TableClassNames,
  emptyTable = TableEmptyProps,
  isBorders = true,
  isHeader = false,
  isStriped = false,
  onExpand,
  onSelect,
  onSort,
  rows,
  summary,
  variant = TableVariant.compact
}) => {
  const [updatedHeaderAndRows, setUpdatedHeaderAndRows] = useState({});
  const [updatedIsExpandableRow, setUpdatedIsExpandableRow] = useState(false);
  const [updatedIsExpandableCell, setUpdatedIsExpandableCell] = useState(false);
  const [updatedIsSelectTable, setUpdatedIsSelectTable] = useState(false);

  /**
   * Apply an onExpand handler.
   *
   * @event onExpandTable
   * @param {object} params
   * @param {string} params.type
   * @param {boolean} params.isExpanded
   * @param {number} params.rowIndex
   * @param {number} params.cellIndex
   * @param {*|object} params.data
   */
  const onExpandTable = ({ type, isExpanded, rowIndex, cellIndex, data } = {}) => {
    if (type === 'compound') {
      setUpdatedHeaderAndRows(prevState => {
        const nextBodyRows = [...prevState.bodyRows];
        const nextBodyRowCells = nextBodyRows?.[rowIndex].cells.map(({ props: cellProps, ...cell }) => {
          const updatedCompoundExpand = cellProps?.compoundExpand;

          if (updatedCompoundExpand) {
            updatedCompoundExpand.isExpanded = false;
          }

          return { ...cell, props: { ...cellProps, compoundExpand: updatedCompoundExpand } };
        });

        nextBodyRowCells[cellIndex].props.compoundExpand.isExpanded = isExpanded;
        nextBodyRows[rowIndex].cells = nextBodyRowCells;

        return {
          ...prevState,
          bodyRows: nextBodyRows
        };
      });
    } else {
      setUpdatedHeaderAndRows(prevState => {
        const nextBodyRows = [...prevState.bodyRows];
        nextBodyRows[rowIndex].expand.isExpanded = isExpanded;

        return {
          ...prevState,
          bodyRows: nextBodyRows
        };
      });
    }

    if (typeof onExpand === 'function') {
      onExpand({
        type,
        rowIndex,
        cellIndex: (type === 'row' && -1) || cellIndex,
        isExpanded,
        data: _cloneDeep(data)
      });
    }
  };

  /**
   * Apply an onSelect handler.
   *
   * @event onSelectTable
   * @param {object} params
   * @param {string} params.type
   * @param {boolean} params.isSelected
   * @param {number} params.rowIndex
   * @param {*|object} params.data
   */
  const onSelectTable = ({ type, isSelected, rowIndex, data } = {}) => {
    if (type === 'all') {
      setUpdatedHeaderAndRows(prevState => {
        const nextBodyRows = prevState.bodyRows?.map(row => ({
          ...row,
          select: { ...row.select, isSelected }
        }));

        const nextHeaderSelectProps = prevState.headerSelectProps;
        nextHeaderSelectProps.isSelected = isSelected;

        return {
          ...prevState,
          bodyRows: nextBodyRows,
          headerSelectProps: nextHeaderSelectProps
        };
      });
    } else {
      setUpdatedHeaderAndRows(prevState => {
        const nextBodyRows = prevState.bodyRows?.map(row => row);
        nextBodyRows[rowIndex].select.isSelected = isSelected;

        const nextHeaderSelectProps = prevState.headerSelectProps;
        nextHeaderSelectProps.isSelected =
          nextBodyRows.filter(row => row.select.isSelected === true).length === nextBodyRows.length;

        return {
          ...prevState,
          bodyRows: nextBodyRows,
          headerSelectProps: nextHeaderSelectProps
        };
      });
    }

    if (typeof onSelect === 'function') {
      onSelect({
        type,
        rowIndex,
        isSelected,
        data: _cloneDeep(data)
      });
    }
  };

  /**
   * Apply an onSort handler.
   *
   * @event onSortTable
   * @param {object} params
   * @param {number} params.cellIndex
   * @param {string} params.direction
   * @param {number} params.originalIndex
   * @param {*|object} params.data
   */
  const onSortTable = ({ cellIndex, direction, originalIndex, data } = {}) => {
    setUpdatedHeaderAndRows(prevState => {
      const nextHeaderRow = prevState.headerRow.map((headerCell, index) => {
        const updatedHeaderCell = headerCell;

        if (updatedHeaderCell?.props?.sort) {
          delete updatedHeaderCell.props.sort.sortBy.index;

          if (index === originalIndex) {
            updatedHeaderCell.props.sort.sortBy.index = cellIndex;
            updatedHeaderCell.props.sort.sortBy.direction = direction;
          }
        }

        return updatedHeaderCell;
      });

      return {
        ...prevState,
        headerRow: nextHeaderRow
      };
    });

    if (typeof onSort === 'function') {
      onSort({
        cellIndex: originalIndex,
        direction,
        data: _cloneDeep(data)
      });
    }
  };

  useShallowCompareEffect(() => {
    const {
      isAllSelected: parsedIsAllSelected,
      isExpandableCell: parsedIsExpandableCell,
      isExpandableRow: parsedIsExpandableRow,
      isSelectTable: parsedIsSelectTable,
      rows: parsedRows
    } = tableHelpers.tableRows({
      onExpand: onExpandTable,
      onSelect: typeof onSelect === 'function' && onSelectTable,
      rows
    });
    const { headerRow: parsedHeaderRow, headerSelectProps: parsedHeaderSelectProps } = tableHelpers.tableHeader({
      columnHeaders,
      isAllSelected: parsedIsAllSelected,
      onSelect: typeof onSelect === 'function' && onSelectTable,
      onSort: typeof onSort === 'function' && onSortTable,
      parsedRows
    });

    setUpdatedIsExpandableRow(parsedIsExpandableRow);
    setUpdatedIsSelectTable(parsedIsSelectTable);
    setUpdatedIsExpandableCell(parsedIsExpandableCell);
    setUpdatedHeaderAndRows({
      headerRow: parsedHeaderRow,
      bodyRows: parsedRows,
      headerSelectProps: parsedHeaderSelectProps
    });
  }, [columnHeaders, onExpand, onExpandTable, onSelect, onSelectTable, onSort, onSortTable, rows]);

  /**
   * Apply settings, return primary thead.
   *
   * @returns {React.ReactNode}
   */
  const renderHeader = () => (
    <Thead>
      <Tr className={componentClassNames.tr}>
        {updatedIsExpandableRow && <Td className={componentClassNames.th} key="expand-th-cell" />}
        {updatedIsSelectTable && (
          <Th
            key="select-cell"
            className={`${componentClassNames.th} ${componentClassNames.tdSelect}`}
            select={updatedHeaderAndRows.headerSelectProps}
            aria-label={ariaLabelSelectTheadColumn}
          />
        )}
        {updatedHeaderAndRows?.headerRow.map(({ key: cellKey, content, props, sort }) => (
          <Th className={componentClassNames.th} key={cellKey} sort={sort} {...props}>
            {content}
          </Th>
        ))}
      </Tr>
    </Thead>
  );

  /**
   * Apply settings, return tbody(s).
   *
   * @returns {React.ReactNode}
   */
  const renderBody = () => {
    const BodyWrapper = ((updatedIsExpandableCell || updatedIsExpandableRow) && React.Fragment) || Tbody;

    return (
      <BodyWrapper>
        {updatedHeaderAndRows?.bodyRows?.map(({ key: rowKey, cells, expand, select, expandedContent }) => {
          const expandedCell =
            (updatedIsExpandableCell && cells.find(cell => cell?.props?.compoundExpand?.isExpanded === true)) ||
            undefined;
          const expandedRow = (updatedIsExpandableRow && expand?.isExpanded === true) || undefined;

          const CellWrapper = ((updatedIsExpandableCell || updatedIsExpandableRow) && Tbody) || React.Fragment;
          const cellWrapperProps =
            (updatedIsExpandableCell && { isExpanded: expandedCell?.props?.compoundExpand?.isExpanded === true }) ||
            (updatedIsExpandableRow && { isExpanded: expand?.isExpanded === true }) ||
            undefined;

          return (
            <CellWrapper key={`${rowKey}-parent-row`} {...cellWrapperProps}>
              <Tr className={componentClassNames.tr} key={`${rowKey}-row`}>
                {(expand && (
                  <Td
                    className={`${componentClassNames.td} ${componentClassNames.tdExpand}`}
                    key={`${rowKey}-expand-col`}
                    expand={expand}
                  />
                )) ||
                  (updatedIsExpandableRow && <Td className={componentClassNames.td} key="expand-td-cell" />)}
                {select && (
                  <Td
                    className={`${componentClassNames.td} ${componentClassNames.tdSelect}`}
                    key={`${rowKey}-select-col`}
                    select={select}
                  />
                )}
                {cells.map(({ key: cellKey, content, isTHeader, props: cellProps = {} }) => {
                  const WrapperCell = (isTHeader && Th) || Td;

                  return (
                    <WrapperCell
                      key={cellKey}
                      {...cellProps}
                      className={`${cellProps.className} ${componentClassNames.td} ${
                        (cellProps.isActionCell && componentClassNames.tdAction) || ''
                      }`}
                    >
                      {content}
                    </WrapperCell>
                  );
                })}
              </Tr>
              {updatedIsExpandableRow && expandedRow && (
                <Tr className={componentClassNames.tr} isExpanded key={`${rowKey}-expandedRow`}>
                  <Td
                    noPadding={expandedRow?.props?.noPadding}
                    className={`${componentClassNames.td} ${componentClassNames.tdExpanded} ${componentClassNames.tdExpandedWrapper}`}
                    colSpan={cells.length + ((expand && 1) || 0) + ((select && 1) || 0)}
                  >
                    <div className={componentClassNames.tdExpandedContent}>
                      <ExpandableRowContent>
                        {(typeof expandedContent === 'function' && expandedContent()) || expandedContent}
                      </ExpandableRowContent>
                    </div>
                  </Td>
                </Tr>
              )}
              {updatedIsExpandableCell && expandedCell && (
                <Tr className={componentClassNames.tr} isExpanded key={`${rowKey}-expandedCol`}>
                  <Td
                    noPadding={expandedCell?.props?.noPadding}
                    className={`${componentClassNames.td} ${componentClassNames.tdExpanded} ${componentClassNames.tdExpandedWrapper}`}
                    colSpan={cells.length + ((expand && 1) || 0) + ((select && 1) || 0)}
                  >
                    <div className={componentClassNames.tdExpandedContent}>
                      <ExpandableRowContent>
                        {(typeof expandedCell.expandedContent === 'function' && expandedCell.expandedContent()) ||
                          expandedCell.expandedContent}
                      </ExpandableRowContent>
                    </div>
                  </Td>
                </Tr>
              )}
            </CellWrapper>
          );
        })}
      </BodyWrapper>
    );
  };

  /**
   * Return empty results display.
   *
   * @returns {React.ReactNode}
   */
  const renderEmpty = () =>
    children || <TableEmpty aria-label={ariaLabelTable} className={className} summary={summary} {...emptyTable} />;

  return (
    <Grid>
      <GridItem span={12}>
        {(updatedHeaderAndRows?.bodyRows?.length && (
          <PfTable
            aria-label={ariaLabelTable}
            borders={isBorders}
            className={`${componentClassNames.table} ${className}`}
            isStriped={isStriped}
            summary={summary}
            variant={variant}
          >
            {isHeader && renderHeader()}
            {renderBody()}
          </PfTable>
        )) ||
          renderEmpty()}
      </GridItem>
    </Grid>
  );
};

export { Table as default, Table, TableVariant, TableClassNames, TableEmptyProps, tableHelpers, SortByDirection };
