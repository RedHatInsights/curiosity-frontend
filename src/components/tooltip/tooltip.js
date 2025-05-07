import React from 'react';
import { Tooltip as PfTooltip, TooltipPosition } from '@patternfly/react-core';

/**
 * PF tooltip wrapper.
 *
 * @memberof Components
 * @module Tooltip
 */

/**
 * PF tooltip wrapper component.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.content='...']
 * @param {boolean} [props.isNoWrap=false]
 * @param {number} [props.distance=15]
 * @param {boolean} [props.enableFlip=false]
 * @param {number} [props.entryDelay=100]
 * @param {number} [props.exitDelay=0]
 * @param {TooltipPosition} [props.position=TooltipPosition.top]
 * @returns {JSX.Element}
 */
const Tooltip = ({
  children,
  content = '...',
  isNoWrap = false,
  distance = 15,
  enableFlip = false,
  entryDelay = 100,
  exitDelay = 0,
  position = TooltipPosition.top,
  ...props
}) => (
  <PfTooltip
    className={`curiosity-tooltip${(isNoWrap && '__nowrap') || ''}`}
    content={(React.isValidElement(content) && content) || <p>{content || ''}</p>}
    distance={distance}
    enableFlip={enableFlip}
    entryDelay={entryDelay}
    exitDelay={exitDelay}
    position={position}
    {...props}
  >
    <div className="curiosity-tooltip-content">
      {(React.isValidElement(children) && children) || <span className="curiosity-tooltip-children">{children}</span>}
    </div>
  </PfTooltip>
);

export { Tooltip as default, Tooltip };
