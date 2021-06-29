import React from 'react';
import PropTypes from 'prop-types';
import { getTooltipDate } from './graphCardHelpers';
import { translate } from '../i18n/i18n';
import { ChartIcon } from '../chart/chartIcon';

/**
 * A custom chart tooltip.
 *
 * @param {object} props
 * @param {object} props.datum
 * @param {string} props.granularity
 * @param {string} props.productLabel
 * @param {Function} props.t
 * @returns {Node}
 */
const GraphCardChartTooltip = ({ datum, granularity, productLabel, t }) => {
  let header = null;
  const data = [];
  const { itemsByKey = {} } = datum || {};

  Object.keys(itemsByKey)
    .reverse()
    .forEach((key, index) => {
      if (index === 0) {
        header = getTooltipDate({
          date: itemsByKey[key]?.data.date,
          granularity
        });
      }

      const tempDataFacet = {
        color: itemsByKey[key]?.color
      };

      if (itemsByKey[key]?.chartType === 'threshold') {
        let thresholdStringValue = itemsByKey[key]?.data.y ?? t('curiosity-graph.noDataLabel');

        if (itemsByKey[key]?.data.hasInfinite) {
          if (tempDataFacet.color) {
            thresholdStringValue = (
              <ChartIcon symbol="infinity" fill="#ffffff" title={t('curiosity-graph.infiniteThresholdLabel')} />
            );
          } else {
            thresholdStringValue = t('curiosity-graph.infiniteThresholdLabel');
          }
        }

        tempDataFacet.label = t(`curiosity-graph.thresholdLabel`);
        tempDataFacet.value = thresholdStringValue;
      } else {
        const dataFactsValue =
          (itemsByKey[key]?.data.hasData === false && t('curiosity-graph.noDataLabel')) || itemsByKey[key]?.data.y || 0;

        tempDataFacet.label = t(`curiosity-graph.${key}Label`, { product: productLabel });
        tempDataFacet.value = dataFactsValue;
      }

      tempDataFacet.chartType = itemsByKey[key]?.chartType;
      data.push(tempDataFacet);
    });

  return (
    <div className="curiosity-usage-graph__tooltip">
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
                  {dataFacet.chartType === 'threshold' && (
                    <ChartIcon size="sm" symbol="dash" fill={dataFacet.color || 'transparent'} />
                  )}
                  {dataFacet.chartType !== 'threshold' && (
                    <ChartIcon size="sm" fill={dataFacet.color || 'transparent'} />
                  )}{' '}
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
 * @type {{datum, productLabel: string, t: Function, granularity: string}}
 */
GraphCardChartTooltip.propTypes = {
  datum: PropTypes.shape({
    itemsByKey: PropTypes.objectOf(
      PropTypes.shape({
        chartType: PropTypes.string,
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
  productLabel: PropTypes.string,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{datum: object, productLabel: string, t: translate}}
 */
GraphCardChartTooltip.defaultProps = {
  datum: {},
  productLabel: '',
  t: translate
};

export { GraphCardChartTooltip as default, GraphCardChartTooltip };
