import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { EmptyState as PfEmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant } from '@patternfly/react-core';
import PageLayout from '../pageLayout/pageLayout';
import { helpers } from '../../common';

/**
 * FixMe: Patternfly EmptyStateIcon PropType is not intuitive
 * Requires the use of a function proptype?!?
 */
const MessageView = ({ icon, message, title }) => (
  <PageLayout>
    <PageHeader>
      <PageHeaderTitle title={title || helpers.UI_DISPLAY_CONFIG_NAME} />
    </PageHeader>
    <PfEmptyState variant={EmptyStateVariant.full} className="fadein">
      {icon && <EmptyStateIcon icon={icon} />}
      {message && <EmptyStateBody>{message}</EmptyStateBody>}
    </PfEmptyState>
  </PageLayout>
);

MessageView.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.func]),
  message: PropTypes.string,
  title: PropTypes.string
};

MessageView.defaultProps = {
  icon: null,
  message: null,
  title: null
};

export { MessageView as default, MessageView };
