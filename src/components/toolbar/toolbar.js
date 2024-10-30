import React from 'react';
import {
  Toolbar as PfToolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { useProductToolbarQuery, useProduct } from '../productView/productViewContext';
import { useToolbarFieldClear, useToolbarFieldClearAll, useToolbarFields } from './toolbarContext';
import { ToolbarFilter } from './toolbarFilter';
import { ToolbarFieldGroupVariant } from './toolbarFieldGroupVariant';
import { ToolbarFieldSelectCategory, useSelectCategoryOptions } from './toolbarFieldSelectCategory';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Primary view toolbar.
 *
 * @memberof Components
 * @module Toolbar
 * @property {module} ToolbarContext
 * @property {module} ToolbarFieldBillingProvider
 * @property {module} ToolbarFieldCategory
 * @property {module} ToolbarFieldDisplayName
 * @property {module} ToolbarFieldGranularity
 * @property {module} ToolbarFieldRangedMonthly
 * @property {module} ToolbarFieldSelectCategory
 * @property {module} ToolbarFieldSla
 * @property {module} ToolbarFieldUsage
 * @property {module} ToolbarFieldVariant
 */

/**
 * Application filter toolbar.
 *
 * @param {object} props
 * @param {boolean} [props.hardFilterReset=false] On clearing all fields allow the category to reset as well.
 * @param {boolean} [props.isDisabled=helpers.UI_DISABLED_TOOLBAR]
 * @param {boolean} [props.isGroupVariantDisabled=helpers.UI_DISABLED_TOOLBAR_GROUP_VARIANT]
 * @param {translate} [props.t=translate]
 * @param {useProduct} [props.useProduct=useProduct]
 * @param {useProductToolbarQuery} [props.useProductToolbarQuery=useProductToolbarQuery]
 * @param {useSelectCategoryOptions} [props.useSelectCategoryOptions=useSelectCategoryOptions]
 * @param {useToolbarFieldClear} [props.useToolbarFieldClear=useToolbarFieldClear]
 * @param {useToolbarFieldClearAll} [props.useToolbarFieldClearAll=useToolbarFieldClearAll]
 * @param {useToolbarFields} [props.useToolbarFields=useToolbarFields]
 * @fires onClearFilter
 * @fires onClearAll
 * @returns {JSX.Element}
 */
const Toolbar = ({
  hardFilterReset = false,
  isDisabled = helpers.UI_DISABLED_TOOLBAR,
  isGroupVariantDisabled = helpers.UI_DISABLED_TOOLBAR_GROUP_VARIANT,
  t = translate,
  useProduct: useAliasProduct = useProduct,
  useProductToolbarQuery: useAliasProductToolbarQuery = useProductToolbarQuery,
  useSelectCategoryOptions: useAliasSelectCategoryOptions = useSelectCategoryOptions,
  useToolbarFieldClear: useAliasToolbarFieldClear = useToolbarFieldClear,
  useToolbarFieldClearAll: useAliasToolbarFieldClearAll = useToolbarFieldClearAll,
  useToolbarFields: useAliasToolbarFields = useToolbarFields
}) => {
  const { productGroup } = useAliasProduct();
  const toolbarFieldQueries = useAliasProductToolbarQuery();
  const { currentCategory, options } = useAliasSelectCategoryOptions();
  const clearField = useAliasToolbarFieldClear();
  const clearAllFields = useAliasToolbarFieldClearAll();
  const { itemFields, secondaryFields } = useAliasToolbarFields();

  if (isDisabled || (isGroupVariantDisabled && !options?.length && !secondaryFields?.length)) {
    return null;
  }

  if (!isGroupVariantDisabled && !options?.length && !secondaryFields?.length) {
    return <ToolbarFieldGroupVariant isStandalone />;
  }

  /**
   * Clear a specific value
   *
   * @event onClearFilter
   * @param {object} params
   * @param {*} params.value
   * @returns {void}
   */
  const onClearFilter = ({ value }) => clearField(value);

  /**
   * Clear all active filters.
   *
   * @event onClearAll
   * @returns {void}
   */
  const onClearAll = () => clearAllFields(hardFilterReset);

  /**
   * Set selected options for chip display.
   *
   * @param {object} params
   * @param {*} params.value
   * @returns {Array}
   */
  const setSelectedOptions = ({ value: filterName } = {}) => {
    const filterValue = toolbarFieldQueries?.[filterName];
    return (
      (typeof filterValue === 'string' && [
        t('curiosity-toolbar.label', { context: [filterName, (filterValue === '' && 'none') || filterValue] })
      ]) ||
      []
    );
  };

  return (
    <PfToolbar
      id="curiosity-toolbar"
      key={productGroup}
      className="curiosity-toolbar pf-m-toggle-group-container ins-c-primary-toolbar"
      collapseListedFiltersBreakpoint="sm"
      clearAllFilters={onClearAll}
      clearFiltersButtonText={t('curiosity-toolbar.clearFilters')}
    >
      {!isGroupVariantDisabled && <ToolbarFieldGroupVariant />}
      <ToolbarContent className="curiosity-toolbar__content">
        {options.length > 0 && (
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="md">
            <ToolbarGroup variant="filter-group">
              {options.length > 1 && (
                <ToolbarItem>
                  <ToolbarFieldSelectCategory />
                </ToolbarItem>
              )}
              {options.map(({ title, value: filterName, component: OptionComponent, isClearable }) => {
                const chipProps = { categoryName: title };

                if (isClearable !== false) {
                  chipProps.chips = setSelectedOptions({ value: filterName });
                  chipProps.deleteChip = () => onClearFilter({ value: filterName });
                }

                return (
                  <ToolbarFilter
                    key={filterName}
                    showToolbarItem={currentCategory === filterName || options.length === 1}
                    {...chipProps}
                  >
                    <OptionComponent isFilter />
                  </ToolbarFilter>
                );
              })}
            </ToolbarGroup>
          </ToolbarToggleGroup>
        )}
        <ToolbarGroup key="itemFields">{itemFields}</ToolbarGroup>
        <ToolbarGroup key="secondaryFields" align={{ default: 'alignRight' }}>
          {secondaryFields}
        </ToolbarGroup>
      </ToolbarContent>
    </PfToolbar>
  );
};

export { Toolbar as default, Toolbar };
