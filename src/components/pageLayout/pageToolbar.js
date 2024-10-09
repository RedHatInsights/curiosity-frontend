import React from 'react';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

/**
 * @memberof PageLayout
 * @module PageToolbar
 */

/**
 * Render a platform toolbar section.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 * @returns {JSX.Element}
 */
const PageToolbar = ({ children, className = '', ...props }) => (
  <Section className={`curiosity-page-toolbar ${className}`} {...props}>
    {children}
  </Section>
);

export { PageToolbar as default, PageToolbar };
