import React from 'react';
import PropTypes from 'prop-types';
import { helpers } from '../../common';
import { GraphCardMetricTotals } from './graphCardMetricTotals';
import { GraphCardChart } from './graphCardChart';
import { GraphCardContext, useParseFiltersSettings } from './graphCardContext';

/**
 * Set up graph cards. Expand filters with base graph settings.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useParseFiltersSettings
 * @returns {Node}
 */
const GraphCard = ({ isDisabled, useParseFiltersSettings: useAliasParseFiltersSettings }) => {
  const { groupedFiltersSettings, standaloneFiltersSettings } = useAliasParseFiltersSettings();

  if (isDisabled) {
    return null;
  }

  return (
    <React.Fragment>
      {(groupedFiltersSettings && (
        <GraphCardContext.Provider value={groupedFiltersSettings}>
          <GraphCardChart />
        </GraphCardContext.Provider>
      )) ||
        null}
      {standaloneFiltersSettings?.map(filtersSettings => (
        <GraphCardContext.Provider key={`graphCard_${filtersSettings?.settings?.metric?.id}`} value={filtersSettings}>
          <GraphCardMetricTotals>
            <GraphCardChart />
          </GraphCardMetricTotals>
        </GraphCardContext.Provider>
      ))}
    </React.Fragment>
  );
};

/**
 * Prop types.
 *
 * @type {{useParseFiltersSettings: Function, isDisabled: boolean}}
 */
GraphCard.propTypes = {
  isDisabled: PropTypes.bool,
  useParseFiltersSettings: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useParseFiltersSettings: Function, isDisabled: boolean}}
 */
GraphCard.defaultProps = {
  isDisabled: helpers.UI_DISABLED_GRAPH,
  useParseFiltersSettings
};

export { GraphCard as default, GraphCard };
