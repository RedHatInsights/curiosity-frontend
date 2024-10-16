import React from 'react';
import {
  useGetInstancesInventory,
  useInventoryCardActionsInstances,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings
} from './inventoryCardInstancesContext';
import { InventoryCard } from '../inventoryCard/inventoryCard';
import { helpers } from '../../common';

/**
 * @memberof Components
 * @module InventoryCardInstances
 * @property {module} InventoryCardInstancesContext
 */

/**
 * An instances' system inventory component.
 *
 * @param {object} props
 * @param {boolean} [props.isDisabled=helpers.UI_DISABLED_TABLE_INSTANCES]
 * @param {useGetInstancesInventory} [props.useGetInventory=useGetInstancesInventory]
 * @param {useInventoryCardActionsInstances} [props.useInventoryCardActions=useInventoryCardActionsInstances]
 * @param {useOnPageInstances} [props.useOnPage=useOnPageInstances]
 * @param {useOnColumnSortInstances} [props.useOnColumnSort=useOnColumnSortInstances]
 * @param {useParseInstancesFiltersSettings} [props.useParseFiltersSettings=useParseInstancesFiltersSettings]
 * @returns {JSX.Element}
 */
const InventoryCardInstances = ({
  isDisabled = helpers.UI_DISABLED_TABLE_INSTANCES,
  useGetInventory = useGetInstancesInventory,
  useInventoryCardActions = useInventoryCardActionsInstances,
  useOnPage = useOnPageInstances,
  useOnColumnSort = useOnColumnSortInstances,
  useParseFiltersSettings = useParseInstancesFiltersSettings
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

export { InventoryCardInstances as default, InventoryCardInstances };
