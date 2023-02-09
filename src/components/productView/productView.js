import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMount } from 'react-use';
import { routerContext } from '../router';
// import { PageLayout, PageHeader, PageColumns } from '../pageLayout/pageLayout';
import { ProductViewContext } from './productViewContext';
import { PageLayout, PageHeader, PageSection, PageToolbar, PageMessages, PageColumns } from '../pageLayout/pageLayout';
import { GraphCard } from '../graphCard/graphCard';
import { Toolbar } from '../toolbar/toolbar';
import { InventoryCard } from '../inventoryCard/inventoryCard';
import { InventoryCardHosts } from '../inventoryCard/inventoryCardHosts';
import { helpers } from '../../common';
import BannerMessages from '../bannerMessages/bannerMessages';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import { InventoryCardSubscriptions } from '../inventoryCardSubscriptions/inventoryCardSubscriptions';
import { RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as DISPLAY_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';
import { storeHooks } from '../../redux';

/**
 * Display product columns.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useRouteDetail
 * @param props.useSelector
 * @returns {Node}
 */
const ProductView = ({ t, useRouteDetail: useAliasRouteDetail, useSelector: useAliasSelector }) => {
  const { productGroup, productConfig } = useAliasRouteDetail();
  // const [] = useState();
  // useEffect(() => {}, []);
  // const { productGroup, productConfig } = detail || {};
  // useAliasRouteDetail();
  // const { productGroup, productConfig } = useAliasSelector(({ view }) => view?.product?.config, {});

  useMount(() => {
    console.log('>>>> PRODUCT VIEW MOUNTED', useAliasSelector, productGroup);
  });

  /**
   * Render a product with a context provider
   *
   * @param {object} config
   * @returns {React.ReactNode|null}
   */
  /*
  const renderProduct = config => {
    const { initialInventoryFilters, initialSubscriptionsInventoryFilters, productDisplay, productId, viewId } = config;

    if (!productId || !viewId) {
      return null;
    }

    return (
      <ProductViewContext.Provider value={config} key={`product_${productId}`}>
        <PageMessages>{productDisplay !== DISPLAY_TYPES.HOURLY && <BannerMessages />}</PageMessages>
        <PageToolbar>
          <Toolbar />
        </PageToolbar>
        <PageSection>
          <GraphCard />
        </PageSection>
        <PageSection className={(productDisplay === DISPLAY_TYPES.HOURLY && 'curiosity-page-section__tabs') || ''}>
          <InventoryTabs
            isDisabled={
              (!initialInventoryFilters && !initialSubscriptionsInventoryFilters) || helpers.UI_DISABLED_TABLE
            }
          >
            {!helpers.UI_DISABLED_TABLE_HOSTS &&
              productDisplay !== DISPLAY_TYPES.HOURLY &&
              productDisplay !== DISPLAY_TYPES.CAPACITY &&
              initialInventoryFilters && (
                <InventoryTab
                  key={`inventory_hosts_${productId}`}
                  title={t('curiosity-inventory.tabHosts', { context: [productId] })}
                >
                  <InventoryCardHosts />
                </InventoryTab>
              )}
            {!helpers.UI_DISABLED_TABLE_INSTANCES &&
              productDisplay !== DISPLAY_TYPES.DUAL_AXES &&
              productDisplay !== DISPLAY_TYPES.LEGACY &&
              productDisplay !== DISPLAY_TYPES.PARTIAL &&
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
  */
  const renderProduct = useCallback(() => {
    const updated = config => {
      console.log('>>>> PRODUCT VIEW', config);
      const { initialInventoryFilters, initialSubscriptionsInventoryFilters, productDisplay, productId, viewId } =
        config;

      if (!productId || !viewId) {
        return null;
      }

      return (
        <ProductViewContext.Provider value={config} key={`product_${productId}`}>
          <PageMessages>{productDisplay !== DISPLAY_TYPES.HOURLY && <BannerMessages />}</PageMessages>
          <PageToolbar>
            <Toolbar />
          </PageToolbar>
          <PageSection>
            <GraphCard />
          </PageSection>
          <PageSection className={(productDisplay === DISPLAY_TYPES.HOURLY && 'curiosity-page-section__tabs') || ''}>
            <InventoryTabs
              isDisabled={
                (!initialInventoryFilters && !initialSubscriptionsInventoryFilters) || helpers.UI_DISABLED_TABLE
              }
            >
              {!helpers.UI_DISABLED_TABLE_HOSTS &&
                productDisplay !== DISPLAY_TYPES.HOURLY &&
                productDisplay !== DISPLAY_TYPES.CAPACITY &&
                initialInventoryFilters && (
                  <InventoryTab
                    key={`inventory_hosts_${productId}`}
                    title={t('curiosity-inventory.tabHosts', { context: [productId] })}
                  >
                    <InventoryCardHosts />
                  </InventoryTab>
                )}
              {!helpers.UI_DISABLED_TABLE_INSTANCES &&
                productDisplay !== DISPLAY_TYPES.DUAL_AXES &&
                productDisplay !== DISPLAY_TYPES.LEGACY &&
                productDisplay !== DISPLAY_TYPES.PARTIAL &&
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

    return productConfig?.map(config => updated(config));
  }, [productConfig, t]);

  return (
    (productGroup && (
      <PageLayout>
        <PageHeader productLabel={productGroup}>
          {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: productGroup })}
        </PageHeader>
        <PageColumns>{renderProduct()}</PageColumns>
      </PageLayout>
    )) ||
    null
  );
};

/**
 * Prop types.
 *
 * @type {{t: translate, useRouteDetail: Function}}
 */
ProductView.propTypes = {
  t: PropTypes.func,
  useRouteDetail: PropTypes.func,
  useSelector: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: translate, useRouteDetail: Function}}
 */
ProductView.defaultProps = {
  t: translate,
  useRouteDetail: routerContext.useRouteDetail,
  useSelector: storeHooks.reactRedux.useSelector
};

export { ProductView as default, ProductView };
