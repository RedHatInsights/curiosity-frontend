import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonVariant, InputGroup } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import { reduxTypes, store, useSelector } from '../../redux';
import { TextInput } from '../form/textInput';
import { formHelpers } from '../form/formHelpers';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * Display a display name input field for search.
 *
 * @fires onSubmit
 * @fires onClear
 * @fires onChange
 * @fires onKeyUp
 * @param {object} props
 * @param {string} props.value
 * @param {Function} props.t
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldDisplayName = ({ value, t, viewId }) => {
  const currentValue = useSelector(
    ({ view }) => view.inventoryHostsQuery?.[viewId]?.[RHSM_API_QUERY_TYPES.DISPLAY_NAME],
    value
  );

  let updatedValue = currentValue;

  /**
   * On submit, dispatch type.
   *
   * @event onSubmit
   * @returns {void}
   */
  const onSubmit = () => {
    if (formHelpers.doesNotHaveMinimumCharacters(updatedValue)) {
      return;
    }

    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.DISPLAY_NAME],
        viewId,
        [RHSM_API_QUERY_TYPES.DISPLAY_NAME]: updatedValue
      }
    ]);
  };

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

    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.DISPLAY_NAME],
        viewId,
        [RHSM_API_QUERY_TYPES.DISPLAY_NAME]: ''
      }
    ]);
  };

  /**
   * On change, update value.
   *
   * @event onChange
   * @param {object} event
   */
  const onChange = event => {
    updatedValue = event.value;
  };

  /**
   * On enter, submit value. We nest the conditions to allow enter to submit onChange value updates.
   *
   * @event onKeyUp
   * @param {object} event
   */
  const onKeyUp = event => {
    if (event.keyCode === 13) {
      if (event.value?.length) {
        updatedValue = event?.value;
      }
      onSubmit();
    }
  };

  return (
    <InputGroup>
      <TextInput
        aria-label={t('curiosity-toolbar.placeholder', { context: 'displayName' })}
        onChange={onChange}
        onClear={onClear}
        onKeyUp={onKeyUp}
        value={updatedValue}
        placeholder={t('curiosity-toolbar.placeholder', { context: 'displayName' })}
        type="search"
      />
      <Button
        onClick={onSubmit}
        variant={ButtonVariant.control}
        aria-label={t('curiosity-toolbar.button', { context: 'displayName' })}
      >
        <SearchIcon />
      </Button>
    </InputGroup>
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, value: string}}
 */
ToolbarFieldDisplayName.propTypes = {
  t: PropTypes.func,
  value: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, value: string}}
 */
ToolbarFieldDisplayName.defaultProps = {
  t: translate,
  value: null,
  viewId: 'toolbarFieldDisplayName'
};

export { ToolbarFieldDisplayName as default, ToolbarFieldDisplayName };
