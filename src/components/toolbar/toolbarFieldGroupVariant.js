import React from 'react';
import { Toolbar as PfToolbar, ToolbarContent, ToolbarItem, ToolbarItemVariant } from '@patternfly/react-core';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import { translate } from '../i18n/i18n';
import { routerContext } from '../router';

/**
 * A toolbar product configuration select filter requiring a toolbar component parent.
 *
 * @memberof Toolbar
 * @module ToolbarFieldGroupVariant
 */

/**
 * Generate select field options from config. Sorted by title string.
 *
 * @param {object} options
 * @param {translate} [options.t=translate]
 * @param {routerContext.useRouteDetail} [options.useRouteDetail=routerContext.useRouteDetail]
 * @returns {Function}
 */
const useToolbarFieldOptions = ({
  t = translate,
  useRouteDetail: useAliasRouteDetail = routerContext.useRouteDetail
} = {}) => {
  const { availableVariants, firstMatch } = useAliasRouteDetail();
  const options = [];

  availableVariants?.forEach(variant => {
    options.push({
      title: t('curiosity-toolbar.label', { context: ['groupVariant', variant] }),
      value: variant,
      isSelected: variant === firstMatch?.productId
    });
  });

  return options.sort(({ title: titleA }, { title: titleB }) => titleA.localeCompare(titleB));
};

/**
 * On select update.
 *
 * @param {object} options
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProduct} [options.useProduct=useProduct]
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productGroup } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ value = null } = {}) => {
    dispatch([
      {
        type: reduxTypes.app.SET_PRODUCT_VARIANT_QUERY_RESET_ALL,
        variant: value
      },
      {
        type: reduxTypes.app.SET_PRODUCT_VARIANT,
        variant: value,
        productGroup
      }
    ]);
  };
};

/**
 * Display a product configuration field with generated options.
 *
 * @param {object} props
 * @param {boolean} [props.isFilter=false]
 * @param {boolean} [props.isStandalone=false]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useProduct} [props.useProduct=useProduct]
 * @param {storeHooks.reactRedux.useSelector} [props.useSelector=storeHooks.reactRedux.useSelector]
 * @param {useToolbarFieldOptions} [props.useToolbarFieldOptions=useToolbarFieldOptions]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldGroupVariant = ({
  isFilter = false,
  isStandalone = false,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector,
  useToolbarFieldOptions: useAliasToolbarFieldOptions = useToolbarFieldOptions
}) => {
  const { productGroup } = useAliasProduct();
  const updatedValue = useAliasSelector(({ view }) => view?.product?.variant?.[productGroup], null);
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({
    ...option,
    isSelected: (updatedValue && option.value === updatedValue) || option?.isSelected
  }));

  if (options?.length <= 1) {
    return null;
  }

  const element = (
    <ToolbarContent className="curiosity-toolbar__content">
      <ToolbarItem variant={ToolbarItemVariant.label}>
        {t('curiosity-toolbar.label', { context: ['groupVariant'] })}{' '}
      </ToolbarItem>
      <Select
        aria-label={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'groupVariant'] })}
        onSelect={onSelect}
        options={updatedOptions}
        selectedOptions={updatedValue}
        placeholder={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'groupVariant'] })}
        alignment={{ position }}
        maxHeight={310}
        data-test="toolbarFieldGroupVariant"
      />
    </ToolbarContent>
  );

  return (
    (isStandalone && (
      <PfToolbar
        id="curiosity-toolbar"
        className="curiosity-toolbar pf-m-toggle-group-container ins-c-primary-toolbar"
        collapseListedFiltersBreakpoint="sm"
      >
        {element}
      </PfToolbar>
    )) ||
    element
  );
};

export { ToolbarFieldGroupVariant as default, ToolbarFieldGroupVariant, useOnSelect, useToolbarFieldOptions };
