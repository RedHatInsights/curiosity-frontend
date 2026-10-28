import React, { useMemo } from 'react';
import {
  Toolbar as PfToolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarItemVariant
} from '@patternfly/react-core';
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
 * @returns {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const useToolbarFieldOptions = ({
  t = translate,
  useRouteDetail: useAliasRouteDetail = routerContext.useRouteDetail
} = {}) => {
  const { availableVariants, firstMatch } = useAliasRouteDetail();
  const productId = firstMatch?.productId;

  return useMemo(() => {
    const options = [];

    availableVariants?.forEach(variant => {
      options.push({
        title: t('curiosity-toolbar.label', { context: ['groupVariant', variant] }),
        value: variant,
        isSelected: variant === productId
      });
    });

    return options.sort(({ title: titleA }, { title: titleB }) => titleA.localeCompare(titleB));
  }, [availableVariants, productId, t]);
};

/**
 * On select update.
 *
 * Resets the variant's cached queries, then reflects the selection in the browser URL. The URL, not Redux,
 * carries the selected variant so the view can be bookmarked and restored, see routerContext.useNavigateVariant.
 *
 * Note: the query reset is intentionally tied to this explicit user action. Arriving at a variant through a
 * bookmark or browser back/forward deliberately leaves cached queries alone, preserving the restored view and
 * avoiding the extra API calls described in viewReducer's SET_PRODUCT_VARIANT_QUERY_RESET_ALL.
 *
 * @param {object} options
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {routerContext.useNavigateVariant} [options.useNavigateVariant=routerContext.useNavigateVariant]
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useNavigateVariant: useAliasNavigateVariant = routerContext.useNavigateVariant
} = {}) => {
  const dispatch = useAliasDispatch();
  const navigateVariant = useAliasNavigateVariant();

  return ({ value = null } = {}) => {
    if (!value) {
      return;
    }

    dispatch([
      {
        type: reduxTypes.app.SET_PRODUCT_VARIANT_QUERY_RESET_ALL,
        variant: value
      },
      {
        type: reduxTypes.rhsm.SET_CONFIG_RHSM_RESET
      },
      {
        type: reduxTypes.graph.SET_GRAPH_LEGEND_RESET
      }
    ]);

    navigateVariant(value);
  };
};

/**
 * Display a product configuration field with generated options.
 *
 * @param {object} props
 * @param {boolean} [props.isFilter=false]
 * @param {boolean} [props.isInline=false]
 * @param {boolean} [props.isStandalone=false]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useProduct} [props.useProduct=useProduct]
 * @param {useToolbarFieldOptions} [props.useToolbarFieldOptions=useToolbarFieldOptions]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldGroupVariant = ({
  isInline = true,
  isFilter = false,
  isStandalone = false,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProduct: useAliasProduct = useProduct,
  useToolbarFieldOptions: useAliasToolbarFieldOptions = useToolbarFieldOptions
}) => {
  // The resolved productId is the variant the URL routed to, see routerContext.setRouteProduct
  const { productId: updatedValue } = useAliasProduct();
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
      <ToolbarGroup>
        <ToolbarItem variant={ToolbarItemVariant.label}>
          {t('curiosity-toolbar.label', { context: ['groupVariant'] })}{' '}
        </ToolbarItem>
        <ToolbarItem>
          <Select
            isInline={isInline}
            aria-label={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'groupVariant'] })}
            onSelect={onSelect}
            options={updatedOptions}
            selectedOptions={updatedValue}
            placeholder={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'groupVariant'] })}
            alignment={{ position }}
            maxHeight={310}
            data-test="toolbarFieldGroupVariant"
          />
        </ToolbarItem>
      </ToolbarGroup>
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
