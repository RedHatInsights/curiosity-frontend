import React from 'react';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { getTooltipDate } from './graphCardHelpers';
import { translate } from '../i18n/i18n';
import { ChartTypeVariant } from '../chart/chart';
import { ChartIcon } from '../chart/chartIcon';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';

/**
 * @memberof GraphCard
 * @module GraphCardChartTooltip
 */

/**
 * A custom chart tooltip.
 *
 * @param {object} props
 * @param {{ itemsByKey: {
 *   chartType: string|undefined,
 *   color: string|undefined,
 *   data: {
 *       date: string|Date,
 *       hasData: boolean,
 *       hasInfinite: boolean,
 *       hasInfiniteQuantity: boolean,
 *       y: number
 *     }|undefined
 * }|undefined}} [props.datum={}]
 * @param {translate} [props.t=translate]
 * @param {useProduct} [props.useProduct=useProduct]
 * @param {useProductGraphTallyQuery} [props.useProductGraphTallyQuery=useProductGraphTallyQuery]
 * @returns {JSX.Element}
 */
const GraphCardChartTooltip = ({
  datum = {},
  t = translate,
  useProduct: useAliasProduct = useProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
}) => {
  const { productLabel } = useAliasProduct();
  const { [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity } = useAliasProductGraphTallyQuery();

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

      if (itemsByKey[key]?.chartType === ChartTypeVariant.threshold) {
        let thresholdStringValue = itemsByKey[key]?.data.y ?? t('curiosity-graph.label', { context: 'noData' });

        // ToDo: Remove hasInfinite check once deprecated graphCard components are removed
        if (itemsByKey[key]?.data.hasInfinite || itemsByKey[key]?.data.hasInfiniteQuantity) {
          thresholdStringValue = t('curiosity-graph.label', { context: ['threshold', 'infinite'] }, [
            tempDataFacet.color && (
              <ChartIcon
                symbol="infinity"
                size="1.1rem"
                fill="#ffffff"
                title={t('curiosity-graph.label', { context: ['threshold', 'infinite'] })}
              />
            )
          ]);
        }

        tempDataFacet.label = t('curiosity-graph.label', { context: ['threshold'] });
        tempDataFacet.value = thresholdStringValue;
      } else {
        const dataFactsValue =
          (itemsByKey[key]?.data.hasData === false && t('curiosity-graph.label', { context: 'noData' })) ||
          itemsByKey[key]?.data.y ||
          0;

        tempDataFacet.label = t(`curiosity-graph.label`, { context: key, product: productLabel });
        tempDataFacet.value = dataFactsValue;
      }

      tempDataFacet.chartType = itemsByKey[key]?.chartType;
      data.push(tempDataFacet);
    });

  return (
    <div className="curiosity-graph__tooltip curiosity-usage-graph__tooltip">
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
            {data.map(dataFacet => {
              const updatedDataFacetValue =
                (typeof dataFacet.value === 'number' &&
                  !Number.isInteger(dataFacet.value) &&
                  helpers
                    .numberDisplay(dataFacet.value)
                    ?.format({ average: true, mantissa: 5, trimMantissa: true, lowPrecision: true })
                    ?.toUpperCase()) ||
                dataFacet.value;

              return (
                <tr key={`tooltip-${dataFacet.label}`}>
                  <th>
                    {dataFacet.chartType === ChartTypeVariant.threshold && (
                      <ChartIcon size="sm" symbol="dash" fill={dataFacet.color || 'transparent'} />
                    )}
                    {dataFacet.chartType !== ChartTypeVariant.threshold && (
                      <ChartIcon size="sm" fill={dataFacet.color || 'transparent'} />
                    )}{' '}
                    {dataFacet.label}
                  </th>
                  <td>{updatedDataFacetValue}</td>
                </tr>
              );
            })}
          </tbody>
        )) ||
          null}
      </table>
      {(!data.length && t('curiosity-graph.label', { context: ['noData', 'error'] })) || null}
    </div>
  );
};

export { GraphCardChartTooltip as default, GraphCardChartTooltip };
