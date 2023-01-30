import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { Tabs } from '../tabs/tabs';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { InventoryTab } from './inventoryTab';

/**
 * Update tab state.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
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
 * @fires onTab
 * @param {object} props
 * @param {number} props.activeTab
 * @param {React.ReactNode} props.children
 * @param {number} props.defaultActiveTab
 * @param {boolean} props.isDisabled
 * @param {Function} props.t
 * @param {Function} props.useOnTab
 * @param {Function} props.useProduct
 * @param {Function} props.useSelector
 * @returns {React.ReactNode|null}
 */
const InventoryTabs = ({
  activeTab,
  children,
  defaultActiveTab,
  isDisabled,
  t,
  useOnTab: useAliasOnTab,
  useProduct: useAliasProduct,
  useSelector: useAliasSelector
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

/**
 * Prop types.
 *
 * @type {{useOnTab: Function, useProduct: Function, t: Function, children: React.ReactNode,
 *     useSelector: Function, defaultActiveTab: number, isDisabled: boolean, activeTab: number}}
 */
InventoryTabs.propTypes = {
  activeTab: PropTypes.number,
  children: PropTypes.node.isRequired,
  defaultActiveTab: PropTypes.number,
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useOnTab: PropTypes.func,
  useProduct: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnTab: Function, useProduct: Function, t: translate, useSelector: Function,
 *     defaultActiveTab: number, isDisabled: boolean, activeTab: number}}
 */
InventoryTabs.defaultProps = {
  activeTab: 0,
  defaultActiveTab: 0,
  isDisabled: helpers.UI_DISABLED_TABLE,
  t: translate,
  useOnTab,
  useProduct,
  useSelector: storeHooks.reactRedux.useSelector
};

export { InventoryTabs as default, InventoryTabs, InventoryTab, useOnTab };
