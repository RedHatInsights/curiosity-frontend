import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GraphCardChart } from './graphCardChart';
import { useProductGraphConfig } from '../productView/productViewContext';
import { GraphCardContext } from './graphCardContext';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';

/**
 * Display a single graph metric.
 *
 * @param {object} props
 * @param {Array} props.metricFilters
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCardMetrics = ({ metricFilters, useProductGraphConfig: useAliasProductGraphConfig }) => {
  const [context, setContext] = useState({});
  const { settings } = useAliasProductGraphConfig();

  useEffect(() => {
    setContext({
      settings: {
        ...settings,
        isStandalone: false,
        metric: undefined,
        metrics: metricFilters
      }
    });
  }, [metricFilters, settings, setContext]);

  return (
    <GraphCardContext.Provider value={context}>
      <GraphCardChart />
    </GraphCardContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductGraphConfig: Function, metricFilters: Array}}
 */
GraphCardMetrics.propTypes = {
  metricFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOf([...Object.values(rhsmConstants.RHSM_API_PATH_METRIC_TYPES)])
    })
  ),
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphConfig: Function, metricFilters: Array}}
 */
GraphCardMetrics.defaultProps = {
  metricFilters: [],
  useProductGraphConfig
};

export { GraphCardMetrics as default, GraphCardMetrics };
