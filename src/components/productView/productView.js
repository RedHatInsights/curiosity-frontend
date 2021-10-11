import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import { useRouteDetail } from '../../hooks/useRouter';
import { PageLayout, PageHeader, PageSection, PageToolbar, PageMessages } from '../pageLayout/pageLayout';
import { apiQueries } from '../../redux';
import { ConnectedGraphCard } from '../graphCard/graphCard';
import { ConnectedToolbar } from '../toolbar/toolbar';
import { ConnectedInventoryList } from '../inventoryList/inventoryList';
import { helpers } from '../../common';
import BannerMessages from '../bannerMessages/bannerMessages';
import { ToolbarFieldGranularity } from '../toolbar/toolbarFieldGranularity';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import { ConnectedInventorySubscriptions } from '../inventorySubscriptions/inventorySubscriptions';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * ToDo: base for default product layouts, add additional props for various toolbars
 * Next steps include...
 * Consider being able to pass customized toolbars for GraphCard and the
 * various Inventory displays. Have to evaluate how to handle the global toolbar, one
 * consideration is creating optional widgets with self-contained state update ability
 * based off of context/props/etc.
 *
 * Moving existing products to this layout, or maintaining them "as is", then renaming and
 * relocating them to this directory if they've been customized beyond a basic layout.
 */
/**
 * Display a product.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Node|boolean} props.toolbarGraph
 * @param {boolean} props.toolbarGraphDescription
 * @param {Node|boolean} props.toolbarProduct
 * @returns {Node}
 */
const ProductView = ({ t, toolbarGraph, toolbarGraphDescription, toolbarProduct }) => {
  const {
    pathParameter: productId,
    productConfig,
    productParameter: productLabel,
    viewParameter: viewId
  } = useRouteDetail();

  const {
    graphTallyQuery,
    inventoryHostsQuery,
    inventorySubscriptionsQuery,
    query,
    initialToolbarFilters,
    initialGraphFilters,
    initialGraphSettings,
    initialGuestsFilters,
    initialInventoryFilters,
    initialInventorySettings,
    initialSubscriptionsInventoryFilters
  } = productConfig?.[0] || {};

  if (!productId || !viewId) {
    return null;
  }

  const {
    query: initialQuery,
    graphTallyQuery: initialGraphTallyQuery,
    inventoryHostsQuery: initialInventoryHostsQuery,
    inventorySubscriptionsQuery: initialInventorySubscriptionsQuery,
    toolbarQuery: initialToolbarQuery
  } = apiQueries.parseRhsmQuery(query, { graphTallyQuery, inventoryHostsQuery, inventorySubscriptionsQuery });

  let graphCardTooltip = null;

  if (toolbarGraphDescription) {
    graphCardTooltip = (
      <Tooltip
        content={<p>{t('curiosity-graph.cardHeadingDescription', { context: productId })}</p>}
        position={TooltipPosition.top}
        enableFlip={false}
        distance={5}
        entryDelay={100}
        exitDelay={0}
      >
        <sup className="curiosity-icon__info">
          <InfoCircleIcon />
        </sup>
      </Tooltip>
    );
  }

  const graphCardTitle = (
    <React.Fragment>
      {t('curiosity-graph.cardHeading', { context: productId })}
      {graphCardTooltip}
    </React.Fragment>
  );

  return (
    <PageLayout>
      <PageHeader productLabel={productLabel}>
        {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: productLabel })}
      </PageHeader>
      <PageMessages>
        <BannerMessages productId={productId} viewId={viewId} query={initialQuery} />
      </PageMessages>
      <PageToolbar>
        {(React.isValidElement(toolbarProduct) && toolbarProduct) ||
          (toolbarProduct !== false && (
            <ConnectedToolbar
              filterOptions={initialToolbarFilters}
              productId={productId}
              query={initialToolbarQuery}
              viewId={viewId}
            />
          ))}
      </PageToolbar>
      <PageSection>
        <ConnectedGraphCard
          key={`graph_${productId}`}
          filterGraphData={initialGraphFilters}
          settings={initialGraphSettings}
          query={initialGraphTallyQuery}
          productId={productId}
          viewId={viewId}
          cardTitle={graphCardTitle}
          productLabel={productLabel}
        >
          {(React.isValidElement(toolbarGraph) && toolbarGraph) ||
            (toolbarGraph !== false && (
              <ToolbarFieldGranularity
                viewId={viewId}
                value={initialGraphTallyQuery[RHSM_API_QUERY_TYPES.GRANULARITY]}
              />
            ))}
        </ConnectedGraphCard>
      </PageSection>
      <PageSection>
        <InventoryTabs key={`inventory_${productId}`} productId={productId}>
          <InventoryTab
            key={`inventory_hosts_${productId}`}
            title={t('curiosity-inventory.tabHosts', { context: ['noInstances', productId] })}
          >
            <ConnectedInventoryList
              key={`inv_${productId}`}
              filterGuestsData={initialGuestsFilters}
              filterInventoryData={initialInventoryFilters}
              productId={productId}
              settings={initialInventorySettings}
              query={initialInventoryHostsQuery}
              viewId={viewId}
            />
          </InventoryTab>
          {initialSubscriptionsInventoryFilters && (
            <InventoryTab
              key={`inventory_subs_${productId}`}
              title={t('curiosity-inventory.tabSubscriptions', { context: productId })}
            >
              <ConnectedInventorySubscriptions
                key={`subs_${productId}`}
                filterInventoryData={initialSubscriptionsInventoryFilters}
                productId={productId}
                query={initialInventorySubscriptionsQuery}
                viewId={viewId}
              />
            </InventoryTab>
          )}
        </InventoryTabs>
      </PageSection>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{t: translate, toolbarGraph: (Node|boolean), toolbarGraphDescription: boolean, productConfig: object,
 *    toolbarProduct: (Node|boolean)}}
 */
ProductView.propTypes = {
  t: PropTypes.func,
  toolbarGraph: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  toolbarGraphDescription: PropTypes.bool,
  toolbarProduct: PropTypes.oneOfType([PropTypes.node, PropTypes.bool])
};

/**
 * Default props.
 *
 * @type {{t: translate, toolbarGraph: (Node|boolean), toolbarGraphDescription: boolean, toolbarProduct: (Node|boolean)}}
 */
ProductView.defaultProps = {
  t: translate,
  toolbarGraph: null,
  toolbarGraphDescription: false,
  toolbarProduct: null
};

export { ProductView as default, ProductView };
