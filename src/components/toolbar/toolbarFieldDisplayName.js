import React from 'react';
import { InputGroup, InputGroupItem } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import _debounce from 'lodash/debounce';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductInventoryHostsQuery } from '../productView/productViewContext';
import { TextInput } from '../form/textInput';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * A standalone Display Name input filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldDisplayName
 */

/**
 * On submit, dispatch type.
 *
 * @param {object} options
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProduct} [options.useProduct=useProduct]
 * @returns {Function}
 */
const useOnSubmit = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { viewId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return submitValue =>
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_INVENTORY_INSTANCES,
        viewId,
        filter: RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME,
        value: submitValue?.trim() || null
      }
    ]);
};

/**
 * On enter submit value, on type submit value, and on esc ignore (clears value at component level).
 *
 * @param {object} options
 * @param {useOnSubmit} [options.useOnSubmit=useOnSubmit]
 * @fires onSubmit
 * @returns {Function}
 */
const useOnKeyUp = ({ useOnSubmit: useAliasOnSubmit = useOnSubmit } = {}) => {
  const onSubmit = useAliasOnSubmit();

  /**
   * Set up submit debounce event to allow for bypass.
   */
  const debounced = _debounce(onSubmit, 700);

  return event => {
    switch (event.keyCode) {
      case 13:
        onSubmit(event.value);
        break;
      case 27:
        break;
      default:
        debounced(event.value);
        break;
    }
  };
};

/**
 * On clear, dispatch type.
 *
 * @param {object} options
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProduct} [options.useProduct=useProduct]
 * @returns {Function}
 */
const useOnClear = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { viewId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return currentValue => {
    if (currentValue === '' || !currentValue) {
      return;
    }

    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_INVENTORY_INSTANCES,
        viewId,
        filter: RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME,
        value: null
      }
    ]);
  };
};

/**
 * ToDo: evaluate the debounce milliseconds, currently based off platforms default 800 ms
 */
/**
 * Display a display name input field for search.
 *
 * @param {object} props
 * @param {translate} [props.t=translate]
 * @param {useProductInventoryHostsQuery} [props.useProductInventoryHostsQuery=useProductInventoryHostsQuery]
 * @param {useOnClear} [props.useOnClear=useOnClear]
 * @param {useOnKeyUp} [props.useOnKeyUp=useOnKeyUp]
 * @fires onClear
 * @fires onKeyUp
 * @returns {JSX.Element}
 */
const ToolbarFieldDisplayName = ({
  t = translate,
  useProductInventoryHostsQuery: useAliasProductInventoryHostsQuery = useProductInventoryHostsQuery,
  useOnClear: useAliasOnClear = useOnClear,
  useOnKeyUp: useAliasOnKeyUp = useOnKeyUp
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: currentValue } = useAliasProductInventoryHostsQuery();
  const onClear = useAliasOnClear();
  const onKeyUp = useAliasOnKeyUp();

  return (
    <InputGroup>
      <InputGroupItem>
        <TextInput
          customIcon={<SearchIcon />}
          aria-label={t('curiosity-toolbar.placeholder', { context: ['filter', 'displayName'] })}
          className="curiosity-input__display-name"
          maxLength={255}
          onClear={onClear}
          onKeyUp={onKeyUp}
          value={currentValue}
          placeholder={t('curiosity-toolbar.placeholder', { context: ['filter', 'displayName'] })}
          data-test="toolbarFieldDisplayName"
        />
      </InputGroupItem>
    </InputGroup>
  );
};

export { ToolbarFieldDisplayName as default, ToolbarFieldDisplayName, useOnClear, useOnKeyUp, useOnSubmit };
