import React, { useCallback, useEffect } from 'react';
import { useMount, useUnmount } from 'react-use';
import { Button } from '@patternfly/react-core';
import { LRUCache } from 'lru-cache';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { NotificationsContext, NotificationVariant } from '../notifications/notifications';
import { PLATFORM_API_EXPORT_POST_TYPES as POST_TYPES } from '../../services/platform/platformConstants';
import { translate } from '../i18n/i18n';
import { useAppLoad } from '../../hooks/useApp';
import { helpers } from '../../common';

/**
 * @memberof ToolbarFieldExport
 * @module ToolbarFieldExportContext
 */

/**
 * Cache store for confirming if the existing exports checked fired.
 *
 * If the page/UI is not refreshed, the cache will reset after 5 minutes and allow future checks.
 *
 * @type {object}
 */
const exportCache = new LRUCache({
  ttl: 300000,
  max: 1,
  updateAgeOnGet: true
});

/**
 * Apply an export hook for an export post. The service automatically sets up polling, then force downloads the file.
 *
 * @param {object} options
 * @param {reduxActions.platform.createExport} options.createExport
 * @param {translate} options.t
 * @param {useAppLoad} options.useAppLoad
 * @param {storeHooks.reactRedux.useDispatch} options.useDispatch
 * @param {NotificationsContext.useNotifications} options.useNotifications
 * @returns {Function}
 */
const useExport = ({
  createExport: createAliasExport = reduxActions.platform.createExport,
  t = translate,
  useAppLoad: useAliasAppLoad = useAppLoad,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useNotifications: useAliasNotifications = NotificationsContext.useNotifications
} = {}) => {
  const dispatch = useAliasDispatch();
  const confirmAppLoaded = useAliasAppLoad();
  const { addNotification } = useAliasNotifications();

  return useCallback(
    async (productId, data) => {
      if (!confirmAppLoaded()) {
        return;
      }

      // assume default pending state
      dispatch({
        type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
        id: productId,
        isPending: true,
        isSelectUpdated: true,
        pending: [{ format: data?.[POST_TYPES.FORMAT] }]
      });

      // assume default pending notification
      addNotification({
        swatchId: 'swatch-exports-individual-status',
        variant: NotificationVariant.info,
        title: t('curiosity-toolbar.notifications', {
          context: ['export', 'pending', 'title'],
          testId: 'exportNotification-individual-pending'
        })
      });

      try {
        const response = await dispatch(createAliasExport(productId, data));
        const {
          completed = [],
          isCompleted,
          isFailed,
          pending = [],
          failed = []
        } = response?.value?.data?.data?.products?.[productId] || {};

        // Display completed or failed notifications
        if (isCompleted || isFailed) {
          const exportVariant = (isFailed && NotificationVariant.danger) || NotificationVariant.success;
          const exportStatus = (isFailed && 'failed') || 'completed';
          const exportFile = (isFailed && failed?.[0]?.fileName) || completed?.[0]?.fileName;

          addNotification({
            swatchId: 'swatch-exports-individual-status',
            variant: exportVariant,
            title: t('curiosity-toolbar.notifications', {
              context: ['export', exportStatus, 'title'],
              testId: `exportNotification-individual-${exportStatus}`
            }),
            description: t(
              'curiosity-toolbar.notifications',
              {
                context: ['export', exportStatus, 'description'],
                fileName: exportFile
              },
              [<Button isInline component="a" variant="link" target="_blank" href={helpers.UI_LINK_PLATFORM_STATUS} />]
            )
          });
        }

        // Dispatch to reset product-specific dropdown display options for export loading/pending status
        dispatch([
          {
            type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
            id: productId,
            pending
          }
        ]);
      } catch (error) {
        addNotification({
          swatchId: 'swatch-exports-individual-status',
          variant: NotificationVariant.warning,
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'error', 'title'],
            testId: 'exportNotification-individual-error'
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'error', 'description']
          })
        });

        dispatch([{ type: reduxTypes.platform.SET_PLATFORM_EXPORT_RESET }]);
      }
    },
    [addNotification, confirmAppLoaded, createAliasExport, dispatch, t]
  );
};

/**
 * User confirmation results when existing exports are detected.
 *
 * @param {object} options
 * @param {reduxActions.platform.deleteExistingExports} options.deleteExistingExports
 * @param {reduxActions.platform.getExistingExports} options.getExistingExports
 * @param {translate} options.t
 * @param {useAppLoad} options.useAppLoad
 * @param {storeHooks.reactRedux.useDispatch} options.useDispatch
 * @param {NotificationsContext.useNotifications} options.useNotifications
 * @returns {Function}
 */
