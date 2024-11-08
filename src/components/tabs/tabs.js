import React, { useMemo, useState } from 'react';
import { Tabs as PfTabs, Tab, TabTitleText, Grid, GridItem } from '@patternfly/react-core';
import { helpers } from '../../common';

/**
 * PF tabs with default internal state.
 *
 * @memberof Components
 * @module Tabs
 */

/**
 * A set of tabs.
 *
 * @param {object} props
 * @param {number} [props.activeTab]
 * @param {string} [props.className='']
 * @param {number} [props.defaultActiveTab=0]
 * @param {boolean} [props.hasOverflowScroll=false]
 * @param {Function} [props.onTab=helpers.noop] A user defined tab handler
 * @param {Array<{ active: (boolean|undefined), content: React.ReactNode, title: React.ReactNode }>} [props.tabs=[]]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const Tabs = ({
  activeTab,
  className = '',
  defaultActiveTab = 0,
  hasOverflowScroll = false,
  onTab = helpers.noop,
  tabs = []
}) => {
  // Apply a config driven default or fallback to internal default state.
  const [updatedActiveTab, setUpdatedActiveTab] = useState(defaultActiveTab);

  // Override internal state, if available. Avoid potential duplicate tab loading by setting directly
  const currentActiveTab = activeTab ?? updatedActiveTab;

  const updatedTabs = useMemo(
    () =>
      tabs.map(({ active, content, title }, index) => {
        if (active === true) {
          setUpdatedActiveTab(index);
        }

        return (
          <Tab key={title} eventKey={index} title={<TabTitleText>{title}</TabTitleText>}>
            {content}
          </Tab>
        );
      }),
    [tabs]
  );

  /**
   * Set internal state, call user defined callback.
   *
   * @event onSelect
   * @param {object} params
   * @param {number} params.index
   */
  const onSelect = ({ index }) => {
    setUpdatedActiveTab(index);
    onTab({ index });
  };

  return (
    <Grid className="curiosity-tabs-container">
      <GridItem span={12}>
        <PfTabs
          className={`curiosity-tabs${(!hasOverflowScroll && '__no-scroll') || ''} ${className || ''}`}
          activeKey={currentActiveTab}
          onSelect={(event, index) => onSelect({ event, index })}
          mountOnEnter
          unmountOnExit
          id={helpers.generateId()}
          inset={{
            default: 'insetNone',
            md: 'insetLg'
          }}
        >
          {updatedTabs}
        </PfTabs>
      </GridItem>
    </Grid>
  );
};

export { Tabs as default, Tabs };
