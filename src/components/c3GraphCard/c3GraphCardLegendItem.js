import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { EyeSlashIcon } from '@patternfly/react-icons';
import { helpers } from '../../common';

/**
 * A chart/graph legend button.
 *
 * @augments React.Component
 * @fires onFocus
 * @fires onRevert
 * @fires onToggle
 */
class C3GraphCardLegendItem extends React.Component {
  state = { updatedIsToggled: null };

  /**
   * C3 chart display focus.
   *
   * @event onFocus
   */
  onFocus = () => {
    const { updatedIsToggled } = this.state;
    const { chart, chartId, getToggle, isToggled } = this.props;

    if ((typeof getToggle === 'function' && !isToggled) || !updatedIsToggled) {
      chart.focus(chartId);
    }
  };

  /**
   * C3 chart display revert.
   *
   * @event onRevert
   */
  onRevert = () => {
    const { updatedIsToggled } = this.state;
    const { chart, getToggle, isToggled } = this.props;

    if ((typeof getToggle === 'function' && !isToggled) || !updatedIsToggled) {
      chart.revert();
    }
  };

  /**
   * C3 chart display toggle.
   *
   * @event onToggle
   */
  onToggle = () => {
    const { updatedIsToggled } = this.state;
    const { chart, chartId, getToggle, isToggled } = this.props;

    chart.toggle(chartId);

    if (typeof getToggle === 'function') {
      getToggle({ isToggled: !isToggled });
    } else {
      this.setState({
        updatedIsToggled: !updatedIsToggled
      });
    }

    this.onRevert();
  };

  /**
   * C3 chart display config color.
   *
   * @returns {string}
   */
  getColor = () => {
    const { chart, chartId } = this.props;
    return chart.color(chartId);
  };

  /**
   * ToDO: evaluate using nullish coalescing operator for checkIsToggled
   */
  /**
   * Render a chart legend item.
   *
   * @returns {Node}
   */
  render() {
    const { updatedIsToggled } = this.state;
    const { children, chart, chartId, isDisabled, isThreshold, isToggled, tooltipContent } = this.props;
    const checkIsToggled =
      (updatedIsToggled === null && typeof isToggled === 'boolean' && isToggled) || updatedIsToggled || false;

    if (checkIsToggled) {
      chart.hide(chartId);
    }

    const button = (
      <Button
        tabIndex={0}
        key={`curiosity-button-${chartId}`}
        variant="link"
        onClick={this.onToggle}
        onFocus={this.onFocus}
        onMouseOver={this.onFocus}
        onBlur={this.onRevert}
        onMouseOut={this.onRevert}
        onKeyPress={this.onToggle}
        component="a"
        isDisabled={isDisabled}
        icon={
          ((isDisabled || checkIsToggled) && <EyeSlashIcon />) ||
          (isThreshold && (
            <hr
              aria-hidden
              className="threshold-legend-icon"
              style={{
                visibility: (isDisabled && 'hidden') || (checkIsToggled && 'hidden') || 'visible',
                borderTopColor: this.getColor()
              }}
            />
          )) || (
            <div
              aria-hidden
              className="legend-icon"
              style={{
                visibility: (isDisabled && 'hidden') || (checkIsToggled && 'hidden') || 'visible',
                backgroundColor: this.getColor()
              }}
            />
          )
        }
      >
        {children}
      </Button>
    );

    if (tooltipContent) {
      return (
        <Tooltip
          key={`curiosity-tooltip-${chartId}`}
          content={tooltipContent}
          position={TooltipPosition.top}
          distance={0}
          entryDelay={100}
          exitDelay={0}
        >
          {button}
        </Tooltip>
      );
    }

    return button;
  }
}

/**
 * Prop types.
 *
 * @type {{chartId: string, children: Node, isDisabled: boolean, tooltipContent: Node, chart: object,
 *    isThreshold: boolean, isToggled: boolean, getToggle: Function}}
 */
C3GraphCardLegendItem.propTypes = {
  chart: PropTypes.shape({
    color: PropTypes.func,
    focus: PropTypes.func,
    hide: PropTypes.func,
    revert: PropTypes.func,
    toggle: PropTypes.func
  }),
  chartId: PropTypes.string.isRequired,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  isThreshold: PropTypes.bool,
  isToggled: PropTypes.bool,
  tooltipContent: PropTypes.node,
  getToggle: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{children: null, isDisabled: boolean, tooltipContent: null, chart: {hide: Function,
 *    color: Function, focus: Function, revert: Function, toggle: Function}, isThreshold: boolean,
 *    isToggled: boolean, getToggle: Function}}
 */
C3GraphCardLegendItem.defaultProps = {
  chart: {
    color: helpers.noop,
    focus: helpers.noop,
    hide: helpers.noop,
    revert: helpers.noop,
    toggle: helpers.noop
  },
  children: null,
  isDisabled: false,
  isThreshold: false,
  isToggled: false,
  tooltipContent: null,
  getToggle: null
};

export { C3GraphCardLegendItem as default, C3GraphCardLegendItem };
