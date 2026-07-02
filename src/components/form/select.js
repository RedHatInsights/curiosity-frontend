import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Select as PfSelect,
  SelectList as PfSelectList,
  SelectOption as PfSelectOption
} from '@patternfly/react-core';
import _cloneDeep from 'lodash/cloneDeep';
import _isPlainObject from 'lodash/isPlainObject';
import _findIndex from 'lodash/findIndex';
import { useMount } from 'react-use';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * A bundled wrapper for PF Select, Dropdown.
 *
 * @memberof Form
 * @module Select
 */

/**
 * Pass button variant as a select component option.
 *
 * @type {{secondary: ButtonVariant.secondary, plain: ButtonVariant.plain, tertiary:
 *     ButtonVariant.tertiary, link: ButtonVariant.link, warning: ButtonVariant.warning, control:
 *     ButtonVariant.control, danger: ButtonVariant.danger, primary: ButtonVariant.primary}}
 */
const SelectButtonVariant = { ...ButtonVariant };

/**
 * Pass select variants as a select component variant option.
 *
 * @type {{single: string, checkbox: string, dropdown: string}}
 */
const SelectVariant = {
  single: 'single',
  checkbox: 'checkbox',
  dropdown: 'dropdown'
};

/**
 * Direction as select prop option.
 *
 * @type {{up: string, down: string}}
 */
const SelectDirection = { up: 'up', down: 'down' };

/**
 * Position as select prop option.
 *
 * @type {{left: string, center: string, right: string}}
 */
const SelectPosition = { left: 'left', right: 'right', center: 'center' };

/**
 * Apply "data-" attributes to main PF element.
 *
 * @param {object} params
 * @param {React.ReactElement|HTMLElement} params.selectField
 * @param {object} params.props
 */
const updateDataAttributes = ({ selectField = {}, ...props } = {}) => {
  const { current: domElement = {} } = selectField;
  const attributes = Object.entries(props).filter(([key]) => /^data-/i.test(key));

  if (domElement?.firstChild) {
    attributes.forEach(([key, value]) => domElement?.firstChild.setAttribute(key, value));
  }
};

/**
 * Update list options for consumption by PF components
 *
 * @param {Array<unknown|{title:(React.ReactNode|undefined), value:(React.ReactNode|undefined),
 *     description:(React.ReactNode|undefined), isSelected:(boolean|undefined),
 *     isDisabled:(boolean|undefined)}>} options
 * @returns {Array}
 */
const updateOptions = options => {
  const updated = (Array.isArray(options) && _cloneDeep(options)) || [];

  return updated.map((option, index) => {
    let convertedOption = option;

    switch (typeof convertedOption) {
      case 'string':
        convertedOption = {
          title: `${(option === '' && 'Empty') || option}`,
          value: option
        };
        break;
      case 'number':
        convertedOption = {
          title: `${option}`,
          value: option
        };
        break;
    }

    // Convert undefined, null to empty values and string descriptions. Assume purposeful, but expect error.
    if (convertedOption === undefined || convertedOption === null) {
      convertedOption = {
        title: `${option}`,
        value: option
      };
    }

    if (_isPlainObject(convertedOption)) {
      convertedOption.title = convertedOption.title || 'undefined';

      switch (convertedOption.value) {
        case undefined:
        case null:
          break;
        case '':
          convertedOption.value = '';
      }

      convertedOption.isSelected = convertedOption.isSelected || false;
      convertedOption.index = index;
      convertedOption.key = `${helpers.generateHash({ value: convertedOption.value, title: convertedOption.title })}`;
    }

    return convertedOption;
  });
};

/**
 * A memoized response for the updateOptions function. Assigned to a property for testing function.
 */
updateOptions.memo = helpers.memo(updateOptions);

/**
 * Update selected list options for consumption.
 *
 * @param {string|number|null|NaN|{value: unknown}|
 *     Array<string|number|null|undefined|NaN|{value:
 *     unknown}>} options
 * @returns {Array|Array<"NaN"|"null"|unknown>}
 */
const updateSelectedOptions = options =>
  (Array.isArray(options) &&
    options.map(value => (value === null && 'null') || (value === undefined && 'undefined') || value)) ||
  (options !== undefined && options !== null && !Number.isNaN(options) && [options]) ||
  (options === null && ['null']) ||
  (Number.isNaN(options) && ['NaN']) ||
  [];

