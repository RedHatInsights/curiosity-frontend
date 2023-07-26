import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as PfTabs, Tab, TabTitleText, Grid, GridItem } from '@patternfly/react-core';
import _isEqualWith from 'lodash/isEqualWith';
import { helpers } from '../../common';

/**
 * PF tabs with state.
 *
 * @memberof Components
 * @module Tabs
 */

/**
 * FixMe: PF tabs misinterprets "isElementInView" when tab title nodes are loaded dynamically
 * It appears the use of isElementInView within PF tabs is trying to be predicative in using
 * "getBoundingClientRect" but produces questionable results in scenarios where content is
 * async created. isElementInView assumes some form of the content will always be there
 * instead of scenarios where someone tries to dynamically apply components. It may be good to
 * review using a window.setTimeout(() => handleScrollButtons()) in componentDidMount.
 *
 * Our temporary solution is to simply hide the buttons with a manual set flag affecting the
 * CSS class. This will most likely cause long-term issues.
 */
/**
 * ToDo: Insights frontend components uses a custom tabs layout, investigate related CSS classes
 * Originally we applied the CSS classes, but they appeared to provide nothing. Since Insights
 * rolled its own tabs we're hesitant to apply said classes without understanding what they provide.
 */
/**
 * A set of tabs.
 *
 * @augments React.Component
 * @fires onTab
 */
class Tabs extends React.Component {
  state = {
    updatedActiveTab: null,
    updatedTabs: null
  };

  componentDidMount() {
    const { updatedTabs } = this.state;

    if (updatedTabs === null) {
      this.setTabData();
    }
  }

  componentDidUpdate(prevProps) {
    const { tabs } = this.props;
    const customizer = (valueA, valueB) => {
      if (typeof valueA === 'function' && typeof valueB === 'function') {
        return valueA.toString() === valueB.toString();
      }

      return undefined;
    };

    if (!_isEqualWith(prevProps.tabs, tabs, customizer)) {
      this.setTabData();
    }
  }

  /**
   * On tab selected
   *
   * @event onTab
   * @param {object} params
   * @param {number} params.index
   */
  onTab = ({ index }) => {
    const { onTab } = this.props;

    this.setState(
      {
        updatedActiveTab: index
      },
      () => onTab({ index })
    );
  };

  /**
   * Convert tab objects into the required PF Tab format.
   */
  setTabData() {
    const { activeTab, defaultActiveTab, tabs } = this.props;
    let updatedActiveTab = defaultActiveTab;

    const updatedTabs = tabs.map(({ active, content, title }, index) => {
      updatedActiveTab = active ? index : updatedActiveTab;

      return (
        <Tab key={title} eventKey={index} title={<TabTitleText>{title}</TabTitleText>}>
          {content}
        </Tab>
      );
    });

    if (typeof activeTab === 'number') {
      updatedActiveTab = activeTab;
    }

    this.setState({
      updatedActiveTab,
      updatedTabs
    });
  }

  /**
   * Apply props to tabs.
   *
   * @returns {React.ReactNode}
   */
  renderTabs() {
    const { updatedActiveTab, updatedTabs } = this.state;
    const { className, hasOverflowScroll } = this.props;

    return (
      <PfTabs
        className={`curiosity-tabs${(!hasOverflowScroll && '__no-scroll') || ''} ${className || ''}`}
        activeKey={updatedActiveTab}
        onSelect={(event, index) => this.onTab({ event, index })}
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
    );
  }

  /**
   * Render tabs.
   *
   * @returns {React.ReactNode}
   */
  render() {
    return (
      <Grid className="curiosity-tabs-container">
        <GridItem span={12}>{this.renderTabs()}</GridItem>
      </Grid>
    );
  }
}

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
 *     defaultActiveTab: number, activeTab: number}}
 */
Tabs.defaultProps = {
  activeTab: null,
  className: '',
  defaultActiveTab: 0,
  hasOverflowScroll: false,
  onTab: helpers.noop,
  tabs: []
};

export { Tabs as default, Tabs };
