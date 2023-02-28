import React from 'react';
import PropTypes from 'prop-types';
import { helpers } from '../../common';
import { GraphCardMetricTotals } from './graphCardMetricTotals';
import { GraphCardChart } from './graphCardChart';
import { GraphCardContext, useParseFiltersSettings } from './graphCardContext';

/**
 * Configurable graph, chart, cards. Consumes Charts.
 *
 * @see Charts
 * @memberof Components
 * @module GraphCard
 * @property {module} GraphCardChart
 * @property {module} GraphCardChartLegend
 * @property {module} GraphCardChartTitleTooltip
 * @property {module} GraphCardChartTooltip
 * @property {module} GraphCardContext
 * @property {module} GraphCardHelpers
 * @property {module} GraphCardMetricTotals
 */

/**
 * Set up graph cards. Expand filters with base graph settings.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useParseFiltersSettings
 * @returns {React.ReactNode}
 */
const GraphCard = ({ isDisabled, useParseFiltersSettings: useAliasParseFiltersSettings }) => {
  const { groupedFiltersSettings, standaloneFiltersSettings } = useAliasParseFiltersSettings();

  if (isDisabled) {
    return null;
  }

  return (
    <React.Fragment>
      {(groupedFiltersSettings?.settings?.metrics?.length && (
        <GraphCardContext.Provider
          key={`graphCard_grouped-${groupedFiltersSettings?.settings?.metrics?.[0]?.id}`}
          value={groupedFiltersSettings}
        >
          <GraphCardChart />
        </GraphCardContext.Provider>
      )) ||
        null}
      {standaloneFiltersSettings?.map(filtersSettings => (
        <GraphCardContext.Provider
          key={`graphCard_standalone-${filtersSettings?.settings?.metric?.id}`}
          value={filtersSettings}
        >
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
