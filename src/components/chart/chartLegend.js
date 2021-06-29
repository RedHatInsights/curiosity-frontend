import React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { useChartContext, useToggleData } from './chartContext';

/**
 * Wrapper for rendering an HTML based legend.
 *
 * @returns {Node}
 */
const ChartLegend = () => {
  const { getIsToggled, onHide, onRevert, onToggle } = useToggleData();
  const { chartSettings = {} } = useChartContext();
  const { chartLegend, dataSets } = chartSettings;

  if (!chartLegend) {
    return null;
  }

  const legendProps = {
    datum: { dataSets: _cloneDeep(dataSets) },
    chart: {
      hide: onHide,
      revert: onRevert,
      toggle: onToggle,
      isToggled: getIsToggled
    }
  };

  return (
    <div className="curiosity-chartarea__legend">
      {(React.isValidElement(chartLegend) && React.cloneElement(chartLegend, { ...legendProps })) ||
        chartLegend({ ...legendProps })}
    </div>
  );
};

/**
 * Prop types.
 */
ChartLegend.propTypes = {};

/**
 * Default props.
 */
ChartLegend.defaultProps = {};

export { ChartLegend as default, ChartLegend };
