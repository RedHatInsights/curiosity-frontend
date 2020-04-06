import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as PfCheckbox } from '@patternfly/react-core/dist/js/components/Checkbox';
import { helpers } from '../../common';

/**
 * Render a checkbox form element.
 *
 * @returns {Node}
 */
const Checkbox = ({ ariaLabel, checked, children, isDisabled, label, name, onChange, readOnly, value, ...props }) => {
  const nameId = name || helpers.generateId();

  const onCheckboxChange = (isChecked, event) => {
    const { currentTarget, target } = event;
    const mockEvent = {
      id: nameId,
      name: nameId,
      value,
      checked: isChecked,
      target,
      currentTarget,
      persist: helpers.noop
    };
    onChange(mockEvent);
  };

  return (
    <PfCheckbox
      aria-label={ariaLabel || children || label}
      checked={checked}
      id={nameId}
      isChecked={checked}
      isDisabled={isDisabled || readOnly || false}
      label={children || label}
      name={nameId}
      onChange={onCheckboxChange}
      value={value}
      readOnly={readOnly || false}
      {...props}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{onChange: Function, children: Node, name: string, checked: boolean, readOnly: boolean,
 *     label: string, value: *, ariaLabel: string}}
 */
Checkbox.propTypes = {
  ariaLabel: PropTypes.string,
  checked: PropTypes.any,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  label: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  value: PropTypes.any
};

/**
 * Default props.
 *
 * @type {{onChange: Function, children: null, name: null, checked: undefined, readOnly: undefined,
 *     label: string, value: undefined, ariaLabel: null}}
 */
Checkbox.defaultProps = {
  ariaLabel: null,
  checked: undefined,
  children: null,
  isDisabled: false,
  label: '',
  name: null,
  onChange: helpers.noop,
  readOnly: false,
  value: undefined
};

export { Checkbox as default, Checkbox };
