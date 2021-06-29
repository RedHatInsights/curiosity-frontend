import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { connect, store, reduxTypes } from '../../redux';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { ChartIcon } from '../chart/chartIcon';

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
        className="curiosity-usage-graph__legend-item"
        tabIndex={0}
        key={`curiosity-button-${chartId}`}
        variant="link"
        component="a"
        isDisabled={isDisabled}
        icon={
          ((isDisabled || checkIsToggled) && <ChartIcon symbol="eyeSlash" />) || (
            <ChartIcon
              symbol={(isThreshold && 'dash') || 'square'}
              style={{ visibility: (isDisabled && 'hidden') || (checkIsToggled && 'hidden') || 'visible' }}
              fill={color}
            />
          )
        }
      >
        {labelContent}
      </Button>
    );

    if (tooltipContent) {
      return (
        <Tooltip
          key={`curiosity-tooltip-${chartId}`}
          content={<p>{tooltipContent}</p>}
          position={TooltipPosition.top}
          enableFlip={false}
          distance={5}
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
    const { datum, productLabel, t } = this.props;

    return (
      <React.Fragment>
        {datum.dataSets.map(({ id, isThreshold, stroke, data = [] }) => {
          const isDisabled =
            !data.find(({ y, hasData }) => (y >= 0 && hasData === true) || (y >= 0 && isThreshold === true)) || false;

          const labelContent =
            (isThreshold &&
              t([`curiosity-graph.${id}Label`, `curiosity-graph.thresholdLabel`], {
                product: productLabel,
                context: productLabel
              })) ||
            t([`curiosity-graph.${id}Label`, `curiosity-graph.noLabel`], {
              product: productLabel,
              context: productLabel
            });

          const tooltipContent =
            (isThreshold &&
              t([`curiosity-graph.${id}LegendTooltip`, `curiosity-graph.thresholdLegendTooltip`], {
                product: productLabel,
                context: productLabel
              })) ||
            t(`curiosity-graph.${id}LegendTooltip`, { product: productLabel, context: productLabel });

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
 * @type {{datum, productLabel: string, t: Function, legend: object, chart: object}}
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
  productLabel: PropTypes.string,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{datum: {dataSets: Array}, productLabel: string, viewId: string, t: translate, legend: object,
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
  productLabel: '',
  t: translate,
  viewId: 'graphCardLegend'
};

const mapStateToProps = ({ graph }) => ({ legend: graph.legend });

const ConnectedGraphCardChartLegend = connect(mapStateToProps)(GraphCardChartLegend);

export { ConnectedGraphCardChartLegend as default, ConnectedGraphCardChartLegend, GraphCardChartLegend };
