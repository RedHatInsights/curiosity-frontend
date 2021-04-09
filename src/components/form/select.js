import React from 'react';
import PropTypes from 'prop-types';
import {
  DropdownDirection,
  DropdownPosition,
  Select as PfSelect,
  SelectOption as PfSelectOption,
  SelectVariant
} from '@patternfly/react-core';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _findIndex from 'lodash/findIndex';
import _isPlainObject from 'lodash/isPlainObject';
import { helpers } from '../../common/helpers';

/**
 * Pass direction as select component variant option.
 *
 * @type {DropdownDirection}
 */
const SelectDirection = DropdownDirection;

/**
 * Pass position as select component variant option.
 *
 * @type {DropdownPosition}
 */
const SelectPosition = DropdownPosition;

/**
 * A wrapper for Patternfly Select. Provides restructured event data for onSelect callback.
 *
 * @augments React.Component
 * @fires onSelect
 * @fires onToggle
 */
class Select extends React.Component {
  state = { isExpanded: false, options: null, selected: null };

  componentDidMount() {
    const { options } = this.state;

    if (options === null) {
      this.formatOptions();
    }
  }

  componentDidUpdate(prevProps) {
    const { options, selectedOptions } = this.props;

    if (!_isEqual(prevProps.options, options) || !_isEqual(prevProps.selectedOptions, selectedOptions)) {
      this.formatOptions();
    }
  }

  /**
   * Emulate select event object, apply to provided onSelect prop.
   *
   * @event onSelect
   * @param {object} event
   * @param {string} titleSelection
   */
  onSelect = (event, titleSelection) => {
    const { options } = this.state;
    const { id, name, onSelect, variant } = this.props;

    const updatedOptions = options;
    const optionsIndex = updatedOptions.findIndex(option => option.title === titleSelection);
    updatedOptions[optionsIndex].selected =
      variant === SelectVariant.single ? true : !updatedOptions[optionsIndex].selected;

    if (variant === SelectVariant.single) {
      updatedOptions.forEach((option, index) => {
        if (optionsIndex !== index) {
          updatedOptions[index].selected = false;
        }
      });
    }

    const updateSelected =
      variant === SelectVariant.single
        ? titleSelection
        : updatedOptions.filter(opt => opt.selected === true).map(opt => opt.title);

    this.setState(
      {
        options: updatedOptions,
        selected: updateSelected
      },
      () => {
        const mockUpdatedOptions = _cloneDeep(updatedOptions);

        const mockTarget = {
          id,
          name: name || id,
          value: mockUpdatedOptions[optionsIndex].value,
          selected:
            (variant === SelectVariant.single && mockUpdatedOptions[optionsIndex]) || _cloneDeep(updateSelected),
          selectedIndex: optionsIndex,
          type: `select-${(variant === SelectVariant.single && 'one') || 'multiple'}`,
          options: mockUpdatedOptions
        };

        if (variant === SelectVariant.checkbox) {
          mockTarget.checked = mockUpdatedOptions[optionsIndex].selected;
        }

        const mockEvent = {
          ...mockTarget,
          target: { ...mockTarget },
          currentTarget: { ...mockTarget },
          persist: helpers.noop
        };

        onSelect({ ...mockEvent }, optionsIndex, mockUpdatedOptions);

        if (variant === SelectVariant.single) {
          this.setState({
            isExpanded: false
          });
        }
      }
    );
  };

  /**
   * Patternfly Select's open/closed state.
   *
   * @event onToggle
   * @param {boolean} expanded
   */
  onToggle = expanded => {
    this.setState({
      isExpanded: expanded
    });
  };

  /**
   * Format options into a consumable array of objects format.
   */
  formatOptions() {
    const { options, selectedOptions, variant } = this.props;
    const updatedOptions = _isPlainObject(options)
      ? Object.keys(options).map(key => ({ ...options[key], title: key, value: options[key] }))
      : _cloneDeep(options);

    const activateOptions =
      (selectedOptions && typeof selectedOptions === 'string') || typeof selectedOptions === 'number'
        ? [selectedOptions]
        : selectedOptions;

    updatedOptions.forEach((option, index) => {
      let convertedOption = option;

      if (typeof convertedOption === 'string') {
        convertedOption = {
          title: option,
          value: option
        };

        updatedOptions[index] = convertedOption;
      }

      convertedOption.text = convertedOption.text || convertedOption.title;
      convertedOption.textContent = convertedOption.textContent || convertedOption.title;
      convertedOption.label = convertedOption.label || convertedOption.title;

      if (activateOptions) {
        let isSelected;

        if (_isPlainObject(convertedOption.value)) {
          isSelected = _findIndex(activateOptions, convertedOption.value) > -1;

          if (!isSelected) {
            const tempSearch = activateOptions.find(activeOption =>
              Object.values(convertedOption.value).includes(activeOption)
            );
            isSelected = !!tempSearch;
          }
        } else {
          isSelected = activateOptions.includes(convertedOption.value);
        }

        if (!isSelected) {
          isSelected = activateOptions.includes(convertedOption.title);
        }

        updatedOptions[index].selected = isSelected;
      }
    });

    let updateSelected;

    if (variant === SelectVariant.single) {
      updateSelected = (updatedOptions.find(opt => opt.selected === true) || {}).title;
    } else {
      updateSelected = updatedOptions.filter(opt => opt.selected === true).map(opt => opt.title);
    }

    this.setState({
      options: updatedOptions,
      selected: updateSelected
    });
  }

