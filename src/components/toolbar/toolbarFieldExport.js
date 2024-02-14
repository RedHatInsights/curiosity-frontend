import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ExportIcon } from '@patternfly/react-icons';
import { useMount } from 'react-use';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductInventoryHostsQuery } from '../productView/productViewContext';
import { Select, SelectPosition, SelectButtonVariant } from '../form/select';
import {
  PLATFORM_API_EXPORT_APPLICATION_TYPES as APP_TYPES,
  PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX as EXPORT_PREFIX,
  PLATFORM_API_EXPORT_RESOURCE_TYPES as RESOURCE_TYPES,
  PLATFORM_API_EXPORT_STATUS_TYPES
} from '../../services/platform/platformConstants';
import { translate } from '../i18n/i18n';

/**
 * A standalone export select/dropdown filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldExport
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, selected: boolean}>}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.label', { context: ['export', type] }),
  value: type,
  selected: false
}));

/**
 * Aggregated export status
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {{isPolling: boolean, isProductPolling: boolean, productPollingFormats: Array<string>,
 *     isCompleted: boolean}}
 */
const useExportStatus = ({
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app?.exports, {});

  const isPolling = data?.data?.isAnythingPending === true || undefined;
  const isCompleted = data?.data?.isAnythingPending === false || undefined;
  const productPollingFormats = [];
  let isProductPolling = false;

  if (isPolling && Array.isArray(data?.data?.[productId])) {
    const pollingResults = data?.data?.[productId]
      .filter(({ status: productStatus }) => productStatus === PLATFORM_API_EXPORT_STATUS_TYPES.PENDING)
      .map(({ format: productFormat }) => productFormat);

    productPollingFormats.push(...pollingResults);

    if (pollingResults.length) {
      isProductPolling = true;
    }
  }

  return {
    isCompleted,
    isPolling,
    isProductPolling,
    productPollingFormats
  };
};

/**
 * Apply a centralized export hook for, post/put, polling status, and download.
 *
 * @param {object} options
 * @param {Function} options.createExport
 * @param {Function} options.getExport
 * @param {Function} options.getExportStatus
 * @param {Function} options.useDispatch
 * @param {Function} options.useExportStatus
 * @returns {Function}
 */
const useExport = ({
  createExport = reduxActions.platform.createExport,
  getExport = reduxActions.platform.getExport,
  getExportStatus = reduxActions.platform.getExportStatus,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useExportStatus: useAliasExportStatus = useExportStatus
} = {}) => {
  const dispatch = useAliasDispatch();
  const { isPolling } = useAliasExportStatus();

  /**
   * A polling response validator
   *
   * @type {Function}
   */
  const validate = useCallback(response => response?.data?.data?.isAnythingPending === false, []);

  /**
   * Create, or get, an export while detecting, or setting up, polling
   */
  return useCallback(
    ({ id, data } = {}) => {
      const updatedOptions = {};

      if (!isPolling) {
        updatedOptions.poll = {
          validate
        };
      }

      if (data) {
        return createExport(data, updatedOptions)(dispatch);
      }

      if (id) {
        return getExport(id)(dispatch);
      }

      if (isPolling === undefined) {
        return getExportStatus(updatedOptions)(dispatch);
      }

      return undefined;
    },
    [createExport, dispatch, getExport, getExportStatus, isPolling, validate]
  );
};

/**
 * On select update export.
 *
 * @param {object} options
 * @param {Function} options.useExport
 * @param {Function} options.useProduct
 * @param {Function} options.useProductInventoryQuery
 * @returns {Function}
 */
const useOnSelect = ({
  useExport: useAliasExport = useExport,
  useProduct: useAliasProduct = useProduct,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryHostsQuery
} = {}) => {
  const createExport = useAliasExport();
  const { productId } = useAliasProduct();
  const inventoryQuery = useAliasProductInventoryQuery();

  return ({ value = null } = {}) => {
    const sources = [
      {
        application: APP_TYPES.SUBSCRIPTIONS,
        resource: RESOURCE_TYPES.SUBSCRIPTIONS,
        filters: {
          ...inventoryQuery,
          productId
        }
      }
    ];

    const data = { format: value, name: `${EXPORT_PREFIX}-${productId}`, sources };
    createExport({ data });
  };
};

/**
 * Display an export/download field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useExport
 * @param {Function} props.useExportStatus
 * @param {Function} props.useOnSelect
 * @returns {React.ReactNode}
 */
const ToolbarFieldExport = ({
  options,
  position,
  t,
  useExport: useAliasExport,
  useExportStatus: useAliasExportStatus,
  useOnSelect: useAliasOnSelect
}) => {
  const { isProductPolling, productPollingFormats = [] } = useAliasExportStatus();
  const checkExport = useAliasExport();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title:
      (isProductPolling &&
        productPollingFormats?.includes(option.value) &&
        t('curiosity-toolbar.label', { context: ['export', 'loading'] })) ||
      option.title,
    selected: isProductPolling && productPollingFormats?.includes(option.value),
    isDisabled: isProductPolling && productPollingFormats?.includes(option.value)
  }));

  useMount(() => {
    checkExport();
  });

  return (
    <Select
      isDropdownButton
      aria-label={t('curiosity-toolbar.placeholder', { context: 'export' })}
      onSelect={onSelect}
      options={updatedOptions}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'export' })}
      position={position}
      data-test="toolbarFieldExport"
      toggleIcon={<ExportIcon />}
      buttonVariant={SelectButtonVariant.plain}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, useExportStatus: Function, options: Array, useExport: Function,
 *     position: string}}
 */
ToolbarFieldExport.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  position: PropTypes.string,
  t: PropTypes.func,
  useExport: PropTypes.func,
  useExportStatus: PropTypes.func,
  useOnSelect: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: translate, useExportStatus: Function, options: Array, useExport: Function,
 *     position: string}}
 */
ToolbarFieldExport.defaultProps = {
  options: toolbarFieldOptions,
  position: SelectPosition.left,
  t: translate,
  useExport,
  useExportStatus,
  useOnSelect
};

export {
  ToolbarFieldExport as default,
  ToolbarFieldExport,
  toolbarFieldOptions,
  useExport,
  useExportStatus,
  useOnSelect
};
