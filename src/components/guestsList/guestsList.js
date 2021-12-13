import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { helpers } from '../../common';
import { apiQueries, connect, reduxActions, reduxSelectors } from '../../redux';
import { Loader } from '../loader/loader';
import { inventoryCardHelpers } from '../inventoryList/inventoryCardHelpers';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { Table } from '../table/table';

/**
 * ToDo: Consider removing the query prop entirely.
 * The current API doesn't allow setting more than "offset" and "limit"
 */
/**
 * ToDo: Review moving the "onScroll" layout into a standalone component.
 */
/**
 * A system inventory guests component.
 *
 * @augments React.Component
 * @fires onUpdateGuestsData
 * @fires onScroll
 */
class GuestsList extends React.Component {
  state = { currentPage: 0, limit: 100, previousData: [] };

  componentDidMount() {
    this.onUpdateGuestsData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state;

    if (currentPage !== prevState.currentPage) {
      this.onUpdateGuestsData();
    }
  }

  /**
   * Call the RHSM APIs, apply filters.
   *
   * @event onUpdateGuestsData
   */
  onUpdateGuestsData = () => {
    const { currentPage, limit } = this.state;
    const { getHostsInventoryGuests, query, id } = this.props;

    if (id) {
      const updatedQuery = {
        ...query,
        [RHSM_API_QUERY_TYPES.LIMIT]: limit,
        [RHSM_API_QUERY_TYPES.OFFSET]: currentPage * limit || 0
      };

      const { inventoryGuestsQuery } = apiQueries.parseRhsmQuery(updatedQuery);
      getHostsInventoryGuests(id, inventoryGuestsQuery);
    }
  };

  /**
   * Update page state.
   *
   * @event onScroll
   * @param {object} event
   */
  onScroll = event => {
    const { target } = event;
    const { currentPage, limit, previousData } = this.state;
    const { numberOfGuests, pending, listData } = this.props;

    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;

    if (numberOfGuests > (currentPage + 1) * limit && bottom && !pending) {
      const newPage = currentPage + 1;
      const updatedData = [...previousData, ...(listData || [])];

      this.setState({
        previousData: updatedData,
        currentPage: newPage
      });
    }
  };

  renderLoader() {
    const { currentPage } = this.state;
    const { filterGuestsData, listData, pending } = this.props;

    if (currentPage > 0 && pending) {
      const scrollLoader = (
        <Loader
          variant="table"
          tableProps={{
            borders: false,
            colCount: filterGuestsData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
            colWidth: (filterGuestsData?.length && filterGuestsData.map(({ cellWidth }) => cellWidth)) || [],
            rowCount: 0,
            variant: TableVariant.compact
          }}
        />
      );

      return <div className="curiosity-table-scroll-loader__custom">{scrollLoader}</div>;
    }

    return null;
  }

  /**
   * ToDo: Consider moving the "meaning of life" into the default props on iteration.
   * For everyone else... move the 42 into default props, possibly the 275.
   */
  /**
   * Render a guests table.
   *
   * @returns {Node}
   */
  renderTable() {
    const { previousData } = this.state;
    const { filterGuestsData, listData, numberOfGuests, session } = this.props;
    let updatedColumnHeaders = [];

    const updatedRows = [...previousData, ...(listData || [])].map(({ ...cellData }) => {
      const { columnHeaders, cells } = inventoryCardHelpers.parseRowCellsListData({
        filters: filterGuestsData,
        cellData,
        session
      });

      updatedColumnHeaders = columnHeaders;

      return {
        cells
      };
    });

    // Include the table header
    let updatedHeight = (numberOfGuests + 1) * 42;
    updatedHeight = (updatedHeight < 275 && updatedHeight) || 275;

    return (
      <div className="curiosity-table-scroll" style={{ height: `${updatedHeight}px` }}>
        <div
          className={`curiosity-table-scroll-list${(updatedHeight < 275 && '__no-scroll') || ''}`}
          onScroll={this.onScroll}
        >
          {this.renderLoader()}
          {(updatedRows.length && (
            <Table
              borders={false}
              variant={TableVariant.compact}
              className="curiosity-guests-list"
              columnHeaders={updatedColumnHeaders}
              rows={updatedRows}
            />
          )) ||
            null}
        </div>
      </div>
    );
  }

  /**
   * Render a guest list table.
   *
   * @returns {Node}
   */
  render() {
    const { currentPage } = this.state;
    const { error, filterGuestsData, listData, numberOfGuests, pending, perPageDefault } = this.props;

    return (
      <div className={`fadein ${(error && 'blur') || ''}`}>
        {pending && currentPage === 0 && (
          <Loader
            variant="table"
            tableProps={{
              borders: false,
              className: 'curiosity-guests-list',
              colCount: filterGuestsData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
              colWidth: (filterGuestsData?.length && filterGuestsData.map(({ cellWidth }) => cellWidth)) || [],
              rowCount: numberOfGuests < perPageDefault ? numberOfGuests : perPageDefault,
              variant: TableVariant.compact
            }}
          />
        )}
        {((!pending && currentPage === 0) || currentPage > 0) && this.renderTable()}
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{listData: Array, getHostsInventoryGuests: Function, session: object, filterGuestsData: object,
 *     pending: boolean, query: object, numberOfGuests: number, perPageDefault: number, id: string,
 *     error: boolean}}
 */
GuestsList.propTypes = {
  error: PropTypes.bool,
  filterGuestsData: PropTypes.arrayOf(
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
  getHostsInventoryGuests: PropTypes.func,
  listData: PropTypes.array,
  id: PropTypes.string.isRequired,
  numberOfGuests: PropTypes.number.isRequired,
  pending: PropTypes.bool,
  perPageDefault: PropTypes.number,
  query: PropTypes.object,
  session: PropTypes.object
};

/**
 * Default props.
 *
 * @type {{listData: Array, getHostsInventoryGuests: Function, session: object, filterGuestsData: Array,
 *     pending: boolean, query: object, perPageDefault: number, error: boolean}}
 */
GuestsList.defaultProps = {
  error: false,
  filterGuestsData: [],
  getHostsInventoryGuests: helpers.noop,
  listData: [],
  pending: false,
  perPageDefault: 5,
  query: {},
  session: {}
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getHostsInventoryGuests: (id, query) => dispatch(reduxActions.rhsm.getHostsInventoryGuests(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.guestsList.makeGuestsList();

const ConnectedGuestsList = connect(makeMapStateToProps, mapDispatchToProps)(GuestsList);

export { ConnectedGuestsList as default, ConnectedGuestsList, GuestsList };
