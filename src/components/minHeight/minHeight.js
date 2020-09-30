import React from 'react';
import PropTypes from 'prop-types';

/**
 * Set a min-height to prevent page jump component.
 *
 * @augments React.Component
 */
class MinHeight extends React.Component {
  containerRef = React.createRef();

  updatedMinHeight = 0;

  componentDidMount() {
    this.setMinHeight();
  }

  componentDidUpdate() {
    const { autoUpdate } = this.props;

    if (autoUpdate) {
      this.setMinHeight();
    }
  }

  /**
   * Set minHeight on mount or update.
   */
  setMinHeight() {
    const { updatedMinHeight } = this;
    const { minHeight: overrideMinHeight } = this.props;
    // const { clientHeight = 0 } = this.containerRef.current || {};
    const clientHeight = this.containerRef?.current?.clientHeight || 0;

    if (clientHeight !== updatedMinHeight) {
      this.updatedMinHeight = clientHeight;
    }

    if (overrideMinHeight > this.updatedMinHeight) {
      this.updatedMinHeight = overrideMinHeight;
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
