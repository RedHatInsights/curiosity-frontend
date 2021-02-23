import React from 'react';
import PropTypes from 'prop-types';
import { Select as PfSelect, SelectOption as PfSelectOption, SelectVariant } from '@patternfly/react-core';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _isPlainObject from 'lodash/isPlainObject';
import { helpers } from '../../common/helpers';

/**
 * FixMe: Patternfly React select generates a random ID for select options.
 * On the surface this seems like a legitimate update until you remember unit tests.
 * Quite a few apps use test snapshots causing certain rendered select snapshots to
 * fail consistently. Appears this may have been part of the "favorites" update.
 * The solution centers around updating the  "GenerateId helper" and detecting a
 * test, dev, or prod environment instead of generating a random string every time.
 *
 * This issue also has the side-effect of making the attribute inadvertently
 * "required" anywhere it's used in an effort to squash it.
 */
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
        updatedOptions[index].selected =
          activateOptions.includes(convertedOption.value) || activateOptions.includes(convertedOption.title);
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
    const { ariaLabel, className, isDisabled, isToggleText, maxHeight, placeholder, toggleIcon, variant } = this.props;

    const pfSelectOptions = {
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
        className={`curiosity-select${(!isToggleText && '__no-toggle-text') || ''} ${className}`}
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
              data-value={option.value}
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
 * @type {{isToggleText: boolean, toggleIcon: (Node|Function), name: string, options: (Array|object),
 *     selectedOptions: (number|string|Array), variant: (object|string), className: string,
 *     id: string, isDisabled: boolean, placeholder: string, ariaLabel: string,
 *     onSelect: Function}}
 */
Select.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
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
  selectedOptions: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
  toggleIcon: PropTypes.element,
  variant: PropTypes.oneOf([...Object.values(SelectVariant)])
};

/**
 * Default props.
 *
 * @type {{isToggleText: boolean, toggleIcon: (Node|Function), name: string, options: (Array|object),
 *     selectedOptions: (number|string|Array), variant: (object|string), className: string,
 *     id: string, isDisabled: boolean, placeholder: string, ariaLabel: string,
 *     onSelect: Function}}
 */
Select.defaultProps = {
  ariaLabel: 'Select option',
  className: '',
  id: helpers.generateId(),
  isDisabled: false,
  isToggleText: true,
  maxHeight: null,
  name: null,
  onSelect: helpers.noop,
  options: [],
  placeholder: 'Select option',
  selectedOptions: null,
  toggleIcon: null,
  variant: SelectVariant.single
};

export { Select as default, Select };
