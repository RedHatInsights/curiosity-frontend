import React from 'react';
import PropTypes from 'prop-types';
import { PageLayout, PageHeader, PageSection, PageToolbar, PageMessages } from '../pageLayout/pageLayout';
import {
  useQuery,
  useGraphTallyQuery,
  useInventoryHostsQuery,
  useInventorySubscriptionsQuery,
  useProductContext
} from './productContext';
import { ConnectedGraphCard, GraphCard } from '../graphCard/graphCard';
import { ConnectedToolbar, Toolbar } from '../toolbar/toolbar';
import { ConnectedInventoryList, InventoryList } from '../inventoryList/inventoryList';
import { helpers } from '../../common';
import BannerMessages from '../bannerMessages/bannerMessages';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import {
  ConnectedInventorySubscriptions,
  InventorySubscriptions
} from '../inventorySubscriptions/inventorySubscriptions';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES,
  RHSM_API_QUERY_TYPES
} from '../../types/rhsmApiTypes';
import { GuestsList } from '../guestsList/guestsList';
import { translate } from '../i18n/i18n';

/**
 * Display a product.
 *
 * @param {object} props
 * @param {Node} props.graphCardToolbar
 * @param {Function} props.t
 * @returns {Node}
 */
const ProductView = ({ graphCardToolbar, t }) => {
  const {
    initialToolbarFilters,
    initialGraphFilters,
    initialGuestsFilters,
    initialInventoryFilters,
    initialInventorySettings,
    initialSubscriptionsInventoryFilters,
    productId,
    productLabel,
    viewId
  } = useProductContext();
  const initialQuery = useQuery();
  const initialGraphTallyQuery = useGraphTallyQuery();
  const initialInventoryHostsQuery = useInventoryHostsQuery();
  const initialInventorySubscriptionsQuery = useInventorySubscriptionsQuery();

  if (!productId || !viewId) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader productLabel={productLabel} includeTour>
        {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: productLabel })}
      </PageHeader>
      <PageMessages>
        <BannerMessages productId={productId} viewId={viewId} query={initialQuery} />
      </PageMessages>
      <PageToolbar>
        <ConnectedToolbar
          filterOptions={initialToolbarFilters}
          productId={productId}
          query={initialQuery}
          viewId={viewId}
        />
      </PageToolbar>
      <PageSection>
        <ConnectedGraphCard
          key={productId}
          filterGraphData={initialGraphFilters}
          query={initialGraphTallyQuery}
          productId={productId}
          viewId={viewId}
          cardTitle={t('curiosity-graph.socketsHeading')}
          productLabel={productLabel}
        >
          {graphCardToolbar}
        </ConnectedGraphCard>
      </PageSection>
      <PageSection>
        <InventoryTabs productId={productId}>
          <InventoryTab key="hostsTab" title={t('curiosity-inventory.tab', { context: 'hosts' })}>
            <ConnectedInventoryList
              key={productId}
              filterGuestsData={initialGuestsFilters}
              filterInventoryData={initialInventoryFilters}
              productId={productId}
              settings={initialInventorySettings}
              query={initialInventoryHostsQuery}
              viewId={viewId}
            />
          </InventoryTab>
          {!helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS && (
            <InventoryTab key="subscriptionsTab" title={t('curiosity-inventory.tab', { context: 'subscriptions' })}>
              <ConnectedInventorySubscriptions
                key={productId}
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
 * @type {{graphCardToolbar: Node, t: Function, routeDetail: object, productConfig: object}}
 */
ProductView.propTypes = {
  graphCardToolbar: PropTypes.node,
  productConfig: PropTypes.shape({
    graphTallyQuery: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
    }),
    inventoryHostsQuery: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SORT_TYPES)]),
      [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
    }),
    inventorySubscriptionsQuery: PropTypes.shape({
      [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
      [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES)]),
      [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
    }),
    query: PropTypes.object,
    initialToolbarFilters: Toolbar.propTypes.filterOptions,
    initialGraphFilters: GraphCard.propTypes.filterGraphData,
    initialGuestsFilters: GuestsList.propTypes.filterGuestsData,
    initialInventoryFilters: InventoryList.propTypes.filterInventoryData,
    initialInventorySettings: InventoryList.propTypes.settings,
    initialSubscriptionsInventoryFilters: InventorySubscriptions.propTypes.filterInventoryData,
    productId: PropTypes.string,
    productLabel: PropTypes.string,
    viewId: PropTypes.string
  }),
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{graphCardToolbar: Node, t: translate}}
 */
ProductView.defaultProps = {
  productConfig: {},
  graphCardToolbar: null,
  t: translate
};

export { ProductView as default, ProductView };
