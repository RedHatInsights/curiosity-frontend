import React from 'react';
import { useProduct, useProductExportQuery } from '../productView/productViewContext';
import { useExport, useExistingExports, useExportStatus } from './toolbarFieldExportContext';
import { Select, SelectButtonVariant, SelectPosition, SelectVariant } from '../form/select';
import {
  PLATFORM_API_EXPORT_APPLICATION_TYPES as APP_TYPES,
  PLATFORM_API_EXPORT_CONTENT_TYPES as FIELD_TYPES,
  PLATFORM_API_EXPORT_RESOURCE_TYPES as RESOURCE_TYPES,
  PLATFORM_API_EXPORT_POST_TYPES as POST_TYPES,
  PLATFORM_API_EXPORT_SOURCE_TYPES as SOURCE_TYPES
} from '../../services/platform/platformConstants';
import { translate } from '../i18n/i18n';
import { dateHelpers, helpers } from '../../common';

/**
 * A standalone export select/dropdown filter and download hooks.
 *
 * @memberof Toolbar
 * @module ToolbarFieldExport
 * @property {module} ToolbarFieldExportContext
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.label', { context: ['export', type] }),
  value: type,
  isSelected: false
}));

/**
 * On select create/post an export.
 *
 * @param {object} options
 * @param {useExport} [options.useExport=useExport]
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {useProductExportQuery} [options.useProductExportQuery=useProductExportQuery]
 * @returns {Function}
 */
const useOnSelect = ({
  useExport: useAliasExport = useExport,
  useProduct: useAliasProduct = useProduct,
  useProductExportQuery: useAliasProductExportQuery = useProductExportQuery
} = {}) => {
  const { productId } = useAliasProduct();
  const exportQuery = useAliasProductExportQuery();
  const createExport = useAliasExport();

  return ({ value = null } = {}) => {
    const sources = [
      {
        [SOURCE_TYPES.APPLICATION]: APP_TYPES.SUBSCRIPTIONS,
        [SOURCE_TYPES.RESOURCE]: RESOURCE_TYPES.SUBSCRIPTIONS,
        [SOURCE_TYPES.FILTERS]: {
          ...exportQuery
        }
      },
      {
        [SOURCE_TYPES.APPLICATION]: APP_TYPES.SUBSCRIPTIONS,
        [SOURCE_TYPES.RESOURCE]: RESOURCE_TYPES.INSTANCES,
        [SOURCE_TYPES.FILTERS]: {
          ...exportQuery
        }
      }
    ];

    createExport(productId, {
      [POST_TYPES.EXPIRES_AT]: dateHelpers
        .setMillisecondsFromDate({
          ms: helpers.CONFIG_EXPORT_EXPIRE
        })
        .toISOString(),
      [POST_TYPES.FORMAT]: value,
      [POST_TYPES.NAME]: `${helpers.CONFIG_EXPORT_SERVICE_NAME_PREFIX}-${productId}`,
      [POST_TYPES.SOURCES]: sources
    });
  };
};

/**
 * Display an export/download field with options. Check and download available exports.
 *
 * @param {object} props
 * @param {toolbarFieldOptions} [props.options=toolbarFieldOptions]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useExistingExports} [props.useExistingExports=useExistingExports]
 * @param {useExportStatus} [props.useExportStatus=useExportStatus]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldExport = ({
  options = toolbarFieldOptions,
  position = SelectPosition.left,
  t = translate,
  useExistingExports: useAliasExistingExports = useExistingExports,
  useExportStatus: useAliasExportStatus = useExportStatus,
  useOnSelect: useAliasOnSelect = useOnSelect
}) => {
  const { isProductPending, pendingProductFormats = [] } = useAliasExportStatus();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({
    ...option,
    title:
      (isProductPending &&
        pendingProductFormats?.includes(option.value) &&
        t('curiosity-toolbar.label', { context: ['export', 'loading'] })) ||
      option.title,
    isSelected: isProductPending && pendingProductFormats?.includes(option.value),
    isDisabled:
      (isProductPending && !pendingProductFormats?.length) ||
      (isProductPending && pendingProductFormats?.includes(option.value))
  }));

  useAliasExistingExports();

  return (
    <Select
      title={t('curiosity-toolbar.placeholder', { context: 'export' })}
      variant={SelectVariant.dropdown}
      aria-label={t('curiosity-toolbar.placeholder', { context: 'export' })}
      onSelect={onSelect}
      options={updatedOptions}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'export' })}
      alignment={{ position }}
      data-test="toolbarFieldExport"
      toggle={{ variant: SelectButtonVariant.secondary, content: t('curiosity-toolbar.label', { context: 'export' }) }}
    />
  );
};

export { ToolbarFieldExport as default, ToolbarFieldExport, toolbarFieldOptions, useOnSelect };
