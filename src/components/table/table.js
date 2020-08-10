import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import { Table as PfTable, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import _isEqual from 'lodash/isEqual';
import { TableEmpty } from './tableEmpty';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * FixMe: PF tables uses sequentially ordered lists/arrays to denote expandable sections
 * Ideal solution is to nest expandable sections within their respective parents. There
 * are scenarios where manipulating a sequentially ordered list/array can, and will,
 * lead to unintended results. And forces an equal, if not greater, amount of effort on
 * state tracking in the consuming GUI/app. Compounding the issue, the index is used/returned
 * during events for a particular row being "expanded". This ends up making after-the-fact
 * application of the expandable list/array items problematic since said index is
 * constantly updating/shifting as rows are dynamically added. Add in a "not every row
 * needs to be expandable" scenario, you can start to see the issues. All of that
 * effort means that in some cases it may actually be quicker to simply use PF styles and
 * a HTML table directly, bypassing PF-React entirely.
 *
 * Applying a React node as content in the sequentially ordered list/array appears to
 * automatically "mount" said node. How this handles in child components where subsequent
 * AJAX/XHR calls are called means you are potentially hitting an API with dozens of calls,
 * row dependent, even when a user may not expand the nested row/child. This could easily
 * be resolved by nesting and applying the expandable contents after-the-fact.
 */
/**
 * FixMe: PF tables misalignment of the column headers list/array and row cells breaks the component
 * The related PF error for this is cryptic. An immediate solution would be to simply fix the error
 * messaging, or do a length check before consuming the lists/arrays. This happens when a consumer
 * places more or less column header cells than row cells.
 */
/**
 * FixMe: PF tables break when an empty list/array is used for the column headers
 * This appears related to the mismatched column header and row cells. The solution is to simply not
 * render the header row instead of throwing an error. This is similar to how the empty rows
 * list/array is handled.
 */
/**
 * A table.
 *
 * @augments React.Component
 * @fires onCollapse
 */
class Table extends React.Component {
  state = {
    isCollapsible: false,
    updatedColumnHeaders: null,
    updatedRows: null
  };

  componentDidMount() {
    const { updatedRows } = this.state;

    if (updatedRows === null) {
      this.setRowData();
    }
  }

  componentDidUpdate(prevProps) {
    const { columnHeaders, rows } = this.props;

    if (!_isEqual(prevProps.rows, rows) || !_isEqual(prevProps.columnHeaders, columnHeaders)) {
      this.setRowData();
    }
  }

  /**
   * Apply expanded row content.
   *
   * @event onCollapse
   * @param {object} params
   * @param {number} params.index
   * @param {boolean} params.isOpen
   */
  onCollapse = ({ index, isOpen }) => {
    const { updatedRows } = this.state;
    updatedRows[index].isOpen = isOpen;

    if (isOpen) {
      updatedRows[index + 1].fullWidth = false;
      updatedRows[index + 1].cells = [{ title: updatedRows[index + 1].expandedContent }];
    } else {
      updatedRows[index + 1].cells = [{ title: '' }];
    }

    this.setState({
      updatedRows
    });
  };

  /**
   * Convert row objects into the required PF Table format.
   */
  setRowData() {
    const { columnHeaders, rows } = this.props;
    const updatedColumnHeaders = [];
    const updatedRows = [];
    let isCollapsible = false;

    columnHeaders.forEach(columnHeader => {
      if (columnHeader?.title) {
        const { title, ...settings } = columnHeader;
        updatedColumnHeaders.push({ title, ...settings });
      } else {
        updatedColumnHeaders.push({ title: columnHeader });
      }
    });

    rows.forEach(({ expandedContent, cells, isExpanded }) => {
      const rowObj = {
        cells: []
      };
      updatedRows.push(rowObj);

      if (expandedContent) {
        isCollapsible = true;
        rowObj.isOpen = isExpanded || false;

        updatedRows.push({
          parent: updatedRows.length - 1,
          fullWidth: true,
          cells: [{ title: '' }],
          expandedContent
        });
      }

      cells.forEach(cell => {
        if (cell?.title) {
          const { title, ...settings } = cell;
          rowObj.cells.push({ title, ...settings });
        } else {
          rowObj.cells.push({ title: cell });
        }
      });
    });

    this.setState({
      isCollapsible,
      updatedColumnHeaders,
      updatedRows
    });
  }

  /**
   * FixMe: PF Tables automatically applies an expandable className when using the "onCollapse" prop?
   * Not every row may need to be expandable. In certain scenarios a table may have no expandable
   * sections, however it appears the "onCollapse" styling, and additionally added "table cells" are still
   * applied.
   */
  /**
   * Apply props to table.
   *
   * @returns {Node}
   */
  renderTable() {
    const { isCollapsible, updatedColumnHeaders, updatedRows } = this.state;
    const { ariaLabel, borders, children, className, isHeader, summary, t, variant } = this.props;
    const pfTableProps = {};
    let emptyTable = null;

    if (!updatedRows?.length) {
      emptyTable = children || (
        <TableEmpty
          icon={SearchIcon}
          title={t('curiosity-inventory.tableEmptyInventoryTitle')}
          message={t('curiosity-inventory.tableEmptyInventoryMessage')}
        />
      );
    }

    if (isCollapsible) {
      pfTableProps.onCollapse = (event, index, isOpen, data) => this.onCollapse({ event, index, isOpen, data });
    }

    return (
      <React.Fragment>
        <PfTable
          className={`curiosity-table${(!borders && '-no-border') || ''} ${className || ''}`}
          borders={borders}
          aria-label={ariaLabel || t('curiosity-inventory.tableAriaLabel', { appName: helpers.UI_DISPLAY_NAME })}
          summary={summary || t('curiosity-inventory.tableSummary')}
          variant={variant}
          rows={(updatedRows?.length && updatedRows) || []}
          cells={updatedColumnHeaders || []}
          {...pfTableProps}
        >
          {isHeader && <TableHeader />}
          <TableBody />
        </PfTable>
        {emptyTable}
      </React.Fragment>
    );
  }

  /**
   * Render a table.
   *
   * @returns {Node}
   */
  render() {
    return (
      <Grid guttter="sm" className="ins-inventory-list">
        <GridItem span={12}>{this.renderTable()}</GridItem>
      </Grid>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{summary: string, columnHeaders: Array, t: Function, borders: boolean, children: Node,
 *     isHeader: boolean, variant: string, className: string, rows, ariaLabel: string}}
 */
Table.propTypes = {
  ariaLabel: PropTypes.string,
  borders: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  columnHeaders: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.shape({
        title: PropTypes.node
      })
    ])
  ).isRequired,
  isHeader: PropTypes.bool,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      expandedContent: PropTypes.node,
      cells: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.node,
          PropTypes.shape({
            title: PropTypes.node
          })
        ])
      ),
      isExpanded: PropTypes.bool
    })
  ),
  summary: PropTypes.string,
  t: PropTypes.func,
  variant: PropTypes.oneOf([...Object.values(TableVariant)])
};

/**
 * Default props.
 *
 * @type {{summary: null, t: translate, borders: boolean, children: null, isHeader: boolean,
 *     variant: null, className: null, rows: Array, ariaLabel: null}}
 */
Table.defaultProps = {
  ariaLabel: null,
  borders: true,
  children: null,
  className: null,
  isHeader: true,
  rows: [],
  summary: null,
  t: translate,
  variant: null
};

export { Table as default, Table };