  /**
   * Render a select/dropdown list.
   *
   * @returns {Node}
   */
  render() {
    const { options, selected, isExpanded } = this.state;
    const {
      ariaLabel,
      className,
      direction,
      isDisabled,
      isToggleText,
      maxHeight,
      placeholder,
      position,
      toggleIcon,
      variant
    } = this.props;

    const pfSelectOptions = {
      direction,
      maxHeight
    };

    // FixMe: investigate "isDisabled", PFReact quirks?
    if (!options || !options.length || isDisabled) {
      pfSelectOptions.isDisabled = true;
    }

    /**
     * FixMe: PFReact quirks around PfSelect, requires children
     * "Null" is a typical fallback we use across the board on a multitude of React apps.
     * In this case "null" is a fallback for scenarios where an "undefined" list is passed
     * during initial mount. Converted to an empty list/array "[]" to compensate.
     */
    return (
      <PfSelect
        className={`curiosity-select${(!isToggleText && '__no-toggle-text') || ''} ${
          (position === DropdownPosition.right && 'curiosity-select__position-right') || ''
        } ${className}`}
        variant={variant}
        aria-label={ariaLabel}
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        selections={selected}
        isOpen={isExpanded}
        toggleIcon={toggleIcon}
        placeholderText={placeholder}
        {...pfSelectOptions}
      >
        {(options &&
          options.map(option => (
            <PfSelectOption
              key={window.btoa(`${option.title}-${option.value}`)}
              id={window.btoa(`${option.title}-${option.value}`)}
              value={option.title}
              data-value={(_isPlainObject(option.value) && JSON.stringify([option.value])) || option.value}
              data-title={option.title}
            />
          ))) ||
          []}
      </PfSelect>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{toggleIcon: (Node|Function), className: string, ariaLabel: string, onSelect: Function,
 *     isToggleText: boolean, maxHeight: number, name: string, options: (Array|object),
 *     selectedOptions: (number|string|Array), variant: string, id: string, isDisabled: boolean,
 *     placeholder: string, position: string, direction: string}}
 */
Select.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  direction: PropTypes.oneOf(Object.values(SelectDirection)),
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isToggleText: PropTypes.bool,
  maxHeight: PropTypes.number,
  name: PropTypes.string,
  onSelect: PropTypes.func,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.any,
        value: PropTypes.any.isRequired,
        selected: PropTypes.bool
      })
    ),
    PropTypes.shape({
      title: PropTypes.any,
      value: PropTypes.any.isRequired,
      selected: PropTypes.bool
    }),
    PropTypes.object
  ]),
  placeholder: PropTypes.string,
  position: PropTypes.oneOf(Object.values(SelectPosition)),
  selectedOptions: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
  ]),
  toggleIcon: PropTypes.element,
  variant: PropTypes.oneOf([...Object.values(SelectVariant)])
};

/**
 * Default props.
 *
 * @type {{toggleIcon: (Node|Function), className: string, ariaLabel: string, onSelect: Function, isToggleText: boolean,
 *     maxHeight: number, name: string, options: (Array|object), selectedOptions: (number|string|Array),
 *     variant: SelectVariant.single, id: string, isDisabled: boolean, placeholder: string,
 *     position: DropdownPosition.left, direction: DropdownDirection.down}}
 */
Select.defaultProps = {
  ariaLabel: 'Select option',
  className: '',
  direction: SelectDirection.down,
  id: helpers.generateId(),
  isDisabled: false,
  isToggleText: true,
  maxHeight: null,
  name: null,
  onSelect: helpers.noop,
  options: [],
  placeholder: 'Select option',
  position: SelectPosition.left,
  selectedOptions: null,
  toggleIcon: null,
  variant: SelectVariant.single
};

export { Select as default, Select, SelectDirection, SelectPosition };
