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
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { toolbarTypes } from './toolbarTypes';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Application filter toolbar.
 *
 * @augments React.Component
 * @fires onClear
 * @fires onClearFilter
 * @fires onCategorySelect
 * @fires onSlaSelect
 * @fires onUsageSelect
 */
class Toolbar extends React.Component {
  /**
   * Clear all filters' state.
   *
   * @event onClear
   */
  onClear = () => {
    this.setDispatch([
      { type: reduxTypes.toolbar.SET_FILTER_TYPE, data: { currentFilter: null } },
      { type: reduxTypes.toolbar.SET_ACTIVE_FILTERS, data: { activeFilters: new Set() } },
      {
        type: reduxTypes.query.SET_QUERY_CLEAR,
        data: {
          clearFilters: {
            [rhsmApiTypes.RHSM_API_QUERY_SLA]: null,
            [rhsmApiTypes.RHSM_API_QUERY_USAGE]: null
          }
        }
      }
    ]);
  };

  /**
   * Clear individual filter state.
   *
   * @event onClearFilter
   * @param {string} categoryTitle
   */
  onClearFilter = categoryTitle => {
    const { activeFilters, currentFilter } = this.props;

    const categoryOptions = toolbarTypes.getOptions();
    const { value: categoryValue } = categoryOptions.options.find(({ title }) => title === categoryTitle) || {};

    if (!categoryValue) {
      return;
    }

    const updatedActiveFilters = new Set(activeFilters);
    updatedActiveFilters.delete(categoryValue);

    const updatedCurrentFilter = (updatedActiveFilters.size > 0 && currentFilter) || null;

    this.setDispatch([
      { type: reduxTypes.toolbar.SET_FILTER_TYPE, data: { currentFilter: updatedCurrentFilter } },
      { type: reduxTypes.toolbar.SET_ACTIVE_FILTERS, data: { activeFilters: updatedActiveFilters } },
      {
        type: reduxTypes.query.SET_QUERY_CLEAR,
        data: {
          clearFilters: {
            [categoryValue]: null
          }
        }
      }
    ]);
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
   * Set SLA filter selection.
   *
   * @event onSlaSelect
   * @param {object} event
   */
  onSlaSelect = event => {
    const { activeFilters } = this.props;
    const { value } = event;
    const updatedActiveFilters = new Set(activeFilters).add(rhsmApiTypes.RHSM_API_QUERY_SLA);

    this.setDispatch([
      {
        type: reduxTypes.toolbar.SET_ACTIVE_FILTERS,
        data: { activeFilters: updatedActiveFilters }
      },
      {
        type: reduxTypes.query.SET_QUERY_SLA_RHSM,
        data: { [rhsmApiTypes.RHSM_API_QUERY_SLA]: value }
      }
    ]);
  };

  /**
   * Set Usage filter selection.
   *
   * @event onUsageSelect
   * @param {object} event
   */
  onUsageSelect = event => {
    const { activeFilters } = this.props;
    const { value } = event;
    const updatedActiveFilters = new Set(activeFilters).add(rhsmApiTypes.RHSM_API_QUERY_USAGE);

    this.setDispatch([
      {
        type: reduxTypes.toolbar.SET_ACTIVE_FILTERS,
        data: { activeFilters: updatedActiveFilters }
      },
      {
        type: reduxTypes.query.SET_QUERY_USAGE_RHSM,
        data: { [rhsmApiTypes.RHSM_API_QUERY_USAGE]: value }
      }
    ]);
  };

  /**
   * Dispatch a Redux store type.
   *
   * @param {Array|object} actions
   */
  setDispatch(actions) {
    const { viewId } = this.props;
    const updatedActions = ((Array.isArray(actions) && actions) || [actions]).map(({ type, data }) => ({
      type,
      viewId,
      ...data
    }));

    store.dispatch(updatedActions);
  }

  /**
   * Available, and selected filter options.
   *
   * @param {string} filterType
   * @returns {{optionsSelected: Array, options: Array }}
   */
  setFilter(filterType) {
    const { currentFilter, query } = this.props;
    const options = toolbarTypes.getOptions(filterType);
    let filter;

    if (filterType) {
      filter =
        typeof query?.[filterType] === 'string' && options.options.find(({ value }) => value === query?.[filterType]);
    } else {
      filter = options.options.find(({ value }) => value === currentFilter);
    }

    const optionsSelected = (filter?.title && [filter.title]) || (options?.selected && [options.selected]) || [];

    return { options, optionsSelected };
  }

  /**
   * Render a filter toolbar.
   *
   * @returns {Node}
   */
  render() {
    const { currentFilter, isDisabled, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const { options: categoryOptions, optionsSelected: categoryOptionsSelected } = this.setFilter();

    const { options: slaOptions, optionsSelected: slaOptionsSelected } = this.setFilter(
      rhsmApiTypes.RHSM_API_QUERY_SLA
    );
    const { options: usageOptions, optionsSelected: usageOptionsSelected } = this.setFilter(
      rhsmApiTypes.RHSM_API_QUERY_USAGE
    );

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
              <ToolbarItem>
                <Select
                  aria-label={t('curiosity-toolbar.category')}
                  onSelect={this.onCategorySelect}
                  selectedOptions={categoryOptionsSelected}
                  placeholder={t('curiosity-toolbar.categoryPlaceholder')}
                  options={categoryOptions.options}
                  toggleIcon={<FilterIcon />}
                />
              </ToolbarItem>
              <ToolbarFilter
                chips={slaOptionsSelected}
                deleteChip={this.onClearFilter}
                categoryName={t('curiosity-toolbar.slaCategory')}
                showToolbarItem={currentFilter === rhsmApiTypes.RHSM_API_QUERY_SLA}
              >
                <Select
                  aria-label={t('curiosity-toolbar.slaCategory')}
                  onSelect={this.onSlaSelect}
                  selectedOptions={slaOptionsSelected}
                  placeholder={t('curiosity-toolbar.slaPlaceholder')}
                  options={slaOptions.options}
                />
              </ToolbarFilter>
              <ToolbarFilter
                chips={usageOptionsSelected}
                deleteChip={this.onClearFilter}
                categoryName={t('curiosity-toolbar.usageCategory')}
                showToolbarItem={currentFilter === rhsmApiTypes.RHSM_API_QUERY_USAGE}
              >
                <Select
                  aria-label={t('curiosity-toolbar.usageCategory')}
                  onSelect={this.onUsageSelect}
                  selectedOptions={usageOptionsSelected}
                  placeholder={t('curiosity-toolbar.usagePlaceholder')}
                  options={usageOptions.options}
                />
              </ToolbarFilter>
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
 * @type {{viewId: string, t: Function, activeFilters, query, currentFilter: string, isDisabled: boolean}}
 */
Toolbar.propTypes = {
  query: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_SLA]: PropTypes.string,
    [rhsmApiTypes.RHSM_API_QUERY_USAGE]: PropTypes.string
  }),
  activeFilters: PropTypes.instanceOf(Set),
  currentFilter: PropTypes.oneOf([rhsmApiTypes.RHSM_API_QUERY_SLA, rhsmApiTypes.RHSM_API_QUERY_USAGE]),
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, activeFilters: Set, query: {}, currentFilter: null, isDisabled: boolean}}
 */
Toolbar.defaultProps = {
  query: {},
  activeFilters: new Set(),
  currentFilter: null,
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
