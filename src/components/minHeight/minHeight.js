import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useResizeObserver } from '../../hooks/useWindow';

/**
 * Normalize component height on page loads and updates.
 *
 * @memberof Components
 * @module MinHeight
 */

/**
 * Set a min-height to prevent page jump component.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} props.isOnLoad
 * @param {number} props.minHeight
 * @param {Function} props.useResizeObserver
 * @returns {React.ReactNode}
 */
const MinHeight = ({ children, isOnLoad, minHeight, useResizeObserver: useAliasResizeObserver }) => {
  const [tracking, setTracking] = useState({ containerWidth: undefined, isLoaded: false });
  const containerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const { height: containerHeight, width: containerWidth } = useAliasResizeObserver(containerRef);

  useEffect(() => {
    if (!isOnLoad || (isOnLoad && !tracking.isLoaded)) {
      const { current: domElement = {} } = containerRef;
      const { current: innerDomElement = {} } = innerContainerRef;

      if (domElement?.style) {
        let updatedHeight = innerDomElement?.clientHeight || 0;

        if (minHeight > containerHeight) {
          updatedHeight = minHeight;
        }

        domElement.style.minHeight = `${updatedHeight}px`;
        setTracking(() => ({
          containerWidth,
          isLoaded: isOnLoad,
          updatedHeight
        }));
      }
    }
  }, [containerHeight, containerWidth, containerRef, innerContainerRef, isOnLoad, minHeight, tracking.isLoaded]);

  return (
    <div className="curiosity-minheight" ref={containerRef}>
      <div className="curiosity-minheight__inner" ref={innerContainerRef}>
        {children}
      </div>
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{minHeight: number, useResizeObserver: Function, children: React.ReactNode, isOnLoad: boolean}}
 */
MinHeight.propTypes = {
  children: PropTypes.node.isRequired,
  minHeight: PropTypes.number,
  isOnLoad: PropTypes.bool,
  useResizeObserver: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{minHeight: number, useResizeObserver: Function, isOnLoad: boolean}}
 */
MinHeight.defaultProps = {
  isOnLoad: false,
  minHeight: 0,
  useResizeObserver
};

export { MinHeight as default, MinHeight };
