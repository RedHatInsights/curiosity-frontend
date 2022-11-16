import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { useSession } from '../authentication/authenticationContext';
import { useProductInventoryGuestsConfig, useProductInventoryGuestsQuery } from '../productView/productViewContext';
import { Loader } from '../loader/loader';
import { inventoryCardHelpers } from '../inventoryCard/inventoryCardHelpers';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { Table } from '../table/table';
import { useGetGuestsInventory, useOnScroll } from './inventoryGuestsContext';

/**
 * A system inventory guests component.
 *
 * @param {object} props
 * @param {number} props.defaultPerPage
 * @param {string} props.id
 * @param {number} props.numberOfGuests
 * @param {Function} props.useGetGuestsInventory
 * @param {Function} props.useOnScroll
 * @param {Function} props.useProductInventoryGuestsQuery
 * @param {Function} props.useProductInventoryGuestsConfig
 * @param {Function} props.useSession
 * @fires onScroll
 * @returns {Node}
 */
const InventoryGuests = ({
  defaultPerPage,
  id,
  numberOfGuests,
  useGetGuestsInventory: useAliasGetGuestsInventory,
  useOnScroll: useAliasOnScroll,
  useProductInventoryGuestsQuery: useAliasProductInventoryGuestsQuery,
  useProductInventoryGuestsConfig: useAliasProductInventoryGuestsConfig,
  useSession: useAliasSession
}) => {
  const sessionData = useAliasSession();
  const { filters: filterGuestsData } = useAliasProductInventoryGuestsConfig();
  const { pending, data: listData = [] } = useAliasGetGuestsInventory(id);
  const onScroll = useAliasOnScroll(id);
  const query = useAliasProductInventoryGuestsQuery({ options: { overrideId: id } });
  const { [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage } = query;

  /**
   * Render a scroll table loader.
   *
   * @param {boolean} isFirstPage
   * @returns {Node}
   */
  const renderLoader = isFirstPage => {
    if (pending) {
      let updatedRowCount = 0;

      if (isFirstPage) {
        if (numberOfGuests < defaultPerPage) {
          updatedRowCount = numberOfGuests;
        } else {
          updatedRowCount = defaultPerPage;
        }
      }

      const scrollLoader = (
        <Loader
          variant="table"
          tableProps={{
            borders: false,
            className: (isFirstPage && 'curiosity-guests-list') || undefined,
            colCount: filterGuestsData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
            colWidth: (filterGuestsData?.length && filterGuestsData.map(({ cellWidth }) => cellWidth)) || [],
            rowCount: updatedRowCount,
            variant: TableVariant.compact
          }}
        />
      );

      return <div className="curiosity-table-scroll-loader__custom">{scrollLoader}</div>;
    }

    return null;
  };

  let updatedColumnHeaders = [];
  const updatedRows = listData.map(({ ...cellData }) => {
    const { columnHeaders, cells } = inventoryCardHelpers.parseRowCellsListData({
      filters: filterGuestsData,
      cellData,
      session: sessionData
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
    <div className="fadein">
      <div className="curiosity-table-scroll" style={{ height: `${updatedHeight}px` }}>
        <div
          className={`curiosity-table-scroll-list${(updatedHeight < 275 && '__no-scroll') || ''}`}
          onScroll={onScroll}
        >
          {renderLoader(currentPage === 0)}
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
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductInventoryGuestsConfig: Function, useSession: Function, numberOfGuests: number, id: string,
 *     useOnScroll: Function, useGetGuestsInventory: Function, useProductInventoryGuestsQuery: Function,
 *     defaultPerPage: number}}
 */
InventoryGuests.propTypes = {
  defaultPerPage: PropTypes.number,
  id: PropTypes.string.isRequired,
  numberOfGuests: PropTypes.number.isRequired,
  useGetGuestsInventory: PropTypes.func,
  useOnScroll: PropTypes.func,
  useProductInventoryGuestsConfig: PropTypes.func,
  useProductInventoryGuestsQuery: PropTypes.func,
  useSession: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductInventoryGuestsConfig: Function, useSession: Function, useOnScroll: Function,
 *     useGetGuestsInventory: Function, useProductInventoryGuestsQuery: Function, defaultPerPage: number}}
 */
InventoryGuests.defaultProps = {
  defaultPerPage: 5,
  useGetGuestsInventory,
  useOnScroll,
  useProductInventoryGuestsConfig,
  useProductInventoryGuestsQuery,
  useSession
};

export { InventoryGuests as default, InventoryGuests };
