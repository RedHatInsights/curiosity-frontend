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
import { connect, reduxSelectors } from '../../redux';
import GraphCard from '../graphCard/graphCard';
import C3GraphCard from '../c3GraphCard/c3GraphCard';
import Toolbar from '../toolbar/toolbar';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

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
    const { query, initialFilters, initialToolbarFilters, location, routeDetail, t, viewId } = this.props;
    const isC3 = location?.parsedSearch?.c3 === '';

    return (
      <PageLayout>
        <PageHeader viewId={viewId}>
          {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: viewId })}
        </PageHeader>
        <PageToolbar>
          <Toolbar filterOptions={initialToolbarFilters} query={query} viewId={viewId} />
        </PageToolbar>
        <PageSection>
          {(isC3 && (
            <C3GraphCard
              key={routeDetail.pathParameter}
              filterGraphData={initialFilters}
              query={query}
              productId={routeDetail.pathParameter}
              viewId={viewId}
              cardTitle={t('curiosity-graph.socketsHeading')}
              productShortLabel={viewId}
            />
          )) || (
            <GraphCard
              key={routeDetail.pathParameter}
              filterGraphData={initialFilters}
              query={query}
              productId={routeDetail.pathParameter}
              viewId={viewId}
              cardTitle={t('curiosity-graph.socketsHeading')}
              productShortLabel={viewId}
            />
          )}
        </PageSection>
      </PageLayout>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{initialFilters: Array, initialToolbarFilters: Array, viewId: string, t: Function, query: object,
 *     routeDetail: object, location: object}}
 */
RhelView.propTypes = {
  query: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
  }),
  initialFilters: PropTypes.array,
  initialToolbarFilters: PropTypes.array,
  location: PropTypes.shape({
    parsedSearch: PropTypes.objectOf(PropTypes.string)
  }).isRequired,
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
 * @type {{initialFilters: Array, initialToolbarFilters: Array, viewId: string, t: translate, query: object}}
 */
RhelView.defaultProps = {
  query: {
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  initialFilters: [
    {
      id: 'physicalSockets',
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value
    },
    {
      id: 'hypervisorSockets',
      fill: chartColorCyanLight.value,
      stroke: chartColorCyanDark.value,
      color: chartColorCyanDark.value
    },
    {
      id: 'cloudSockets',
      fill: chartColorPurpleLight.value,
      stroke: chartColorPurpleDark.value,
      color: chartColorPurpleDark.value
    },
    { id: 'thresholdSockets' }
  ],
  initialToolbarFilters: [
    {
      id: rhsmApiTypes.RHSM_API_QUERY_SLA
    },
    {
      id: rhsmApiTypes.RHSM_API_QUERY_USAGE,
      selected: true
    }
  ],
  t: translate,
  viewId: 'RHEL'
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.view.makeView(RhelView.defaultProps);

const ConnectedRhelView = connect(makeMapStateToProps)(RhelView);

export { ConnectedRhelView as default, ConnectedRhelView, RhelView };
