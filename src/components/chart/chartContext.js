import React, { useCallback, useContext } from 'react';
import { helpers } from '../../common';

/**
 * @memberof Chart
 * @module ChartContext
 */

/**
 * Chart context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [
  { chartContainerRef: helpers.noop, chartSettings: {}, chartTooltipRef: helpers.noop, dataSetsToggle: [] },
  helpers.noop
];

const ChartContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated chart context.
 *
 * @returns {React.Context<{}>}
 */
const useChartContext = () => useContext(ChartContext);

/**
 * ToDo: reevaluate this alternative pattern of passing hooks as options, helps testing
 */
/**
 * Track, show, and hide chart data layers.
 *
 * @fires onHide
 * @fires onRevert
 * @fires onToggle
 * @param {object} options
 * @param {Function} options.useChartContext
 * @returns {{onRevert: Function, onToggle: Function, getIsToggled: Function, dataSetsToggle: object,
 *     onHide: Function}}
 */
const useToggleData = ({ useChartContext: useAliasChartContext = useChartContext } = {}) => {
  const { dataSetsToggle: contextDataSetsToggle = [] } = useAliasChartContext();
  const [dataSetsToggle, setDataSetsToggle] = contextDataSetsToggle;

  /**
   * Hide a graph layer.
   *
   * @event onHide
   */
  const onHide = useCallback(
    id => {
      setDataSetsToggle(prevState => ({ ...prevState, [id]: true }));
    },
    [setDataSetsToggle]
  );

  /**
   * Reset graph layers.
   *
   * @event onRevert
   */
  const onRevert = useCallback(() => {
    setDataSetsToggle(() => ({}));
  }, [setDataSetsToggle]);

  /**
   * Hide/show graph layers.
   *
   * @event onToggle
   * @returns boolean;
   */
  const onToggle = useCallback(
    id => {
      const updatedToggle = !dataSetsToggle?.[id];
      setDataSetsToggle(prevState => ({ ...prevState, [id]: updatedToggle }));
      return updatedToggle;
    },
    [dataSetsToggle, setDataSetsToggle]
  );

  /**
   * Graph layer status.
   *
   * @callback getIsToggled
   * @returns boolean|*
   */
  const getIsToggled = useCallback(id => dataSetsToggle?.[id] || false, [dataSetsToggle]);

  return {
    ...{ dataSetsToggle },
    onHide,
    onRevert,
    onToggle,
    getIsToggled
  };
};

const context = {
  ChartContext,
  DEFAULT_CONTEXT,
  useChartContext,
  useToggleData
};

export { context as default, context, ChartContext, DEFAULT_CONTEXT, useChartContext, useToggleData };
