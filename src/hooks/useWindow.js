import { useEffect, useState } from 'react';
import { helpers } from '../common';

/**
 * Apply a resize observer to an element.
 *
 * @param {*} target
 * @returns {{width: number, height: number}}
 */
const useResizeObserver = target => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const isElementResize = target && window.ResizeObserver && true;
    const element = target?.current;
    let removeObserver = helpers.noop;

    if (element) {
      const handler = () => {
        const { clientHeight = 0, clientWidth = 0, innerHeight = 0, innerWidth = 0 } = element || {};

        setDimensions({
          width: isElementResize ? clientWidth : innerWidth,
          height: isElementResize ? clientHeight : innerHeight
        });
      };

      if (isElementResize) {
        const resizeObserver = new window.ResizeObserver(handler);
        resizeObserver.observe(element);
        removeObserver = () => resizeObserver.unobserve(element);
      } else {
        handler();
        window.addEventListener('resize', handler);
        removeObserver = () => window.removeEventListener('resize', handler);
      }
    }

    return () => {
      removeObserver();
    };
  }, [target]);

  return dimensions;
};

const windowHooks = {
  useResizeObserver
};

export { windowHooks as default, windowHooks, useResizeObserver };
