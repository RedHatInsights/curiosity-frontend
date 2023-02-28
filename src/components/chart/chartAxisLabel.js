import React from 'react';

/**
 * @memberof Chart
 * @module ChartAxisLabel
 */

/**
 * Note: Victory Charts components require a form of extended "something" applied by the consuming component.
 * This leads to odd implementations, like returning a function component.
 */
/**
 * Allow, and return, SVG compatible HTML for axis labels.
 *
 * @param {object} params
 * @param {string} params.axis
 * @param {number} params.index
 * @returns {Function}
 */
const chartAxisLabel =
  ({ axis, index = 0 } = {}) =>
  ({ x, y, text }) => // eslint-disable-line
    (
      <g>
        <foreignObject x={0} y={0} width="100%" height="100%">
          <div
            className={`curiosity-chartarea__axis-label-container curiosity-chartarea__axis-label-container-${axis} curiosity-chartarea__axis-label-container-${axis}-${index}`}
            style={{ top: `${y ?? 0}px` }}
            xmlns="http://www.w3.org/1999/xhtml"
          >
            <div className="curiosity-chartarea__axis-label-container-content">{text}</div>
          </div>
        </foreignObject>
      </g>
    );

export { chartAxisLabel as default, chartAxisLabel };
