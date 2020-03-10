import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { DataToolbar, DataToolbarContent, DataToolbarFilter, DataToolbarGroup } from '@patternfly/react-core';
import { Select } from '../select/select';
import { reduxTypes, store } from '../../redux';
import { toolbarTypes } from './toolbarTypes';
import { helpers } from '../../common';

class Toolbar extends React.Component {
  state = { filterSla: toolbarTypes.getOptions().selected };

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

  render() {
    const { filterSla } = this.state;
    const { t } = this.props;
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

Toolbar.propTypes = {
  t: PropTypes.func,
  viewId: PropTypes.string
};

Toolbar.defaultProps = {
  t: helpers.noopTranslate,
  viewId: 'toolbar'
};

const TranslatedToolbar = withTranslation()(Toolbar);

export { TranslatedToolbar as default, TranslatedToolbar, Toolbar };
