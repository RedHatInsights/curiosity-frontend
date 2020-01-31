import React from 'react';
import PropTypes from 'prop-types';
import { PageSection as Main } from '@patternfly/react-core';
import { PageHeader } from './pageHeader';
import { PageSection } from './pageSection';

/**
 * ToDo: Reevaluate, import for Main component from @redhat-cloud-services/frontend-components
 * Fallback towards PF PageSection. Named export for Main is overridden by default connected export.
 */
const PageLayout = ({ children }) => (
  <React.Fragment>
    {React.Children.toArray(children).filter(child => React.isValidElement(child) && child.type === PageHeader)}
    <Main className="curiosity">{React.Children.toArray(children).filter(child => child.type !== PageHeader)}</Main>
  </React.Fragment>
);

PageLayout.propTypes = {
  children: PropTypes.node.isRequired
};

PageLayout.defaultProps = {};

export { PageLayout as default, PageLayout, PageHeader, PageSection };
