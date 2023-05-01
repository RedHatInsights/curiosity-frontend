import React from 'react';
import PropTypes from 'prop-types';
import {
  Toolbar as PfToolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { useProductToolbarQuery } from '../productView/productViewContext';
import { useToolbarFieldClear, useToolbarFieldClearAll, useToolbarFields } from './toolbarContext';
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
 * @property {module} ToolbarFieldUom
 * @property {module} ToolbarFieldUsage
 * @property {module} ToolbarFieldVariant
 */

/**
 * Application filter toolbar.
 *
 * @fires onClearFilter
 * @fires onClearAll
 * @param {object} props
 * @param {boolean} props.hardFilterReset On clearing all fields allow the category to reset as well.
 * @param {boolean} props.isDisabled
 * @param {boolean} props.isGroupVariantDisabled
 * @param {Function} props.t
 * @param {Function} props.useProductToolbarQuery
 * @param {Function} props.useSelectCategoryOptions
 * @param {Function} props.useToolbarFieldClear
 * @param {Function} props.useToolbarFieldClearAll
 * @param {Function} props.useToolbarFields
 * @returns {React.ReactNode}
 */
const Toolbar = ({
  hardFilterReset,
  isDisabled,
  isGroupVariantDisabled,
  t,
  useProductToolbarQuery: useAliasProductToolbarQuery,
  useSelectCategoryOptions: useAliasSelectCategoryOptions,
  useToolbarFieldClear: useAliasToolbarFieldClear,
  useToolbarFieldClearAll: useAliasToolbarFieldClearAll,
  useToolbarFields: useAliasToolbarFields
}) => {
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
      className="curiosity-toolbar pf-m-toggle-group-container ins-c-primary-toolbar"
      collapseListedFiltersBreakpoint="sm"
      clearAllFilters={onClearAll}
      clearFiltersButtonText={t('curiosity-toolbar.clearFilters')}
    >
      {!isGroupVariantDisabled && <ToolbarFieldGroupVariant />}
      <ToolbarContent>
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
        <ToolbarGroup key="itemFields">{itemFields}</ToolbarGroup>
        <ToolbarGroup key="secondaryFields" alignment={{ default: 'alignRight' }}>
          {secondaryFields}
        </ToolbarGroup>
      </ToolbarContent>
    </PfToolbar>
  );
};

/**
 * Prop types
 *
 * @type {{useToolbarFieldClear: Function, t: Function, useSelectCategoryOptions: Function, hardFilterReset: boolean,
 *     useToolbarFields: Function, isGroupVariantDisabled: boolean, useProductToolbarQuery: Function, isDisabled: boolean,
 *     useToolbarFieldClearAll: Function}}
 */
Toolbar.propTypes = {
  hardFilterReset: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isGroupVariantDisabled: PropTypes.bool,
  t: PropTypes.func,
  useProductToolbarQuery: PropTypes.func,
  useSelectCategoryOptions: PropTypes.func,
  useToolbarFieldClear: PropTypes.func,
  useToolbarFieldClearAll: PropTypes.func,
  useToolbarFields: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useToolbarFieldClear: Function, t: translate, useSelectCategoryOptions: Function, hardFilterReset: boolean,
 *     useToolbarFields: Function, isGroupVariantDisabled: boolean, useProductToolbarQuery: Function, isDisabled: boolean,
 *     useToolbarFieldClearAll: Function}}
 */
Toolbar.defaultProps = {
  hardFilterReset: false,
  isDisabled: helpers.UI_DISABLED_TOOLBAR,
  isGroupVariantDisabled: helpers.UI_DISABLED_TOOLBAR_GROUP_VARIANT,
  t: translate,
  useProductToolbarQuery,
  useSelectCategoryOptions,
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFields
};

export { Toolbar as default, Toolbar };
