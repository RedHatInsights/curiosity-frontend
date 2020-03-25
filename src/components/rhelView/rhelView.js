import React from 'react';
import PropTypes from 'prop-types';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark,
  chart_color_purple_100 as chartColorPurpleLight,
  chart_color_purple_300 as chartColorPurpleDark
} from '@patternfly/react-tokens';
import { PageLayout, PageHeader, PageSection, PageToolbar } from '../pageLayout/pageLayout';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, rhsmApiTypes } from '../../types/rhsmApiTypes';
import { connectTranslate, reduxSelectors } from '../../redux';
import GraphCard from '../graphCard/graphCard';
import Toolbar from '../toolbar/toolbar';
import { helpers } from '../../common';

/**
 * A Red Hat Enterprise Linux encompassing view, and system architectures.
 *
 * @augments React.Component
 */
class RhelView extends React.Component {
  componentDidMount() {}

  /**
   * Render a RHEL view.
   *
   * @returns {Node}
   */
  render() {
    const { graphQuery, initialFilters, routeDetail, t, viewId } = this.props;

    return (
      <PageLayout>
        <PageHeader>
          {(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_CONFIG_NAME}
        </PageHeader>
        <PageToolbar>
          <Toolbar graphQuery={graphQuery} viewId={viewId} />
        </PageToolbar>
        <PageSection>
          <GraphCard
            key={routeDetail.pathParameter}
            filterGraphData={initialFilters}
            graphQuery={graphQuery}
            productId={routeDetail.pathParameter}
            viewId={viewId}
            cardTitle={t('curiosity-graph.socketsHeading')}
            productShortLabel={viewId}
          />
        </PageSection>
      </PageLayout>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{initialFilters: Array, viewId: string, t: Function, routeDetail: object, graphQuery: object}}
 */
RhelView.propTypes = {
  graphQuery: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
  }),
  initialFilters: PropTypes.array,
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string.isRequired,
    pathId: PropTypes.string.isRequired,
    routeItem: PropTypes.shape({
      title: PropTypes.string
    })
  }).isRequired,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{initialFilters: Array, viewId: string, t: Function, graphQuery: object}}
 */
RhelView.defaultProps = {
  graphQuery: {
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  initialFilters: [
    { id: 'physicalSockets', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
    { id: 'hypervisorSockets', fill: chartColorCyanLight.value, stroke: chartColorCyanDark.value },
    { id: 'cloudSockets', fill: chartColorPurpleLight.value, stroke: chartColorPurpleDark.value },
    { id: 'thresholdSockets' }
  ],
  t: helpers.noopTranslate,
  viewId: 'RHEL'
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.view.makeView(RhelView.defaultProps);

const ConnectedRhelView = connectTranslate(makeMapStateToProps)(RhelView);

export { ConnectedRhelView as default, ConnectedRhelView, RhelView };
