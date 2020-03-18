import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { DataToolbar, DataToolbarContent, DataToolbarFilter, DataToolbarGroup } from '@patternfly/react-core';
import { Select } from '../select/select';
import { reduxTypes, store } from '../../redux';
import { toolbarTypes } from './toolbarTypes';
import { helpers } from '../../common';

/**
 * Application filter toolbar.
 *
 * @augments React.Component
 * @fires onClear
 * @fires onSlaSelect
 */
class Toolbar extends React.Component {
  state = { filterSla: toolbarTypes.getOptions().selected };

  /**
   * Clear filters' state.
   *
   * @event onClear
   */
  onClear = () => {
    this.setState(
      {
        filterSla: null
      },
      () => {
        this.dispatchFilter(reduxTypes.rhsm.SET_GRAPH_SLA_RHSM, { sla: null });
      }
    );
  };

  /**
   * Set SLA filter selection.
   *
   * @event onSlaSelect
   * @param {object} event
   */
  onSlaSelect = event => {
    const { selected, value } = event;

    this.setState(
      {
        filterSla: { ...selected }
      },
      () => {
        this.dispatchFilter(reduxTypes.rhsm.SET_GRAPH_SLA_RHSM, { sla: value });
      }
    );
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

  /**
   * Render a filter toolbar.
   *
   * @returns {Node}
   */
  render() {
    const { filterSla } = this.state;
    const { isDisabled, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const slaOptions = toolbarTypes.getOptions();
    const slaOptionsSelected =
      (filterSla && filterSla.title && [filterSla.title]) || (slaOptions.selected && [slaOptions.selected]) || [];

    return (
      <DataToolbar
        id="curiosity-toolbar"
        className="pf-m-toggle-group-container ins-c-primary-toolbar"
        collapseListedFiltersBreakpoint="xl"
        clearAllFilters={this.onClear}
      >
        <DataToolbarContent>
          <DataToolbarGroup variant="filter-group">
            <DataToolbarFilter
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
            </DataToolbarFilter>
          </DataToolbarGroup>
        </DataToolbarContent>
      </DataToolbar>
    );
  }
}

/**
 * Prop types
 *
 * @type {{viewId: string, t: Function, isDisabled: boolean}}
 */
Toolbar.propTypes = {
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: Function, isDisabled: boolean}}
 */
Toolbar.defaultProps = {
  isDisabled: helpers.UI_DISABLED_TOOLBAR,
  t: helpers.noopTranslate,
  viewId: 'toolbar'
};

const TranslatedToolbar = withTranslation()(Toolbar);

export { TranslatedToolbar as default, TranslatedToolbar, Toolbar };
