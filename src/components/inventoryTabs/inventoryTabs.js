import React from 'react';
import { Title } from '@patternfly/react-core';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { Tabs } from '../tabs/tabs';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { InventoryTab } from './inventoryTab';

/**
 * An inventory tabs display with state. Consume Tabs.
 *
 * @see Tabs
 * @memberof Components
 * @module InventoryTabs
 * @property {module} InventoryTab
 */

/**
 * Update tab state.
 *
 * @param {object} options
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProduct} [options.useProduct=useProduct]
 * @returns {Function}
 */
const useOnTab = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ index } = {}) => {
    dispatch({
      type: reduxTypes.inventory.SET_INVENTORY_TAB,
      tabs: {
        [productId]: index
      }
    });
  };
};

/**
 * An inventory tabs component.
 * Render inventory tabs using Inventory tab passed props only.
 *
 * @param {object} props
 * @param {number} [props.activeTab=0]
 * @param {React.ReactNode} props.children
 * @param {number} [props.defaultActiveTab=0]
 * @param {boolean} [props.isDisabled=helpers.UI_DISABLED_TABLE]
 * @param {translate} [props.t=translate]
 * @param {useOnTab} [props.useOnTab=useOnTab]
 * @param {useProduct} [props.useProduct=useProduct]
 * @param {storeHooks.reactRedux.useSelector} [props.useSelector=storeHooks.reactRedux.useSelector]
 * @fires onTab
 * @returns {JSX.Element|null}
 */
const InventoryTabs = ({
  activeTab = 0,
  children,
  defaultActiveTab = 0,
  isDisabled = helpers.UI_DISABLED_TABLE,
  t = translate,
  useOnTab: useAliasOnTab = useOnTab,
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
}) => {
  const { productId } = useAliasProduct();
  const updatedActiveTab = useAliasSelector(({ inventory }) => inventory.tabs?.[productId], activeTab);
  const onTab = useAliasOnTab();

  if (isDisabled) {
    return null;
  }

  const updatedChildren = React.Children.toArray(children).map((child, index) => {
    const { props: childProps = {} } = child;

    return {
      active: childProps.active || false,
      content: childProps.children || child,
      title: childProps.title || t('curiosity-inventory.tabSubHeading', { count: index })
    };
  });

  return (
    <React.Fragment>
      <Title headingLevel="h2" className="sr-only">
        {t('curiosity-inventory.tabHeading', { count: updatedChildren.length })}
      </Title>
      <Tabs activeTab={updatedActiveTab} defaultActiveTab={defaultActiveTab} onTab={onTab} tabs={updatedChildren} />
    </React.Fragment>
  );
};

export { InventoryTabs as default, InventoryTabs, InventoryTab, useOnTab };
