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
import { useToolbarFieldClear, useToolbarFieldClearAll, useToolbarFieldQueries } from './toolbarContext';
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
 * @param {Function} props.useSelectCategoryOptions
 * @param {Function} props.useToolbarFieldClear
 * @param {Function} props.useToolbarFieldClearAll
 * @param {Function} props.useToolbarFieldQueries
 * @returns {Node}
 */
const Toolbar = ({
  hardFilterReset,
  isDisabled,
  t,
  useSelectCategoryOptions: useAliasSelectCategoryOptions,
  useToolbarFieldClear: useAliasToolbarFieldClear,
  useToolbarFieldClearAll: useAliasToolbarFieldClearAll,
  useToolbarFieldQueries: useAliasToolbarFieldQueries
}) => {
  const { currentCategory, options } = useAliasSelectCategoryOptions();
  const toolbarFieldQueries = useAliasToolbarFieldQueries();
  const clearField = useAliasToolbarFieldClear();
  const clearAllFields = useAliasToolbarFieldClearAll();

  if (isDisabled || !options?.length) {
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
   * @param {Array} params.options
   * @param {*} params.value
   * @returns {Array}
   */
  const setSelectedOptions = ({ options: filterOptions, value }) => {
    const query = filterOptions.find(({ value: optionValue }) => optionValue === toolbarFieldQueries?.[value]);
    return (query?.title && [query?.title]) || [];
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
            {options.map(({ title, value, component, isClearable, options: filterOptions }) => {
              const chipProps = { categoryName: title };

              if (isClearable !== false) {
                chipProps.chips = setSelectedOptions({ options: filterOptions, value });
                chipProps.deleteChip = () => onClearFilter({ options: filterOptions, value });
              }

              return (
                <ToolbarFilter
                  key={value}
                  showToolbarItem={currentCategory === value || options.length === 1}
                  {...chipProps}
                >
                  {component}
                </ToolbarFilter>
              );
            })}
          </ToolbarGroup>
        </ToolbarToggleGroup>
      </ToolbarContent>
    </PfToolbar>
  );
};

/**
 * Prop types
 *
 * @type {{useToolbarFieldClear: Function, t: Function, useSelectCategoryOptions: Function, hardFilterReset: boolean,
 *     isDisabled: boolean, useToolbarFieldClearAll: Function, useToolbarFieldQueries: Function}}
 */
Toolbar.propTypes = {
  hardFilterReset: PropTypes.bool,
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useSelectCategoryOptions: PropTypes.func,
  useToolbarFieldClear: PropTypes.func,
  useToolbarFieldClearAll: PropTypes.func,
  useToolbarFieldQueries: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useToolbarFieldClear: Function, t: Function, useSelectCategoryOptions: Function, hardFilterReset: boolean,
 *     isDisabled: boolean, useToolbarFieldClearAll: Function, useToolbarFieldQueries: Function}}
 */
Toolbar.defaultProps = {
  hardFilterReset: false,
  isDisabled: helpers.UI_DISABLED_TOOLBAR,
  t: translate,
  useSelectCategoryOptions,
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFieldQueries
};

export { Toolbar as default, Toolbar };
