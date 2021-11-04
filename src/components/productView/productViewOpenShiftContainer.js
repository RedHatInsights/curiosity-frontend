import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import { useRouteDetail } from '../../hooks/useRouter';
import { ProductViewContext } from './productViewContext';
import { PageLayout, PageColumns, PageHeader, PageSection, PageToolbar } from '../pageLayout/pageLayout';
import { RHSM_API_PATH_ID_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { apiQueries, storeHooks } from '../../redux';
import GraphCard from '../graphCard/graphCard';
import { SelectPosition } from '../form/select';
import { ToolbarFieldUom } from '../toolbar/toolbarFieldUom';
import { ToolbarFieldGranularity } from '../toolbar/toolbarFieldGranularity';
import { ToolbarFieldRangedMonthly } from '../toolbar/toolbarFieldRangedMonthly';
import { Toolbar } from '../toolbar/toolbar';
import InventoryList from '../inventoryList/inventoryList';
import InventorySubscriptions from '../inventorySubscriptions/inventorySubscriptions';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import { translate } from '../i18n/i18n';
import { helpers } from '../../common';

/**
 * An OpenShift Container Platform encompassing view.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useRouteDetail
 * @returns {Node}
 */
const ProductViewOpenShiftContainer = ({ t, useRouteDetail: useAliasRouteDetail }) => {
  const { productParameter: viewProductLabel, productConfig } = useAliasRouteDetail();
  const uomValue = storeHooks.reactRedux.useSelector(
    ({ view }) => view.query?.[productConfig[0].viewId]?.[RHSM_API_QUERY_TYPES.UOM],
    null
  );

  const renderProduct = (config, updatedUomValue) => {
    const {
      productContextFilterUom,
      query = {},
      graphTallyQuery = {},
      inventoryHostsQuery = {},
      inventorySubscriptionsQuery = {},
      initialGuestsFilters = [],
      initialInventoryFilters = [],
      initialInventorySettings = {},
      initialSubscriptionsInventoryFilters,
      productId,
      viewId
    } = config;

    if (!productId || !viewId) {
      return null;
    }

    const {
      graphTallyQuery: initialGraphTallyQuery,
      inventoryHostsQuery: initialInventoryHostsQuery,
      inventorySubscriptionsQuery: initialInventorySubscriptionsQuery
    } = apiQueries.parseRhsmQuery(query, { graphTallyQuery, inventoryHostsQuery, inventorySubscriptionsQuery });

    let inventoryFilters = initialInventoryFilters;
    let subscriptionsInventoryFilters = initialSubscriptionsInventoryFilters;
    let uomFilter;

    if (productContextFilterUom) {
      uomFilter = updatedUomValue || query[RHSM_API_QUERY_TYPES.UOM];

      const filter = ({ id, isOptional }) => {
        if (!isOptional) {
          return true;
        }
        return new RegExp(uomFilter, 'i').test(id);
      };

      inventoryFilters = initialInventoryFilters.filter(filter);
      subscriptionsInventoryFilters = initialSubscriptionsInventoryFilters.filter(filter);
    }

    const graphCardTitle = (
      <React.Fragment>
        {t('curiosity-graph.cardHeading', { context: productId })}
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
      </React.Fragment>
    );

    return (
      <ProductViewContext.Provider value={config} key={`product_${productId}_${uomFilter}`}>
        <PageToolbar>
          <Toolbar />
        </PageToolbar>
        <PageSection>
          <GraphCard
            key={`graph_${productId}`}
            query={initialGraphTallyQuery}
            productId={productId}
            viewId={viewId}
            cardTitle={graphCardTitle}
          >
            {productId === RHSM_API_PATH_ID_TYPES.OPENSHIFT && uomFilter && (
              <ToolbarFieldUom position={SelectPosition.right} />
            )}
            {productId === RHSM_API_PATH_ID_TYPES.OPENSHIFT && (
              <ToolbarFieldGranularity position={SelectPosition.right} />
            )}
            {productId === RHSM_API_PATH_ID_TYPES.OPENSHIFT_METRICS && (
              <ToolbarFieldRangedMonthly position={SelectPosition.right} />
            )}
          </GraphCard>
        </PageSection>
        <PageSection>
          <InventoryTabs key={`inventory_${productId}`} productId={productId}>
            <InventoryTab
              key={`inventory_hosts_${productId}`}
              title={t('curiosity-inventory.tabHosts', { context: ['noInstances', productId] })}
            >
              <InventoryList
                key={`inv_${productId}`}
                filterGuestsData={initialGuestsFilters}
                filterInventoryData={inventoryFilters}
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
                <InventorySubscriptions
                  key={`subs_${productId}`}
                  filterInventoryData={subscriptionsInventoryFilters}
                  productId={productId}
                  query={initialInventorySubscriptionsQuery}
                  viewId={viewId}
                />
              </InventoryTab>
            )}
          </InventoryTabs>
        </PageSection>
      </ProductViewContext.Provider>
    );
  };

  return (
    <PageLayout>
      <PageHeader productLabel={viewProductLabel}>
        {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: viewProductLabel })}
      </PageHeader>
      <PageColumns>{productConfig.map(config => renderProduct(config, uomValue))}</PageColumns>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{t: Function, useRouteDetail: Function}}
 */
ProductViewOpenShiftContainer.propTypes = {
  t: PropTypes.func,
  useRouteDetail: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: Function, useRouteDetail: Function}}
 */
ProductViewOpenShiftContainer.defaultProps = {
  t: translate,
  useRouteDetail
};

export { ProductViewOpenShiftContainer as default, ProductViewOpenShiftContainer };
