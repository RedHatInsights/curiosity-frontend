import React from 'react';
import PropTypes from 'prop-types';
import { Page, PageSection } from '@patternfly/react-core';

const PageLayout = ({ children }) => (
  <Page className="layout-pf subscriptions-insights">
    <PageSection noPadding>{children}</PageSection>
  </Page>
);

PageLayout.propTypes = {
  children: PropTypes.node.isRequired
};

PageLayout.defaultProps = {};

export { PageLayout as default, PageLayout };
