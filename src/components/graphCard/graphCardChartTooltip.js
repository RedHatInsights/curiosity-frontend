import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { getTooltipDate } from './graphCardHelpers';
import { helpers } from '../../common';

/**
 * A custom chart tooltip.
 *
 * @returns {Node}
 */
const GraphCardChartTooltip = ({ datum, granularity, product, t }) => {
  let header = null;
  const data = [];
  const { itemsByKey = {} } = datum || {};

  Object.keys(itemsByKey).forEach((key, index) => {
    if (index === 0) {
      header = getTooltipDate({
        date: itemsByKey[key]?.data.date,
        granularity
      });
    }

    const tempDataFacet = {
      color: itemsByKey[key]?.color
    };

    if (/^threshold/.test(key)) {
      const thresholdStringValue =
        (itemsByKey[key]?.data.hasInfinite && t('curiosity-graph.infiniteThresholdLabel')) ||
        (itemsByKey[key]?.data.y ?? t('curiosity-graph.noDataLabel'));

      tempDataFacet.label = t(`curiosity-graph.thresholdLabel`);
      tempDataFacet.value = thresholdStringValue;
    } else {
      const dataFactsValue =
        (itemsByKey[key]?.data.hasData === false && t('curiosity-graph.noDataLabel')) || itemsByKey[key]?.data.y || 0;

      tempDataFacet.label = t(`curiosity-graph.${key}Label`, { product });
      tempDataFacet.value = dataFactsValue;
    }

    data.push(tempDataFacet);
  });

  return (
    <div className="victory-tooltip">
      <table summary={t('curiosity-graph.tooltipSummary')}>
        {(data.length && header && (
          <thead>
            <tr>
              <th colSpan={2}>{header}</th>
            </tr>
          </thead>
        )) ||
          null}
        {(data.length && (
          <tbody>
            {data.map(dataFacet => (
              <tr key={`tooltip-${dataFacet.label}`}>
                <th>
                  <div
                    aria-hidden
                    className="legend-icon victory-legend-icon"
                    style={{
                      backgroundColor: dataFacet.color || 'transparent'
                    }}
                  />
                  {dataFacet.label}
                </th>
                <td>{dataFacet.value}</td>
              </tr>
            ))}
          </tbody>
        )) ||
          null}
      </table>
      {(!data.length && t('curiosity-graph.noDataErrorLabel')) || null}
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{datum, product: string, t: Function, granularity: string}}
 */
GraphCardChartTooltip.propTypes = {
  datum: PropTypes.shape({
    itemsByKey: PropTypes.objectOf(
      PropTypes.shape({
        color: PropTypes.string,
        data: PropTypes.shape({
          date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
          hasData: PropTypes.bool,
          hasInfinite: PropTypes.bool,
          y: PropTypes.number
        })
      })
    )
  }),
  granularity: PropTypes.string.isRequired,
  product: PropTypes.string,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{datum: {}, product: string, t: Function}}
 */
GraphCardChartTooltip.defaultProps = {
  datum: {},
  product: '',
  t: helpers.noopTranslate
};

const TranslatedGraphCardChartTooltip = withTranslation()(GraphCardChartTooltip);

export { TranslatedGraphCardChartTooltip as default, TranslatedGraphCardChartTooltip, GraphCardChartTooltip };
