import React from 'react';
import PropTypes from 'prop-types';
import {
  PageHeader as RcsPageHeader,
  PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/components/PageHeader';

const PageHeader = ({ children }) => (
  <RcsPageHeader>
    <PageHeaderTitle title={children} />
  </RcsPageHeader>
);

PageHeader.propTypes = {
  children: PropTypes.node.isRequired
};

PageHeader.defaultProps = {};

export { PageHeader as default, PageHeader };
