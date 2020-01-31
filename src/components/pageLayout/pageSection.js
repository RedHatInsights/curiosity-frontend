import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components';

const PageSection = ({ children, ...props }) => <Section {...props}>{children}</Section>;

PageSection.propTypes = {
  children: PropTypes.node.isRequired
};

PageSection.defaultProps = {};

export { PageSection as default, PageSection };
