import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { useProduct } from '../productView/productViewContext';
import { useGraphCardContext } from './graphCardContext';
import { translate } from '../i18n/i18n';

/**
 * @memberof GraphCard
 * @module GraphCardChartTitleTooltip
 */

/**
 * Graph card title tooltip.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useGraphCardContext
 * @param {Function} props.useProduct
 * @returns {React.ReactNode}
 */
const GraphCardChartTitleTooltip = ({
  t,
  useGraphCardContext: useAliasGraphCardContext,
  useProduct: useAliasProduct
}) => {
  const { productId } = useAliasProduct();
  const { settings = {} } = useAliasGraphCardContext();
  const { isCardTitleDescription, isStandalone, metric } = settings;

  if (!isCardTitleDescription && !metric?.isCardTitleDescription) {
    return null;
  }

  return (
    <Tooltip
      content={
        <p>{t(`curiosity-graph.cardHeadingDescription`, { context: (isStandalone && metric?.id) || productId })}</p>
      }
      position={TooltipPosition.top}
      enableFlip={false}
      distance={5}
      entryDelay={100}
      exitDelay={0}
    >
      <span className="curiosity-icon__question">
        <OutlinedQuestionCircleIcon />
      </span>
    </Tooltip>
  );
};

/**
 * Prop types.
 *
 * @type {{useGraphCardContext: Function, useProduct: Function, t: Function}}
 */
GraphCardChartTitleTooltip.propTypes = {
  t: PropTypes.func,
  useProduct: PropTypes.func,
  useGraphCardContext: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGraphCardContext: Function, useProduct: Function, t: Function}}
 */
GraphCardChartTitleTooltip.defaultProps = {
  t: translate,
  useProduct,
  useGraphCardContext
};

export { GraphCardChartTitleTooltip as default, GraphCardChartTitleTooltip };
