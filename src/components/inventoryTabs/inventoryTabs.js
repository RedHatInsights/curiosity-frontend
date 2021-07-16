import React from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { connect, reduxTypes, store } from '../../redux';
import { Tabs } from '../tabs/tabs';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';
import { InventoryTab } from './inventoryTab';

/**
 * A system inventory tabs component.
 *
 * @augments React.Component
 * @fires onTab
 */
class InventoryTabs extends React.Component {
  /**
   * On tab update state.
   *
   * @event onTab
   * @param {object} params
   * @param {string} params.index tab index
   */
  onTab = ({ index }) => {
    const { productId } = this.props;

    store.dispatch({
      type: reduxTypes.inventory.SET_INVENTORY_TAB,
      tabs: {
        [productId]: index
      }
    });
  };

  /**
   * Render inventory tabs using Inventory tab passed props only. A parallel outcome can be
   * achieved by passing an array of objects through a prop.
   *
   * @returns {Node}
   */
  render() {
    const { activeTab, children, defaultActiveTab, isDisabled, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const updatedChildren = React.Children.toArray(children).map((child, index) => {
      const { props = {} } = child;

      return {
        active: props.active || false,
        content: props.children || child,
        title: props.title || t('curiosity-inventory.tabSubHeading', { count: index })
      };
    });

    return (
      <React.Fragment>
        <Title headingLevel="h2" className="sr-only">
          {t('curiosity-inventory.tabHeading', { count: updatedChildren.length })}
        </Title>
        <Tabs activeTab={activeTab} defaultActiveTab={defaultActiveTab} onTab={this.onTab} tabs={updatedChildren} />
      </React.Fragment>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{productId: string, t: Function, children: Node, defaultActiveTab: number, isDisabled: boolean,
 *     activeTab: number}}
 */
InventoryTabs.propTypes = {
  activeTab: PropTypes.number,
  children: PropTypes.node.isRequired,
  defaultActiveTab: PropTypes.number,
  isDisabled: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: translate, defaultActiveTab: number, isDisabled: boolean, activeTab: number}}
 */
InventoryTabs.defaultProps = {
  activeTab: 0,
  defaultActiveTab: 0,
  isDisabled: helpers.UI_DISABLED_TABLE,
  t: translate
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const mapStateToProps = ({ inventory }, { productId }) => ({ activeTab: inventory.tabs?.[productId] });

const ConnectedInventoryTabs = connect(mapStateToProps)(InventoryTabs);

export { ConnectedInventoryTabs as default, ConnectedInventoryTabs, InventoryTabs, InventoryTab };
