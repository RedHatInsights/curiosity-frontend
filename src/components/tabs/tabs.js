import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
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
 * @param {number} props.defaultActiveTab
 * @param {Array} props.tabs
 * @param {Function} props.onTab A user defined tab handler
 * @param {string} props.className
 * @param {boolean} props.hasOverflowScroll
 * @param {number} props.activeTab
 * @fires onSelect
 * @returns {React.ReactNode}
 */
const Tabs = ({ activeTab, defaultActiveTab, tabs, onTab, className, hasOverflowScroll }) => {
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

/**
 * Prop types.
 *
 * @type {{tabs: Array, hasOverflowScroll: boolean, onTab: Function, className: string,
 *     defaultActiveTab: number, activeTab: number}}
 */
Tabs.propTypes = {
  activeTab: PropTypes.number,
  className: PropTypes.string,
  defaultActiveTab: PropTypes.number,
  hasOverflowScroll: PropTypes.bool,
  onTab: PropTypes.func,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      content: PropTypes.node.isRequired,
      title: PropTypes.node.isRequired
    })
  )
};

/**
 * Default props.
 *
 * @type {{tabs: Array, hasOverflowScroll: boolean, onTab: Function, className: string,
 *     defaultActiveTab: number, activeTab: number|undefined}}
 */
Tabs.defaultProps = {
  activeTab: undefined,
  className: '',
  defaultActiveTab: 0,
  hasOverflowScroll: false,
  onTab: helpers.noop,
  tabs: []
};

export { Tabs as default, Tabs };
