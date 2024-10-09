import React from 'react';
import {
  useGetSubscriptionsInventory,
  useInventoryCardActionsSubscriptions,
  useOnPageSubscriptions,
  useOnColumnSortSubscriptions,
  useParseSubscriptionsFiltersSettings
} from './inventoryCardSubscriptionsContext';
import { InventoryCard } from '../inventoryCard/inventoryCard';
import { helpers } from '../../common';

/**
 * @memberof Components
 * @module InventoryCardSubscriptions
 * @property {module} InventoryCardSubscriptionsContext
 */

/**
 * A subscriptions' system inventory component.
 *
 * @param {object} props
 * @param {boolean} [props.isDisabled=helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS]
 * @param {useGetSubscriptionsInventory} [props.useGetInventory=useGetSubscriptionsInventory]
 * @param {useInventoryCardActionsSubscriptions} [props.useInventoryCardActions=useInventoryCardActionsSubscriptions]
 * @param {useOnPageSubscriptions} [props.useOnPage=useOnPageSubscriptions]
 * @param {useOnColumnSortSubscriptions} [props.useOnColumnSort=useOnColumnSortSubscriptions]
 * @param {useParseSubscriptionsFiltersSettings} [props.useParseFiltersSettings=useParseSubscriptionsFiltersSettings]
 * @returns {JSX.Element}
 */
const InventoryCardSubscriptions = ({
  isDisabled = helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS,
  useGetInventory = useGetSubscriptionsInventory,
  useInventoryCardActions = useInventoryCardActionsSubscriptions,
  useOnPage = useOnPageSubscriptions,
  useOnColumnSort = useOnColumnSortSubscriptions,
  useParseFiltersSettings = useParseSubscriptionsFiltersSettings
}) => (
  <InventoryCard
    isDisabled={isDisabled}
    useGetInventory={useGetInventory}
    useInventoryCardActions={useInventoryCardActions}
    useOnPage={useOnPage}
    useOnColumnSort={useOnColumnSort}
    useParseFiltersSettings={useParseFiltersSettings}
  />
);

export { InventoryCardSubscriptions as default, InventoryCardSubscriptions };
