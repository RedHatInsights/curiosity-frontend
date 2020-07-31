import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar as PfToolbar, ToolbarContent, ToolbarFilter, ToolbarGroup } from '@patternfly/react-core';
import { Select } from '../form/select';
import { reduxTypes, store } from '../../redux';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { toolbarTypes } from './toolbarTypes';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Application filter toolbar.
 *
 * @augments React.Component
 * @fires onClear
 * @fires onSlaSelect
 */
class Toolbar extends React.Component {
  /**
   * Clear filters' state.
   *
   * @event onClear
   */
  onClear = () => {
    this.dispatchFilter(reduxTypes.rhsm.SET_FILTER_SLA_RHSM, { [rhsmApiTypes.RHSM_API_QUERY_SLA]: null });
  };

  /**
   * Set SLA filter selection.
   *
   * @event onSlaSelect
   * @param {object} event
   */
  onSlaSelect = event => {
    const { value } = event;

    this.dispatchFilter(reduxTypes.rhsm.SET_FILTER_SLA_RHSM, { [rhsmApiTypes.RHSM_API_QUERY_SLA]: value });
  };

  /**
   * Dispatch a Redux store type.
   *
   * @param {string} type
   * @param {object} data
   */
  dispatchFilter(type, data = {}) {
    const { viewId } = this.props;

    if (type) {
      store.dispatch({
        type,
        viewId,
        ...data
      });
    }
  }

  // ToDo: API to provide SLA options from endpoint.
  /**
   * Available and selected SLA options.
   *
   * @returns {{slaOptionsSelected: Array, slaOptions: object}}
   */
  filterSla() {
    const { query } = this.props;

    const slaOptions = toolbarTypes.getOptions();
    const filterSla =
      typeof query[rhsmApiTypes.RHSM_API_QUERY_SLA] === 'string' &&
      slaOptions.options.find(val => val.value === query[rhsmApiTypes.RHSM_API_QUERY_SLA]);

    const slaOptionsSelected =
      (filterSla && filterSla.title && [filterSla.title]) || (slaOptions.selected && [slaOptions.selected]) || [];

    return { slaOptions, slaOptionsSelected };
  }

  /**
   * Render a filter toolbar.
   *
   * @returns {Node}
   */
  render() {
    const { isDisabled, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const { slaOptions, slaOptionsSelected } = this.filterSla();

    return (
      <PfToolbar
        id="curiosity-toolbar"
        className="pf-m-toggle-group-container ins-c-primary-toolbar"
        collapseListedFiltersBreakpoint="xl"
        clearAllFilters={this.onClear}
      >
        <ToolbarContent>
          <ToolbarGroup variant="filter-group">
            <ToolbarFilter
              chips={slaOptionsSelected}
              deleteChip={this.onClear}
              categoryName={t('curiosity-toolbar.slaCategory')}
            >
              <Select
                aria-label={t('curiosity-toolbar.slaCategory')}
                onSelect={this.onSlaSelect}
                selectedOptions={slaOptionsSelected}
                placeholder={t('curiosity-toolbar.slaPlaceholder')}
                options={slaOptions.options}
              />
            </ToolbarFilter>
          </ToolbarGroup>
        </ToolbarContent>
      </PfToolbar>
    );
  }
}

/**
 * Prop types
 *
 * @type {{viewId: string, t: Function, query: object, isDisabled: boolean }}
 */
Toolbar.propTypes = {
  query: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_SLA]: PropTypes.string
  }),
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, query: {}, isDisabled: boolean}}
 */
Toolbar.defaultProps = {
  query: {},
  isDisabled: helpers.UI_DISABLED_TOOLBAR,
  t: translate,
  viewId: 'toolbar'
};

export { Toolbar as default, Toolbar };
