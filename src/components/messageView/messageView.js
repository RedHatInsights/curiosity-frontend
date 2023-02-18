import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { PageLayout, PageHeader, PageSection } from '../pageLayout/pageLayout';
import { helpers } from '../../common';

/**
 * Page empty state message display.
 *
 * @memberof Components
 * @module MessageView
 */

/**
 * FixMe: Patternfly EmptyStateIcon PropType registers as function?
 */
/**
 * Render a message view, page empty state.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode|Function} props.icon
 * @param {string} props.message
 * @param {string} props.pageTitle
 * @param {string} props.title
 * @returns {React.ReactNode}
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
 * @type {{children: React.ReactNode, icon: React.ReactNode|Function, message: string, pageTitle: string, title: string}}
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
