import React, { useEffect } from 'react';
import { AlertVariant, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useProduct, useProductBillingAccountsQuery, useProductViewContext } from './productViewContext';
import { useSetBannerMessages } from '../bannerMessages/bannerMessagesContext';
import { reduxActions, storeHooks } from '../../redux';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';
import { translate } from '../i18n/i18nHelpers';

/**
 * Product view onload hooks. Hooks intended to fire AFTER product query and configuration is set.
 *
 * @memberof ProductViewOnload
 * @module ProductViewOnloadContext
 */

/**
 * Onload product apply conditional state dispatch services.
 *
 * @param {object} options
 * @param {reduxActions.rhsm.getBillingAccounts} [options.getBillingAccounts=reduxActions.rhsm.getBillingAccounts]
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProductViewContext} [options.useProductViewContext=useProductViewContext]
 * @param {useProductBillingAccountsQuery} [options.useProductBillingAccountsQuery=useProductBillingAccountsQuery]
 * @param {storeHooks.reactRedux.useSelectorsResponse} [options.useSelectorsResponse=useSelectorsResponse]
 * @returns {{data: object, productId: string, pending: boolean, isReady: boolean, fulfilled: boolean,
 *     responses: object}}
 */
const useProductOnload = ({
  getBillingAccounts = reduxActions.rhsm.getBillingAccounts,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProductViewContext: useAliasProductViewContext = useProductViewContext,
  useProductBillingAccountsQuery: useAliasProductBillingAccountsQuery = useProductBillingAccountsQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { onloadProduct, productId } = useAliasProductViewContext();
  const billingAccountsQuery = useAliasProductBillingAccountsQuery();
  const dispatch = useAliasDispatch();
  const isBillingAccountRequired =
    onloadProduct?.find(value => value === rhsmConstants.RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined;

  const selectors = [];
  if (isBillingAccountRequired) {
    selectors.push({ id: 'billing', selector: ({ app }) => app.billingAccounts?.[productId] });
  }
  const response = useAliasSelectorsResponse(selectors);

  useEffect(() => {
    if (isBillingAccountRequired) {
      dispatch(getBillingAccounts(productId, billingAccountsQuery));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBillingAccountRequired, productId]);

  return {
    ...response,
    isReady: !onloadProduct?.length || response?.fulfilled || false,
    productId
  };
};

/**
 * Apply a usage related banner notification per product variant
 *
 * @param {object} options
 * @param {translate} [options.t=translate]
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {storeHooks.reactRedux.useSelector} [options.useSelector=storeHooks.reactRedux.useSelector]
 * @param {useSetBannerMessages} [options.useSetBannerMessages=useSetBannerMessages]
 */
const useUsageBanner = ({
  t = translate,
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector,
  useSetBannerMessages: useAliasSetBannerMessages = useSetBannerMessages
} = {}) => {
  const setBannerMessages = useAliasSetBannerMessages();
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app.billingAccounts?.[productId], {});
  const isUsageError = data?.isUsageError || false;

  useEffect(() => {
    if (isUsageError === true) {
      const { firstProvider, firstProviderAccount, firstProviderNumberAccounts, numberProviders } = data.usageMetrics;

      setBannerMessages({
        variant: AlertVariant.warning,
        id: 'usage-warning',
        title: t('curiosity-banner.usage', { context: ['title'], product: productId }),
        message: t(
          'curiosity-banner.usage',
          {
            context: ['description'],
            count: (numberProviders >= 2 && 2) || (firstProviderNumberAccounts > 2 && 2) || 0,
            remaining: t('curiosity-banner.usage', {
              context: ['description', 'remaining', numberProviders >= 2 && 'provider'],
              count:
                (numberProviders === 2 && 1) ||
                (numberProviders > 2 && numberProviders - 1) ||
                (numberProviders === 2 && 1) ||
                (firstProviderNumberAccounts > 2 && firstProviderNumberAccounts - 1) ||
                0
            }),
            provider: t('curiosity-toolbar.label', {
              context: ['billing_provider', (firstProvider === '' && 'none') || firstProvider],
              value: firstProvider
            }),
            account: firstProviderAccount
          },
          [
            <strong />,
            <Button
              isInline
              component="a"
              variant="link"
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
              target="_blank"
              href={helpers.UI_LINK_USAGE_SUBSCRIPTIONS}
            />
          ]
        )
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsageError]);
};

const context = {
  useProductOnload,
  useUsageBanner
};

export { context as default, context, useProductOnload, useUsageBanner };
