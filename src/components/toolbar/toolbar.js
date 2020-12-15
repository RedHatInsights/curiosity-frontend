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
import { Select } from '../form/select';
import { connect, reduxTypes, store } from '../../redux';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { toolbarHelpers } from './toolbarHelpers';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Application filter toolbar.
 *
 * @augments React.Component
 * @fires onClear
 * @fires onClearFilter
 * @fires onCategorySelect
 * @fires onSelect
 */
class Toolbar extends React.Component {
  /**
   * Clear all filters' state.
   *
   * @event onClear
   */
  onClear = () => {
    const { hardFilterReset } = this.props;
    const dispatchActions = [
      { type: reduxTypes.toolbar.SET_ACTIVE_FILTERS, data: { activeFilters: new Set() } },
      {
        type: reduxTypes.query.SET_QUERY_CLEAR,
        data: {
          clearFilters: {
            [RHSM_API_QUERY_TYPES.SLA]: null,
            [RHSM_API_QUERY_TYPES.USAGE]: null
          }
        }
      }
    ];

    if (hardFilterReset) {
      dispatchActions.push({ type: reduxTypes.toolbar.SET_FILTER_TYPE, data: { currentFilter: null } });
    }

    this.setDispatch(dispatchActions, true);
  };

  /**
   * Clear individual filter state.
   *
   * @event onClearFilter
   * @param {string} categoryTitle
   */
  onClearFilter = categoryTitle => {
    const { activeFilters, currentFilter, hardFilterReset } = this.props;

    const categoryOptions = toolbarHelpers.getOptions();
    const { value: categoryValue } = categoryOptions.options.find(({ title }) => title === categoryTitle) || {};

    if (!categoryValue) {
      return;
    }

    const updatedActiveFilters = new Set(activeFilters);
    updatedActiveFilters.delete(categoryValue);

    const dispatchActions = [
      { type: reduxTypes.toolbar.SET_ACTIVE_FILTERS, data: { activeFilters: updatedActiveFilters } },
      {
        type: reduxTypes.query.SET_QUERY_CLEAR,
        data: {
          clearFilters: {
            [categoryValue]: null
          }
        }
      }
    ];

    if (hardFilterReset) {
      const updatedCurrentFilter = (updatedActiveFilters.size > 0 && currentFilter) || null;
      dispatchActions.push({ type: reduxTypes.toolbar.SET_FILTER_TYPE, data: { currentFilter: updatedCurrentFilter } });
    }

    this.setDispatch(dispatchActions, true);
  };

  /**
   * Set Category selection.
   *
   * @event onCategorySelect
   * @param {object} event
   */
  onCategorySelect = event => {
    const { value } = event;
    this.setDispatch({ type: reduxTypes.toolbar.SET_FILTER_TYPE, data: { currentFilter: value } });
  };

  /**
   * Set select filter selection for dispatch.
   *
   * @param {object} params
   * @param {object} params.event
   * @param {string} params.field
   */
  onSelect = ({ event, field }) => {
    const { activeFilters } = this.props;
    const { value } = event;
    const updatedActiveFilters = new Set(activeFilters).add(field);

    this.setDispatch(
      [
        {
          type: reduxTypes.toolbar.SET_ACTIVE_FILTERS,
          data: { activeFilters: updatedActiveFilters }
        },
        {
          type: reduxTypes.query.SET_QUERY_RHSM_TYPES[field],
          data: { [field]: value }
        }
      ],
      true
    );
  };

  /**
   * Dispatch a Redux store type.
   *
   * @param {Array|object} actions
   * @param {boolean} resetPage
   */
  setDispatch(actions, resetPage = false) {
    const { viewId } = this.props;
    const updatedActions = ((Array.isArray(actions) && actions) || [actions]).map(({ type, data }) => ({
      type,
      viewId,
      ...data
    }));

    if (resetPage) {
      updatedActions.push({
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST
      });
    }

    store.dispatch(updatedActions);
  }

  /**
   * Available, and selected select filter options.
   *
   * @param {string} field
   * @returns {{optionsSelected: Array, options: Array }}
   */
  setSelectFilter(field) {
    const { query } = this.props;
    const options = toolbarHelpers.getOptions(field);
    const currentFilter = this.getCurrentFilter();
    let filter;

    if (field) {
      filter = typeof query?.[field] === 'string' && options.options.find(({ value }) => value === query?.[field]);
    } else {
      filter = options.options.find(({ value }) => value === currentFilter);
    }

    const optionsSelected = (filter?.title && [filter.title]) || (options?.selected && [options.selected]) || [];

    return { options, optionsSelected };
  }

