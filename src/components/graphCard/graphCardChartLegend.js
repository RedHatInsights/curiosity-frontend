import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { EyeSlashIcon } from '@patternfly/react-icons';
import { connectTranslate, store, reduxTypes } from '../../redux';
import { helpers } from '../../common';

/**
 * A custom chart legend.
 *
 * @augments React.Component
 * @fires onClick
 */
class GraphCardChartLegend extends React.Component {
  componentDidMount() {
    const { chart, datum, legend, viewId } = this.props;
    datum.dataSets.forEach(({ id }) => {
      const checkIsToggled = legend[`${viewId}-${id}`] || chart.isToggled(id);

      if (checkIsToggled) {
        chart.hide(id);
      }
    });
  }

  /**
   * Toggle legend item and chart.
   *
   * @event onClick
   * @param {string} id
   */
  onClick = id => {
    const { chart, viewId } = this.props;
    const updatedToggle = chart.toggle(id);

    store.dispatch({
      type: reduxTypes.graph.SET_GRAPH_LEGEND,
      legend: {
        [`${viewId}-${id}`]: updatedToggle
      }
    });
  };

  /**
   * Return a legend item.
   *
   * @param {object} options
   * @param {string} options.chartId
   * @param {string} options.color
   * @param {boolean} options.isDisabled
   * @param {boolean} options.isThreshold
   * @param {string} options.labelContent
   * @param {string} options.tooltipContent
   * @returns {Node}
   */
  renderLegendItem({ chartId, color, isDisabled, isThreshold, labelContent, tooltipContent }) {
    const { chart, legend, viewId } = this.props;
    const checkIsToggled = legend[`${viewId}-${chartId}`] || chart.isToggled(chartId);

    const button = (
      <Button
        onClick={() => this.onClick(chartId)}
        onKeyPress={() => this.onClick(chartId)}
        className="victory-legend-item"
        tabIndex={0}
        key={`curiosity-button-${chartId}`}
        variant="link"
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
                borderTopColor: color
              }}
            />
          )) || (
            <div
              aria-hidden
              className="legend-icon"
              style={{
                visibility: (isDisabled && 'hidden') || (checkIsToggled && 'hidden') || 'visible',
                backgroundColor: color
              }}
            />
          )
        }
      >
        {labelContent}
      </Button>
    );

    /**
     * FixMe: PF Tooltip has breaking changes not called out in changelog.md for PF React-core?
     * Unclear which changelog this is called out in. Had to open the PF React-core component
     * and the associated PR to determine when breaking changes were activated. v4.30.0
     *  - https://github.com/patternfly/patternfly-react/pull/4491/files
     *
     * Breaking changes:
     * 1. enableFlip prop is more sensitive, and/or not overridden by declaring "position"
     *    - enableFlip possibly causes unintended behavior on smaller screen sizes when "distance" prop
     *      is set to "0"
     * 2. unit test snapshots updated, causing CI to fail
     * 3. removing props, deprecating them, having them "[not do anything]"
     */
    if (tooltipContent) {
      return (
        <Tooltip
          key={`curiosity-tooltip-${chartId}`}
          content={<p>{tooltipContent}</p>}
          position={TooltipPosition.top}
          enableFlip={false}
          distance={5}
          entryDelay={100}
          exitDelay={0}
        >
          {button}
        </Tooltip>
      );
    }

    return button;
  }

  /**
   * Render a graph legend.
   *
   * @returns {Node}
   */
  render() {
    const { datum, product, t } = this.props;

    return (
      <React.Fragment>
        {datum.dataSets.map(({ id, isThreshold, stroke, data = [] }) => {
          const isDisabled =
            !data.find(({ y, hasData }) => (y >= 0 && hasData === true) || (y >= 0 && isThreshold === true)) || false;

          const labelContent =
            (isThreshold &&
              t([`curiosity-graph.${id}Label`, `curiosity-graph.thresholdLabel`], { product, context: product })) ||
            t([`curiosity-graph.${id}Label`, `curiosity-graph.noLabel`], { product, context: product });

          const tooltipContent =
            (isThreshold &&
              t([`curiosity-graph.${id}LegendTooltip`, `curiosity-graph.thresholdLegendTooltip`], {
                product,
                context: product
              })) ||
            t(`curiosity-graph.${id}LegendTooltip`, { product, context: product });

          return this.renderLegendItem({
            chartId: id,
            color: stroke,
            labelContent,
            isDisabled,
            isThreshold,
            tooltipContent
          });
        })}
      </React.Fragment>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{datum, product: string, t: Function, legend, chart}}
 */
GraphCardChartLegend.propTypes = {
  chart: PropTypes.shape({
    hide: PropTypes.func,
    toggle: PropTypes.func,
    isToggled: PropTypes.func
  }),
  datum: PropTypes.shape({
    dataSets: PropTypes.arrayOf(
      PropTypes.shape({
        stroke: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isThreshold: PropTypes.bool
      })
    )
  }),
  legend: PropTypes.objectOf(PropTypes.bool),
  product: PropTypes.string,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{datum: {dataSets: Array}, product: string, viewId: string, t: Function, legend: {},
 *     chart: {hide: Function, toggle: Function, isToggled: Function}}}
 */
GraphCardChartLegend.defaultProps = {
  chart: {
    hide: helpers.noop,
    toggle: helpers.noop,
    isToggled: helpers.noop
  },
  datum: {
    dataSets: []
  },
  legend: {},
  product: '',
  t: helpers.noopTranslate,
  viewId: 'graphCardLegend'
};

const mapStateToProps = ({ graph }) => ({ legend: graph.legend });

const ConnectedGraphCardChartLegend = connectTranslate(mapStateToProps)(GraphCardChartLegend);

export { ConnectedGraphCardChartLegend as default, ConnectedGraphCardChartLegend, GraphCardChartLegend };
