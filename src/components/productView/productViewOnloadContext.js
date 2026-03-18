import React, { useEffect } from 'react';
import { AlertVariant, AlertActionLink, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useProduct, useProductBillingAccountsQuery, useProductViewContext } from './productViewContext';
import { BannerMessagesModal, useSetBannerMessages } from '../bannerMessages/bannerMessages';
import { reduxActions, storeHooks } from '../../redux';
import { bannersConfig } from '../../config';
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
      const { firstProvider, firstProviderAccount, uniqueAccountsProvidersList = [] } = data?.usageMetrics || {};

      const numberAccounts = uniqueAccountsProvidersList.length;
      const isMultipleAccounts = numberAccounts >= 2;
      const remainingAccounts = numberAccounts - 1;

      const modalTitle = t('curiosity-banner.usage', {
        context: ['modal', 'title'],
        count: numberAccounts
      });

      const modalContent = (
        <label aria-live="polite">
          <p>
            {t(
              'curiosity-banner.usage',
              {
                context: ['modal', 'description'],
                count: numberAccounts
              },
              [
                <Button
                  data-test="bannerUsageLearnMoreLink"
                  isInline
                  component="a"
                  variant="link"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  target="_blank"
                  href={helpers.UI_LINK_USAGE_SUBSCRIPTIONS}
                />
              ]
            )}
          </p>
          <textarea
            data-test="bannerUsageAccountsProvidersList"
            className="curiosity-error__textarea"
            readOnly
            rows="10"
            value={JSON.stringify(uniqueAccountsProvidersList, null, 2)}
          />
        </label>
      );

      setBannerMessages({
        variant: AlertVariant.warning,
        dataTest: 'bannerUsage',
        id: 'usage-warning',
        title: t('curiosity-banner.usage', {
          context: ['alert', 'title'],
          product: productId
        }),
        actionLinks: (
          <React.Fragment>
            <BannerMessagesModal
              alertVariant={AlertVariant.warning}
              modalTitle={modalTitle}
              modalContent={modalContent}
            >
              {t('curiosity-banner.usage', { context: ['alert', 'link', 'modal'] })}
            </BannerMessagesModal>
            <AlertActionLink
              data-test="bannerUsageLearnMoreLink"
              component="a"
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
              target="_blank"
              href={helpers.UI_LINK_USAGE_SUBSCRIPTIONS}
            >
              {t('curiosity-banner.usage', { context: ['alert', 'link'] })}
            </AlertActionLink>
          </React.Fragment>
        ),
        message: t(
          'curiosity-banner.usage',
          {
            context: ['alert', 'description'],
            count: (isMultipleAccounts && numberAccounts) || 1,
            remaining: t('curiosity-banner.usage', {
              context: ['alert', 'description', 'remaining'],
              count: (isMultipleAccounts && remainingAccounts) || 1
            }),
            provider: t('curiosity-toolbar.label', {
              context: ['billing_provider', (firstProvider === '' && 'none') || firstProvider],
              value: firstProvider
            }),
            account: firstProviderAccount
          },
          [<strong />]
        )
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsageError]);
};

/**
 * Apply configurable banners per product variant
 *
 * @param {object} options
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {useSetBannerMessages} [options.useSetBannerMessages=useSetBannerMessages]
 */
const useConfigBanners = ({
  useProduct: useAliasProduct = useProduct,
  useSetBannerMessages: useAliasSetBannerMessages = useSetBannerMessages
} = {}) => {
  const setBannerMessages = useAliasSetBannerMessages();
  const { productId } = useAliasProduct();

  useEffect(() => {
    bannersConfig.forEach(banner => {
      const { id, title, message, variant, dataTest, productIds, condition, actions } = banner;

      const isAssociated = !productIds || productIds.includes(productId);
      const isConditionMet = !condition || condition({ productId });

      if (isAssociated && isConditionMet) {
        setBannerMessages({
          id: `${productId}-${id}`,
          title: typeof title === 'function' ? title({ productId }) : title,
          message: typeof message === 'function' ? message({ productId }) : message,
          variant: variant || AlertVariant.info,
          dataTest,
          actionLinks:
            (actions?.length && (
              <React.Fragment>
                {actions.map((action, index) => (
                  <AlertActionLink
                    key={helpers.generateHash(`${productId}-${id}-action-${index}`)}
                    data-test={`${dataTest}-action-${index}`}
                    component={action.href ? 'a' : 'button'}
                    href={action.href}
                    onClick={action.onClick}
                    icon={action.isExternal ? <ExternalLinkAltIcon /> : undefined}
                    iconPosition="right"
                    target={action.isExternal ? '_blank' : undefined}
                  >
                    {typeof action.title === 'function' ? action.title({ productId }) : action.title}
                  </AlertActionLink>
                ))}
              </React.Fragment>
            )) ||
            undefined
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);
};

const context = {
  useProductOnload,
  useUsageBanner,
  useConfigBanners
};

export { context as default, context, useProductOnload, useUsageBanner, useConfigBanners };
