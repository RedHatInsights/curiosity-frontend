import React from 'react';
import PropTypes from 'prop-types';
import { PageSection as Main } from '@patternfly/react-core';
import { PageHeader } from './pageHeader';
import { PageColumns } from './pageColumns';
import { PageMessages } from './pageMessages';
import { PageSection } from './pageSection';
import { PageToolbar } from './pageToolbar';

/**
 * ToDo: Reevaluate, import for Main component from @redhat-cloud-services/frontend-components
 * Fallback towards PF PageSection. Named export for Main is overridden by default connected export.
 */
/**
 * Render a platform page layout.
 *
 * @param {object} props
 * @param {Node} props.children
 * @returns {Node}
 */
const PageLayout = ({ children }) => (
  <React.Fragment>
    {React.Children.toArray(children).filter(child => React.isValidElement(child) && child.type === PageHeader)}
    {React.Children.toArray(children).filter(child => React.isValidElement(child) && child.type === PageMessages)}
    {React.Children.toArray(children).filter(child => React.isValidElement(child) && child.type === PageToolbar)}
    <Main padding={{ default: 'noPadding' }} className="curiosity">
      {React.Children.toArray(children).filter(
        child => child.type !== PageHeader && child.type !== PageMessages && child.type !== PageToolbar
      )}
    </Main>
  </React.Fragment>
);

/**
 * Prop types.
 *
 * @type {{children: Node}}
 */
PageLayout.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Default props.
 */
PageLayout.defaultProps = {};

export { PageLayout as default, PageLayout, PageColumns, PageHeader, PageMessages, PageSection, PageToolbar };
