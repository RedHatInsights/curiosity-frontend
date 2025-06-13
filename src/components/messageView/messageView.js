import React from 'react';
import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
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
        <EmptyState
          variant={EmptyStateVariant.full}
          className="fadein"
          icon={(typeof icon === 'function' && icon) || (icon && (() => icon)) || undefined}
          titleText={title}
          headingLevel="h2"
        >
          {message && <EmptyStateBody>{message}</EmptyStateBody>}
        </EmptyState>
      )}
    </PageSection>
  </PageLayout>
);

export { MessageView as default, MessageView };
