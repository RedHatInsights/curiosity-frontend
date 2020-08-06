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
 * A table.
 *
 * @augments React.Component
 * @fires onCollapse
 */
class Table extends React.Component {
  state = {
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

    columnHeaders.forEach(columnHeader => {
      updatedColumnHeaders.push(columnHeader);
    });

    rows.forEach(({ expandedContent, cells, isExpanded }) => {
      const rowObj = {
        cells: []
      };
      updatedRows.push(rowObj);

      if (expandedContent) {
        rowObj.isOpen = isExpanded || false;

        updatedRows.push({
          parent: updatedRows.length - 1,
          fullWidth: true,
          cells: [{ title: '' }],
          expandedContent
        });
      }

      cells.forEach(cell => {
        if (cell?.cell) {
          const { cell: contentCell, ...settings } = cell;
          rowObj.cells.push({ title: contentCell, ...settings });
        } else {
          rowObj.cells.push({ title: cell });
        }
      });
    });

    this.setState({
      updatedColumnHeaders,
      updatedRows
    });
  }

  /**
   * Apply props to table.
   *
   * @returns {Node}
   */
  renderTable() {
    const { updatedColumnHeaders, updatedRows } = this.state;
    const { ariaLabel, borders, children, className, isHeader, summary, t, variant } = this.props;
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

    return (
      <React.Fragment>
        <PfTable
          className={`curiosity-table${(!borders && '-no-border') || ''} ${className || ''}`}
          borders={borders}
          aria-label={ariaLabel || t('curiosity-inventory.tableAriaLabel', { appName: helpers.UI_DISPLAY_NAME })}
          summary={summary || t('curiosity-inventory.tableSummary')}
          variant={variant}
          onCollapse={(event, index, isOpen, data) => this.onCollapse({ event, index, isOpen, data })}
          rows={(updatedRows?.length && updatedRows) || []}
          cells={updatedColumnHeaders || []}
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
            cell: PropTypes.node
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
