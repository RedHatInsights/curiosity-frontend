import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import { useRouteDetail } from '../../hooks/useRouter';
import { ProductViewContext } from './productViewContext';
import { PageLayout, PageHeader, PageSection, PageToolbar, PageMessages, PageColumns } from '../pageLayout/pageLayout';
import { apiQueries } from '../../redux';
import { ConnectedGraphCard as ConnectedGraphCardDeprecated } from '../graphCard/graphCard.deprecated';
import { GraphCard } from '../graphCard/graphCard';
import { Toolbar } from '../toolbar/toolbar';
import { ConnectedInventoryList as ConnectedInventoryListDeprecated } from '../inventoryCard/inventoryList.deprecated';
import { InventoryCard } from '../inventoryCard/inventoryCard';
import { InventoryCardHosts } from '../inventoryCard/inventoryCardHosts';
import { helpers } from '../../common';
import BannerMessages from '../bannerMessages/bannerMessages';
import { SelectPosition } from '../form/select';
import { ToolbarFieldGranularity } from '../toolbar/toolbarFieldGranularity';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import { InventoryCardSubscriptions } from '../inventoryCardSubscriptions/inventoryCardSubscriptions';
import { RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES } from '../../services/rhsm/rhsmConstants';
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
 * Display product columns.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Node|boolean} props.toolbarGraph
 * @param {boolean} props.toolbarGraphDescription
 * @param {Function} props.useRouteDetail
 * @returns {Node}
 */
const ProductView = ({ t, toolbarGraph, toolbarGraphDescription, useRouteDetail: useAliasRouteDetail }) => {
  const { productParameter: routeProductLabel, productConfig } = useAliasRouteDetail();

  const renderProduct = config => {
    const {
      graphTallyQuery,
      inventoryHostsQuery,
      inventorySubscriptionsQuery,
      query,
      initialGuestsFilters,
      initialInventoryFilters,
      initialInventorySettings,
      initialSubscriptionsInventoryFilters,
      productDisplay,
      productId,
      viewId
    } = config;

    if (!productId || !viewId) {
      return null;
    }

    const { graphTallyQuery: initialGraphTallyQuery, inventoryHostsQuery: initialInventoryHostsQuery } =
      apiQueries.parseRhsmQuery(query, { graphTallyQuery, inventoryHostsQuery, inventorySubscriptionsQuery });

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
      <ProductViewContext.Provider value={config} key={`product_${productId}`}>
        <PageMessages>{productDisplay !== DISPLAY_TYPES.HOURLY && <BannerMessages />}</PageMessages>
        <PageToolbar>
          <Toolbar />
        </PageToolbar>
        <PageSection>
          {productDisplay !== DISPLAY_TYPES.HOURLY && productDisplay !== DISPLAY_TYPES.PARTIAL && (
            <ConnectedGraphCardDeprecated
              key={`graph_${productId}`}
              query={initialGraphTallyQuery}
              productId={productId}
              viewId={viewId}
              cardTitle={graphCardTitle}
            >
              {(React.isValidElement(toolbarGraph) && toolbarGraph) ||
                (toolbarGraph !== false && <ToolbarFieldGranularity position={SelectPosition.right} />)}
            </ConnectedGraphCardDeprecated>
          )}
          {(productDisplay === DISPLAY_TYPES.HOURLY && <GraphCard />) ||
            (productDisplay === DISPLAY_TYPES.PARTIAL && <GraphCard />)}
        </PageSection>
        <PageSection className={(productDisplay === DISPLAY_TYPES.HOURLY && 'curiosity-page-section__tabs') || ''}>
          <InventoryTabs
            key={`inventory_${productId}`}
            productId={productId}
            isDisabled={
              (!initialInventoryFilters && !initialSubscriptionsInventoryFilters) || helpers.UI_DISABLED_TABLE
            }
          >
            {!helpers.UI_DISABLED_TABLE_HOSTS &&
              productDisplay !== DISPLAY_TYPES.HOURLY &&
              productDisplay !== DISPLAY_TYPES.PARTIAL &&
              initialInventoryFilters && (
                <InventoryTab
                  key={`inventory_hosts_${productId}`}
                  title={t('curiosity-inventory.tabHosts', { context: [productId] })}
                >
                  <ConnectedInventoryListDeprecated
                    key={`inv_${productId}`}
                    filterGuestsData={initialGuestsFilters}
                    filterInventoryData={initialInventoryFilters}
                    productId={productId}
                    settings={initialInventorySettings}
                    query={initialInventoryHostsQuery}
                    viewId={viewId}
                  />
                </InventoryTab>
              )}
            {!helpers.UI_DISABLED_TABLE_HOSTS && productDisplay === DISPLAY_TYPES.PARTIAL && initialInventoryFilters && (
              <InventoryTab
                key={`inventory_instances_${productId}`}
                title={t('curiosity-inventory.tabHosts', { context: [productId] })}
              >
                <InventoryCardHosts />
              </InventoryTab>
            )}
            {!helpers.UI_DISABLED_TABLE_INSTANCES &&
              productDisplay === DISPLAY_TYPES.HOURLY &&
              initialInventoryFilters && (
                <InventoryTab
                  key={`inventory_instances_${productId}`}
                  title={t('curiosity-inventory.tabInstances', { context: [productId] })}
                >
                  <InventoryCard />
                </InventoryTab>
              )}
            {!helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS && initialSubscriptionsInventoryFilters && (
              <InventoryTab
                key={`inventory_subs_${productId}`}
                title={t('curiosity-inventory.tabSubscriptions', { context: [productId] })}
              >
                <InventoryCardSubscriptions />
              </InventoryTab>
            )}
          </InventoryTabs>
        </PageSection>
      </ProductViewContext.Provider>
    );
  };

  return (
    <PageLayout>
      <PageHeader productLabel={routeProductLabel}>
        {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: routeProductLabel })}
      </PageHeader>
      <PageColumns>{productConfig.map(config => renderProduct(config))}</PageColumns>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{t: translate, toolbarGraph: (Node|boolean), toolbarGraphDescription: boolean, useRouteDetail: Function}}
 */
ProductView.propTypes = {
  t: PropTypes.func,
  toolbarGraph: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  toolbarGraphDescription: PropTypes.bool,
  useRouteDetail: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: translate, toolbarGraph: (Node|boolean), toolbarGraphDescription: boolean, useRouteDetail: Function}}
 */
ProductView.defaultProps = {
  t: translate,
  toolbarGraph: null,
  toolbarGraphDescription: false,
  useRouteDetail
};

export { ProductView as default, ProductView };
