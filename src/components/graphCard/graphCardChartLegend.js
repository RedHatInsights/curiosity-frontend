import React from 'react';
import { Button, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { useMount } from 'react-use';
import { useProduct } from '../productView/productViewContext';
import { useGraphCardContext } from './graphCardContext';
import { reduxTypes, storeHooks } from '../../redux';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { ChartIcon } from '../chart/chartIcon';

/**
 * @memberof GraphCard
 * @module GraphCardChartLegend
 */

/**
 * FixMe: PF button disabled borks events on immediate parent nodes, such as tooltip wrappers
 * PF is using "pointer-events: none" styling when disabled is activated. This
 * currently affects events on immediate parent nodes.
 */
/**
 * A custom chart legend.
 *
 * @fires onClick
 * @param {object} props
 * @param {{ hide: Function, toggle: Function,
 *     isToggled: Function }} [props.chart={ hide:helpers.noop, toggle:helpers.noop, isToggled:helpers.noop}]
 * @param {{ dataSets: Array<{ data: Array|undefined, id: string,
 *     isThreshold: boolean|undefined, stroke: string }>}} [props.datum={ dataSets:[] }]
 * @param {translate} [props.t=translate]
 * @param {storeHooks.reactRedux.useDispatch} [props.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useGraphCardContext} [props.useGraphCardContext=useGraphCardContext]
 * @param {useProduct} [props.useProduct=useProduct]
 * @param {storeHooks.reactRedux.useSelectors} [props.useSelectors=storeHooks.reactRedux.useSelectors]
 * @returns {JSX.Element}
 */
const GraphCardChartLegend = ({
  chart = { hide: helpers.noop, toggle: helpers.noop, isToggled: helpers.noop },
  datum = { dataSets: [] },
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useProduct: useAliasProduct = useProduct,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
}) => {
  const { settings = {} } = useAliasGraphCardContext();
  const { productId, productLabel } = useAliasProduct();
  const { isDisabledLegendClick } = settings;

  const dispatch = useAliasDispatch();
  const [invertedLegendItem, ...legendItems] = useAliasSelectors([
    ({ graph }) => graph.legend?.[`${productId}-inverted`],
    ...datum.dataSets.map(
      ({ id }) =>
        ({ graph }) =>
          graph.legend?.[id]
    )
  ]);

  useMount(() => {
    datum.dataSets.forEach(({ id, isToolbarFilter }, index) => {
      if (invertedLegendItem && isToolbarFilter) {
        if (!new RegExp(invertedLegendItem).test(id)) {
          chart.hide(id);
        }
      } else {
        const checkIsToggled = legendItems?.[index] || chart.isToggled(id);

        if (checkIsToggled) {
          chart.hide(id);
        }
      }
    });
  });

  /**
   * Toggle legend item and chart.
   *
   * @event onClick
   * @param {string} id
   */
  const onClick = id => {
    const updatedToggle = chart.toggle(id);

    dispatch({
      type: reduxTypes.graph.SET_GRAPH_LEGEND,
      id,
      value: updatedToggle
    });
  };

  return (
    <React.Fragment>
      {datum.dataSets.map(({ id, isThreshold, stroke: color, data = [] }, index) => {
        const isDisabled =
          !data.find(({ y, hasData }) => (y >= 0 && hasData === true) || (y >= 0 && isThreshold === true)) || false;

        const labelContent = t([`curiosity-graph.label`, 'curiosity-graph.label_no'], {
          product: productLabel,
          context: id
        });

        const tooltipContent = t(
          `curiosity-graph.legendTooltip`,
          {
            product: productLabel,
            context: id
          },
          [<span style={{ whiteSpace: 'nowrap' }} />]
        );

        const checkIsToggled = legendItems?.[index] || chart.isToggled(id);
        const buttonActionProps = {};

        if (!isDisabledLegendClick) {
          buttonActionProps.onClick = () => onClick(id);
          buttonActionProps.onKeyPress = () => onClick(id);
        }

        const button = (
          <Button
            {...buttonActionProps}
            className="curiosity-graph__legend-item curiosity-usage-graph__legend-item"
            tabIndex={0}
            key={`curiosity-button-${id}`}
            variant="link"
            component="a"
            isDisabled={isDisabledLegendClick ?? isDisabled}
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
              key={`curiosity-tooltip-${id}`}
              content={<p>{tooltipContent}</p>}
              position={TooltipPosition.top}
              enableFlip
            >
              <span className="pf-c-button pf-m-link curiosity-graph__legend-item-wrapper curiosity-usage-graph__legend-item-wrapper">
                {button}
              </span>
            </Tooltip>
          );
        }

        return button;
      })}
    </React.Fragment>
  );
};

export { GraphCardChartLegend as default, GraphCardChartLegend };
