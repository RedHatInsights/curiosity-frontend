import React, { useRef, useState } from 'react';
import { useShallowCompareEffect, useUnmount } from 'react-use';
import { ButtonVariant as PfButtonVariant } from '@patternfly/react-core';
import {
  Dropdown,
  DropdownDirection,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  DropdownToggleAction,
  DropdownToggleCheckbox,
  Select as PfSelect,
  SelectOption as PfSelectOption,
  SelectVariant as PfSelectVariant
} from '@patternfly/react-core/deprecated';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import _isPlainObject from 'lodash/isPlainObject';
import _memoize from 'lodash/memoize';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * A deprecated bundled wrapper for PF5 Select, Dropdown.
 *
 * @memberof Form
 * @module Select
 * @deprecated
 */

/**
 * Dropdown split button variants
 *
 * @type {{default: string, checkbox: string, action: string}}
 */
const SplitButtonVariant = {
  action: 'action',
  checkbox: 'checkbox',
  default: 'default'
};

/**
 * Dropdown toggle button variants
 *
 * @type {{secondary: string, default: string, plain: string, text: string, primary: string}}
 */
const ButtonVariant = PfButtonVariant;

/**
 * Pass button variant as a select component option.
 *
 * @type {{secondary: string, default: string, plain: string, text: string, primary: string}}
 */
const SelectButtonVariant = { ...ButtonVariant };

/**
 * Pass direction as select component variant option.
 *
 * @type {{up: DropdownDirection.up, down: DropdownDirection.down}}
 */
const SelectDirection = { ...DropdownDirection };

/**
 * Pass position as select component variant option.
 *
 * @type {{left: DropdownPosition.left, right: DropdownPosition.right}}
 */
const SelectPosition = { ...DropdownPosition };

/**
 * Pass select variants as a select component variant option.
 *
 * @type {{single: SelectVariant.single, checkbox: SelectVariant.checkbox, typeahead: SelectVariant.typeahead,
 *     typeaheadMulti: SelectVariant.typeaheadMulti}}
 */
const SelectVariant = { ...PfSelectVariant };

/**
 * FixMe: attributes on PF select and dropdown components do not allow data- attributes being passed
 * FixMe: PF dropdown, select attempt to break the ref attribute?
 * Moving from a class to func wrapper exposes a PF "special props warning", https://bit.ly/2n0hzWo
 */
/**
 * Format options into a consumable array of objects.
 * Note: It is understood that for line 83'ish around "updatedOptions" we dump all values regardless
 * of whether they are plain objects, or not, into updatedOptions. This has been done for speed only,
 * one less check to perform.
 *
 * @param {object} params
 * @param {*|React.ReactNode} params.selectField
 * @param {object|Array} params.options
 * @param {string|number|Array} params.selectedOptions
 * @param {string} params.variant
 * @param {object} params.props
 * @returns {{options: Array|any, selected: Array}}
 */
