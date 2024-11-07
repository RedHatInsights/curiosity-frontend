import React, { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
 * @param {string|{key: string, name: string}} props.categoryName
 * @param {string} [props.chipGroupCollapsedText]
 * @param {string} [props.chipGroupExpandedText]
 * @param {Array<(string |{ key: string, node: string })>} props.chips
 * @param {React.ReactNode} props.children
 * @param {Function} [props.deleteChip=helpers.noop]
 * @param {Function} [props.deleteChipGroup]
 * @param {boolean} [props.showToolbarItem=true]
 * @param {useToolbarContentContext} [props.useToolbarContentContext=useToolbarContentContext]
 * @param {useToolbarContext} [props.useToolbarContext=useToolbarContext]
 * @returns {JSX.Element}
 */
const ToolbarFilter = ({
  categoryName,
  chipGroupCollapsedText,
  chipGroupExpandedText,
  chips = [],
  children,
  deleteChip = helpers.noop,
  deleteChipGroup,
  showToolbarItem = true,
  useToolbarContentContext: useAliasToolbarContentContext = useToolbarContentContext,
  useToolbarContext: useAliasToolbarContext = useToolbarContext,
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

export { ToolbarFilter as default, ToolbarFilter, useToolbarContentContext, useToolbarContext };
