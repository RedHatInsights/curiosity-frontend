import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark
} from '@patternfly/react-tokens';
import GraphCard from '../graphCard/graphCard';
import { PageLayout, PageHeader, PageSection } from '../pageLayout/pageLayout';
import { helpers } from '../../common';

class RhelView extends React.Component {
  componentDidMount() {}

  render() {
    const { routeDetail, t } = this.props;

    return (
      <PageLayout>
        <PageHeader>
          {(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_CONFIG_NAME}
        </PageHeader>
        <PageSection>
          <GraphCard
            key={routeDetail.pathParameter}
            filterGraphData={[
              { id: 'physicalSockets', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
              { id: 'hypervisorSockets', fill: chartColorCyanLight.value, stroke: chartColorCyanDark.value },
              { id: 'threshold' }
            ]}
            productId={routeDetail.pathParameter}
            cardTitle={t('curiosity-graph.socketsHeading')}
            errorRoute={routeDetail.errorRoute}
          />
        </PageSection>
      </PageLayout>
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
  }),
  t: PropTypes.func
};

RhelView.defaultProps = {
  routeDetail: {},
  t: helpers.noopTranslate
};

const TranslatedRhelView = withTranslation()(RhelView);

export { TranslatedRhelView as default, TranslatedRhelView, RhelView };
