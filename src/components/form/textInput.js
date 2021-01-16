import React from 'react';
import PropTypes from 'prop-types';
import { TextInput as PfTextInput } from '@patternfly/react-core';
import { helpers } from '../../common';

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
    const { onClear, onKeyUp } = this.props;
    const { currentTarget, keyCode, target } = { ...event };

    event.persist();
    onKeyUp(event);

    if (keyCode === 27) {
      if (currentTarget.value === '') {
        const mockEvent = {
          id: currentTarget.name,
          name: currentTarget.name,
          value: currentTarget.value,
          target,
          currentTarget,
          persist: helpers.noop
        };

        onClear(mockEvent);
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
    const { onClear, onMouseUp } = this.props;
    const { currentTarget, target } = { ...event };

    event.persist();
    onMouseUp(event);

    if (currentTarget.value === '') {
      return;
    }

    setTimeout(() => {
      if (currentTarget.value === '') {
        const mockEvent = {
          id: currentTarget.name,
          name: currentTarget.name,
          value: currentTarget.value,
          target,
          currentTarget,
          persist: helpers.noop
        };

        onClear(mockEvent);
      }
    });
  };

  /**
   * onChange event, provide restructured event.
   *
   * @param {string} value
   * @param {object} event
   */
  onChange = (value, event) => {
    const { onChange } = this.props;
    const { currentTarget, target } = event;

    this.setState({ updatedValue: value }, () => {
      const mockEvent = {
        id: currentTarget.name,
        name: currentTarget.name,
        value,
        target,
        currentTarget,
        persist: helpers.noop
      };

      onChange(mockEvent);
    });
  };

  /**
   * Render a text input.
   *
   * @returns {Node}
   */
  render() {
    const { name, updatedValue } = this.state;
    const {
      className,
      isDisabled,
      onChange,
      onClear,
      onKeyUp,
      onMouseUp,
      isReadOnly,
      type,
      value,
      ...props
    } = this.props;
    const nameId = name || helpers.generateId();

    return (
      <PfTextInput
        id={nameId}
        name={nameId}
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
 *     name: string, className: string, isDisabled: boolean, onMouseUp: Function, type: string,
 *     value: string}}
 */
TextInput.propTypes = {
  className: PropTypes.string,
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
 *     name: string, className: string, isDisabled: boolean, onMouseUp: Function, type: string,
 *     value: string}}
 */
TextInput.defaultProps = {
  className: '',
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
