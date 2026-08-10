import React, { useEffect, useRef, useState } from 'react';
import { useResizeObserver } from '../../hooks/useWindow';

/**
 * Normalize component height on page loads and updates.
 *
 * @memberof Components
 * @module MinHeight
 */

/**
 * Set a min-height to prevent page jump.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.isOnLoad=false]
 * @param {number} [props.minHeight=0]
 * @param {useResizeObserver} [props.useResizeObserver=useResizeObserver]
 * @returns {JSX.Element}
 */
const MinHeight = ({
  children,
  isOnLoad = false,
  minHeight = 0,
  useResizeObserver: useAliasResizeObserver = useResizeObserver
}) => {
  const [tracking, setTracking] = useState({ containerWidth: undefined, isLoaded: false, updatedHeight: 0 });
  const containerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const { height: containerHeight, width: containerWidth } = useAliasResizeObserver(containerRef);

  useEffect(() => {
    if (!isOnLoad || (isOnLoad && !tracking.isLoaded)) {
      const { current: innerDomElement = {} } = innerContainerRef;
      let updatedHeight = innerDomElement?.clientHeight || 0;

      if (minHeight > containerHeight) {
        updatedHeight = minHeight;
      }

      setTracking(() => ({
        containerWidth,
        isLoaded: isOnLoad,
        updatedHeight
      }));
    }
  }, [containerHeight, containerWidth, innerContainerRef, isOnLoad, minHeight, tracking.isLoaded]);

  return (
    <div className="curiosity-minheight" style={{ minHeight: `${tracking.updatedHeight}px` }} ref={containerRef}>
      <div className="curiosity-minheight__inner" ref={innerContainerRef}>
        {children}
      </div>
    </div>
  );
};

export { MinHeight as default, MinHeight };
