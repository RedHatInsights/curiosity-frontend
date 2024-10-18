import React from 'react';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

/**
 * @memberof PageLayout
 * @module PageMessages
 */

/**
 * Render a platform toolbar section.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 * @returns {JSX.Element}
 */
const PageMessages = ({ children, className = '', ...props }) => (
  <Section className={`curiosity-page-messages ${className}`} {...props}>
    {children}
  </Section>
);

export { PageMessages as default, PageMessages };
