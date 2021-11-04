import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GraphCardChart } from './graphCardChart';
import { useProductGraphConfig } from '../productView/productViewContext';
import { GraphCardContext } from './graphCardContext';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { GraphCardMetricTotals } from './graphCardMetricTotals';

/**
 * Display a single graph metric.
 *
 * @param {object} props
 * @param {object} props.metricFilter
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCardMetric = ({ metricFilter, useProductGraphConfig: useAliasProductGraphConfig }) => {
  const [context, setContext] = useState({});
  const { settings } = useAliasProductGraphConfig();

  useEffect(() => {
    setContext({
      settings: {
        padding: {
          bottom: 75,
          left: 75,
          right: 45,
          top: 45
        },
        ...settings,
        isStandalone: true,
        metric: metricFilter,
        metrics: [metricFilter]
      }
    });
  }, [metricFilter, settings, setContext]);

  return (
    <GraphCardContext.Provider value={context}>
      <GraphCardMetricTotals>
        <GraphCardChart />
      </GraphCardMetricTotals>
    </GraphCardContext.Provider>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductGraphConfig: Function, metricFilter: object}}
 */
GraphCardMetric.propTypes = {
  metricFilter: PropTypes.shape({
    id: PropTypes.oneOf([...Object.values(rhsmConstants.RHSM_API_PATH_METRIC_TYPES)])
  }),
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphConfig: Function, metricFilter: object}}
 */
GraphCardMetric.defaultProps = {
  metricFilter: {},
  useProductGraphConfig
};

export { GraphCardMetric as default, GraphCardMetric };
