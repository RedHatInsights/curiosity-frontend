import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '../loader/loader';
import { Table, TableVariant } from '../table/table';
import { useGetGuestsInventory, useOnScroll } from './inventoryGuestsContext'; // eslint-disable-line

/**
 * Guests inventory table wrapper.
 *
 * @memberof Components
 * @module InventoryGuests
 * @property {module} InventoryGuestsContext
 */

/**
 * A system inventory guests component.
 *
 * @param {object} props
 * @param {number} props.defaultPerPage
 * @param {string} props.id
 * @param {number} props.numberOfGuests
 * @param {Function} props.useGetInventory
 * @param {Function} props.useOnScroll
 * @fires onScroll
 * @returns {React.ReactNode}
 */
const InventoryGuests = ({
  defaultPerPage,
  id,
  numberOfGuests,
  useGetInventory: useAliasGetInventory,
  useOnScroll: useAliasOnScroll
}) => {
  const {
    pending,
    dataSetColumnHeaders = [],
    dataSetRows = [],
    resultsColumnCountAndWidths = { count: 1, widths: [] },
    resultsOffset
  } = useAliasGetInventory(id);

  const onScroll = useAliasOnScroll({ id, numberOfGuests });

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
          {pending && (
            <div className="curiosity-table-scroll-loader__custom">
              <Loader
                variant="table"
                tableProps={{
                  borders: false,
                  className: 'curiosity-guests-list',
                  colCount: resultsColumnCountAndWidths.count,
                  colWidth: resultsColumnCountAndWidths.widths,
                  rowCount: (resultsOffset === 0 && numberOfGuests < defaultPerPage && numberOfGuests) || 1,
                  variant: TableVariant.compact,
                  isHeader: false
                }}
              />
            </div>
          )}
          {(dataSetRows?.length && (
            <Table
              isBorders={false}
              isHeader
              className="curiosity-guests-list"
              columnHeaders={dataSetColumnHeaders}
              rows={dataSetRows}
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
 * @type {{numberOfGuests: number, id: string, useOnScroll: Function, useGetInventory: Function,
 *     defaultPerPage: number}}
 */
InventoryGuests.propTypes = {
  defaultPerPage: PropTypes.number,
  id: PropTypes.string.isRequired,
  numberOfGuests: PropTypes.number.isRequired,
  useGetInventory: PropTypes.func,
  useOnScroll: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnScroll: Function, useGetInventory: Function, defaultPerPage: number}}
 */
InventoryGuests.defaultProps = {
  defaultPerPage: 5,
  useGetInventory: useGetGuestsInventory,
  useOnScroll
};

export { InventoryGuests as default, InventoryGuests };
