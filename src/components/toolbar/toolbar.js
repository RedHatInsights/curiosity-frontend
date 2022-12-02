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
import { useToolbarFieldClear, useToolbarFieldClearAll, useToolbarSecondaryFields } from './toolbarContext';
import { ToolbarFieldSelectCategory, useSelectCategoryOptions } from './toolbarFieldSelectCategory';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Application filter toolbar.
 *
 * @fires onClearFilter
 * @fires onClearAll
 * @param {object} props
 * @param {boolean} props.hardFilterReset On clearing all fields allow the category to reset as well.
 * @param {boolean} props.isDisabled
 * @param {Function} props.t
 * @param {Function} props.useProductToolbarQuery
 * @param {Function} props.useSelectCategoryOptions
 * @param {Function} props.useToolbarFieldClear
 * @param {Function} props.useToolbarFieldClearAll
 * @param {Function} props.useToolbarSecondaryFields
 * @returns {Node}
 */
const Toolbar = ({
  hardFilterReset,
  isDisabled,
  t,
  useProductToolbarQuery: useAliasProductToolbarQuery,
  useSelectCategoryOptions: useAliasSelectCategoryOptions,
  useToolbarFieldClear: useAliasToolbarFieldClear,
  useToolbarFieldClearAll: useAliasToolbarFieldClearAll,
  useToolbarSecondaryFields: useAliasToolbarSecondaryFields
}) => {
  const toolbarFieldQueries = useAliasProductToolbarQuery();
  const { currentCategory, options } = useAliasSelectCategoryOptions();
  const clearField = useAliasToolbarFieldClear();
  const clearAllFields = useAliasToolbarFieldClearAll();
  const secondaryFields = useAliasToolbarSecondaryFields();

  if (isDisabled || (!options?.length && !secondaryFields?.length)) {
    return null;
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
  const setSelectedOptions = ({ value } = {}) => {
    const categoryValue = toolbarFieldQueries?.[value];
    return (categoryValue && [t('curiosity-toolbar.label', { context: [value, categoryValue] })]) || [];
  };

  return (
    <PfToolbar
      id="curiosity-toolbar"
      className="curiosity-toolbar pf-m-toggle-group-container ins-c-primary-toolbar"
      collapseListedFiltersBreakpoint="sm"
      clearAllFilters={onClearAll}
      clearFiltersButtonText={t('curiosity-toolbar.clearFilters')}
    >
      <ToolbarContent>
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="md">
          <ToolbarGroup variant="filter-group">
            {options.length > 1 && (
              <ToolbarItem>
                <ToolbarFieldSelectCategory />
              </ToolbarItem>
            )}
            {options.map(({ title, value, component: OptionComponent, isClearable }) => {
              const chipProps = { categoryName: title };

              if (isClearable !== false) {
                chipProps.chips = setSelectedOptions({ value });
                chipProps.deleteChip = () => onClearFilter({ value });
              }

              return (
                <ToolbarFilter
                  key={value}
                  showToolbarItem={currentCategory === value || options.length === 1}
                  {...chipProps}
                >
                  <OptionComponent isFilter />
                </ToolbarFilter>
              );
            })}
          </ToolbarGroup>
        </ToolbarToggleGroup>
        <ToolbarGroup alignment={{ default: 'alignRight' }}>{secondaryFields}</ToolbarGroup>
      </ToolbarContent>
    </PfToolbar>
  );
};

/**
 * Prop types
 *
 * @type {{useToolbarFieldClear: Function, t: Function, useSelectCategoryOptions: Function, hardFilterReset: boolean,
 *     useToolbarSecondaryFields: Function, useProductToolbarQuery: Function, isDisabled: boolean,
 *     useToolbarFieldClearAll: Function}}
 */
Toolbar.propTypes = {
  hardFilterReset: PropTypes.bool,
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useProductToolbarQuery: PropTypes.func,
  useSelectCategoryOptions: PropTypes.func,
  useToolbarFieldClear: PropTypes.func,
  useToolbarFieldClearAll: PropTypes.func,
  useToolbarSecondaryFields: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useToolbarFieldClear: Function, t: Function, useSelectCategoryOptions: Function, hardFilterReset: boolean,
 *     useToolbarSecondaryFields: Function, useProductToolbarQuery: Function, isDisabled: boolean,
 *     useToolbarFieldClearAll: Function}}
 */
Toolbar.defaultProps = {
  hardFilterReset: false,
  isDisabled: helpers.UI_DISABLED_TOOLBAR,
  t: translate,
  useProductToolbarQuery,
  useSelectCategoryOptions,
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarSecondaryFields
};

export { Toolbar as default, Toolbar };
