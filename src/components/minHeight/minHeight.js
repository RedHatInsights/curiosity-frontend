import React from 'react';
import PropTypes from 'prop-types';
import { helpers } from '../../common';

/**
 * Set a min-height to prevent page jump component.
 *
 * @augments React.Component
 * @fires onResizeContainer
 */
class MinHeight extends React.Component {
  containerRef = React.createRef();

  updatedMinHeight = 0;

  updatedContainerWidth = 0;

  resizeObserver = helpers.noop;

  componentDidMount() {
    this.setMinHeight();
    this.setResizeObserver();
  }

  componentDidUpdate() {
    const { autoUpdate } = this.props;

    if (autoUpdate) {
      this.setMinHeight();
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
    const clientWidth = this.containerRef?.current?.clientWidth || 0;

    if (clientWidth !== updatedContainerWidth) {
      this.updatedContainerWidth = clientWidth;
      this.setMinHeight(true);
    }
  };

  /**
   * Set minHeight on mount or update.
   *
   * @param {boolean} resetMinHeight
   */
  setMinHeight(resetMinHeight) {
    const { updatedMinHeight } = this;
    const { minHeight: overrideMinHeight } = this.props;
    const { current: domElement = {} } = this.containerRef;

    if (resetMinHeight && domElement.style) {
      domElement.style.minHeight = 0;
    }

    const clientHeight = domElement?.clientHeight || 0;

    if (clientHeight !== updatedMinHeight) {
      this.updatedMinHeight = clientHeight;
    }

    if (overrideMinHeight > this.updatedMinHeight) {
      this.updatedMinHeight = overrideMinHeight;
    }
  }

  /**
   * Set ResizeObserver for scenarios when min-height needs to be updated.
   */
  setResizeObserver() {
    const containerElement = this.containerRef.current;
    const { ResizeObserver } = window;

    if (containerElement && ResizeObserver) {
      const resizeObserver = new ResizeObserver(this.onResizeContainer);
      resizeObserver.observe(containerElement);
      this.resizeObserver = () => resizeObserver.unobserve(containerElement);
    } else {
      window.addEventListener('resize', this.onResizeContainer);
      this.resizeObserver = () => window.removeEventListener('resize', this.onResizeContainer);
    }
  }

  /**
   * Render a min-height div with children.
   *
   * @returns {Node}
   */
  render() {
    const { updatedMinHeight } = this;
    const { children } = this.props;

    return (
      <div ref={this.containerRef} style={{ minHeight: updatedMinHeight }}>
        {children}
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{minHeight: number, autoUpdate: boolean, children: Node}}
 */
MinHeight.propTypes = {
  autoUpdate: PropTypes.bool,
  children: PropTypes.node.isRequired,
  minHeight: PropTypes.number
};

/**
 * Default props.
 *
 * @type {{minHeight: number, autoUpdate: boolean}}
 */
MinHeight.defaultProps = {
  autoUpdate: true,
  minHeight: 0
};

export { MinHeight as default, MinHeight };
