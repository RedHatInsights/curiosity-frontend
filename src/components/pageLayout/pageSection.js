import React from 'react';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

/**
 * @memberof PageLayout
 * @module PageSection
 */

/**
 * Render a platform page section.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className='']
 * @returns {JSX.Element}
 */
const PageSection = ({ children, className = '', ...props }) => (
  <Section className={`curiosity-page-section ${className}`} {...props}>
    {children}
  </Section>
);

export { PageSection as default, PageSection };
