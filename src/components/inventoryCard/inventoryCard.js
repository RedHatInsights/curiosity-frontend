import React from 'react';
import { TableVariant } from '@patternfly/react-table';
import {
  Bullseye,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Toolbar,
  ToolbarContent,
  ToolbarGroup
} from '@patternfly/react-core';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/TableToolbar';
import { Table } from '../table/table';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { Pagination, PaginationDirectionType, PaginationVariant } from '../pagination/pagination';
import { ErrorMessage } from '../errorMessage/errorMessage';
import { translate } from '../i18n/i18n';
import { helpers } from '../../common';

/**
 * Base inventory table card.
 *
 *     The InventoryCard pattern is purposefully different when compared to the current GraphCard component
 *     for the specific purpose of using hook dependency injection. Minor lifecycle hook alterations
 *     allow the InventoryCard to be used against multiple inventory API endpoints without the need to
 *     recreate the core component.
 *
 * @memberof Components
 * @module InventoryCard
 * @property {module} InventoryCardHelpers
 */

/**
 * @callback useGetInventory
 * @returns {{
 *     error: boolean,
 *     message: string,
 *     pending: boolean,
 *     dataSetColumnHeaders: Array,
 *     dataSetRows: Array,
 *     resultsColumnCountAndWidths: { count: number, widths: Array },
 *     resultsCount,
 *     resultsOffset,
 *     resultsPerPage
 *   }}
 */

/**
 * @callback useInventoryCardActions
 * @returns {React.ReactNode}
 */

/**
 * @callback useParseFiltersSettings
 * @returns {{ filters: Array }}
 */

/**
 * @callback useOnPage
 * @returns {Function}
 */

/**
 * @callback useOnColumnSort
 * @returns {Function}
 */

/**
 * Set up inventory cards. Expand filters with base settings.
 *
 * @param {object} props
 * @param {boolean} [props.isDisabled=false]
 * @param {translate} [props.t=translate]
 * @param {useGetInventory} props.useGetInventory
 * @param {useInventoryCardActions} props.useInventoryCardActions
 * @param {useParseFiltersSettings} props.useParseFiltersSettings
 * @param {useOnPage} props.useOnPage
 * @param {useOnColumnSort} props.useOnColumnSort
 * @fires onColumnSort
 * @fires onPage
 * @returns {JSX.Element}
 */
const InventoryCard = ({
  isDisabled = false,
  t = translate,
  useGetInventory: useAliasGetInventory,
  useInventoryCardActions: useAliasInventoryCardActions,
  useOnPage: useAliasOnPage,
  useOnColumnSort: useAliasOnColumnSort,
  useParseFiltersSettings: useAliasParseFiltersSettings
}) => {
  const updatedActionDisplay = useAliasInventoryCardActions();
  const onPage = useAliasOnPage();
  const onColumnSort = useAliasOnColumnSort();
  const { filters } = useAliasParseFiltersSettings({ isDisabled });
  const {
    error,
    message,
    pending,
    dataSetColumnHeaders = [],
    dataSetRows = [],
    resultsColumnCountAndWidths = { count: 1, widths: [] },
    resultsCount,
    resultsOffset,
    resultsPerPage
  } = useAliasGetInventory({ isDisabled });

  if (isDisabled || !filters?.length) {
    return (
      <Card className="curiosity-inventory-card__disabled">
        <CardBody>
          <Bullseye>{t('curiosity-inventory.tab', { context: 'disabled' })}</Bullseye>
        </CardBody>
      </Card>
    );
  }

  const tableClassName = 'curiosity-inventory-list';

  const tableAriaLabel = translate('curiosity-inventory.table', {
    context: ['ariaLabel'],
    appName: helpers.UI_DISPLAY_NAME
  });

  const tableSummary = translate('curiosity-inventory.table', {
    context: ['summary']
  });

  return (
    <Card className="curiosity-card curiosity-inventory-card" isPlain>
      <MinHeight key="headerMinHeight">
        <CardHeader
          className={`curiosity-card__header ${(error && 'hidden') || ''}`}
          aria-hidden={error || false}
          actions={{
            className: 'curiosity-card__actions',
            actions: (
              <Toolbar className="curiosity-toolbar" collapseListedFiltersBreakpoint="sm">
                <ToolbarContent className="curiosity-toolbar__content">
                  {updatedActionDisplay && (
                    <ToolbarGroup key="inventory-actions" align={{ default: 'alignStart' }}>
                      {updatedActionDisplay}
                    </ToolbarGroup>
                  )}
                  <ToolbarGroup
                    key="inventory-paging"
                    align={{ default: 'alignEnd' }}
                    className={`curiosity-toolbar__group ${(!resultsCount && 'transparent') || ''}`}
                    aria-hidden={!resultsCount || false}
                  >
                    <Pagination
                      isCompact
                      isDisabled={pending || error}
                      itemCount={resultsCount}
                      offset={resultsOffset}
                      onPage={onPage}
                      onPerPage={onPage}
                      perPage={resultsPerPage}
                    />
                  </ToolbarGroup>
                </ToolbarContent>
              </Toolbar>
            )
          }}
        />
      </MinHeight>
      <MinHeight key="bodyMinHeight">
        <CardBody className="curiosity-card__body">
          {(error && <ErrorMessage message={message} title={t('curiosity-inventory.error_title')} />) || (
            <div className={(pending && 'fadein') || ''}>
              {(pending && (
                <Loader
                  variant="table"
                  tableProps={{
                    ariaLabel: tableAriaLabel,
                    className: tableClassName,
                    colCount: resultsColumnCountAndWidths.count,
                    colWidth: resultsColumnCountAndWidths.widths,
                    rowCount: dataSetRows?.length || resultsPerPage,
                    summary: tableSummary,
                    variant: TableVariant.compact,
                    isHeader: true
                  }}
                />
              )) || (
                <Table
                  key="inventory-table"
                  ariaLabelTable={tableAriaLabel}
                  className={tableClassName}
                  emptyTable={{
                    ariaLabel: tableAriaLabel,
                    className: tableClassName,
                    summary: tableSummary,
                    title: translate('curiosity-inventory.table', { context: ['emptyState', 'title'] }),
                    message: translate('curiosity-inventory.table', { context: ['emptyState', 'description'] })
                  }}
                  isBorders
                  isHeader
                  onSort={onColumnSort}
                  columnHeaders={dataSetColumnHeaders}
                  rows={dataSetRows}
                  summary={tableSummary}
                />
              )}
            </div>
          )}
        </CardBody>
      </MinHeight>
      <MinHeight key="footerMinHeight">
        <CardFooter
          className={`curiosity-card__footer ${(error && 'hidden') || (!resultsCount && 'transparent') || ''}`}
          aria-hidden={error || !resultsCount || false}
        >
          <TableToolbar isFooter>
            <Pagination
              variant={PaginationVariant.bottom}
              dropDirection={PaginationDirectionType.up}
              isDisabled={pending || error}
              itemCount={resultsCount}
              offset={resultsOffset}
              onPage={onPage}
              onPerPage={onPage}
              perPage={resultsPerPage}
            />
          </TableToolbar>
        </CardFooter>
      </MinHeight>
    </Card>
  );
};

export { InventoryCard as default, InventoryCard };
