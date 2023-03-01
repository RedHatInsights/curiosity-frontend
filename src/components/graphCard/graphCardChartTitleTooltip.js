import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
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
 * @returns {React.ReactNode}
 */
const GraphCardChartTitleTooltip = ({ t, useGraphCardContext: useAliasGraphCardContext }) => {
  const { settings = {} } = useAliasGraphCardContext();
  const { isCardTitleDescription, stringId } = settings;

  if (!isCardTitleDescription) {
    return null;
  }

  return (
    <Tooltip
      content={<p>{t(`curiosity-graph.cardHeadingDescription`, { context: stringId })}</p>}
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
 * @type {{useGraphCardContext: Function, t: Function}}
 */
GraphCardChartTitleTooltip.propTypes = {
  t: PropTypes.func,
  useGraphCardContext: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGraphCardContext: Function, t: Function}}
 */
GraphCardChartTitleTooltip.defaultProps = {
  t: translate,
  useGraphCardContext
};

export { GraphCardChartTitleTooltip as default, GraphCardChartTitleTooltip };
