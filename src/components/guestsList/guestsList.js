import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { useProductInventoryGuestsConfig, useProductInventoryGuestsQuery } from '../productView/productViewContext';
import { connect, reduxSelectors } from '../../redux';
import { Loader } from '../loader/loader';
import { inventoryCardHelpers } from '../inventoryList/inventoryCardHelpers';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { Table } from '../table/table';
import { useGetGuestsInventory, useOnScroll } from './guestsListContext';

/**
 * A system inventory guests component.
 *
 * @param {object} props
 * @param {number} props.defaultPerPage
 * @param {string} props.id
 * @param {number} props.numberOfGuests
 * @param {object} props.session
 * @param {Function} props.useGetGuestsInventory
 * @param {Function} props.useOnScroll
 * @param {Function} props.useProductInventoryGuestsQuery
 * @param {Function} props.useProductInventoryGuestsConfig
 * @fires onScroll
 * @returns {Node}
 */
const GuestsList = ({
  defaultPerPage,
  id,
  numberOfGuests,
  session,
  useGetGuestsInventory: useAliasGetGuestsInventory,
  useOnScroll: useAliasOnScroll,
  useProductInventoryGuestsQuery: useAliasProductInventoryGuestsQuery,
  useProductInventoryGuestsConfig: useAliasProductInventoryGuestsConfig
}) => {
  const [previousData, setPreviousData] = useState([]);
  const { filters: filterGuestsData } = useAliasProductInventoryGuestsConfig();

  const query = useAliasProductInventoryGuestsQuery({ options: { overrideId: id } });
  const { [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage } = query;

  const { error, pending, data = {} } = useAliasGetGuestsInventory(id);
  const { data: listData = [] } = data;

  const onScroll = useAliasOnScroll(id, () => {
    const updatedData = [...previousData, ...(listData || [])];
    setPreviousData(updatedData);
  });

  /**
   * Render a scroll table loader.
   *
   * @returns {Node}
   */
  const renderLoader = () => {
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
  };

  /**
   * Render a guests table.
   *
   * @returns {Node}
   */
  const renderTable = () => {
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

    // ToDo: Review having the height be a calc value
    // Include the table header
    let updatedHeight = (numberOfGuests + 1) * 42;
    updatedHeight = (updatedHeight < 275 && updatedHeight) || 275;

    return (
      <div className="curiosity-table-scroll" style={{ height: `${updatedHeight}px` }}>
        <div
          className={`curiosity-table-scroll-list${(updatedHeight < 275 && '__no-scroll') || ''}`}
          onScroll={onScroll}
        >
          {renderLoader()}
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
  };

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
            rowCount: numberOfGuests < defaultPerPage ? numberOfGuests : defaultPerPage,
            variant: TableVariant.compact
          }}
        />
      )}
      {((!pending && currentPage === 0) || currentPage > 0) && renderTable()}
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductInventoryGuestsConfig: Function, session: object, useOnScroll: Function, numberOfGuests: number,
 *     id: string, useGetGuestsInventory: Function, useProductInventoryGuestsQuery: Function, defaultPerPage: number}}
 */
GuestsList.propTypes = {
  defaultPerPage: PropTypes.number,
  id: PropTypes.string.isRequired,
  numberOfGuests: PropTypes.number.isRequired,
  session: PropTypes.object,
  useGetGuestsInventory: PropTypes.func,
  useOnScroll: PropTypes.func,
  useProductInventoryGuestsConfig: PropTypes.func,
  useProductInventoryGuestsQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductInventoryGuestsConfig: Function, session: object, useOnScroll: Function,
 *     useGetGuestsInventory: Function, useProductInventoryGuestsQuery: Function, defaultPerPage: number}}
 */
GuestsList.defaultProps = {
  defaultPerPage: 5,
  session: {},
  useGetGuestsInventory,
  useOnScroll,
  useProductInventoryGuestsConfig,
  useProductInventoryGuestsQuery
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.user.makeUserSession();

const ConnectedGuestsList = connect(makeMapStateToProps)(GuestsList);

export { ConnectedGuestsList as default, ConnectedGuestsList, GuestsList };
