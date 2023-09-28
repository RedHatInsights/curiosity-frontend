import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as PfCheckbox } from '@patternfly/react-core/dist/js/components/Checkbox';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * A checkbox with state.
 *
 * @memberof Form
 * @module Checkbox
 */

/**
 * Render a checkbox form element. Provides restructured event data.
 *
 * @fires onCheckboxChange
 * @param {object} props
 * @param {string} props.ariaLabel
 * @param {React.ReactNode} props.children
 * @param {string} props.id
 * @param {*} props.isChecked
 * @param {boolean} props.isDisabled
 * @param {boolean} props.isReadOnly
 * @param {React.ReactNode} props.label
 * @param {string} props.name
 * @param {Function} props.onChange
 * @param {*} props.value
 * @returns {React.ReactNode}
 */
const Checkbox = ({
  ariaLabel,
  children,
  id,
  isChecked,
  isDisabled,
  isReadOnly,
  label,
  name,
  onChange,
  value,
  ...props
}) => {
  const [check, setCheck] = React.useState();
  const updatedChecked = check ?? isChecked ?? false;
  const updatedName = name || helpers.generateId();
  const updatedId = id || updatedName;

  /**
   * onChange event, provide restructured event.
   *
   * @event onCheckboxChange
   * @param {boolean} checked
   * @param {object} event
   */
  const onCheckboxChange = (checked, event) => {
    const mockEvent = {
      ...createMockEvent(event),
      id: updatedId,
      name: updatedName,
      value,
      checked
    };

    setCheck(checked);
    onChange(mockEvent);
  };

  return (
    <PfCheckbox
      aria-label={ariaLabel || children || label}
      checked={updatedChecked}
      id={updatedId}
      isChecked={updatedChecked}
      isDisabled={isDisabled || false}
      label={children || label}
      name={updatedName}
      onChange={(event, checked) => onCheckboxChange(checked, event)}
      value={value}
      readOnly={isReadOnly || false}
      {...props}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{isReadOnly: boolean, onChange: Function, children: React.ReactNode, name: string, id: string,
 *     isDisabled: boolean, label: string, isChecked: boolean, value: *, ariaLabel: string}}
 */
Checkbox.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string,
  isChecked: PropTypes.any,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  label: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any
};

/**
 * Default props.
 *
 * @type {{isReadOnly: boolean, onChange: Function, children: React.ReactNode, name: string, id: string,
 *     isDisabled: boolean, label: string, isChecked: boolean, value: *, ariaLabel: string}}
 */
Checkbox.defaultProps = {
  ariaLabel: null,
  children: null,
  id: null,
  isChecked: false,
  isDisabled: false,
  isReadOnly: false,
  label: '',
  name: null,
  onChange: helpers.noop,
  value: undefined
};

export { Checkbox as default, Checkbox };
