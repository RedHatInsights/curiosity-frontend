import React from 'react';
import PropTypes from 'prop-types';
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
 * ToDo: evaluate the debounce milliseconds, currently based off platforms default 800 ms
 */
/**
 * Display a display name input field for search.
 *
 * @fires onSubmit
 * @fires onClear
 * @fires onKeyUp
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useDispatch
 * @param {Function} props.useProduct
 * @param {Function} props.useProductInventoryHostsQuery
 * @returns {React.ReactNode}
 */
const ToolbarFieldDisplayName = ({
  t,
  useDispatch: useAliasDispatch,
  useProduct: useAliasProduct,
  useProductInventoryHostsQuery: useAliasProductInventoryHostsQuery
}) => {
  const { viewId } = useAliasProduct();
  const { [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: currentValue } = useAliasProductInventoryHostsQuery();
  const dispatch = useAliasDispatch();

  /**
   * On submit, dispatch type.
   *
   * @event onSubmit
   * @param {string} submitValue
   * @returns {void}
   */
  const onSubmit = submitValue =>
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME],
        viewId,
        [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: submitValue?.trim() || null
      }
    ]);

  /**
   * On clear, dispatch type.
   *
   * @event onClear
   * @returns {void}
   */
  const onClear = () => {
    if (currentValue === '' || !currentValue) {
      return;
    }

    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME],
        viewId,
        [RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME]: null
      }
    ]);
  };

  /**
   * Set up submit debounce event to allow for bypass.
   */
  const debounced = _debounce(onSubmit, 700);

  /**
   * On enter submit value, on type submit value, and on esc ignore (clear value at component level).
   *
   * @event onKeyUp
   * @param {object} event
   */
  const onKeyUp = event => {
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

  return (
    <InputGroup>
      <InputGroupItem>
        <TextInput
          customIcon={<SearchIcon />}
          aria-label={t('curiosity-toolbar.placeholder_filter', { context: 'displayName' })}
          className="curiosity-input__display-name"
          maxLength={255}
          onClear={onClear}
          onKeyUp={onKeyUp}
          value={currentValue}
          placeholder={t('curiosity-toolbar.placeholder_filter', { context: 'displayName' })}
          data-test="toolbarFieldDisplayName"
        />
      </InputGroupItem>
    </InputGroup>
  );
};

/**
 * Prop types.
 *
 * @type {{useProduct: Function, t: translate, useDispatch: Function, useProductInventoryHostsQuery: Function}}
 */
ToolbarFieldDisplayName.propTypes = {
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useProduct: PropTypes.func,
  useProductInventoryHostsQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, t: translate, useDispatch: Function, useProductInventoryHostsQuery: Function}}
 */
ToolbarFieldDisplayName.defaultProps = {
  t: translate,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useProduct,
  useProductInventoryHostsQuery
};

export { ToolbarFieldDisplayName as default, ToolbarFieldDisplayName };
