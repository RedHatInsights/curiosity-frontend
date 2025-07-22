import React, { useCallback, useEffect } from 'react';
import { useEffectOnce } from 'react-use';
import { Button } from '@patternfly/react-core';
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
 * A constant object containing notification identifiers for various export statuses.
 *
 * Properties:
 * - `EXPORT_INDIVIDUAL_STATUS`: Identifier for notifications related to individual status updates
 *     during export operations.
 * - `EXPORT_STATUS`: Identifier for notifications pertaining to overall export operation status updates.
 *
 * @type {{EXPORT_INDIVIDUAL_STATUS: string, EXPORT_STATUS: string}}
 */
const NOTIFICATION_IDS = {
  EXPORT_INDIVIDUAL_STATUS: 'swatch-exports-individual-status',
  EXPORT_STATUS: 'swatch-exports-status'
};

/**
 * Return a polling status callback. Used when creating an export.
 *
 * @param {object} [options={}]
 * @param {translate} [options.t=translate]
 * @param {useAppLoad} [options.useAppLoad=useAppLoad]
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {NotificationsContext.useNotifications} [options.useNotifications=NotificationsContext.useNotifications]
 * @param {useProduct} [options.useProduct=useProduct]
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
      const {
        completed = [],
        isAnything,
        isCompleted,
        isPending,
        isFailed,
        pending = [],
        failed = []
      } = data?.data || {};

      if (error || !confirmAppLoaded() || !isAnything) {
        return;
      }

      // Display pending notification. No data is returned on the initial status response.
      if (retryCount === -1) {
        addNotification({
          swatchId: NOTIFICATION_IDS.EXPORT_INDIVIDUAL_STATUS,
          variant: NotificationVariant.info,
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'pending', 'title'],
            testId: 'exportNotification-individual-pending'
          })
        });
        return;
      }

      // Display completed or failed notifications
      if (isCompleted || isFailed) {
        const exportVariant = (isFailed && NotificationVariant.danger) || NotificationVariant.success;
        const exportStatus = (isFailed && 'failed') || 'completed';
        const exportFile = (isFailed && failed?.[0]?.fileName) || completed?.[0]?.fileName;

        addNotification({
          swatchId: NOTIFICATION_IDS.EXPORT_INDIVIDUAL_STATUS,
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

      // Dispatch a status regardless of completion. Apply minimal-state-tracking for debugging.
      dispatch([
        {
          type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
          id: productId,
          isAnything,
          isCompleted,
          isPending,
          isFailed,
          completed,
          pending,
          failed
        }
      ]);
    },
    [addNotification, confirmAppLoaded, dispatch, productId, t]
  );
};

/**
 * Handle export rejection notifications.
 *
 * @param {object} [options={}]
 * @param {Function} [options.t=translate]
 * @param {object} [options.useNotifications=NotificationsContext.useNotifications]
 * @returns {Function}
 */
const useExportRejection = ({
  t = translate,
  useNotifications: useAliasNotifications = NotificationsContext.useNotifications
} = {}) => {
  const { addNotification } = useAliasNotifications();

  return useCallback(
    () =>
      addNotification({
        variant: NotificationVariant.warning,
        title: t('curiosity-toolbar.notifications', {
          context: ['export', 'error', 'title'],
          testId: 'exportNotification-individual-error'
        }),
        description: t('curiosity-toolbar.notifications', {
          context: ['export', 'error', 'description']
        })
      }),
    [addNotification, t]
  );
};

/**
 * Apply an export hook for an export post. The service automatically sets up polling, then force downloads the file.
 *
 * @param {object} [options={}]
 * @param {reduxActions.platform.createExport} [options.createExport=reduxActions.platform.createExport]
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useExportConfirmation} [options.useExportConfirmation=useExportConfirmation]
 * @param {useExportRejection} [options.useExportRejection=useExportRejection]
 * @returns {Function}
 */
const useExport = ({
  createExport: createAliasExport = reduxActions.platform.createExport,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExportConfirmation: useAliasExportConfirmation = useExportConfirmation,
  useExportRejection: useAliasExportRejection = useExportRejection
} = {}) => {
  const statusConfirmation = useAliasExportConfirmation();
  const statusRejection = useAliasExportRejection();
  const dispatch = useAliasDispatch();

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
            rejectCallback: statusRejection
          }
        )
      ]);
    },
    [createAliasExport, dispatch, statusConfirmation, statusRejection]
  );
};

/**
 * User confirmation results when existing exports are detected.
 *
 * @param {object} [options={}]
 * @param {reduxActions.platform.deleteExistingExports} [options.deleteExistingExports]
 * @param {reduxActions.platform.getExistingExports} [options.getExistingExports]
 * @param {translate} [options.t=translate]
 * @param {useAppLoad} [options.useAppLoad=useAppLoad]
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {NotificationsContext.useNotifications} [options.useNotifications=NotificationsContext.useNotifications]
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
      removeNotification(NOTIFICATION_IDS.EXPORT_STATUS);

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
      })(dispatch).then(({ value } = {}) => {
        if (confirmAppLoaded()) {
          if (value?.data?.data?.isAnything) {
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
 * Apply an existing exports hook for user-abandoned reports. Allow bulk polling status with download.
 *
 * @param {object} [options={}]
 * @param {reduxActions.platform.getExistingExportsStatus} [options.getExistingExportsStatus]
 * @param {translate} [options.t=translate]
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useExistingExportsConfirmation} [options.useExistingExportsConfirmation=useExistingExportsConfirmation]
 * @param {NotificationsContext.useNotifications} [options.useNotifications=NotificationsContext.useNotifications]
 * @param {storeHooks.reactRedux.useSelectorsResponse} [options.useSelectorsResponse]
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
      removeNotification(NOTIFICATION_IDS.EXPORT_STATUS);
      dispatch([{ type: reduxTypes.platform.SET_PLATFORM_EXPORT_RESET }]);
    };
  });

  useEffect(() => {
    const isAnythingAvailable = isAnythingCompleted || isAnythingPending || false;
    const totalResults = completed.length + pending.length;
    // Confirm existing toast IDs for "toast pending/success" OR "existing toast message".
    const isExistingNotifications =
      hasNotification(NOTIFICATION_IDS.EXPORT_INDIVIDUAL_STATUS) || hasNotification(NOTIFICATION_IDS.EXPORT_STATUS);

    if (isAnythingAvailable && totalResults && !isExistingNotifications) {
      addNotification({
        swatchId: NOTIFICATION_IDS.EXPORT_STATUS,
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
 * @param {object} [options={}]
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {storeHooks.reactRedux.useSelector} [options.useSelector=storeHooks.reactRedux.useSelector]
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
  NOTIFICATION_IDS,
  useExport,
  useExportConfirmation,
  useExportRejection,
  useExportStatus,
  useExistingExports,
  useExistingExportsConfirmation
};

export {
  context as default,
  context,
  NOTIFICATION_IDS,
  useExport,
  useExportConfirmation,
  useExportRejection,
  useExportStatus,
  useExistingExports,
  useExistingExportsConfirmation
};
