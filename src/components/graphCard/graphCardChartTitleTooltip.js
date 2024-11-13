import React from 'react';
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
 * @param {translate} [props.t=translate]
 * @param {useGraphCardContext} [props.useGraphCardContext=useGraphCardContext]
 * @returns {JSX.Element}
 */
const GraphCardChartTitleTooltip = ({
  t = translate,
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext
}) => {
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
      entryDelay={100}
      exitDelay={0}
    >
      <span className="curiosity-icon__question">
        <OutlinedQuestionCircleIcon />
      </span>
    </Tooltip>
  );
};

export { GraphCardChartTitleTooltip as default, GraphCardChartTitleTooltip };
