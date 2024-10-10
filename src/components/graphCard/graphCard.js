import React from 'react';
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
 * @param {boolean} [props.isDisabled=helpers.UI_DISABLED_GRAPH]
 * @param {useParseFiltersSettings} [props.useParseFiltersSettings=useParseFiltersSettings]
 * @returns {JSX.Element}
 */
const GraphCard = ({
  isDisabled = helpers.UI_DISABLED_GRAPH,
  useParseFiltersSettings: useAliasParseFiltersSettings = useParseFiltersSettings
}) => {
  const { filtersSettings } = useAliasParseFiltersSettings();

  if (isDisabled || !filtersSettings?.length) {
    return null;
  }

  return filtersSettings?.map(filterSetting => (
    <GraphCardContext.Provider key={`graphCard-${filterSetting?.settings?.metrics?.[0]?.id}`} value={filterSetting}>
      <GraphCardMetricTotals>
        <GraphCardChart />
      </GraphCardMetricTotals>
    </GraphCardContext.Provider>
  ));
};

export { GraphCard as default, GraphCard };
