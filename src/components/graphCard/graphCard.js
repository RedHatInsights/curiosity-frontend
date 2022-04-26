import React from 'react';
import PropTypes from 'prop-types';
import { useProductGraphConfig } from '../productView/productViewContext';
import { helpers } from '../../common';
import { GraphCardMetricTotals } from './graphCardMetricTotals';
import { GraphCardChart } from './graphCardChart';
import { GraphCardContext } from './graphCardContext';
import { graphCardHelpers } from './graphCardHelpers';

/**
 * Set up graph cards. Expand filters with base graph settings.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCard = ({ isDisabled, useProductGraphConfig: useAliasProductGraphConfig }) => {
  const { filters, settings } = useAliasProductGraphConfig();
  const { groupedFiltersSettings, standaloneFiltersSettings } = graphCardHelpers.generateChartSettings(
    filters,
    settings
  );

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
        <GraphCardContext.Provider key={`graphCard_${filtersSettings?.metric?.id}`} value={filtersSettings}>
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
 * @type {{useProductGraphConfig: Function, isDisabled: boolean}}
 */
GraphCard.propTypes = {
  isDisabled: PropTypes.bool,
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphConfig: Function, isDisabled: boolean}}
 */
GraphCard.defaultProps = {
  isDisabled: helpers.UI_DISABLED_GRAPH,
  useProductGraphConfig
};

export { GraphCard as default, GraphCard };
