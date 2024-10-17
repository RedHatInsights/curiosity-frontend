import React from 'react';
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
 * Render a message view, page empty state.
 * Note: PF EmptyStateIcon registers as function, we compensate for PF by allowing a ReactNode or Function.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children]
 * @param {React.ReactNode|Function} [props.icon]
 * @param {string} [props.message]
 * @param {string} [props.pageTitle]
 * @param {string} [props.title]
 * @returns {JSX.Element}
 */
const MessageView = ({ children, icon, message, pageTitle, title }) => (
  <PageLayout>
    <PageHeader>{pageTitle || helpers.UI_DISPLAY_NAME}</PageHeader>
    <PageSection>
      {children ?? (
        <EmptyState variant={EmptyStateVariant.full} className="fadein">
          {(typeof icon === 'function' && <EmptyStateIcon icon={icon} />) ||
            (icon && <EmptyStateIcon icon={() => icon} />) ||
            null}
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

export { MessageView as default, MessageView };
