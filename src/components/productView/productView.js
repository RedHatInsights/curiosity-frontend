import React, { useCallback } from 'react';
import { Button } from '@patternfly/react-core';
import { routerContext } from '../router';
import { ProductViewContext } from './productViewContext';
import { PageLayout, PageHeader, PageSection, PageToolbar, PageMessages, PageColumns } from '../pageLayout/pageLayout';
import { GraphCard } from '../graphCard/graphCard';
import { Toolbar } from '../toolbar/toolbar';
import { helpers } from '../../common';
import BannerMessages from '../bannerMessages/bannerMessages';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import { InventoryCardInstances } from '../inventoryCardInstances/inventoryCardInstances';
import { InventoryCardSubscriptions } from '../inventoryCardSubscriptions/inventoryCardSubscriptions';
import { translate } from '../i18n/i18n';
import { ProductViewMissing } from './productViewMissing';

/**
 * Primary product display component, and config context provider.
 *
 * @memberof Components
 * @module ProductView
 * @property {module} ProductViewContext
 * @property {module} ProductViewMissing
 */

/**
 * ToDo: review removing the "useCallback" once the routing updates are in place
 */
/**
 * Display products.
 *
 * @param {object} props
 * @param {translate} [props.t=translate]
 * @param {routerContext.useRouteDetail} [props.useRouteDetail=routerContext.useRouteDetail]
 * @returns {JSX.Element}
 */
const ProductView = ({ t = translate, useRouteDetail: useAliasRouteDetail = routerContext.useRouteDetail }) => {
  const { disableIsClosestMatch, firstMatch, productGroup } = useAliasRouteDetail();

  const renderProduct = useCallback(() => {
    const updated = config => {
      const { initialInventoryFilters, initialSubscriptionsInventoryFilters, productId, viewId } = config;

      if (!productId || !viewId) {
        return null;
      }

      return (
        <ProductViewContext.Provider value={config}>
          <PageMessages>
            <BannerMessages />
          </PageMessages>
          <PageToolbar>
            <Toolbar />
          </PageToolbar>
          <PageSection className="curiosity-page-section__graphs">
            <GraphCard />
          </PageSection>
          <PageSection className="curiosity-page-section__tabs">
            <InventoryTabs
              isDisabled={
                (!initialInventoryFilters && !initialSubscriptionsInventoryFilters) || helpers.UI_DISABLED_TABLE
              }
            >
              {!helpers.UI_DISABLED_TABLE_INSTANCES && initialInventoryFilters && (
                <InventoryTab
                  key={`inventory_instances_${productId}`}
                  title={t('curiosity-inventory.tabInstances', { context: [productId] })}
                >
                  <InventoryCardInstances />
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

    return updated(firstMatch);
  }, [firstMatch, t]);

  if (disableIsClosestMatch) {
    return <ProductViewMissing />;
  }

  return (
    (productGroup && (
      <PageLayout>
        <PageHeader productLabel={productGroup}>
          {t('curiosity-view.title', { appName: helpers.UI_DISPLAY_NAME, context: productGroup })}
        </PageHeader>
        <PageColumns>{renderProduct()}</PageColumns>
        <div className="curiosity-page-section__version">
          <Button
            className="curiosity-page-section__version-link"
            isInline
            component="a"
            variant="link"
            target="_blank"
            href={helpers.UI_LINK_CHANGELOG}
          >
            {t('curiosity-view.version', { guiVersion: helpers.UI_VERSION })}
          </Button>
        </div>
      </PageLayout>
    )) ||
    null
  );
};

export { ProductView as default, ProductView };
