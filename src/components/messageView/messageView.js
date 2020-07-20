import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { PageLayout, PageHeader } from '../pageLayout/pageLayout';
import { helpers } from '../../common';

/**
 * FixMe: Patternfly EmptyStateIcon PropType registers as function?
 */
/**
 * Render a message view.
 *
 * @param {object} props
 * @param {Node|Function} props.icon
 * @param {string} props.message
 * @param {string} props.pageTitle
 * @param {string} props.title
 * @returns {Node}
 */
const MessageView = ({ icon, message, pageTitle, title }) => (
  <PageLayout>
    <PageHeader>{pageTitle || helpers.UI_DISPLAY_NAME}</PageHeader>
    <EmptyState variant={EmptyStateVariant.full} className="fadein">
      {icon && <EmptyStateIcon icon={icon} />}
      {title && (
        <Title headingLevel="h2" size="lg">
          {title}
        </Title>
      )}
      {message && <EmptyStateBody>{message}</EmptyStateBody>}
    </EmptyState>
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