/**
 * A memoized response for the updateSelectedOptions function. Assigned to a property for testing function.
 */
updateSelectedOptions.memo = helpers.memo(updateSelectedOptions, { cacheLimit: 25 });

/**
 * Update the isSelected property for formatted options.
 *
 * @param {object} params
 * @param {Array<{title, value, isSelected}>} params.options
 * @param {Array} params.selectedOptions
 * @param {SelectVariant|string} params.variant
 * @returns {{isSelected:boolean}|undefined|Array<{isSelected:boolean}>|Array}
 */
const updateOptionsSelectedOptions = ({ options, selectedOptions = [], variant = SelectVariant.single } = {}) => {
  const memoOptions = _cloneDeep(updateOptions.memo(options));
  const memoSelectedOptions = updateSelectedOptions.memo(selectedOptions);

  const updatedOptions = memoOptions.map(option => {
    const { isSelected, title, value, index, ...meta } = option;
    let updateIsSelected = isSelected;

    if (updateIsSelected === true && !memoSelectedOptions.length) {
      return option;
    }

    if (_isPlainObject(value)) {
      updateIsSelected = _findIndex(memoSelectedOptions, value) > -1;

      if (!isSelected) {
        updateIsSelected =
          memoSelectedOptions.find(activeOption => Object.values(value).includes(activeOption)) !== undefined;
      }
    } else {
      updateIsSelected = memoSelectedOptions.includes(value);
    }

    if (!updateIsSelected) {
      updateIsSelected = memoSelectedOptions.includes(title);
    }

    if (!updateIsSelected && _isPlainObject(meta)) {
      updateIsSelected =
        memoSelectedOptions.find(activeOption => Object.values(meta).includes(activeOption)) !== undefined;
    }

    if (!updateIsSelected) {
      const foundIndex = memoSelectedOptions.find(
        activeOption => _isPlainObject(activeOption) && activeOption.index === index
      );

      if (foundIndex) {
        updateIsSelected = true;
      }
    }

    return {
      ...option,
      isSelected: updateIsSelected
    };
  });

  return {
    options: updatedOptions,
    selected: updatedOptions[(variant === SelectVariant.checkbox && 'filter') || 'find'](opt => opt.isSelected === true)
  };
};

/**
 * A memoized response for the updateOptionsSelectedOptions function. Assigned to a property for testing function.
 */
updateOptionsSelectedOptions.memo = helpers.memo(updateOptionsSelectedOptions, { cacheLimit: 25 });

/**
 * Expand the returned event for select responses.
 *
 * @param {object} params
 * @param {object} params.event
 * @param {Array<{ isSelected: boolean }>} params.options
 * @param {SelectVariant} params.variant
 * @returns {CustomEvent<{keyCode, currentTarget: {}, name, checked: *, id: *, persist: Function,
 *     value, target: {}, selected: unknown|Array<unknown>, selectedIndex: Array<number>,
 *     type: "select-one"|"select-multiple", value: unknown }>}
 */
const formatEvent = ({ event, options, variant = SelectVariant.single } = {}) => {
  const mockUpdatedOptions = helpers.memoClone(options);
  const mockSelected =
    (variant === SelectVariant.checkbox && mockUpdatedOptions.filter(({ isSelected }) => isSelected === true)) ||
    mockUpdatedOptions.find(({ isSelected }) => isSelected === true);

  const mockSelectedIndex = mockUpdatedOptions
    .filter(({ isSelected }) => isSelected === true)
    .map(({ index }) => index);

  return {
    ...createMockEvent(event),
    selected: mockSelected,
    selectedIndex: mockSelectedIndex,
    type: `select-${(variant === SelectVariant.checkbox && 'multiple') || 'one'}`,
    value: (Array.isArray(mockSelected) && mockSelected.map(({ value: mockValue }) => mockValue)) || mockSelected.value
  };
};

/**
 * Set PF components.
 *
 * @param {SelectVariant} [variant]
 * @returns {{SelectList: React.FunctionComponent<DropdownList|PfSelectList>,
 *     SelectElement: React.FunctionComponent<Dropdown|PfSelect>, SelectOption:
 *     React.FunctionComponent<DropdownItem|PfSelectOption>}}
 */
