import React from 'react';
import PropTypes from 'prop-types';
import { VictoryStack as ChartStack, VictoryTooltip as ChartCursorTooltip } from 'victory';
import { createContainer } from 'victory-create-container';
import { Chart, ChartArea, ChartAxis, ChartContainer, ChartLine, ChartThreshold } from '@patternfly/react-charts';
import { useChartContext } from './chartContext';
import { chartTooltip } from './chartTooltip';
import { chartAxisLabel } from './chartAxisLabel';
import { ChartTypeVariant } from './chartHelpers';

/**
 * @memberof Chart
 * @module ChartElements
 */

/**
 * Aggregate, generate, a compatible Victory chart element/facet component.
 *
 * @param {object} props
 * @param {object} props.chartTypeDefaults
 * @returns {React.ReactNode}
 */
const ChartElements = ({ chartTypeDefaults }) => {
  const { chartSettings = {}, chartContainerRef, chartTooltipRef } = useChartContext();
  const {
    chartDomain,
    chartElementsProps,
    chartWidth,
    hasData,
    padding,
    themeColor,
    xAxisProps = {},
    yAxisProps = []
  } = chartSettings;

  let containerComponent = <ChartContainer />;
  let xAxis = null;
  let yAxis = null;
  let chartElements = [];
  let stackedChartElements = [];

  if (hasData) {
    /**
     * Note: both cursor and voronoiDimension attrs required if the need is to have...
     * the tooltip populate consistently without being "near" a chart element y axis point
     */
    const VictoryVoronoiCursorContainer = createContainer('voronoi', 'cursor');
    const TooltipLabelComponent = chartTooltip({ chartSettings, chartContainerRef, chartTooltipRef });

    containerComponent = (
      <VictoryVoronoiCursorContainer
        cursorDimension="x"
        voronoiDimension="x"
        labels={obj => obj}
        labelComponent={
          <ChartCursorTooltip
            dx={0}
            dy={0}
            centerOffset={{ x: 0, y: 0 }}
            flyoutStyle={{ fill: 'transparent', stroke: 'transparent' }}
            labelComponent={<TooltipLabelComponent />}
          />
        }
        voronoiPadding={(padding && Object.values(padding).sort()?.[0]) || 0}
        mouseFollowTooltips
      />
    );
  }

  /**
   * Generate X Axis
   */
  if (Object.keys(xAxisProps).length) {
    const updatedXAxisProps = {
      ...xAxisProps
    };

    if (updatedXAxisProps.label) {
      const AxisLabelComponent = chartAxisLabel({ axis: 'x' });
      updatedXAxisProps.axisLabelComponent = <AxisLabelComponent />;
    }

    xAxis = <ChartAxis {...updatedXAxisProps} animate={false} />;
  }

  /**
   * Generate Y Axis
   */
  if (Array.isArray(yAxisProps)) {
    yAxis = yAxisProps.map((axisProps, index) => {
      const updatedAxisProps = {
        ...axisProps
      };

      if (updatedAxisProps.label) {
        const AxisLabelComponent = chartAxisLabel({ axis: 'y', index });
        updatedAxisProps.axisLabelComponent = <AxisLabelComponent />;
      }

      return <ChartAxis key={`yaxis-${axisProps.orientation}`} {...updatedAxisProps} animate={false} />;
    });
  }

  const setChartElement = ({ chartType, props }) => {
    const { component: Component, ...defaultProps } =
      chartTypeDefaults[chartType] || chartTypeDefaults[ChartTypeVariant.area];
    return <Component {...{ ...defaultProps, ...props }} />;
  };

  chartElements = chartElementsProps?.elements.map(setChartElement);
  stackedChartElements = chartElementsProps?.stackedElements.map(setChartElement);

  return (
    <Chart
      animate={{ duration: 0 }}
      width={chartWidth}
      themeColor={themeColor}
      {...{ padding, containerComponent, ...chartDomain }}
    >
      {xAxis}
      {yAxis}
      {chartElements}
      <ChartStack>{stackedChartElements}</ChartStack>
    </Chart>
  );
};

/**
 * Prop types
 *
 * @type {{chartTypeDefaults:{}}}
 */
ChartElements.propTypes = {
  chartTypeDefaults: PropTypes.objectOf(
    PropTypes.shape({
      component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
      animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
      interpolation: PropTypes.oneOf(['monotoneX', 'step'])
    })
  )
};

/**
 * Default props
 *
 * @type {{chartTypeDefaults:{}}}
 */
ChartElements.defaultProps = {
  chartTypeDefaults: {
    [ChartTypeVariant.area]: {
      component: ChartArea,
      animate: {
        duration: 250,
        onLoad: { duration: 250 }
      },
      interpolation: 'monotoneX'
    },
    [ChartTypeVariant.line]: {
      component: ChartLine,
      animate: {
        duration: 250,
        onLoad: { duration: 250 }
      },
      interpolation: 'monotoneX'
    },
    [ChartTypeVariant.threshold]: {
      component: ChartThreshold,
      animate: {
        duration: 100,
        onLoad: { duration: 100 }
      },
      interpolation: 'step'
    }
  }
};

export { ChartElements as default, ChartElements };
