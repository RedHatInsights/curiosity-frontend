import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import { SortByDirection, TableVariant } from '@patternfly/react-table';
import { Bullseye, Card, CardActions, CardBody, CardFooter, CardHeader, CardHeaderMain } from '@patternfly/react-core';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/TableToolbar';
import _camelCase from 'lodash/camelCase';
import { helpers } from '../../common';
import { connect, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import GuestsList from '../guestsList/guestsList';
import { inventoryListHelpers } from './inventoryListHelpers';
import Pagination from '../pagination/pagination';
import { ToolbarFieldDisplayName } from '../toolbar/toolbarFieldDisplayName';
import { paginationHelpers } from '../pagination/paginationHelpers';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SORT_TYPES as SORT_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * A hosts system inventory component.
 *
 * @augments React.Component
 * @fires onColumnSort
 * @fires onPage
 * @fires onUpdateInventoryData
 */
class InventoryList extends React.Component {
  componentDidMount() {
    this.onUpdateInventoryData();
  }

  componentDidUpdate(prevProps) {
    const { productId, query } = this.props;

    if (productId !== prevProps.productId || !_isEqual(query, prevProps.query)) {
      this.onUpdateInventoryData();
    }
  }

  /**
   * On column sort update state.
   *
   * @event onColumnSort
   * @param {object} data pass-through inventory data.
   * @param {object} sortParams
   * @param {string} sortParams.direction
   * @param {string} sortParams.id column identifier
   */
  onColumnSort = (data, { direction, id }) => {
    const { productId } = this.props;
    const updatedSortColumn = Object.values(SORT_TYPES).find(value => _camelCase(value) === id);
    let updatedDirection;

    if (!updatedSortColumn) {
      return;
    }

    switch (direction) {
      case SortByDirection.desc:
        updatedDirection = SORT_DIRECTION_TYPES.DESCENDING;
        break;
      default:
        updatedDirection = SORT_DIRECTION_TYPES.ASCENDING;
        break;
    }

    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.DIRECTION],
        viewId: productId,
        [RHSM_API_QUERY_TYPES.DIRECTION]: updatedDirection
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.SORT],
        viewId: productId,
        [RHSM_API_QUERY_TYPES.SORT]: updatedSortColumn
      }
    ]);
  };

  /**
   * On paging and on perPage events.
   *
   * @event onPage
   * @param {object} params
   * @param {number} params.offset
   * @param {number} params.perPage
   */
  onPage = ({ offset, perPage }) => {
    const { productId } = this.props;

    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
        viewId: productId,
        [RHSM_API_QUERY_TYPES.OFFSET]: offset
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
        viewId: productId,
        [RHSM_API_QUERY_TYPES.LIMIT]: perPage
      }
    ]);
  };

  /**
   * Call the RHSM APIs, apply filters.
   *
   * @event onUpdateInventoryData
   */
  onUpdateInventoryData = () => {
    const { getHostsInventory, isDisabled, productId, query } = this.props;

    if (!isDisabled && productId) {
      getHostsInventory(productId, query);
    }
  };

  /**
   * Render an inventory table.
   *
   * @returns {Node}
   */
  renderTable() {
    const { filterGuestsData, filterInventoryData, listData, query, session, settings } = this.props;
    let updatedColumnHeaders = [];

    const updatedRows = listData.map(({ ...cellData }) => {
      const { columnHeaders, cells } = inventoryListHelpers.parseRowCellsListData({
        filters: inventoryListHelpers.parseInventoryFilters({
          filters: filterInventoryData,
          onSort: this.onColumnSort,
          query
        }),
        cellData,
        session
      });

      updatedColumnHeaders = columnHeaders;

      const guestsId = cellData?.subscriptionManagerId;
      let hasGuests = cellData?.numberOfGuests > 0 && guestsId;

      // Apply hasGuests callback, return boolean
      if (typeof settings?.hasGuests === 'function') {
        hasGuests = settings.hasGuests({ ...cellData }, { ...session });
      }

      return {
        cells,
        expandedContent:
          (hasGuests && (
            <GuestsList
              key={guestsId}
              filterGuestsData={filterGuestsData}
              numberOfGuests={cellData?.numberOfGuests}
              id={guestsId}
              query={query}
            />
          )) ||
          undefined
      };
    });

    return (
      <Table
        borders
        variant={TableVariant.compact}
        className="curiosity-inventory-list"
        columnHeaders={updatedColumnHeaders}
        rows={updatedRows}
      />
    );
  }

  /**
   * Render an inventory card.
   *
   * @returns {Node}
   */
  render() {
    const {
      error,
      filterInventoryData,
      fulfilled,
      isDisabled,
      itemCount,
      listData,
      pending,
      perPageDefault,
      query,
      t,
      viewId
    } = this.props;

    if (isDisabled) {
      return (
        <Card className="curiosity-inventory-card__disabled">
          <CardBody>
            <Bullseye>{t('curiosity-inventory.tab', { context: 'disabled' })}</Bullseye>
          </CardBody>
        </Card>
      );
    }

    const updatedPerPage = query[RHSM_API_QUERY_TYPES.LIMIT] || perPageDefault;
    const updatedOffset = query[RHSM_API_QUERY_TYPES.OFFSET];
    const isLastPage = paginationHelpers.isLastPage(updatedOffset, updatedPerPage, itemCount);

    // Set an updated key to force refresh minHeight
    const minHeightContentRefreshKey =
      (fulfilled === true && itemCount < updatedPerPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
      (fulfilled === true && isLastPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
      (error === true && `bodyMinHeight-${updatedPerPage}-resize`) ||
      `bodyMinHeight-${updatedPerPage}`;

    return (
      <Card className="curiosity-inventory-card">
        <MinHeight key="headerMinHeight" updateOnContent>
          <CardHeader className={(error && 'hidden') || ''} aria-hidden={error || false}>
            <CardHeaderMain>
              <ToolbarFieldDisplayName viewId={viewId} />
            </CardHeaderMain>
            <CardActions className={(!itemCount && 'transparent') || ''} aria-hidden={!itemCount || false}>
              <Pagination
                isCompact
                isDisabled={pending || error}
                itemCount={itemCount}
                offset={updatedOffset}
                onPage={this.onPage}
                onPerPage={this.onPage}
                perPage={updatedPerPage}
              />
            </CardActions>
          </CardHeader>
        </MinHeight>
        <MinHeight key={minHeightContentRefreshKey} updateOnContent>
          <CardBody>
            <div className={(error && 'blur') || (pending && 'fadein') || ''}>
              {pending && (
                <Loader
                  variant="table"
                  tableProps={{
                    className: 'curiosity-inventory-list',
                    colCount: filterInventoryData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
                    colWidth:
                      (filterInventoryData?.length && filterInventoryData.map(({ cellWidth }) => cellWidth)) || [],
                    rowCount: listData?.length || updatedPerPage,
                    variant: TableVariant.compact
                  }}
                />
              )}
              {!pending && this.renderTable()}
            </div>
          </CardBody>
        </MinHeight>
        <MinHeight key="footerMinHeight" updateOnContent>
          <CardFooter
            className={(error && 'hidden') || (!itemCount && 'transparent') || ''}
            aria-hidden={error || !itemCount || false}
          >
            <TableToolbar isFooter>
              <Pagination
                dropDirection="up"
                isDisabled={pending || error}
                itemCount={itemCount}
                offset={updatedOffset}
                onPage={this.onPage}
                onPerPage={this.onPage}
                perPage={updatedPerPage}
              />
            </TableToolbar>
          </CardFooter>
        </MinHeight>
      </Card>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{settings:object, productId: string, listData: Array, session: object, pending: boolean,
 *     query: object, fulfilled: boolean, getHostsInventory: Function, error: boolean,
 *     itemCount: number, viewId: string, t: Function, filterInventoryData: Array, filterGuestsData: Array,
 *     perPageDefault: number, isDisabled: boolean}}
 */
InventoryList.propTypes = {
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  filterGuestsData: PropTypes.array,
  filterInventoryData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      header: PropTypes.oneOfType([
        PropTypes.shape({
          title: PropTypes.node.isRequired
        }),
        PropTypes.func,
        PropTypes.node
      ]),
      cell: PropTypes.oneOfType([
        PropTypes.shape({
          title: PropTypes.node.isRequired
        }),
        PropTypes.func,
        PropTypes.node
      ])
    }).isRequired
  ),
  getHostsInventory: PropTypes.func,
  isDisabled: PropTypes.bool,
  itemCount: PropTypes.number,
  listData: PropTypes.array,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  perPageDefault: PropTypes.number,
  query: PropTypes.object.isRequired,
  session: PropTypes.object,
  settings: PropTypes.shape({
    hasGuests: PropTypes.func
  }),
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{settings: object, listData: Array, session: object, pending: boolean, fulfilled: boolean,
 *     getHostsInventory: Function, error: boolean, itemCount: number, viewId: string, t: translate,
 *     filterInventoryData: Array, filterGuestsData: Array, perPageDefault: number, isDisabled: boolean}}
 */
InventoryList.defaultProps = {
  error: false,
  fulfilled: false,
  filterGuestsData: [],
  filterInventoryData: [],
  getHostsInventory: helpers.noop,
  isDisabled: helpers.UI_DISABLED_TABLE_HOSTS,
  itemCount: 0,
  listData: [],
  pending: false,
  perPageDefault: 10,
  session: {},
  settings: {},
  t: translate,
  viewId: 'inventoryList'
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getHostsInventory: (id, query) => dispatch(reduxActions.rhsm.getHostsInventory(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.inventoryList.makeInventoryList();

const ConnectedInventoryList = connect(makeMapStateToProps, mapDispatchToProps)(InventoryList);

export { ConnectedInventoryList as default, ConnectedInventoryList, InventoryList };
