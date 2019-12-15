import React from 'react';
import PropTypes from 'prop-types';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark
} from '@patternfly/react-tokens';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { PageSection } from '@patternfly/react-core';
import RhelGraphCard from '../rhelGraphCard/rhelGraphCard';
import { helpers } from '../../common';

class RhelView extends React.Component {
  componentDidMount() {}

  render() {
    const { routeDetail } = this.props;

    return (
      <React.Fragment>
        <PageHeader>
          <PageHeaderTitle
            title={(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_CONFIG_NAME}
          />
        </PageHeader>
        <PageSection>
          <RhelGraphCard
            key={routeDetail.pathParameter}
            filterGraphData={[
              { id: 'physicalSockets', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
              { id: 'hypervisorSockets', fill: chartColorCyanLight.value, stroke: chartColorCyanDark.value },
              { id: 'threshold' }
            ]}
            productId={routeDetail.pathParameter}
            errorRoute={routeDetail.errorRoute}
          />
        </PageSection>
      </React.Fragment>
    );
  }
}

RhelView.propTypes = {
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string.isRequired,
    routeItem: PropTypes.shape({
      title: PropTypes.string
    }),
    errorRoute: PropTypes.shape({
      to: PropTypes.string
    })
  })
};

RhelView.defaultProps = {
  routeDetail: {}
};

export { RhelView as default, RhelView };
