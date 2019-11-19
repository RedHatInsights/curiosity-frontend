import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { PageSection } from '@patternfly/react-core';
import { helpers } from '../../common';

const TourView = ({ routeDetail }) => (
  <React.Fragment>
    <PageHeader>
      <PageHeaderTitle
        title={(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_START_NAME}
      />
    </PageHeader>
    <PageSection>
      {helpers.UI_DISPLAY_START_NAME} helps you understand your total subscription usage and capacity over time.
    </PageSection>
  </React.Fragment>
);

TourView.propTypes = {
  routeDetail: PropTypes.shape({
    routeItem: PropTypes.shape({
      title: PropTypes.string
    })
  })
};

TourView.defaultProps = {
  routeDetail: {}
};

export { TourView as default, TourView };
