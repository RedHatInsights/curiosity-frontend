import React from 'react';
import PropTypes from 'prop-types';
import { helpers } from '../../common';

/**
 * Normalize component height on page loads and updates.
 *
 * @memberof Components
 * @module MinHeight
 */

/**
 * Set a min-height to prevent page jump component.
 *
 * @augments React.Component
 * @fires onResizeContainer
 */
class MinHeight extends React.Component {
  containerRef = React.createRef();

  innerContainerRef = React.createRef();

  updatedContainerWidth = 0;

  resizeObserver = helpers.noop;

  componentDidMount() {
    const { updateOnResize } = this.props;
    window.setTimeout(() => {
      this.setMinHeight();
    });

    if (updateOnResize) {
      this.setResizeObserver();
    }
  }

  componentDidUpdate() {
    const { updateOnContent } = this.props;

    if (updateOnContent) {
      window.setTimeout(() => {
        this.setMinHeight();
      });
    }
  }

  componentWillUnmount() {
    this.resizeObserver();
  }

  /**
   * On resize adjust graph display.
   *
   * @event onResizeContainer
   */
  onResizeContainer = () => {
    const { updatedContainerWidth } = this;
    const { updateOnResize } = this.props;
    const clientWidth = this.containerRef?.current?.clientWidth || 0;

    if (updateOnResize && clientWidth !== updatedContainerWidth) {
      this.updatedContainerWidth = clientWidth;
      this.setMinHeight(true);
    }
  };

  /**
   * Set minHeight on mount or update.
   *
   * @param {boolean} reset
   */
  setMinHeight(reset = false) {
    const { minHeight: overrideMinHeight } = this.props;
    const { current: domElement = {} } = this.containerRef;
    const { current: innerDomElement = {} } = this.innerContainerRef;

    if (domElement?.style) {
      let clientHeight;

      if (reset) {
        clientHeight = innerDomElement?.clientHeight || 0;
      } else {
        clientHeight = domElement?.clientHeight || 0;
      }

      if (overrideMinHeight > clientHeight) {
        clientHeight = overrideMinHeight;
      }

      domElement.style.minHeight = `${clientHeight}px`;
    }
  }

  /**
   * Set ResizeObserver for scenarios when min-height needs to be updated.
   */
  setResizeObserver() {
    window.addEventListener('resize', this.onResizeContainer);
    this.resizeObserver = () => window.removeEventListener('resize', this.onResizeContainer);
  }

  /**
   * Render a min-height div with children.
   *
   * @returns {React.ReactNode}
   */
  render() {
    const { children } = this.props;

    return (
      <div className="curiosity-minheight" ref={this.containerRef}>
        <div ref={this.innerContainerRef}>{children}</div>
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{minHeight: number, children: React.ReactNode, updateOnContent: boolean, updateOnResize: boolean}}
 */
MinHeight.propTypes = {
  updateOnContent: PropTypes.bool,
  updateOnResize: PropTypes.bool,
  children: PropTypes.node.isRequired,
  minHeight: PropTypes.number
};

/**
 * Default props.
 *
 * @type {{minHeight: number, updateOnContent: boolean, updateOnResize: boolean}}
 */
MinHeight.defaultProps = {
  updateOnContent: false,
  updateOnResize: true,
  minHeight: 0
};

export { MinHeight as default, MinHeight };
