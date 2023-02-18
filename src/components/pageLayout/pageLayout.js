import React from 'react';
import PropTypes from 'prop-types';
import { PageSection as Main } from '@patternfly/react-core';
import { PageHeader } from './pageHeader';
import { PageColumns } from './pageColumns';
import { PageMessages } from './pageMessages';
import { PageSection } from './pageSection';
import { PageToolbar } from './pageToolbar';

/**
 * Page layout, organize header, columns, messages, sections, and toolbar.
 *
 * @memberof Components
 * @module PageLayout
 * @property {module} PageColumns
 * @property {module} PageHeader
 * @property {module} PageMessages
 * @property {module} PageSection
 * @property {module} PageToolbar
 */

/**
 * ToDo: Reevaluate, import for Main component from @redhat-cloud-services/frontend-components
 * Fallback towards PF PageSection. Named export for Main is overridden by default connected export.
 */
/**
 * Render a platform page layout.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @returns {React.ReactNode}
 */
const PageLayout = ({ children, className }) => (
  <React.Fragment>
    {React.Children.toArray(children).filter(child => React.isValidElement(child) && child.type === PageHeader)}
    {React.Children.toArray(children).filter(child => React.isValidElement(child) && child.type === PageMessages)}
    {React.Children.toArray(children).filter(child => React.isValidElement(child) && child.type === PageToolbar)}
    <Main padding={{ default: 'noPadding' }} className={`curiosity ${className}`}>
      {React.Children.toArray(children).filter(
        child => child.type !== PageHeader && child.type !== PageMessages && child.type !== PageToolbar
      )}
    </Main>
  </React.Fragment>
);

/**
 * Prop types.
 *
 * @type {{children: React.ReactNode, className: string}}
 */
PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{className: string}}
 */
PageLayout.defaultProps = {
  className: ''
};

export { PageLayout as default, PageLayout, PageColumns, PageHeader, PageMessages, PageSection, PageToolbar };
