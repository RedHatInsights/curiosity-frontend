import React from 'react';
import PropTypes from 'prop-types';
import ReactBreakpoints from 'react-breakpoints';
import { Page, PageSection } from '@patternfly/react-core';
import { helpers } from '../../common/helpers';

const PageLayout = ({ children }) => (
  <ReactBreakpoints breakpoints={helpers.breakpoints}>
    <Page className="layout-pf curiosity">
      <PageSection noPadding>{children}</PageSection>
    </Page>
  </ReactBreakpoints>
);

PageLayout.propTypes = {
  children: PropTypes.node.isRequired
};

PageLayout.defaultProps = {};

export { PageLayout as default, PageLayout };
