import React from 'react';
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
 * @param {string} [props.ariaLabel]
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.id]
 * @param {boolean} [props.isChecked=false]
 * @param {boolean} [props.isDisabled=false]
 * @param {boolean} [props.isReadOnly=false]
 * @param {React.ReactNode} [props.label]
 * @param {string} [props.name]
 * @param {Function} [props.onChange=helpers.noop]
 * @param {string} [props.value]
 * @returns {JSX.Element}
 */
const Checkbox = ({
  ariaLabel,
  children,
  id,
  isChecked = false,
  isDisabled = false,
  isReadOnly = false,
  label = '',
  name = helpers.generateId(),
  onChange = helpers.noop,
  value,
  ...props
}) => {
  const [check, setCheck] = React.useState();
  const updatedChecked = check ?? isChecked ?? false;
  const updatedId = id || name;

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
      name,
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
      isDisabled={isDisabled}
      label={children || label}
      name={name}
      onChange={(event, checked) => onCheckboxChange(checked, event)}
      value={value}
      readOnly={isReadOnly}
      {...props}
    />
  );
};

export { Checkbox as default, Checkbox };
