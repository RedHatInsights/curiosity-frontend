import React from 'react';
import PropTypes from 'prop-types';
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
 * @augments React.Component
 * @fires onKeyUp
 * @fires onMouseUp
 * @fires onChange
 */
class TextInput extends React.Component {
  state = {
    updatedValue: null
  };

  /**
   * onKeyUp event, provide additional functionality for onClear event.
   *
   * @event onKeyUp
   * @param {object} event
   */
  onKeyUp = event => {
    const { onClear, onKeyUp, type } = this.props;
    const { currentTarget, keyCode } = event;
    const clonedEvent = { ...event };

    onKeyUp(createMockEvent(event, true));

    if (keyCode === 27) {
      if (type === 'search' && currentTarget.value === '') {
        onClear(createMockEvent(clonedEvent));
      } else {
        this.setState({ updatedValue: '' }, () => {
          onClear(
            createMockEvent({ ...clonedEvent, ...{ currentTarget: { ...clonedEvent.currentTarget, value: '' } } })
          );
        });
      }
    }
  };

  /**
   * onMouseUp event, provide additional functionality for onClear event.
   *
   * @event onMouseUp
   * @param {object} event
   */
  onMouseUp = event => {
    const { onClear, onMouseUp, type } = this.props;
    const { currentTarget } = event;
    const clonedEvent = { ...event };

    onMouseUp(createMockEvent(event, true));

    if (type !== 'search' || currentTarget.value === '') {
      return;
    }

    setTimeout(() => {
      if (currentTarget.value === '') {
        onClear(createMockEvent(clonedEvent));
      }
    });
  };

  /**
   * onChange event, provide restructured event.
   *
   * @event onChange
   * @param {string} value
   * @param {object} event
   */
  onChange = (value, event) => {
    const { onChange } = this.props;
    const clonedEvent = { ...event };

    this.setState({ updatedValue: value }, () => {
      onChange(createMockEvent(clonedEvent));
    });
  };

  /**
   * Render a text input.
   *
   * @returns {React.ReactNode}
   */
  render() {
    const { updatedValue } = this.state;
    const {
      className,
      id,
      isDisabled,
      name,
      onChange,
      onClear,
      onKeyUp,
      onMouseUp,
      isReadOnly,
      type,
      value,
      ...props
    } = this.props;
    const updatedName = name || helpers.generateId();
    const updatedId = id || updatedName;

    return (
      <PfTextInput
        id={updatedId}
        name={updatedName}
        className={`curiosity-text-input ${className}`}
        isDisabled={isDisabled || false}
        onChange={this.onChange}
        onKeyUp={this.onKeyUp}
        onMouseUp={this.onMouseUp}
        isReadOnly={isReadOnly || false}
        type={type}
        value={updatedValue ?? value ?? ''}
        {...props}
      />
    );
  }
}

/**
 * Prop types.
 *
 * @type {{onKeyUp: Function, isReadOnly: boolean, onChange: Function, onClear: Function,
 *     name: string, className: string, id: string, isDisabled: boolean, onMouseUp: Function,
 *     type: string, value: string}}
 */
TextInput.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onKeyUp: PropTypes.func,
  onMouseUp: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{onKeyUp: Function, isReadOnly: boolean, onChange: Function, onClear: Function,
 *     name: string, className: string, id: string, isDisabled: boolean, onMouseUp: Function,
 *     type: string, value: string}}
 */
TextInput.defaultProps = {
  className: '',
  id: null,
  isDisabled: false,
  isReadOnly: false,
  name: null,
  onChange: helpers.noop,
  onClear: helpers.noop,
  onKeyUp: helpers.noop,
  onMouseUp: helpers.noop,
  type: 'text',
  value: ''
};

export { TextInput as default, TextInput };