const setSelectElements = variant => ({
  SelectElement: (variant === SelectVariant.dropdown && Dropdown) || PfSelect,
  SelectList: (variant === SelectVariant.dropdown && DropdownList) || PfSelectList,
  SelectOption: (variant === SelectVariant.dropdown && DropdownItem) || PfSelectOption
});

/**
 * A memoized response for the setSelectElements function. Assigned to a property for testing function.
 */
setSelectElements.memo = helpers.memo(setSelectElements);

/**
 * Hook for handling option and selected option updates.
 *
 * @param {object} options
 * @param {updateOptions} options.options
 * @param {Function} options.onSelect
 * @param {updateSelectedOptions} options.selectedOptions
 * @param {SelectVariant} options.variant
 * @returns {{options: Array, selectedOption: undefined, onSelect: Function}}
 */
const useOnSelect = ({ options: baseOptions, onSelect, selectedOptions, variant } = {}) => {
  // True memo. Update and "re-update", base/initial arrays/objects only when necessary
  const { options: initialOptions, selected: initialSelectedOption } = updateOptionsSelectedOptions.memo({
    options: baseOptions,
    selectedOptions,
    variant
  });

  const [selectedOption, setSelectedOption] = React.useState();
  const [options, setOptions] = useState(initialOptions);

  useEffect(() => {
    setOptions(initialOptions);
    setSelectedOption(initialSelectedOption);
  }, [initialOptions, initialSelectedOption]);

  // Update the local state with user-selected options
  const onSelectCallback = useCallback(
    (event, key) => {
      const updatedOptions = _cloneDeep(options);
      const selectedOptionIndex = updatedOptions.findIndex(option => option.key === key);

      if (!options[selectedOptionIndex] || options[selectedOptionIndex].isDisabled === true) {
        if (helpers.DEV_MODE && !options[selectedOptionIndex]) {
          console.warn(`Selected option at key "${key}" doesn't exist in ${JSON.stringify(updatedOptions)}`);
        }
        if (helpers.DEV_MODE && options[selectedOptionIndex]?.isDisabled) {
          console.warn(`Selected option at index "${selectedOptionIndex}" is disabled or has no value.`);
        }
        return;
      }

      switch (variant) {
        case SelectVariant.checkbox:
          updatedOptions[selectedOptionIndex].isSelected = !updatedOptions[selectedOptionIndex].isSelected;
          break;
        case SelectVariant.single:
        default:
          updatedOptions.forEach((_option, index) => {
            updatedOptions[index].isSelected = index === selectedOptionIndex;
          });
          break;
      }

      setSelectedOption(updatedOptions[selectedOptionIndex]);
      setOptions(updatedOptions);

      if (typeof onSelect === 'function') {
        const selectEvent = formatEvent({ event, options: updatedOptions, variant });
        onSelect(selectEvent);
      }
    },
    [onSelect, variant, options]
  );

  return {
    selectedOption,
    options,
    onSelect: onSelectCallback
  };
};

/**
 * Component wrapper for PF Select and Dropdown.
 *
 * @param {object} props
 * @param {{ direction: SelectDirection,
 *     position: SelectPosition,
 *     preventOverflow: boolean }} [props.alignment] Alias for PF references to "popperProps".
 *     Override by passing a "popperProps" prop object value.
 * @param {string} [props.className]
 * @param {boolean} [props.isDisabled] Disable the select/dropdown toggle
 * @param {boolean} [props.isInline=true] Is the select/dropdown an inline-block or not.
 * @param {boolean} [props.isReadOnly] Is the select/dropdown "read only". ONLY disables the onSelect callback, use
 *     isDisabled if a "disabled field display" is required.
 * @param {number} [props.maxHeight] Max height of the select/dropdown menu
 * @param {Function} [props.onSelect]
 * @param {Array<string|number|{
 *     description: (unknown|undefined),
 *     isSelected: (boolean|undefined),
 *     isDisabled: (boolean|undefined),
 *     title: (React.ReactNode|undefined),
 *     value: unknown
 *     }>} props.options
 * @param {React.ReactNode} [props.placeholder] The default value for the select/dropdown. An emulated placeholder.
 * @param {string|number|{value: unknown}|
 *     Array<string|number|{value: unknown
 *     }>} [props.selectedOptions]
 * @param {{ content: React.ReactNode|undefined, icon: React.ReactNode|undefined,
 *     isToggleIconOnly: boolean|undefined, variant: SelectButtonVariant|undefined }} [props.toggle] select/dropdown
 *     menu-toggle props object
 * @param {SelectVariant} [props.variant=SelectVariant.single]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @returns {React.ReactElement}
 */
