import React from 'react';
import {
  Button,
  Toolbar as PfToolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarItemVariant,
  ToolbarFilter,
  ToolbarToggleGroup
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { useProductToolbarQuery, useProduct } from '../productView/productViewContext';
import {
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFields,
  useSeparateSlaTypeUsageFiltersEnabled
} from './toolbarContext';
import { ToolbarFieldGroupVariant } from './toolbarFieldGroupVariant';
import { ToolbarFieldSelectCategory, useSelectCategoryOptions } from './toolbarFieldSelectCategory';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
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

const separateFilterTypes = [
  RHSM_API_QUERY_SET_TYPES.SLA,
  RHSM_API_QUERY_SET_TYPES.USAGE,
  RHSM_API_QUERY_SET_TYPES.CATEGORY
];

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
 * @param {Function} [props.useSeparateSlaTypeUsageFiltersEnabled=useSeparateSlaTypeUsageFiltersEnabled]
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
  useSeparateSlaTypeUsageFiltersEnabled:
    useAliasSeparateSlaTypeUsageFiltersEnabled = useSeparateSlaTypeUsageFiltersEnabled,
  useToolbarFieldClear: useAliasToolbarFieldClear = useToolbarFieldClear,
  useToolbarFieldClearAll: useAliasToolbarFieldClearAll = useToolbarFieldClearAll,
  useToolbarFields: useAliasToolbarFields = useToolbarFields
}) => {
  const { productId } = useAliasProduct();
  const toolbarFieldQueries = useAliasProductToolbarQuery();
  const { currentCategory, initialCategory, options } = useAliasSelectCategoryOptions();
  const separateFiltersEnabled = useAliasSeparateSlaTypeUsageFiltersEnabled();
  const clearField = useAliasToolbarFieldClear();
  const clearAllFields = useAliasToolbarFieldClearAll();
  const { itemFields, secondaryFields } = useAliasToolbarFields();
  const separateOptions = separateFiltersEnabled
    ? separateFilterTypes.map(filter => options.find(({ value }) => value === filter)).filter(Boolean)
    : [];
  const combinedOptions = options.filter(option => !separateOptions.includes(option));
  const combinedCategory =
    separateOptions.length > 0 && !combinedOptions.some(({ value }) => value === currentCategory)
      ? combinedOptions[0]?.value
      : currentCategory;

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
  const onClearFilter = ({ value }) => {
    const updatedValue = [];

    if (typeof value === 'string') {
      updatedValue.push(value);
    }

    if (Array.isArray(value)) {
      updatedValue.push(
        ...value.map(obj => {
          if (typeof obj === 'string') {
            return obj;
          }
          return obj.name;
        })
      );
    }

    updatedValue.forEach(val => clearField(val));
  };

  /**
   * Clear all active filters.
   *
   * @event onClearAll
   * @returns {void}
   */
  const onClearAll = () => clearAllFields(hardFilterReset);

  /**
   * Set selected options for chip/label display.
   *
   * @param {object} params
   * @param {string|Array<string|{name:string, isDisplayValueOnly:boolean}>} params.value
   * @returns {Array<string>}
   */
  const setSelectedOptions = ({ value: filterName } = {}) => {
    const filterValues = [];

    if (typeof toolbarFieldQueries[filterName] === 'string') {
      filterValues.push({ name: filterName, value: toolbarFieldQueries[filterName] });
    }

    if (Array.isArray(filterName)) {
      filterValues.push(
        ...filterName.map(filter => {
          if (typeof filter === 'string') {
            return { name: filter, value: toolbarFieldQueries[filter] };
          }

          const { isDisplayValueOnly, name } = filter;
          return {
            isDisplayValueOnly,
            name,
            value: toolbarFieldQueries[name]
          };
        })
      );
    }

    return filterValues
      .filter(({ value }) => typeof value === 'string')
      .map(({ isDisplayValueOnly, name, value }) =>
        t(`curiosity-toolbar.label`, {
          context: [name, (value === '' && 'none') || (!isDisplayValueOnly && value)],
          value
        })
      );
  };

  const clearFiltersButtonText = t('curiosity-toolbar.clearFilters');

  return (
    <PfToolbar
      id="curiosity-toolbar"
      key={productId}
      className="curiosity-toolbar"
      collapseListedFiltersBreakpoint="md"
      clearAllFilters={onClearAll}
      clearFiltersButtonText={clearFiltersButtonText}
    >
      {!isGroupVariantDisabled && <ToolbarFieldGroupVariant />}
      <ToolbarContent className="curiosity-toolbar__content">
        {options.length > 0 && (
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="md">
            {separateOptions.length > 0 && (
              <ToolbarGroup className="curiosity-toolbar__separate-filters" rowWrap={{ default: 'nowrap' }}>
                {separateOptions.map(({ title, value, component: OptionComponent }) => (
                  <ToolbarGroup key={value} rowWrap={{ default: 'nowrap' }}>
                    <ToolbarItem variant={ToolbarItemVariant.label}>{title}:</ToolbarItem>
                    <ToolbarItem className="curiosity-toolbar__filter-select">
                      <OptionComponent isFilter isInline={false} />
                    </ToolbarItem>
                    <ToolbarItem variant={ToolbarItemVariant.separator} />
                  </ToolbarGroup>
                ))}
              </ToolbarGroup>
            )}
            {combinedOptions.length > 0 && (
              <ToolbarGroup variant="filter-group">
                {combinedOptions.length > 1 && (
                  <ToolbarItem>
                    <ToolbarFieldSelectCategory
                      {...(separateOptions.length > 0 && {
                        useSelectCategoryOptions: () => ({
                          currentCategory: combinedCategory,
                          initialCategory: combinedCategory !== currentCategory ? combinedCategory : initialCategory,
                          options: combinedOptions
                        })
                      })}
                    />
                  </ToolbarItem>
                )}
                {combinedOptions.map(
                  ({ title, dynamicValue, value: filterName, component: OptionComponent, isClearable }) => {
                    const labelProps = {
                      categoryName: title
                    };

                    const updatedValue = dynamicValue || filterName;

                    if (isClearable !== false) {
                      labelProps.labels = setSelectedOptions({ value: updatedValue });
                      labelProps.deleteLabel = () => onClearFilter({ value: updatedValue });
                    }

                    return (
                      <ToolbarFilter
                        key={helpers.generateHash(updatedValue)}
                        showToolbarItem={combinedCategory === updatedValue || combinedOptions.length === 1}
                        {...labelProps}
                      >
                        <OptionComponent isFilter />
                      </ToolbarFilter>
                    );
                  }
                )}
              </ToolbarGroup>
            )}
          </ToolbarToggleGroup>
        )}
        <ToolbarGroup key="itemFields">{itemFields}</ToolbarGroup>
        <ToolbarGroup key="secondaryFields" align={{ default: 'alignEnd' }}>
          {secondaryFields}
        </ToolbarGroup>
      </ToolbarContent>
      {separateOptions.length > 0 && (
        <ToolbarContent className="curiosity-toolbar__content curiosity-toolbar__reset-filters">
          <ToolbarItem>
            <Button variant="link" isInline onClick={onClearAll}>
              {clearFiltersButtonText}
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      )}
    </PfToolbar>
  );
};

export { Toolbar as default, Toolbar };
