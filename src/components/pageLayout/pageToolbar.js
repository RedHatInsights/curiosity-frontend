import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';

const PageToolbar = ({ children, ...props }) => <Section {...props}>{children}</Section>;

PageToolbar.propTypes = {
  children: PropTypes.node.isRequired
};

PageToolbar.defaultProps = {};

export { PageToolbar as default, PageToolbar };
