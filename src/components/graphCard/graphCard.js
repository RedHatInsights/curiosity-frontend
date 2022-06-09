import React from 'react';
import PropTypes from 'prop-types';
import { useProduct, useProductGraphConfig } from '../productView/productViewContext';
import { helpers } from '../../common';
import { GraphCardMetricTotals } from './graphCardMetricTotals';
import { GraphCardChart } from './graphCardChart';
import { GraphCardContext } from './graphCardContext';
import { graphCardHelpers } from './graphCardHelpers';

/**
 * Set up graph cards. Expand filters with base graph settings.
 *
 * @param {object} props
 * @param {boolean} props.isDisabled
 * @param {Function} props.useProduct
 * @param {Function} props.useProductGraphConfig
 * @returns {Node}
 */
const GraphCard = ({ isDisabled, useProduct: useAliasProduct, useProductGraphConfig: useAliasProductGraphConfig }) => {
  const { productId } = useAliasProduct();
  const { filters, settings } = useAliasProductGraphConfig();
  const { groupedFiltersSettings, standaloneFiltersSettings } = graphCardHelpers.generateChartSettings({
    filters,
    settings,
    productId
  });

  if (isDisabled) {
    return null;
  }

  return (
    <React.Fragment>
      {(groupedFiltersSettings && (
        <GraphCardContext.Provider value={groupedFiltersSettings}>
          <GraphCardChart />
        </GraphCardContext.Provider>
      )) ||
        null}
      {standaloneFiltersSettings?.map(filtersSettings => (
        <GraphCardContext.Provider key={`graphCard_${filtersSettings?.settings?.metric?.id}`} value={filtersSettings}>
          <GraphCardMetricTotals>
            <GraphCardChart />
          </GraphCardMetricTotals>
        </GraphCardContext.Provider>
      ))}
    </React.Fragment>
  );
};

/**
 * Prop types.
 *
 * @type {{useProduct: Function, useProductGraphConfig: Function, isDisabled: boolean}}
 */
GraphCard.propTypes = {
  isDisabled: PropTypes.bool,
  useProduct: PropTypes.func,
  useProductGraphConfig: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, useProductGraphConfig: Function, isDisabled: boolean}}
 */
GraphCard.defaultProps = {
  isDisabled: helpers.UI_DISABLED_GRAPH,
  useProduct,
  useProductGraphConfig
};

export { GraphCard as default, GraphCard };
