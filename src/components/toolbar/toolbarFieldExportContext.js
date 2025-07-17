import React, { useCallback, useEffect } from 'react';
import { useEffectOnce } from 'react-use';
import { Button } from '@patternfly/react-core';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { NotificationsContext, NotificationVariant } from '../notifications/notifications';
import { PLATFORM_API_EXPORT_POST_TYPES as POST_TYPES } from '../../services/platform/platformConstants';
import { translate } from '../i18n/i18n';
import { useAppLoad } from '../../hooks/useApp';

/**
 * @memberof ToolbarFieldExport
 * @module ToolbarFieldExportContext
 */

/**
 * Return a polling status callback. Used when creating an export.
 *
 * @param {object} options
 * @param {translate} options.t
 * @param {useAppLoad} options.useAppLoad
 * @param {storeHooks.reactRedux.useDispatch} options.useDispatch
 * @param {NotificationsContext.useNotifications} options.useNotifications
 * @param {useProduct} options.useProduct
 * @returns {Function}
 */
const useExportConfirmation = ({
  t = translate,
  useAppLoad: useAliasAppLoad = useAppLoad,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useNotifications: useAliasNotifications = NotificationsContext.useNotifications,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();
  const confirmAppLoaded = useAliasAppLoad();
  const { addNotification } = useAliasNotifications();

  return useCallback(
    ({ error, data } = {}, retryCount) => {
      const { completed = [], isCompleted, isPending, pending = [] } = data?.data || {};

      if (error || !confirmAppLoaded()) {
        return;
      }

      // Display pending notification. No data is returned on the initial status response.
      if (retryCount === -1) {
        addNotification({
          swatchId: 'swatch-exports-individual-status',
          variant: NotificationVariant.info,
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'pending', 'title'],
            testId: 'exportNotification-individual-pending'
          })
        });
        return;
      }

      // Display completed notification
      if (isCompleted) {
        addNotification({
          swatchId: 'swatch-exports-individual-status',
          variant: NotificationVariant.success,
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'title'],
            testId: 'exportNotification-individual-completed'
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'description'],
            fileName: completed?.[0]?.fileName
          })
        });
      }

      // Dispatch a status regardless of completion
      dispatch([
        {
          type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
          id: productId,
          isPending,
          pending
        }
      ]);
    },
    [addNotification, confirmAppLoaded, dispatch, productId, t]
  );
};

/**
 * Apply an export hook for an export post. The service automatically sets up polling, then force downloads the file.
 *
 * @param {object} options
 * @param {reduxActions.platform.createExport} options.createExport
 * @param {translate} options.t
 * @param {storeHooks.reactRedux.useDispatch} options.useDispatch
 * @param {useExportConfirmation} options.useExportConfirmation
 * @param {NotificationsContext.useNotifications} options.useNotifications
 * @returns {Function}
 */
const useExport = ({
  createExport: createAliasExport = reduxActions.platform.createExport,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExportConfirmation: useAliasExportConfirmation = useExportConfirmation,
  useNotifications: useAliasNotifications = NotificationsContext.useNotifications
} = {}) => {
  const statusConfirmation = useAliasExportConfirmation();
  const dispatch = useAliasDispatch();
  const { addNotification } = useAliasNotifications();

  return useCallback(
    (id, data) => {
      dispatch([
        {
          type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
          id,
          isPending: true,
          isSelectUpdated: true,
          pending: [{ format: data?.[POST_TYPES.FORMAT] }]
        },
        createAliasExport(
          id,
          data,
          { poll: { status: statusConfirmation } },
          {
            rejectCallback: () =>
              addNotification({
                variant: NotificationVariant.warning,
                title: t('curiosity-toolbar.notifications', {
                  context: ['export', 'error', 'title'],
                  testId: 'exportNotification-individual-error'
                }),
                description: t('curiosity-toolbar.notifications', {
                  context: ['export', 'error', 'description']
                })
              })
          }
        )
      ]);
    },
    [addNotification, createAliasExport, dispatch, statusConfirmation, t]
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
    (confirmation, allResults) => {
      removeNotification('swatch-exports-status');

      if (confirmation === 'no') {
        return dispatch(deleteAliasExistingExports(allResults));
      }

      return getAliasExistingExports(allResults, {
        pendingCallback: () =>
          addNotification({
            swatchId: 'swatch-exports-existing-confirmation',
            variant: NotificationVariant.info,
            title: t('curiosity-toolbar.notifications', {
              context: ['export', 'pending', 'titleGlobal'],
              testId: 'exportNotification-existing-pending'
            })
          })
      })(dispatch).then(() => {
        if (confirmAppLoaded()) {
          addNotification({
            swatchId: 'swatch-exports-existing-confirmation',
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
      });
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
 * @param {reduxActions.platform.getExistingExportsStatus} options.getExistingExportsStatus
 * @param {translate} options.t
 * @param {storeHooks.reactRedux.useDispatch} options.useDispatch
 * @param {useExistingExportsConfirmation} options.useExistingExportsConfirmation
 * @param {NotificationsContext.useNotifications} options.useNotifications
 * @param {storeHooks.reactRedux.useSelectorsResponse} options.useSelectorsResponse
 */
const useExistingExports = ({
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
  const { data, fulfilled } = useAliasSelectorsResponse(({ app }) => app?.exportsExisting);
  const { completed = [], isAnythingPending, isAnythingCompleted, pending = [] } = data?.[0]?.data || {};

  useEffectOnce(() => {
    dispatch(getAliasExistingExportsStatus());

    return () => {
      removeNotification('swatch-exports-status');
      dispatch([{ type: reduxTypes.platform.SET_PLATFORM_EXPORT_RESET }]);
    };
  });

  useEffect(() => {
    const isAnythingAvailable = isAnythingCompleted || false;
    const totalResults = completed.length + pending.length;
    // Confirm existing toast IDs for "toast pending/success" OR "existing toast message".
    const isExistingNotifications =
      hasNotification('swatch-exports-individual-status') || hasNotification('swatch-exports-status');

    if (isAnythingAvailable && totalResults && !isExistingNotifications) {
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
      dispatch([{ type: reduxTypes.platform.SET_PLATFORM_EXPORT_RESET }]);
    }
  }, [
    addNotification,
    completed,
    dispatch,
    fulfilled,
    hasNotification,
    isAnythingCompleted,
    isAnythingPending,
    onConfirmation,
    pending,
    removeNotification,
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
  useExportConfirmation,
  useExportStatus,
  useExistingExports,
  useExistingExportsConfirmation
};

export {
  context as default,
  context,
  useExport,
  useExportConfirmation,
  useExportStatus,
  useExistingExports,
  useExistingExportsConfirmation
};
