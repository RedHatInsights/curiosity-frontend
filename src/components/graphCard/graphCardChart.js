import React from 'react';
import PropTypes from 'prop-types';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { useSelector } from '../../redux';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { graphCardHelpers } from './graphCardHelpers';
import GraphCardChartTooltip from './graphCardChartTooltip';
import GraphCardChartLegend from './graphCardChartLegend';
import { ChartArea } from '../chartArea/chartArea';
import { useRouteDetail } from '../router/routerContext';
import { useProductContext } from '../productView/productContext';

/**
 * A chart/graph.
 *
 * @param {object} props
 * @param {object} props.graphData
 * @param {string} props.granularity
 * @returns {Node}
 */
const GraphCardChart = ({ graphData, granularity }) => {
  const { initialGraphFilters: filterGraphData = [] } = useProductContext();
  const { productParameter: productLabel, viewParameter: viewId } = useRouteDetail();
  const updatedGranularity = useSelector(
    ({ view }) => view.graphTallyQuery?.[RHSM_API_QUERY_TYPES.GRANULARITY]?.[viewId],
    granularity
  );

  const xAxisTickFormat = ({ item, previousItem, tick }) =>
    graphCardHelpers.xAxisTickFormat({
      tick,
      date: item.date,
      previousDate: previousItem.date,
      granularity: updatedGranularity
    });

  const chartAreaProps = {
    xAxisFixLabelOverlap: true,
    xAxisLabelIncrement: graphCardHelpers.getChartXAxisLabelIncrement(updatedGranularity),
    xAxisTickFormat,
    yAxisTickFormat: graphCardHelpers.yAxisTickFormat
  };

  const filteredGraphData = data => {
    const filtered = key => {
      const tempFiltered = {
        data: data[key],
        id: key,
        animate: {
          duration: 250,
          onLoad: { duration: 250 }
        },
        strokeWidth: 2,
        isStacked: !/^threshold/.test(key),
        isThreshold: /^threshold/.test(key)
      };

      if (/^threshold/.test(key)) {
        tempFiltered.animate = {
          duration: 100,
          onLoad: { duration: 100 }
        };
        tempFiltered.stroke = chartColorGreenDark.value;
        tempFiltered.strokeDasharray = '4,3';
        tempFiltered.strokeWidth = 3;
      }

      return tempFiltered;
    };

    if (filterGraphData.length) {
      return filterGraphData.map(value => Object.assign(filtered(value.id), value));
    }

    return Object.keys(data).map(key => filtered(key));
  };

  return (
    <ChartArea
      key={`graphCardChart_${updatedGranularity}`}
      {...chartAreaProps}
      dataSets={filteredGraphData(graphData)}
      chartLegend={({ chart, datum }) => (
        <GraphCardChartLegend chart={chart} datum={datum} productLabel={productLabel} viewId={viewId} />
      )}
      chartTooltip={({ datum }) => (
        <GraphCardChartTooltip datum={datum} granularity={updatedGranularity} productLabel={productLabel} />
      )}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{granularity: string, graphData: object }}
 */
GraphCardChart.propTypes = {
  graphData: PropTypes.object,
  granularity: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
};

/**
 * Default props.
 *
 * @type {{granularity: string, graphData: object }}
 */
GraphCardChart.defaultProps = {
  graphData: {},
  granularity: null
};

export { GraphCardChart as default, GraphCardChart };