const formatOptions = ({ selectField = { current: null }, options, selectedOptions, variant, ...props } = {}) => {
  const { current: domElement = {} } = selectField;
  const dataAttributes = Object.entries(props).filter(([key]) => /^data-/i.test(key));
  const updatedOptions =
    (_isPlainObject(options) && Object.entries(options).map(([key, value]) => ({ ...value, title: key, value }))) ||
    (options && _cloneDeep(options)) ||
    [];
  const isSelectedOptionsStringNumber = typeof selectedOptions === 'string' || typeof selectedOptions === 'number';
  const activateOptions =
    (Array.isArray(selectedOptions) && selectedOptions) || (isSelectedOptionsStringNumber && [selectedOptions]) || [];

  updatedOptions.forEach((option, index) => {
    let convertedOption = option;

    if (typeof convertedOption === 'string') {
      convertedOption = {
        title: option,
        value: option
      };

      updatedOptions[index] = convertedOption;
    } else if (typeof convertedOption.title === 'function') {
      convertedOption.title = convertedOption.title();
    }

    convertedOption.text = convertedOption.text || convertedOption.title;
    convertedOption.textContent = convertedOption.textContent || convertedOption.title;
    convertedOption.label = convertedOption.label || convertedOption.title;

    if (activateOptions.length) {
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

  if (domElement?.firstChild) {
    dataAttributes.forEach(([key, value]) => domElement?.firstChild.setAttribute(key, value));
  }

  return {
    options: updatedOptions,
    selected: updateSelected
  };
};

/**
 * Return assumed/expected PF select props.
 *
 * @param {object} params
 * @param {boolean} params.isDisabled
 * @param {string} params.placeholder
 * @param {object|Array} params.options
 * @returns {{}}
 */
const formatSelectProps = _memoize(({ isDisabled, placeholder, options } = {}) => {
  const updatedProps = {};

  if (!options || !options.length || isDisabled) {
    updatedProps.isDisabled = true;
  }

  if (typeof placeholder === 'string' && placeholder) {
    updatedProps.hasPlaceholderStyle = true;
  }

  return updatedProps;
});

/**
 * Format consistent dropdown button props.
 *
 * @param {object} params
 * @param {boolean} params.isDisabled
 * @param {Array} params.options
 * @param {React.ReactNode} params.buttonContent
 * @param {string} params.buttonVariant
 * @param {Function} params.onSplitButton
 * @param {string} params.placeholder
 * @param {string} params.splitButtonVariant
 * @returns {*}
 */
const formatButtonProps = _memoize(
  ({ isDisabled, options, buttonContent, buttonVariant, onSplitButton, placeholder, splitButtonVariant } = {}) => {
    const buttonVariantPropLookup = {
      default: { toggleVariant: 'default' },
      plain: { isPlain: true, toggleIndicator: null },
      primary: { toggleVariant: 'primary' },
      secondary: { toggleVariant: 'secondary' },
      text: { isText: true }
    };

    const splitButtonVariantPropLookup = {
      action: {
        splitButtonVariant: 'action',
        splitButtonItems: [
          <DropdownToggleAction onClick={onSplitButton} key="toggle-action">
            {buttonContent}
          </DropdownToggleAction>
        ]
      },
      default: {
        splitButtonVariant: 'default',
        splitButtonItems: [
          <DropdownToggleAction onClick={onSplitButton} key="toggle-action">
            {buttonContent}
          </DropdownToggleAction>
        ]
      },
      checkbox: {
        splitButtonVariant: 'checkbox',
        splitButtonItems: [
          <DropdownToggleCheckbox
            id={`toggle-action-${placeholder}`}
            key="toggle-action"
            onClick={onSplitButton}
            aria-label={placeholder}
            placeholder={placeholder}
          />
        ]
      }
    };

    const updatedProps = {
      ...buttonVariantPropLookup[buttonVariant],
      ...splitButtonVariantPropLookup[splitButtonVariant]
    };

    if (!options || !options.length || isDisabled) {
      updatedProps.isDisabled = true;
    }

    return updatedProps;
  }
);

/**
 * FixMe: PF has an inconsistency in how it applies props for the dropdown
 * Sometimes those props are on the toggle, sometimes those props are on the parent, little bit of guesswork.
 * Additionally, it's not filtering props so you'll throw the "[HTML doesn't recognize attribute]" error.
 */
/**
 * Fix pf props inconsistency for dropdown button props.
 *
 * @param {object} formattedButtonProps
 * @returns {*}
 */
const formatButtonParentProps = (formattedButtonProps = {}) => {
  const updatedButtonProps = formatButtonProps(formattedButtonProps);
  delete updatedButtonProps.isDisabled;
  delete updatedButtonProps.toggleIndicator;

  return updatedButtonProps;
};

/**
 * A wrapper for Pf Select, and emulator for Pf Dropdown. Provides consistent restructured event data for onSelect
 * callback for both select and dropdown.
 *
 * @param {object} props
 * @param {string} [props.ariaLabel='Select option']
 * @param {React.ReactNode} [props.buttonContent]
 * @param {ButtonVariant} [props.buttonVariant=ButtonVariant.default]
 * @param {string} [props.className='']
 * @param {SelectDirection} [props.direction=SelectDirection.down]
 * @param {string} [props.id=helpers.generateId()]
 * @param {boolean} [props.isDisabled=false]
 * @param {boolean} [props.isDropdownButton=false]
 * @param {boolean} [props.isFlipEnabled=false]
 * @param {boolean} [props.isInline=true]
 * @param {boolean} [props.isToggleText=true]
 * @param {number} [props.maxHeight]
 * @param {string} [props.name]
 * @param {Function} [props.onSelect=helpers.noop]
 * @param {Function} [props.onSplitButton]
 * @param {{
 *     description: (unknown|undefined),
 *     selected: (boolean|undefined),
 *     isDisabledAllowEvent: (boolean|undefined),
 *     isDisabled: (boolean|undefined),
 *     title: (string|undefined),
 *     value: unknown
 *     }|Array<{
 *     description: (unknown|undefined),
 *     selected: (boolean|undefined),
 *     isDisabledAllowEvent: (boolean|undefined),
 *     isDisabled: (boolean|undefined),
 *     title: (string|undefined),
 *     value: unknown
 *     }>|Array<{string}>} [props.options=[]]
 * @param {string} [props.placeholder='Select option']
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {number|string|Array<(number|string)>} [props.selectedOptions]
 * @param {boolean} [props.splitButtonAllowDualButtonToggle=true]
 * @param {SplitButtonVariant} [props.splitButtonVariant]
 * @param {React.ReactNode|Function} [props.toggleIcon]
 * @param {SelectVariant} [props.variant=SelectVariant.single]
 * @fires onDropdownSelect
 * @fires onSplitButton
 * @fires onToggle
 * @returns {JSX.Element}
 */
const Select = ({
  ariaLabel = 'Select option',
  buttonContent,
  buttonVariant = ButtonVariant.default,
  className = '',
  direction = SelectDirection.down,
  id = helpers.generateId(),
  isDisabled = false,
  isDropdownButton = false,
  isFlipEnabled = false,
  isInline = true,
  isToggleText = true,
  maxHeight,
  name,
  onSelect = helpers.noop,
  onSplitButton,
  options: baseOptions = [],
  placeholder = 'Select option',
  position = SelectPosition.left,
  selectedOptions,
  splitButtonAllowDualButtonToggle = true,
  splitButtonVariant,
  toggleIcon,
  variant = SelectVariant.single,
  ...props
}) => {
  const [isMounted, setIsMounted] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [options, setOptions] = useState(baseOptions);
  const [selected, setSelected] = useState([]);
  const selectField = useRef();

  useUnmount(() => {
    setIsMounted(false);
  });

  useShallowCompareEffect(() => {
    if (isMounted !== false) {
      const { options: updatedOptions, selected: updatedSelected } = formatOptions({
        selectField,
        options: baseOptions,
        selectedOptions,
        variant,
        ...props
      });
      setOptions(updatedOptions);
      setSelected(updatedSelected);
    }
  }, [baseOptions, props, selectField, selectedOptions, variant]);

  /**
   * Open/closed state.
   *
   * @event onToggle
   * @param {boolean} expanded
   */
  const onToggle = expanded => {
    setIsExpanded(expanded);
  };

  /**
   * Split button event handler.
   *
   * @event onSplitButton
   * @param {object} event
   */
  const onUpdatedSplitButton = event => {
    if (splitButtonAllowDualButtonToggle) {
      onToggle(!isExpanded);
    }

    if (typeof onSplitButton === 'function') {
      const updatedOptions = _cloneDeep(options);
      onSplitButton(
        {
          ...createMockEvent(event),
          options: updatedOptions
        },
        -1,
        updatedOptions
      );
    }
  };

  /**
   * Emulate select event object, apply to provided onSelect prop.
   *
   * @event onDropdownSelect
   * @param {object} event
   * @param {string} titleSelection
   */
  const onDropdownSelect = (event, titleSelection) => {
    const updatedOptions = options;
    const optionsIndex = updatedOptions.findIndex(
      option =>
        (titleSelection && option.title === titleSelection) ||
        event.currentTarget.querySelector('[data-title]')?.getAttribute('data-title') === option.title ||
        event.currentTarget.innerText === option.title
    );

    if (updatedOptions[optionsIndex].isDisabled === true) {
      return;
    }

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

    const mockUpdatedOptions = _cloneDeep(updatedOptions);

    const mockTarget = {
      id,
      name: name || id,
      value: !updatedOptions[optionsIndex].isDisabledAllowEvent ? mockUpdatedOptions[optionsIndex].value : undefined,
      isDisabled: updatedOptions[optionsIndex].isDisabledAllowEvent === true,
      selected: (variant === SelectVariant.single && mockUpdatedOptions[optionsIndex]) || _cloneDeep(updateSelected),
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

    setOptions(updatedOptions);
    setSelected(updateSelected);

    onSelect({ ...mockEvent }, optionsIndex, mockUpdatedOptions);

    if (variant === SelectVariant.single && !updatedOptions[optionsIndex].isDisabledAllowEvent) {
      setIsExpanded(false);
    }
  };

  /**
   * Apply dropdown.
   *
   * @returns {React.ReactNode}
   */
  const renderDropdownButton = () => (
    <Dropdown
      direction={direction}
      isFlipEnabled={isFlipEnabled}
      isOpen={isExpanded}
      position={position}
      toggle={
        <DropdownToggle
          onToggle={(_event, expanded) => onToggle(expanded)}
          {...formatButtonProps({
            isDisabled,
            onSplitButton: onUpdatedSplitButton,
            options,
            buttonVariant,
            buttonContent,
            splitButtonVariant,
            placeholder: placeholder || ariaLabel
          })}
        >
          {toggleIcon ||
            (!splitButtonVariant && buttonContent) ||
            (!splitButtonVariant && placeholder) ||
            (!SplitButtonVariant && ariaLabel)}
        </DropdownToggle>
      }
      dropdownItems={
        options?.map(option => (
          <DropdownItem
            className={(option.isDisabledAllowEvent === true && 'pf-m-disabled') || ''}
            onClick={onDropdownSelect}
            key={window.btoa(`${option.title}-${option.value}`)}
            id={window.btoa(`${option.title}-${option.value}`)}
            isDisabled={option.isDisabled === true}
            data-value={(_isPlainObject(option.value) && JSON.stringify([option.value])) || option.value}
            data-title={option.title}
            data-description={option.description}
            description={option.description}
          >
            {option.title}
          </DropdownItem>
        )) || []
      }
      {...formatButtonParentProps({ buttonVariant })}
      {...props}
    />
  );

  /**
   * Apply select.
   *
   * @returns {React.ReactNode}
   */
  const renderSelect = () => (
    <PfSelect
      className={`curiosity-select-pf${(!isToggleText && '__no-toggle-text') || ''} ${
        (direction === SelectDirection.down && 'curiosity-select-pf__position-down') || ''
      } ${(position === SelectPosition.right && 'curiosity-select-pf__position-right') || ''} ${className}`}
      variant={variant}
      aria-label={ariaLabel}
      onToggle={(_event, expanded) => onToggle(expanded)}
      onSelect={onDropdownSelect}
      selections={selected}
      isFlipEnabled={isFlipEnabled}
      isOpen={isExpanded}
      toggleIcon={toggleIcon}
      placeholderText={(typeof placeholder === 'string' && placeholder) || undefined}
      {...{
        direction,
        maxHeight,
        ...formatSelectProps({
          isDisabled,
          options: baseOptions,
          placeholder
        })
      }}
      {...props}
    >
      {options?.map(option => (
        <PfSelectOption
          className={(option.isDisabledAllowEvent === true && 'pf-m-disabled') || ''}
          key={window.btoa(`${option.title}-${option.value}`)}
          id={window.btoa(`${option.title}-${option.value}`)}
          value={option.title}
          isDisabled={option.isDisabled === true}
          data-value={(_isPlainObject(option.value) && JSON.stringify([option.value])) || option.value}
          data-title={option.title}
          data-description={option.description}
        />
      )) || []}
    </PfSelect>
  );

  return (
    <div
      ref={selectField}
      className={`curiosity-select${(isInline && ' curiosity-select__inline') || ' curiosity-select__not-inline'}`}
    >
      {(isDropdownButton && renderDropdownButton()) || renderSelect()}
    </div>
  );
};

export {
  Select as default,
  Select,
  ButtonVariant,
  formatOptions,
  formatButtonProps,
  formatSelectProps,
  SelectDirection,
  SelectPosition,
  SelectVariant,
  SelectButtonVariant,
  SplitButtonVariant
};
