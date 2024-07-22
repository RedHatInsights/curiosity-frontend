import React, { useCallback, useEffect } from 'react';
import { useEffectOnce, useUnmount } from 'react-use';
import { Button } from '@patternfly/react-core';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
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
 * @param {Function} options.addNotification
 * @param {Function} options.removeNotification
 * @param {Function} options.t
 * @param {Function} options.useAppLoad
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useExportConfirmation = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  removeNotification: removeAliasNotification = reduxActions.platform.removeNotification,
  t = translate,
  useAppLoad: useAliasAppLoad = useAppLoad,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();
  const confirmAppLoaded = useAliasAppLoad();

  useUnmount(() => {
    dispatch(removeAliasNotification('swatch-exports-individual-status'));
  });

  return useCallback(
    ({ error, data } = {}, retryCount) => {
      const { completed = [], isCompleted, isPending, pending = [] } = data?.data?.products?.[productId] || {};

      if (error || !confirmAppLoaded()) {
        return;
      }

      // Display pending notification. No data is returned on the initial status response.
      if (retryCount === -1) {
        dispatch([
          addAliasNotification({
            id: 'swatch-exports-individual-status',
            variant: 'info',
            title: t('curiosity-toolbar.notifications', {
              context: ['export', 'pending', 'title'],
              testId: 'exportNotification-individual-pending'
            }),
            dismissable: true
          })
        ]);
        return;
      }

      // Dispatch a status regardless of completion
      const updatedDispatch = [
        {
          type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
          id: productId,
          isPending,
          pending
        }
      ];

      // Display completed notification
      if (isCompleted) {
        updatedDispatch.unshift(
          addAliasNotification({
            id: 'swatch-exports-individual-status',
            variant: 'success',
            title: t('curiosity-toolbar.notifications', {
              context: ['export', 'completed', 'title'],
              testId: 'exportNotification-individual-completed'
            }),
            description: t('curiosity-toolbar.notifications', {
              context: ['export', 'completed', 'description'],
              count: completed.length,
              fileName: completed?.[0]?.fileName
            }),
            dismissable: true
          })
        );
      }

      dispatch(updatedDispatch);
    },
    [addAliasNotification, confirmAppLoaded, dispatch, productId, t]
  );
};

/**
 * Apply an export hook for an export post. The service automatically sets up polling, then force downloads the file.
 *
 * @param {object} options
 * @param {Function} options.createExport
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useExportConfirmation
 * @returns {Function}
 */
const useExport = ({
  createExport: createAliasExport = reduxActions.platform.createExport,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExportConfirmation: useAliasExportConfirmation = useExportConfirmation
} = {}) => {
  const statusConfirmation = useAliasExportConfirmation();
  const dispatch = useAliasDispatch();

  return useCallback(
    (id, data) => {
      dispatch([
        {
          type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
          id,
          isPending: true
        },
        createAliasExport(
          id,
          data,
          { poll: { status: statusConfirmation } },
          {
            rejected: {
              variant: 'warning',
              title: t('curiosity-toolbar.notifications', {
                context: ['export', 'error', 'title'],
                testId: 'exportNotification-individual-error'
              }),
              description: t('curiosity-toolbar.notifications', {
                context: ['export', 'error', 'description']
              }),
              dismissable: true
            }
          }
        )
      ]);
    },
    [createAliasExport, dispatch, statusConfirmation, t]
  );
};

/**
 * User confirmation results when existing exports are detected.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.deleteExistingExports
 * @param {Function} options.getExistingExports
 * @param {Function} options.removeNotification
 * @param {Function} options.t
 * @param {Function} options.useAppLoad
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useExistingExportsConfirmation = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  deleteExistingExports: deleteAliasExistingExports = reduxActions.platform.deleteExistingExports,
  getExistingExports: getAliasExistingExports = reduxActions.platform.getExistingExports,
  removeNotification: removeAliasNotification = reduxActions.platform.removeNotification,
  t = translate,
  useAppLoad: useAliasAppLoad = useAppLoad,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();
  const confirmAppLoaded = useAliasAppLoad();

  return useCallback(
    (confirmation, allResults) => {
      dispatch(removeAliasNotification('swatch-exports-status'));

      if (confirmation === 'no') {
        return dispatch(deleteAliasExistingExports(allResults));
      }

      return getAliasExistingExports(allResults, {
        pending: {
          id: 'swatch-exports-existing-confirmation',
          variant: 'info',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'pending', 'titleGlobal'],
            testId: 'exportNotification-existing-pending'
          }),
          dismissable: true
        }
      })(dispatch).then(() => {
        if (confirmAppLoaded()) {
          dispatch(
            addAliasNotification({
              id: 'swatch-exports-existing-confirmation',
              variant: 'success',
              title: t('curiosity-toolbar.notifications', {
                context: ['export', 'completed', 'titleGlobal'],
                count: allResults.length,
                testId: 'exportNotification-existing-completed'
              }),
              description: t('curiosity-toolbar.notifications', {
                context: ['export', 'completed', 'descriptionGlobal'],
                count: allResults.length
              }),
              dismissable: true
            })
          );
        }
      });
    },
    [
      addAliasNotification,
      confirmAppLoaded,
      dispatch,
      deleteAliasExistingExports,
      getAliasExistingExports,
      removeAliasNotification,
      t
    ]
  );
};

/**
 * Apply an existing exports hook for user abandoned reports. Allow bulk polling status with download.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.getExistingExportsStatus
 * @param {Function} options.removeNotification
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useExistingExportsConfirmation
 * @param {Function} options.useSelectorsResponse
 */
const useExistingExports = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  getExistingExportsStatus: getAliasExistingExportsStatus = reduxActions.platform.getExistingExportsStatus,
  removeNotification: removeAliasNotification = reduxActions.platform.removeNotification,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExistingExportsConfirmation: useAliasExistingExportsConfirmation = useExistingExportsConfirmation,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const dispatch = useAliasDispatch();
  const onConfirmation = useAliasExistingExportsConfirmation();
  const { data, fulfilled } = useAliasSelectorsResponse(({ app }) => app?.exportsExisting);
  const { completed = [], isAnythingPending, isAnythingCompleted, pending = [] } = data?.[0]?.data || {};

  useEffectOnce(() => {
    dispatch(getAliasExistingExportsStatus());

    return () => {
      dispatch([
        removeAliasNotification('swatch-exports-status'),
        { type: reduxTypes.platform.SET_PLATFORM_EXPORT_RESET }
      ]);
    };
  });

  useEffect(() => {
    const isAnythingAvailable = isAnythingPending || isAnythingCompleted || false;
    const totalResults = completed.length + pending.length;

    if (isAnythingAvailable && totalResults) {
      dispatch([
        addAliasNotification({
          id: 'swatch-exports-status',
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
        }),
        { type: reduxTypes.platform.SET_PLATFORM_EXPORT_RESET }
      ]);
    }
  }, [
    addAliasNotification,
    completed,
    dispatch,
    fulfilled,
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
