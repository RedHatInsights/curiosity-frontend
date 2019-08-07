import React from 'react';
import PropTypes from 'prop-types';
import { Select as PfSelect, SelectOption as PfSelectOption, SelectVariant } from '@patternfly/react-core';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _isPlainObject from 'lodash/isPlainObject';
import { helpers } from '../../common/helpers';

class Select extends React.Component {
  state = { isExpanded: false, options: null, selected: null };

  componentDidMount() {
    const { options } = this.state;

    if (options === null) {
      this.formatOptions();
    }
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;

    if (!_isEqual(prevProps.options, options)) {
      this.formatOptions();
    }
  }

  onSelect = (event, titleSelection) => {
    const { options } = this.state;
    const { id, name, onSelect, variant } = this.props;

    const updatedOptions = options;
    const optionsIndex = updatedOptions.findIndex(option => option.title === titleSelection);
    updatedOptions[optionsIndex].selected =
      variant === SelectVariant.single ? true : !updatedOptions[optionsIndex].selected;

    if (SelectVariant.single) {
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
          selectedIndex: optionsIndex,
          type: `select-${(variant === SelectVariant.single && 'one') || 'multiple'}`,
          options: mockUpdatedOptions
        };

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

  onToggle = expanded => {
    this.setState({
      isExpanded: expanded
    });
  };

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
        updatedOptions[index].selected = activateOptions.includes(convertedOption.value);
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

  render() {
    const { options, selected, isExpanded } = this.state;
    const { ariaLabel, className, isDisabled, placeholder, variant } = this.props;

    const pfSelectOptions = {};

    // FixMe: investigate "isDisabled", PFReact quirks?
    if (!options || !options.length || isDisabled) {
      pfSelectOptions.isDisabled = true;
    }

    return (
      <PfSelect
        className={`curiosity-select ${className}`}
        variant={variant}
        aria-label={ariaLabel}
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        selections={selected}
        isExpanded={isExpanded}
        placeholderText={placeholder}
        {...pfSelectOptions}
      >
        {(options &&
          options.map(option => (
            <PfSelectOption
              key={window.btoa(option.title)}
              value={option.title}
              data-value={option.value}
              data-title={option.title}
            />
          ))) ||
          null}
      </PfSelect>
    );
  }
}

Select.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
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
  selectedOptions: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
  placeholder: PropTypes.string,
  variant: PropTypes.oneOf([...Object.values(SelectVariant)])
};

Select.defaultProps = {
  ariaLabel: 'Select option',
  className: '',
  id: helpers.generateId(),
  isDisabled: false,
  name: null,
  onSelect: helpers.noop,
  options: [],
  selectedOptions: null,
  placeholder: 'Select option',
  variant: SelectVariant.single
};

export { Select as default, Select };
