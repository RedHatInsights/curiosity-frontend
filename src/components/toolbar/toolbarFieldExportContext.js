import React, { useCallback, useEffect, useState } from 'react';
import { useMount } from 'react-use';
import { Button } from '@patternfly/react-core';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { translate } from '../i18n/i18n';

/**
 * @memberof ToolbarFieldExport
 * @module ToolbarFieldExportContext
 */

/**
 * Return a polling status callback. Used when creating an export.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useExportConfirmation = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return useCallback(
    successResponse => {
      const { completed = [], isCompleted, pending = [] } = successResponse?.data?.data?.products?.[productId] || {};
      const isPending = !isCompleted;

      if (isCompleted) {
        addAliasNotification({
          variant: 'success',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'title']
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'description'],
            fileName: completed?.[0]?.fileName
          }),
          dismissable: true
        })(dispatch);
      }

      dispatch({
        type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
        id: productId,
        isPending,
        pending
      });
    },
    [addAliasNotification, dispatch, productId, t]
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
      dispatch({
        type: reduxTypes.platform.SET_PLATFORM_EXPORT_STATUS,
        id,
        isPending: true
      });

      createAliasExport(
        id,
        data,
        { poll: { status: statusConfirmation } },
        {
          rejected: {
            variant: 'warning',
            title: t('curiosity-toolbar.notifications', {
              context: ['export', 'error', 'title']
            }),
            description: t('curiosity-toolbar.notifications', {
              context: ['export', 'error', 'description']
            }),
            dismissable: true
          },
          pending: {
            variant: 'info',
            title: t('curiosity-toolbar.notifications', {
              context: ['export', 'pending', 'title', id]
            }),
            dismissable: true
          }
        }
      )(dispatch);
    },
    [createAliasExport, dispatch, statusConfirmation, t]
  );
};

/**
 * User confirmation results when existing exports are detected.
 *
 * @param {object} options
 * @param {Function} options.deleteExistingExports
 * @param {Function} options.getExistingExports
 * @param {Function} options.removeNotification
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @returns {Function}
 */
const useExistingExportsConfirmation = ({
  deleteExistingExports: deleteAliasExistingExports = reduxActions.platform.deleteExistingExports,
  getExistingExports: getAliasExistingExports = reduxActions.platform.getExistingExports,
  removeNotification: removeAliasNotification = reduxActions.platform.removeNotification,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch
} = {}) => {
  const dispatch = useAliasDispatch();

  return useCallback(
    (confirmation, allResults) => {
      dispatch(removeAliasNotification('swatch-exports-status'));

      if (confirmation === 'no') {
        return deleteAliasExistingExports(allResults, {
          rejected: {
            variant: 'warning',
            title: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'title'] }),
            description: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'description'] }),
            dismissable: true
          }
        })(dispatch);
      }

      return getAliasExistingExports(allResults, {
        rejected: {
          variant: 'warning',
          title: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'title'] }),
          description: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'description'] }),
          dismissable: true
        },
        pending: {
          variant: 'info',
          title: t('curiosity-toolbar.notifications', { context: ['export', 'pending', 'titleGlobal'] }),
          dismissable: true
        },
        fulfilled: {
          variant: 'success',
          title: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'titleGlobal'],
            count: allResults.length
          }),
          description: t('curiosity-toolbar.notifications', {
            context: ['export', 'completed', 'descriptionGlobal'],
            count: allResults.length
          }),
          dismissable: true
        }
      })(dispatch);
    },
    [dispatch, deleteAliasExistingExports, getAliasExistingExports, removeAliasNotification, t]
  );
};

/**
 * Apply an existing exports hook for user abandoned reports. Allow bulk polling status with download.
 *
 * @param {object} options
 * @param {Function} options.addNotification
 * @param {Function} options.getExistingExportsStatus
 * @param {Function} options.t
 * @param {Function} options.useDispatch
 * @param {Function} options.useExistingExportsConfirmation
 * @param {Function} options.useSelectorsResponse
 */
const useExistingExports = ({
  addNotification: addAliasNotification = reduxActions.platform.addNotification,
  getExistingExportsStatus: getAliasExistingExportsStatus = reduxActions.platform.getExistingExportsStatus,
  t = translate,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExistingExportsConfirmation: useAliasExistingExportsConfirmation = useExistingExportsConfirmation,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const dispatch = useAliasDispatch();
  const onConfirmation = useAliasExistingExportsConfirmation();
  const { data, fulfilled } = useAliasSelectorsResponse(({ app }) => app?.exportsExisting);
  const { completed = [], isAnythingPending, isAnythingCompleted, pending = [] } = data?.[0]?.data || {};

  useMount(() => {
    if (!isConfirmation) {
      getAliasExistingExportsStatus({
        rejected: {
          variant: 'warning',
          title: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'title'] }),
          description: t('curiosity-toolbar.notifications', { context: ['export', 'error', 'description'] }),
          dismissable: true
        }
      })(dispatch);
    }
  });

  useEffect(() => {
    if (!fulfilled || isConfirmation) {
      return;
    }

    const isAnythingAvailable = isAnythingPending || isAnythingCompleted || false;
    const totalResults = completed.length + pending.length;

    if (isAnythingAvailable && totalResults) {
      addAliasNotification({
        id: 'swatch-exports-status',
        title: t('curiosity-toolbar.notifications', {
          context: ['export', 'completed', 'title', 'existing'],
          count: totalResults
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
                data-test="exportButtonConfirm"
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
      })(dispatch);

      setIsConfirmation(true);
    }
  }, [
    addAliasNotification,
    completed,
    dispatch,
    fulfilled,
    isAnythingCompleted,
    isAnythingPending,
    isConfirmation,
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