const Select = ({
  alignment,
  className,
  isDisabled,
  isInline = true,
  isReadOnly,
  maxHeight,
  onSelect: baseOnSelect,
  options: baseOptions,
  placeholder = 'Select option',
  selectedOptions,
  toggle,
  variant = SelectVariant.single,
  useOnSelect: useAliasOnSelect = useOnSelect,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const selectField = useRef();
  const { options, selectedOption, onSelect } = useAliasOnSelect({
    ...props,
    options: baseOptions,
    onSelect: baseOnSelect,
    placeholder,
    selectedOptions,
    variant
  });
  const { SelectElement, SelectList, SelectOption } = setSelectElements.memo(variant);

  useMount(() => {
    updateDataAttributes({ ...props, selectField });
  });

  const onKeySelectOrClickOutsideSelect = () => {
    setIsExpanded(false);
  };

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const onPfSelect = (event, value) => {
    if (variant === SelectVariant.single || variant === SelectVariant.dropdown) {
      setIsExpanded(false);
    }
    if (!isReadOnly) {
      /*
       * Remove "timeStamp", the assumption is it's intended to help cycle updates.
       * Causes issues with mock events in testing
       */
      onSelect({ ...event, timeStamp: undefined }, value);
    }
  };

  const toggleContent = toggle?.content;
  const isToggleIconOnly = toggle?.isToggleIconOnly;
  const toggleProps = {
    isDisabled: isDisabled ?? (!options || options.length === 0),
    ...toggle
  };
  delete toggleProps.content;
  delete toggleProps.isToggleIconOnly;

  const updatedProps = {
    popperProps: {
      ...alignment
    },
    maxMenuHeight: (maxHeight && `${maxHeight}px`) || undefined,
    toggle: toggleRef => (
      <MenuToggle
        className="curiosity-select-pf__toggle"
        ref={toggleRef}
        onClick={onToggle}
        isExpanded={isExpanded}
        isFullWidth={isInline === false}
        {...toggleProps}
      >
        {(!isToggleIconOnly &&
          (toggleContent ||
            (variant === SelectVariant.dropdown && placeholder) ||
            (variant === SelectVariant.single && (selectedOption?.title || placeholder)))) ||
          (variant === SelectVariant.checkbox && (
            <React.Fragment>
              {!isToggleIconOnly && `${placeholder} `}
              {options.filter(({ isSelected }) => isSelected === true).length > 0 && (
                <Badge isRead>{options.filter(({ isSelected }) => isSelected === true).length}</Badge>
              )}
            </React.Fragment>
          ))}
      </MenuToggle>
    ),
    ...props
  };

  // Note: applying isExpanded to the options map helps remove animation flicker
  return (
    <div
      ref={selectField}
      className={`curiosity-select${(isInline && ' curiosity-select__inline') || ' curiosity-select__not-inline'} fadein__fast`}
    >
      <SelectElement
        className={`curiosity-select-pf ${className || ''}`}
        isOpen={isExpanded}
        onSelect={onPfSelect}
        onOpenChange={onKeySelectOrClickOutsideSelect}
        popperProps={{
          direction: 'up'
        }}
        {...updatedProps}
      >
        <SelectList>
          {isExpanded &&
            options?.map(option => (
              <SelectOption
                className="curiosity-select-pf__option"
                role="menu"
                description={option.description}
                key={option.key}
                id={option.key}
                hasCheckbox={variant === SelectVariant.checkbox}
                icon={option.icon}
                isDisabled={option.isDisabled === true}
                isSelected={variant !== SelectVariant.dropdown && option.isSelected}
                value={option.key}
              >
                {option.title}
              </SelectOption>
            ))}
        </SelectList>
      </SelectElement>
    </div>
  );
};

export {
  Select as default,
  Select,
  formatEvent,
  SelectButtonVariant,
  SelectVariant,
  SelectDirection,
  SelectPosition,
  setSelectElements,
  updateDataAttributes,
  updateOptions,
  updateOptionsSelectedOptions,
  updateSelectedOptions,
  useOnSelect
};
