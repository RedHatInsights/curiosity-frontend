import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { PageLayout, PageHeader, PageSection } from '../pageLayout/pageLayout';
import { helpers } from '../../common';

/**
 * FixMe: Patternfly EmptyStateIcon PropType registers as function?
 */
/**
 * Render a message view.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {Node|Function} props.icon
 * @param {string} props.message
 * @param {string} props.pageTitle
 * @param {string} props.title
 * @returns {Node}
 */
const MessageView = ({ children, icon, message, pageTitle, title }) => (
  <PageLayout>
    <PageHeader>{pageTitle || helpers.UI_DISPLAY_NAME}</PageHeader>
    <PageSection>
      {children ?? (
        <EmptyState variant={EmptyStateVariant.full} className="fadein">
          {icon && <EmptyStateIcon icon={icon} />}
          {title && (
            <Title headingLevel="h2" size="lg">
              {title}
            </Title>
          )}
          {message && <EmptyStateBody>{message}</EmptyStateBody>}
        </EmptyState>
      )}
    </PageSection>
  </PageLayout>
);

/**
 * Prop types.
 *
 * @type {{children: Node, icon: Node|Function, message: string, pageTitle: string, title: string}}
 */
MessageView.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  message: PropTypes.string,
  pageTitle: PropTypes.string,
  title: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{children: null, icon: null, message: null, pageTitle: null, title: null}}
 */
MessageView.defaultProps = {
  children: null,
  icon: null,
  message: null,
  pageTitle: null,
  title: null
};

export { MessageView as default, MessageView };
