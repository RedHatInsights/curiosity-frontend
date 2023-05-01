import React from 'react';
import PropTypes from 'prop-types';
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
 * Generate select field options from config
 *
 * @param {object} options
 * @param {Function} options.useRouteDetail
 * @returns {Function}
 */
const useToolbarFieldOptions = ({ useRouteDetail: useAliasRouteDetail = routerContext.useRouteDetail } = {}) => {
  const { availableVariants, firstMatch } = useAliasRouteDetail();
  const options = [];

  availableVariants?.forEach(variant => {
    options.push({ title: variant, value: variant, selected: variant === firstMatch?.productId });
  });

  return options;
};

/**
 * On select update.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
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
        productGroup
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
 * @fires onSelect
 * @param {object} props
 * @param {boolean} props.isFilter
 * @param {boolean} props.isStandalone
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useProduct
 * @param {Function} props.useSelector
 * @param {Function} props.useToolbarFieldOptions
 * @returns {React.ReactNode}
 */
const ToolbarFieldGroupVariant = ({
  isFilter,
  isStandalone,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useProduct: useAliasProduct,
  useSelector: useAliasSelector,
  useToolbarFieldOptions: useAliasToolbarFieldOptions
}) => {
  const { productGroup } = useAliasProduct();
  const updatedValue = useAliasSelector(({ view }) => view?.product?.variant?.[productGroup], null);
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({
    ...option,
    selected: (updatedValue && option.value === updatedValue) || option?.selected
  }));

  if (options?.length <= 1) {
    return null;
  }

  const element = (
    <ToolbarContent>
      <ToolbarItem variant={ToolbarItemVariant.label}>
        {t('curiosity-toolbar.label', { context: ['groupVariant'] })}{' '}
      </ToolbarItem>
      <Select
        aria-label={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'groupVariant'] })}
        onSelect={onSelect}
        options={updatedOptions}
        selectedOptions={updatedValue}
        placeholder={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'groupVariant'] })}
        position={position}
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

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, useProduct: Function, t: Function, useSelector: Function, isFilter: boolean,
 *     isStandalone: boolean, position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldGroupVariant.propTypes = {
  isFilter: PropTypes.bool,
  isStandalone: PropTypes.bool,
  position: PropTypes.string,
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useProduct: PropTypes.func,
  useSelector: PropTypes.func,
  useToolbarFieldOptions: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, useProduct: Function, t: translate, useSelector: Function, isFilter: boolean,
 *     isStandalone: boolean, position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldGroupVariant.defaultProps = {
  isFilter: false,
  isStandalone: false,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useProduct,
  useSelector: storeHooks.reactRedux.useSelector,
  useToolbarFieldOptions
};

export { ToolbarFieldGroupVariant as default, ToolbarFieldGroupVariant, useOnSelect, useToolbarFieldOptions };
