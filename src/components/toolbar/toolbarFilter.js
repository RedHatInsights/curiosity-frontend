import React, { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useMount } from 'react-use';
import { ToolbarContentContext, ToolbarContext } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { ToolbarItem, Chip, ChipGroup } from '@patternfly/react-core';
import { helpers } from '../../common/helpers';

/**
 * ToolbarFilter, wrapper component for Patternfly ToolbarFilter.
 *
 * @memberof Toolbar
 * @module ToolbarFilter
 */

/**
 * Hook for ToolbarContentContext
 *
 * @returns {{ chipContainerRef: any }}
 */
const useToolbarContentContext = () => useContext(ToolbarContentContext);

/**
 * Hook for ToolbarContext
 *
 * @returns {{ isExpanded: boolean, chipGroupContentRef: any, updateNumberFilters: Function }}
 */
const useToolbarContext = () => useContext(ToolbarContext);

/**
 * FixMe: PF-React-Core v4 & v5 ToolbarFilter should conditional check "firstElementChild".
 * This line inside of ToolbarFilter, https://github.com/patternfly/patternfly-react/blob/v4/packages/react-core/src/components/Toolbar/ToolbarFilter.tsx#L130
 * creates an application error, adding optional chaining and a conditional check for "firstElementChild"
 * removes the application error. It is beyond our current scope to determine if there are additional
 * PF Toolbar issues.
 */
/**
 * Converted PF ToolbarFilter replacement with conditional "firstElementChild".
 *
 * @param {object} props
 * @param {string|object} props.categoryName
 * @param {string} props.chipGroupCollapsedText
 * @param {string} props.chipGroupExpandedText
 * @param {Array} props.chips
 * @param {React.ReactNode} props.children
 * @param {Function} props.deleteChip
 * @param {Function} props.deleteChipGroup
 * @param {boolean} props.showToolbarItem
 * @param {Function} props.useToolbarContentContext
 * @param {Function} props.useToolbarContext
 * @returns {React.ReactNode}
 */
const ToolbarFilter = ({
  categoryName,
  chipGroupCollapsedText,
  chipGroupExpandedText,
  chips,
  children,
  deleteChip,
  deleteChipGroup,
  showToolbarItem,
  useToolbarContentContext: useAliasToolbarContentContext,
  useToolbarContext: useAliasToolbarContext,
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { isExpanded, chipGroupContentRef, updateNumberFilters = helpers.noop } = useAliasToolbarContext();
  const { chipContainerRef } = useAliasToolbarContentContext();
  const { key: normalizedCategoryKey, name: normalizedCategoryName } =
    (typeof categoryName === 'string' && { key: categoryName, name: categoryName }) || categoryName;

  useMount(() => {
    setIsMounted(true);
  });

  useEffect(() => {
    updateNumberFilters(normalizedCategoryKey, chips.length);
  }, [normalizedCategoryKey, chips, updateNumberFilters]);

  let chipGroup;

  if (chips.length) {
    const chipGroupProps = { isClosable: false };

    if (deleteChipGroup) {
      chipGroupProps.onClick = () => deleteChipGroup(categoryName);
      chipGroupProps.isClosable = true;
    }

    if (chipGroupCollapsedText) {
      chipGroupProps.collapsedText = chipGroupCollapsedText;
    }

    if (chipGroupExpandedText) {
      chipGroupProps.expandedText = chipGroupExpandedText;
    }

    chipGroup = (
      <ToolbarItem variant="chip-group">
        <ChipGroup key={normalizedCategoryKey} categoryName={normalizedCategoryName} {...chipGroupProps}>
          {chips.map(chip => {
            const normalizedChip = (typeof chip === 'string' && { key: chip, node: chip }) || chip;
            return (
              <Chip key={normalizedChip.key} onClick={() => deleteChip(normalizedCategoryKey, normalizedChip)}>
                {normalizedChip.node}
              </Chip>
            );
          })}
        </ChipGroup>
      </ToolbarItem>
    );
  }

  const portalRef =
    (!isExpanded && isMounted && chipGroupContentRef?.current?.firstElementChild) || chipContainerRef?.current;

  return (
    <React.Fragment>
      {showToolbarItem && <ToolbarItem {...props}>{children}</ToolbarItem>}
      {portalRef && createPortal(chipGroup, portalRef)}
    </React.Fragment>
  );
};

/**
 * Prop types.
 *
 * @type {{deleteChip: Function, chips: Array, deleteChipGroup: Function, children: React.ReactNode,
 *     chipGroupCollapsedText: string, useToolbarContext: Function, categoryName: string|object,
 *     chipGroupExpandedText: string, showToolbarItem: boolean, useToolbarContentContext: Function}}
 */
ToolbarFilter.propTypes = {
  categoryName: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  chipGroupCollapsedText: PropTypes.string,
  chipGroupExpandedText: PropTypes.string,
  chips: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ key: PropTypes.string, node: PropTypes.string })])
  ),
  deleteChip: PropTypes.func,
  deleteChipGroup: PropTypes.func,
  showToolbarItem: PropTypes.bool,
  useToolbarContentContext: PropTypes.func,
  useToolbarContext: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{deleteChip: Function, chips: Array, deleteChipGroup: Function, chipGroupCollapsedText: null,
 *     useToolbarContext: Function, chipGroupExpandedText: null, showToolbarItem: boolean,
 *     useToolbarContentContext: Function}}
 */
ToolbarFilter.defaultProps = {
  chipGroupCollapsedText: null,
  chipGroupExpandedText: null,
  chips: [],
  deleteChip: helpers.noop,
  deleteChipGroup: null,
  showToolbarItem: true,
  useToolbarContentContext,
  useToolbarContext
};

export { ToolbarFilter as default, ToolbarFilter, useToolbarContentContext, useToolbarContext };
