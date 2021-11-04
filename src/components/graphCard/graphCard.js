import React from 'react';
import PropTypes from 'prop-types';
import { useProductGraphConfig } from '../productView/productViewContext';
import { helpers } from '../../common';
import { GraphCardMetrics } from './graphCardMetrics';
import { GraphCardMetric } from './graphCardMetric';
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
  const { filters } = useAliasProductGraphConfig();
  const { groupedFilters, standaloneFilters } = graphCardHelpers.generateChartSettings(filters);

  if (isDisabled) {
    return null;
  }

  return (
    <React.Fragment>
      {(groupedFilters?.length && <GraphCardMetrics metricFilters={groupedFilters} />) || null}
      {standaloneFilters.map(metricFilter => (
        <GraphCardMetric key={`graphCard_${metricFilter.id}`} metricFilter={metricFilter} />
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
