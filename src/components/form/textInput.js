import React, { useCallback, useState } from 'react';
import { TextInput as PfTextInput } from '@patternfly/react-core';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * Text input with state.
 *
 * @memberof Form
 * @module TextInput
 */

/**
 * A wrapper for Patternfly TextInput. Provides restructured event data,
 * and an onClear event for the search type.
 *
 * @param {object} props
 * @param {string} [props.className='']
 * @param {string} [props.id]
 * @param {boolean} [props.isDisabled=false]
 * @param {boolean} [props.isReadOnly=false]
 * @param {string} [props.name=helpers.generateId()]
 * @param {Function} [props.onChange=helpers.noop]
 * @param {Function} [props.onClear=helpers.noop]
 * @param {Function} [props.onKeyUp=helpers.noop]
 * @param {Function} [props.onMouseUp=helpers.noop]
 * @param {string} [props.type='text']
 * @param {string} [props.value='']
 * @fires onKeyUp
 * @fires onMouseUp
 * @fires onChange
 * @returns {JSX.Element}
 */
const TextInput = ({
  className = '',
  id,
  isDisabled = false,
  isReadOnly = false,
  name = helpers.generateId(),
  onChange: onChangeCallback = helpers.noop,
  onClear: onClearCallback = helpers.noop,
  onKeyUp: onKeyUpCallback = helpers.noop,
  onMouseUp: onMouseUpCallback = helpers.noop,
  type = 'text',
  value: initialValue = '',
  ...props
}) => {
  const [updatedValue, setUpdatedValue] = useState(initialValue);

  /**
   * onKeyUp event, provide additional functionality for onClear event.
   *
   * @event onKeyUp
   * @param {object} event
   */
  const onKeyUp = useCallback(
    event => {
      const { currentTarget, keyCode } = event;
      const clonedEvent = { ...event };

      onKeyUpCallback(createMockEvent(event, true));

      if (keyCode === 27) {
        if (type === 'search' && currentTarget.value === '') {
          onClearCallback(createMockEvent(clonedEvent));
        } else {
          setUpdatedValue('');
          onClearCallback(
            createMockEvent({ ...clonedEvent, ...{ currentTarget: { ...clonedEvent.currentTarget, value: '' } } })
          );
        }
      }
    },
    [onKeyUpCallback, onClearCallback, type]
  );

  /**
   * onMouseUp event, provide additional functionality for onClear event.
   *
   * @event onMouseUp
   * @param {object} event
   */
  const onMouseUp = useCallback(
    event => {
      const { currentTarget } = event;
      const clonedEvent = { ...event };

      onMouseUpCallback(createMockEvent(event, true));

      if (type !== 'search' || currentTarget.value === '') {
        return;
      }

      if (currentTarget.value === '') {
        onClearCallback(createMockEvent(clonedEvent));
      }
    },
    [onMouseUpCallback, onClearCallback, type]
  );

  /**
   * onChange event, provide restructured event.
   *
   * @event onChange
   * @param {object} event
   * @param {string} value
   */
  const onChange = useCallback(
    (event, value) => {
      const clonedEvent = { ...event };
      setUpdatedValue(value);
      onChangeCallback(createMockEvent(clonedEvent));
    },
    [onChangeCallback]
  );

  return (
    <PfTextInput
      id={id || name}
      name={name}
      className={`curiosity-text-input ${className}`}
      isDisabled={isDisabled}
      onChange={onChange}
      onKeyUp={onKeyUp}
      onMouseUp={onMouseUp}
      readOnlyVariant={(isReadOnly && 'default') || undefined}
      type={type}
      value={updatedValue}
      {...props}
    />
  );
};

export { TextInput as default, TextInput };
