import React from 'react';
import { Loader } from '../loader/loader';
import { Table, TableVariant } from '../table/table';
import { useGetGuestsInventory, useOnScroll } from './inventoryGuestsContext'; // eslint-disable-line
import { ErrorMessage } from '../errorMessage/errorMessage';
import { translate } from '../i18n/i18n';

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
 * @param {number} [props.defaultPerPage=5]
 * @param {string} props.id
 * @param {number} props.numberOfGuests
 * @param {useGetGuestsInventory} [props.useGetInventory=useGetGuestsInventory]
 * @param {useOnScroll} [props.useOnScroll=useOnScroll]
 * @param {translate} [props.t=translate]
 * @fires onScroll
 * @returns {JSX.Element}
 */
const InventoryGuests = ({
  defaultPerPage = 5,
  id,
  numberOfGuests,
  t = translate,
  useGetInventory: useAliasGetInventory = useGetGuestsInventory,
  useOnScroll: useAliasOnScroll = useOnScroll
}) => {
  const {
    error,
    message,
    pending,
    dataSetColumnHeaders = [],
    dataSetRows = [],
    resultsColumnCountAndWidths = { count: 1, widths: [] },
    resultsOffset
  } = useAliasGetInventory(id);
  const onScroll = useAliasOnScroll({ id, numberOfGuests });

  // ToDo: Review having the height be a calc value. Remember to include the table header
  let updatedHeight = (numberOfGuests + 1) * 42;
  updatedHeight = (updatedHeight < 275 && updatedHeight) || 275;

  return (
    <div className="curiosity-table-scroll" style={{ height: `${updatedHeight}px` }}>
      <div
        className={`curiosity-table-scroll-list${(pending && '__no-scroll') || (updatedHeight < 275 && '__no-scroll') || ''}`}
        onScroll={onScroll}
      >
        {(error && <ErrorMessage message={message} title={t('curiosity-inventory.error_title')} />) ||
          (pending && (
            <div className="curiosity-table-scroll-loader__custom">
              <Loader
                variant="table"
                tableProps={{
                  borders: false,
                  className: 'curiosity-guests-list',
                  colCount: resultsColumnCountAndWidths.count,
                  colWidth: resultsColumnCountAndWidths.widths,
                  rowCount:
                    (resultsOffset === 0 && numberOfGuests < defaultPerPage && numberOfGuests) ||
                    (resultsOffset === 0 && numberOfGuests) ||
                    1,
                  variant: TableVariant.compact,
                  isHeader: false
                }}
              />
            </div>
          ))}
        {(dataSetRows?.length && (
          <Table
            key={id}
            isBorders={false}
            isHeader
            className="curiosity-guests-list fadein__fast"
            columnHeaders={dataSetColumnHeaders}
            rows={dataSetRows}
          />
        )) ||
          null}
      </div>
    </div>
  );
};

export { InventoryGuests as default, InventoryGuests };