const useExistingExportsConfirmation = ({
  deleteExistingExports: deleteAliasExistingExports = reduxActions.platform.deleteExistingExports,
  getExistingExports: getAliasExistingExports = reduxActions.platform.getExistingExports,
  t = translate,
  useAppLoad: useAliasAppLoad = useAppLoad,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useNotifications: useAliasNotifications = NotificationsContext.useNotifications
} = {}) => {
  const dispatch = useAliasDispatch();
  const confirmAppLoaded = useAliasAppLoad();
  const { addNotification, removeNotification } = useAliasNotifications();

  return useCallback(
    async (confirmation, allResults) => {
      if (!confirmAppLoaded()) {
        return;
      }

      // clean up unused exports
      if (confirmation === 'no') {
        dispatch(deleteAliasExistingExports(allResults));
        removeNotification('swatch-exports-status');
        return;
      }

      // assume default pending notification
      addNotification({
        swatchId: 'swatch-exports-status',
        variant: NotificationVariant.info,
        title: t('curiosity-toolbar.notifications', {
          context: ['export', 'pending', 'titleGlobal'],
          testId: 'exportNotification-existing-pending'
        })
      });

      try {
        const response = await dispatch(getAliasExistingExports(allResults));

        if (response?.value?.data?.data?.isAnything) {
          addNotification({
            swatchId: 'swatch-exports-status',
            variant: NotificationVariant.success,
            title: t('curiosity-toolbar.notifications', {
              context: ['export', 'completed', 'titleGlobal'],
              count: allResults.length,
              testId: 'exportNotification-existing-completed'
            }),
            description: t('curiosity-toolbar.notifications', {
              context: ['export', 'completed', 'descriptionGlobal'],
              count: allResults.length
            })
          });
        }
      } catch (error) {
        addNotification({
          swatchId: 'swatch-exports-status',
          variant: NotificationVariant.warning,
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'error', 'title'],
            testId: 'exportNotification-existing-error'
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'error', 'description']
          })
        });

        dispatch([{ type: reduxTypes.platform.SET_PLATFORM_EXPORT_RESET }]);
      }
    },
    [
      addNotification,
      confirmAppLoaded,
      dispatch,
      deleteAliasExistingExports,
      getAliasExistingExports,
      removeNotification,
      t
    ]
  );
};

/**
 * Apply an existing exports hook for user abandoned reports. Allow bulk polling status with download.
 *
 * @param {object} options
 * @param {object} options.cache
 * @param {reduxActions.platform.getExistingExportsStatus} options.getExistingExportsStatus
 * @param {translate} options.t
 * @param {storeHooks.reactRedux.useDispatch} options.useDispatch
 * @param {useExistingExportsConfirmation} options.useExistingExportsConfirmation
 * @param {NotificationsContext.useNotifications} options.useNotifications
 * @param {storeHooks.reactRedux.useSelectorsResponse} options.useSelectorsResponse
 */
const useExistingExports = ({
  cache = exportCache,
  getExistingExportsStatus: getAliasExistingExportsStatus = reduxActions.platform.getExistingExportsStatus,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExistingExportsConfirmation: useAliasExistingExportsConfirmation = useExistingExportsConfirmation,
  useNotifications: useAliasNotifications = NotificationsContext.useNotifications,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const dispatch = useAliasDispatch();
  const { addNotification, removeNotification, hasNotification } = useAliasNotifications();
  const onConfirmation = useAliasExistingExportsConfirmation();
  const { data } = useAliasSelectorsResponse(({ app }) => app?.exportsExisting);
  const { completed = [], isAnythingPending, isAnythingCompleted, pending = [] } = data?.[0]?.data || {};
  const hasCache = cache.get('isExistingExports');

  useMount(() => {
    if (!hasCache) {
      dispatch(getAliasExistingExportsStatus());
    }
  });

  useUnmount(() => {
    removeNotification('swatch-exports-status');
  });

  useEffect(() => {
    const isAnythingAvailable = isAnythingCompleted || isAnythingPending || false;
    const totalResults = completed.length + pending.length;
    const isExistingNotifications =
      hasNotification('swatch-exports-individual-status') || hasNotification('swatch-exports-status');

    if (!hasCache && !isExistingNotifications && isAnythingAvailable && totalResults) {
      cache.set('isExistingExports', true);

      addNotification({
        swatchId: 'swatch-exports-status',
        title: t('curiosity-toolbar.notifications', {
          context: ['export', 'completed', 'title', 'existing'],
          count: totalResults,
          testId: 'exportNotification-existing-confirmation'
        }),
        description: (
          <div aria-live="polite">
            {t('curiosity-toolbar.notifications', {
              context: [
                'export',
                'completed',
                'description',
                'existing',
                completed.length && 'completed',
                pending.length && 'pending'
              ],
              count: totalResults,
              completed: completed.length,
              pending: pending.length
            })}
            <div style={{ paddingTop: '0.5rem' }}>
              <Button
                data-test="exportButtonConfirm"
                variant="primary"
                onClick={() => onConfirmation('yes', [...completed, ...pending])}
                autoFocus
              >
                {t('curiosity-toolbar.button', { context: 'yes' })}
              </Button>{' '}
              <Button
                data-test="exportButtonCancel"
                variant="plain"
                onClick={() => onConfirmation('no', [...completed, ...pending])}
              >
                {t('curiosity-toolbar.button', { context: 'no' })}
              </Button>
            </div>
          </div>
        ),
        autoDismiss: false,
        dismissable: false
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addNotification,
    completed,
    hasCache,
    hasNotification,
    isAnythingCompleted,
    isAnythingPending,
    onConfirmation,
    pending,
    t
  ]);
};

/**
 * Aggregated export status
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {{isProductPending: boolean, productPendingFormats: Array<string>}}
 */
const useExportStatus = ({
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { productId } = useAliasProduct();
  const { isPending, pending } = useAliasSelector(({ app }) => app?.exports?.[productId], {});

  const pendingProductFormats = [];
  const isProductPending = isPending || false;

  if (isProductPending && Array.isArray(pending)) {
    pendingProductFormats.push(...pending.map(({ format: productFormat }) => productFormat));
  }

  return {
    isProductPending,
    pendingProductFormats
  };
};

const context = {
  useExport,
  useExportStatus,
  useExistingExports,
  useExistingExportsConfirmation
};

export { context as default, context, useExport, useExportStatus, useExistingExports, useExistingExportsConfirmation };
