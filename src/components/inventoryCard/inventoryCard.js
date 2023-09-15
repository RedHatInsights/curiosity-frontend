import React from 'react';
import PropTypes from 'prop-types';
import { TableVariant } from '@patternfly/react-table';
import {
  Bullseye,
  Card,
  CardActions,
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
import { Pagination } from '../pagination/pagination';
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
 * Set up inventory cards. Expand filters with base settings.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.t
 * @param {Function} props.useGetInventory
 * @param {Function} props.useInventoryCardActions
 * @param {Function} props.useParseFiltersSettings
 * @param {Function} props.useOnPage
 * @param {Function} props.useOnColumnSort
 * @fires onColumnSort
 * @fires onPage
 * @returns {React.ReactNode}
 */
const InventoryCard = ({
  isDisabled,
  t,
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
    <Card className="curiosity-inventory-card">
      <MinHeight key="headerMinHeight">
        <CardHeader className={(error && 'hidden') || ''} aria-hidden={error || false}>
          <CardActions>
            <Toolbar collapseListedFiltersBreakpoint="sm">
              <ToolbarContent>
                {updatedActionDisplay && (
                  <ToolbarGroup key="inventory-actions" alignment={{ default: 'alignLeft' }}>
                    {updatedActionDisplay}
                  </ToolbarGroup>
                )}
                <ToolbarGroup
                  key="inventory-paging"
                  alignment={{ default: 'alignRight' }}
                  className={(!resultsCount && 'transparent') || ''}
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
          </CardActions>
        </CardHeader>
      </MinHeight>
      <MinHeight key="bodyMinHeight">
        <CardBody>
          <div className={(error && 'blur') || (pending && 'fadein') || ''}>
            {pending && (
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
            )}
            {!pending && (
              <Table
                key="inventory-table"
                ariaLabel={tableAriaLabel}
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
        </CardBody>
      </MinHeight>
      <MinHeight key="footerMinHeight">
        <CardFooter
          className={(error && 'hidden') || (!resultsCount && 'transparent') || ''}
          aria-hidden={error || !resultsCount || false}
        >
          <TableToolbar isFooter>
            <Pagination
              dropDirection="up"
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

/**
 * Prop types.
 *
 * @type {{useOnPage: Function, useParseFiltersSettings: Function, t: Function, useInventoryCardActions: Function,
 *     isDisabled: boolean, useGetInventory: Function, useOnColumnSort: Function}}
 */
InventoryCard.propTypes = {
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useGetInventory: PropTypes.func.isRequired,
  useInventoryCardActions: PropTypes.func.isRequired,
  useOnPage: PropTypes.func.isRequired,
  useOnColumnSort: PropTypes.func.isRequired,
  useParseFiltersSettings: PropTypes.func.isRequired
};

/**
 * Default props.
 *
 * @type {{t: translate, isDisabled: boolean}}
 */
InventoryCard.defaultProps = {
  isDisabled: false,
  t: translate
};

export { InventoryCard as default, InventoryCard };