  /**
   * Return the currentFilter, fallback to selected
   *
   * @returns {string|undefined}
   */
  getCurrentFilter() {
    const { currentFilter, filterOptions } = this.props;

    return (
      currentFilter ||
      filterOptions.find(({ selected }) => selected === true)?.id ||
      (filterOptions.length === 1 && filterOptions[0]?.id)
    );
  }

  /**
   * A select filter node.
   *
   * @param {object} params
   * @param {string} params.id
   * @returns {object}
   */
  renderSelectFilter({ id: field }) {
    const { t } = this.props;
    const { options, optionsSelected } = this.setSelectFilter(field);
    const currentFilter = this.getCurrentFilter();

    return (
      <ToolbarFilter
        key={field}
        chips={optionsSelected}
        deleteChip={this.onClearFilter}
        categoryName={t('curiosity-toolbar.category', { context: field })}
        showToolbarItem={currentFilter === field}
      >
        <Select
          aria-label={t('curiosity-toolbar.category', { context: field })}
          onSelect={event => this.onSelect({ event, field })}
          selectedOptions={optionsSelected}
          placeholder={t('curiosity-toolbar.placeholder', { context: field })}
          options={options.options}
        />
      </ToolbarFilter>
    );
  }

  /**
   * Render a filter toolbar.
   *
   * @returns {Node}
   */
  render() {
    const { filterOptions, isDisabled, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const { options: categoryOptions, optionsSelected: categoryOptionsSelected } = this.setSelectFilter();

    return (
      <PfToolbar
        id="curiosity-toolbar"
        className="curiosity-toolbar pf-m-toggle-group-container ins-c-primary-toolbar"
        collapseListedFiltersBreakpoint="sm"
        clearAllFilters={this.onClear}
      >
        <ToolbarContent>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="md">
            <ToolbarGroup variant="filter-group">
              {filterOptions.length !== 1 && (
                <ToolbarItem>
                  <Select
                    aria-label={t('curiosity-toolbar.category')}
                    onSelect={this.onCategorySelect}
                    selectedOptions={categoryOptionsSelected}
                    placeholder={t('curiosity-toolbar.placeholder')}
                    options={categoryOptions.options}
                    toggleIcon={<FilterIcon />}
                  />
                </ToolbarItem>
              )}
              {filterOptions.map(({ id, selected }) => this.renderSelectFilter({ id, selected }))}
            </ToolbarGroup>
          </ToolbarToggleGroup>
        </ToolbarContent>
      </PfToolbar>
    );
  }
}

/**
 * Prop types
 *
 * @type {{viewId: string, t: Function, activeFilters: Set, hardFilterReset: boolean, query: object,
 *     currentFilter: string, isDisabled: boolean, Array}}
 */
Toolbar.propTypes = {
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.SLA]: PropTypes.string,
    [RHSM_API_QUERY_TYPES.USAGE]: PropTypes.string
  }),
  activeFilters: PropTypes.instanceOf(Set),
  currentFilter: PropTypes.oneOf([RHSM_API_QUERY_TYPES.SLA, RHSM_API_QUERY_TYPES.USAGE]),
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      filterType: PropTypes.oneOf(['select']),
      id: PropTypes.oneOf([RHSM_API_QUERY_TYPES.SLA, RHSM_API_QUERY_TYPES.USAGE]),
      selected: PropTypes.bool
    })
  ),
  hardFilterReset: PropTypes.bool,
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, activeFilters: Set, hardFilterReset: boolean, query: object,
 *     currentFilter: string, isDisabled: boolean, filterOptions: Array}}
 */
Toolbar.defaultProps = {
  query: {},
  activeFilters: new Set(),
  currentFilter: null,
  filterOptions: [
    {
      id: RHSM_API_QUERY_TYPES.SLA,
      filterType: 'select'
    },
    {
      id: RHSM_API_QUERY_TYPES.USAGE,
      filterType: 'select',
      selected: true
    }
  ],
  hardFilterReset: false,
  isDisabled: helpers.UI_DISABLED_TOOLBAR,
  t: translate,
  viewId: 'toolbar'
};

/**
 * Apply state to props.
 *
 * @param {object} state
 * @param {object} state.toolbar
 * @param {object} props
 * @param {string} props.viewId
 * @returns {object}
 */
const mapStateToProps = ({ toolbar }, { viewId }) => ({ ...toolbar.filters?.[viewId] });

const ConnectedToolbar = connect(mapStateToProps)(Toolbar);

export { ConnectedToolbar as default, ConnectedToolbar, Toolbar };
