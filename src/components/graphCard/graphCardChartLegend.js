import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { EyeSlashIcon } from '@patternfly/react-icons';
import { helpers } from '../../common';

/**
 * A custom chart legend.
 *
 * @augments React.Component
 */
class GraphCardChartLegend extends React.Component {
  static renderLegendItem({ chartId, color, isDisabled, isThreshold, labelContent, tooltipContent }) {
    const button = (
      <Button
        className="victory-legend-item"
        tabIndex={0}
        key={`curiosity-button-${chartId}`}
        variant="link"
        component="a"
        isDisabled={isDisabled}
        icon={
          (isDisabled && <EyeSlashIcon />) ||
          (isThreshold && (
            <hr
              aria-hidden
              className="threshold-legend-icon"
              style={{
                visibility: (isDisabled && 'hidden') || 'visible',
                borderTopColor: color
              }}
            />
          )) || (
            <div
              aria-hidden
              className="legend-icon"
              style={{
                visibility: (isDisabled && 'hidden') || 'visible',
                backgroundColor: color
              }}
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
          distance={-10}
          entryDelay={100}
          exitDelay={0}
        >
          {button}
        </Tooltip>
      );
    }

    return button;
  }

  render() {
    const { datum, product, t } = this.props;

    return (
      <React.Fragment>
        {datum.dataSets.map(({ id, isThreshold, stroke, data = [] }) => {
          const isDisabled =
            !data.find(({ y, hasData }) => (y >= 0 && hasData === true) || (y >= 0 && isThreshold === true)) || false;

          const labelContent =
            (isThreshold && t(`curiosity-graph.thresholdLabel`)) ||
            t(`curiosity-graph.${id}Label`, { product }) ||
            t(`curiosity-graph.noLabel`, { product });

          const tooltipContent =
            (isThreshold && t(`curiosity-graph.thresholdLegendTooltip`)) || t(`curiosity-graph.${id}LegendTooltip`);

          return GraphCardChartLegend.renderLegendItem({
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
 * @type {{datum, product: string, t: Function}}
 */
GraphCardChartLegend.propTypes = {
  datum: PropTypes.shape({
    dataSets: PropTypes.arrayOf(
      PropTypes.shape({
        stroke: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        isThreshold: PropTypes.bool
      })
    )
  }),
  product: PropTypes.string,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{datum: {}, product: string, t: Function}}
 */
GraphCardChartLegend.defaultProps = {
  datum: {
    dataSets: []
  },
  product: '',
  t: helpers.noopTranslate
};

const TranslatedGraphCardChartLegend = withTranslation()(GraphCardChartLegend);

export { TranslatedGraphCardChartLegend as default, TranslatedGraphCardChartLegend, GraphCardChartLegend };
