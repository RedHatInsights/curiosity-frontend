import React from 'react';
import { helpers } from '../../common';

/**
 * Note: Victory Charts components require a form of extended "something" applied by the consuming component.
 * This leads to odd implementations, like returning a function component.
 */
/**
 * Return a compatible Victory tooltip component.
 *
 * @param {object} params
 * @param {object} params.chartSettings
 * @param {Function} params.chartContainerRef
 * @param {Function} params.chartTooltipRef
 * @param {number} params.minChartWidth
 * @returns {Function}
 */
const chartTooltip = ({
  chartSettings = {},
  chartContainerRef = helpers.noop,
  chartTooltipRef = helpers.noop,
  minChartWidth = 500
} = {}) => {
  // ToDo: evaluate using "width" in place of "minWidth" for scenarios where the graph size is smaller
  /**
   * Return a tooltip x coordinate.
   *
   * @param {object} params
   * @param {number} params.x
   * @param {number} params.width
   * @param {number} params.tooltipWidth
   * @param {number} params.padding
   * @param {number} params.minWidth
   * @returns {number}
   */
  const getXCoordinate = ({ x, width, tooltipWidth, padding = 0, minWidth = minChartWidth } = {}) => {
    if (width <= minWidth && x > tooltipWidth / 2 + padding && x < minWidth - tooltipWidth + padding) {
      return x + padding - tooltipWidth / 2;
    }

    return x > width / 2 ? x - tooltipWidth + padding : x + padding;
  };

  /**
   * Return a tooltip y coordinate.
   *
   * @param {object} params
   * @param {number} params.y
   * @param {number} params.height
   * @param {number} params.tooltipHeight
   * @param {number} params.width
   * @param {number} params.padding
   * @param {number} params.minWidth
   * @returns {number}
   */
  const getYCoordinate = ({ y, height, tooltipHeight, width, padding = 15, minWidth = minChartWidth } = {}) => {
    if (width <= minWidth) {
      return y > height / 2 ? y - tooltipHeight - padding : y + padding;
    }

    return height * 0.25;
  };

  // ToDo: evaluate using "width" in place of "minWidth" for scenarios where the graph size is smaller
  /**
   * Return a tooltip tail position CSS class.
   *
   * @param {object} params
   * @param {number} params.x
   * @param {number} params.width
   * @param {number} params.tooltipWidth
   * @param {number} params.padding
   * @param {number} params.minWidth
   * @returns {number}
   */
  const tailPosition = ({ x, width, tooltipWidth, padding = 0, minWidth = minChartWidth } = {}) => {
    if (width <= minWidth && x > tooltipWidth / 2 + padding && x < minWidth - tooltipWidth + padding) {
      return 'middle';
    }

    return x > width / 2 ? 'right' : 'left';
  };

  return ({ x, y, datum = {} }) => { // eslint-disable-line
    const { padding = {}, tooltipDataSetLookUp = {} } = chartSettings;

    const containerRef = chartContainerRef();
    const tooltipRef = chartTooltipRef();
    const content = tooltipDataSetLookUp?.[datum.x]?.tooltip || '';
    const containerPaddingBottom = padding.bottom ?? 0;
    const containerBounds = containerRef?.current?.querySelector('svg')?.getBoundingClientRect() || {
      width: 0,
      height: 0
    };
    const tooltipBounds = tooltipRef?.current?.getBoundingClientRect() || { width: 0, height: 0 };

    if (content) {
      const updatedClassName = `${(tooltipBounds.height <= 0 && 'fadein') || ''}`;

      return (
        <g>
          <foreignObject
            x={getXCoordinate({ x, width: containerBounds.width, tooltipWidth: tooltipBounds.width })}
            y={getYCoordinate({
              y,
              height: containerBounds.height,
              tooltipHeight: tooltipBounds.height,
              width: containerBounds.width
            })}
            width="100%"
            height="100%"
          >
            <div
              className={`curiosity-chartarea__tooltip-container ${updatedClassName}`}
              ref={tooltipRef}
              style={{ display: (y > containerBounds.height - containerPaddingBottom && 'none') || 'inline-block' }}
              xmlns="http://www.w3.org/1999/xhtml"
            >
              <div
                className={`curiosity-chartarea__tooltip curiosity-chartarea__tooltip-${tailPosition({
                  x,
                  y,
                  width: containerBounds.width,
                  tooltipWidth: tooltipBounds.width
                })}`}
              >
                {content}
              </div>
            </div>
          </foreignObject>
        </g>
      );
    }

    return <g />;
  };
};

export { chartTooltip as default, chartTooltip };
