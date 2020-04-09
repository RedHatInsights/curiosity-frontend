import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState as PfEmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import { PageLayout, PageHeader } from '../pageLayout/pageLayout';
import { helpers } from '../../common';

/**
 * FixMe: Patternfly EmptyStateIcon PropType registers as function?
 */
/**
 * Render a message view.
 *
 * @returns {Node}
 */
const MessageView = ({ icon, message, pageTitle, title }) => (
  <PageLayout>
    <PageHeader>{pageTitle || helpers.UI_DISPLAY_NAME}</PageHeader>
    <PfEmptyState variant={EmptyStateVariant.full} className="fadein">
      {title && (
        <Title headingLevel="h2" size="lg">
          {title}
        </Title>
      )}
      {icon && <EmptyStateIcon icon={icon} />}
      {message && <EmptyStateBody>{message}</EmptyStateBody>}
    </PfEmptyState>
  </PageLayout>
);

/**
 * Prop types.
 *
 * @type {{icon: Node|Function, message: string, title: string}}
 */
MessageView.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  message: PropTypes.string,
  pageTitle: PropTypes.string,
  title: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{icon: null, message: null, title: null}}
 */
MessageView.defaultProps = {
  icon: null,
  message: null,
  pageTitle: null,
  title: null
};

export { MessageView as default, MessageView };
