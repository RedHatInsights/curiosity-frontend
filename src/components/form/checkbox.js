import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as PfCheckbox } from '@patternfly/react-core/dist/js/components/Checkbox';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * Render a checkbox form element. Provides restructured event data.
 *
 * @fires onCheckboxChange
 * @param {object} props
 * @param {string} props.ariaLabel
 * @param {Node} props.children
 * @param {*} props.isChecked
 * @param {boolean} props.isDisabled
 * @param {boolean} props.isReadOnly
 * @param {Node} props.label
 * @param {string} props.name
 * @param {Function} props.onChange
 * @param {*} props.value
 * @returns {Node}
 */
const Checkbox = ({
  ariaLabel,
  children,
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
  const nameId = name || helpers.generateId();

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
      id: nameId,
      name: nameId,
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
      id={nameId}
      isChecked={updatedChecked}
      isDisabled={isDisabled || false}
      label={children || label}
      name={nameId}
      onChange={onCheckboxChange}
      value={value}
      readOnly={isReadOnly || false}
      {...props}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{onChange: Function, children: Node, name: string, isChecked: *, isDisabled: boolean,
 *     isReadOnly: boolean, label: string, value: *, ariaLabel: string}}
 */
Checkbox.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
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
 * @type {{onChange: Function, children: Node, name: string, isChecked: *, isDisabled: boolean,
 *     isReadOnly: boolean, label: string, value: *, ariaLabel: string}}
 */
Checkbox.defaultProps = {
  ariaLabel: null,
  children: null,
  isChecked: false,
  isDisabled: false,
  isReadOnly: false,
  label: '',
  name: null,
  onChange: helpers.noop,
  value: undefined
};

export { Checkbox as default, Checkbox };
