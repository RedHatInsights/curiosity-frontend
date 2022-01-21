import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import { Bullseye, Card, CardActions, CardBody, CardFooter, CardHeader, CardHeaderMain } from '@patternfly/react-core';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/TableToolbar';
import { useProductInventoryHostsConfig, useProductInventoryHostsQuery } from '../productView/productViewContext';
import { helpers } from '../../common';
import { connect, reduxSelectors } from '../../redux';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import InventoryGuests from '../inventoryGuests/inventoryGuests';
import { inventoryCardHelpers } from './inventoryCardHelpers';
import Pagination from '../pagination/pagination';
import { ToolbarFieldDisplayName } from '../toolbar/toolbarFieldDisplayName';
import { paginationHelpers } from '../pagination/paginationHelpers';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';
import { useGetInstancesInventory, useOnPageInstances, useOnColumnSortInstances } from './inventoryCardContext';

/**
 * Set up inventory cards. Expand filters with base settings.
 *
 * @param {object} props
 * @param {Node} props.cardActions
 * @param {boolean} props.isDisabled
 * @param {number} props.perPageDefault
 * @param {Function} props.t
 * @param {object} props.session
 * @param {Function} props.useGetInventory
 * @param {Function} props.useOnPage
 * @param {Function} props.useOnColumnSort
 * @param {Function} props.useProductInventoryConfig
 * @param {Function} props.useProductInventoryQuery
 * @fires onColumnSort
 * @fires onPage
 * @fires onUpdateInventoryData
 * @returns {Node}
 */
const InventoryCard = ({
  cardActions,
  isDisabled,
  perPageDefault,
  t,
  session,
  useGetInventory: useAliasGetInventory,
  useOnPage: useAliasOnPage,
  useOnColumnSort: useAliasOnColumnSort,
  useProductInventoryConfig: useAliasProductInventoryConfig,
  useProductInventoryQuery: useAliasProductInventoryQuery
}) => {
  const query = useAliasProductInventoryQuery();
  const onPage = useAliasOnPage();
  const onColumnSort = useAliasOnColumnSort();
  const { filters: filterInventoryData, settings } = useAliasProductInventoryConfig();
  const { error, fulfilled, pending, data = {} } = useAliasGetInventory({ isDisabled });
  const { data: listData = [], meta = {} } = data;

  if (isDisabled) {
    return (
      <Card className="curiosity-inventory-card__disabled">
        <CardBody>
          <Bullseye>{t('curiosity-inventory.tab', { context: 'disabled' })}</Bullseye>
        </CardBody>
      </Card>
    );
  }

  const itemCount = meta?.count;
  const updatedPerPage = query[RHSM_API_QUERY_SET_TYPES.LIMIT] || perPageDefault;
  const updatedOffset = query[RHSM_API_QUERY_SET_TYPES.OFFSET];
  const isLastPage = paginationHelpers.isLastPage(updatedOffset, updatedPerPage, itemCount);

  // Set an updated key to force refresh minHeight
  const minHeightContentRefreshKey =
    (fulfilled === true && itemCount < updatedPerPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
    (fulfilled === true && isLastPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
    (error === true && `bodyMinHeight-${updatedPerPage}-resize`) ||
    `bodyMinHeight-${updatedPerPage}`;

  /**
   * Render an inventory table.
   *
   * @returns {Node}
   */
  const renderTable = () => {
    let updatedColumnHeaders = [];

    const updatedRows = listData.map(({ ...cellData }) => {
      const { columnHeaders, cells } = inventoryCardHelpers.parseRowCellsListData({
        filters: inventoryCardHelpers.parseInventoryFilters({
          filters: filterInventoryData,
          onSort: onColumnSort,
          query
        }),
        cellData,
        session
      });

      updatedColumnHeaders = columnHeaders;
      const subscriptionManagerId = cellData?.subscriptionManagerId;
      const numberOfGuests = cellData?.numberOfGuests;
      let isSubTable;

      // Is there a subTable, callback, or attempt to determine, return boolean
      if (typeof settings?.hasSubTable === 'function') {
        isSubTable = settings.hasSubTable({ ...cellData }, { ...session });
      } else {
        isSubTable = numberOfGuests > 0 && subscriptionManagerId;
      }

      return {
        cells,
        expandedContent:
          (isSubTable && <InventoryGuests numberOfGuests={numberOfGuests} id={subscriptionManagerId} />) || undefined
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
  };

  return (
    <Card className="curiosity-inventory-card">
      <MinHeight key="headerMinHeight" updateOnContent>
        <CardHeader className={(error && 'hidden') || ''} aria-hidden={error || false}>
          {cardActions}
          <CardActions className={(!itemCount && 'transparent') || ''} aria-hidden={!itemCount || false}>
            <Pagination
              isCompact
              isDisabled={pending || error}
              itemCount={itemCount}
              offset={updatedOffset}
              onPage={onPage}
              onPerPage={onPage}
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
            {!pending && renderTable()}
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
              onPage={onPage}
              onPerPage={onPage}
              perPage={updatedPerPage}
            />
          </TableToolbar>
        </CardFooter>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{useOnPage: Function, t: Function, session: object, perPageDefault: number, isDisabled: boolean,
 *     useProductInventoryConfig: Function, useGetInventory: Function, useOnColumnSort: Function,
 *     useProductInventoryQuery: Function}}
 */
InventoryCard.propTypes = {
  cardActions: PropTypes.node,
  isDisabled: PropTypes.bool,
  perPageDefault: PropTypes.number,
  session: PropTypes.object,
  t: PropTypes.func,
  useGetInventory: PropTypes.func,
  useOnPage: PropTypes.func,
  useOnColumnSort: PropTypes.func,
  useProductInventoryConfig: PropTypes.func,
  useProductInventoryQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnPage: Function, t: Function, session: object, perPageDefault: number, isDisabled: boolean,
 *     useProductInventoryConfig: Function, useGetInventory: Function, useOnColumnSort: Function,
 *     useProductInventoryQuery: Function}}
 */
InventoryCard.defaultProps = {
  cardActions: (
    <CardHeaderMain>
      <ToolbarFieldDisplayName />
    </CardHeaderMain>
  ),
  isDisabled: helpers.UI_DISABLED_TABLE_INSTANCES,
  perPageDefault: 10,
  session: {},
  t: translate,
  useGetInventory: useGetInstancesInventory,
  useOnPage: useOnPageInstances,
  useOnColumnSort: useOnColumnSortInstances,
  useProductInventoryConfig: useProductInventoryHostsConfig,
  useProductInventoryQuery: useProductInventoryHostsQuery
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.user.makeUserSession();

const ConnectedInventoryCard = connect(makeMapStateToProps)(InventoryCard);

export { ConnectedInventoryCard as default, ConnectedInventoryCard, InventoryCard };
