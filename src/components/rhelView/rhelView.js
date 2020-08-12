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
import { Badge, Button } from '@patternfly/react-core';
import { PageLayout, PageHeader, PageSection, PageToolbar } from '../pageLayout/pageLayout';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { apiQueries, connect, reduxSelectors } from '../../redux';
import GraphCard from '../graphCard/graphCard';
import C3GraphCard from '../c3GraphCard/c3GraphCard';
import Toolbar from '../toolbar/toolbar';
import InventoryList from '../inventoryList/inventoryList';
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
    const {
      initialGraphFilters,
      initialGuestsFilters,
      initialInventoryFilters,
      initialToolbarFilters,
      location,
      query,
      routeDetail,
      t,
      viewId
    } = this.props;
    const isC3 = location?.parsedSearch?.c3 === '';
    const { graphQuery, toolbarQuery, inventoryQuery } = apiQueries.parseRhsmQuery(query);

    return (
      <PageLayout>
        <PageHeader viewId={viewId}>
          {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: viewId })}
        </PageHeader>
        <PageToolbar>
          <Toolbar filterOptions={initialToolbarFilters} query={toolbarQuery} viewId={viewId} />
        </PageToolbar>
        <PageSection>
          {(isC3 && (
            <C3GraphCard
              key={routeDetail.pathParameter}
              filterGraphData={initialGraphFilters}
              query={graphQuery}
              productId={routeDetail.pathParameter}
              viewId={viewId}
              cardTitle={t('curiosity-graph.socketsHeading')}
              productShortLabel={viewId}
            />
          )) || (
            <GraphCard
              key={routeDetail.pathParameter}
              filterGraphData={initialGraphFilters}
              query={graphQuery}
              productId={routeDetail.pathParameter}
              viewId={viewId}
              cardTitle={t('curiosity-graph.socketsHeading')}
              productShortLabel={viewId}
            />
          )}
        </PageSection>
        <PageSection>
          <InventoryList
            key={routeDetail.pathParameter}
            filterGuestsData={initialGuestsFilters}
            filterInventoryData={initialInventoryFilters}
            query={inventoryQuery}
            productId={routeDetail.pathParameter}
            viewId={viewId}
            cardTitle={t('curiosity-inventory.cardHeading')}
          />
        </PageSection>
      </PageLayout>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{initialToolbarFilters: Array, viewId: string, t: Function, query: object, initialGraphFilters: Array,
 *     routeDetail: object, location: object, initialGuestsFilters: Array, initialInventoryFilters: Array}}
 */
RhelView.propTypes = {
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
  }),
  initialGraphFilters: PropTypes.array,
  initialGuestsFilters: PropTypes.array,
  initialInventoryFilters: PropTypes.array,
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
 * @type {{initialToolbarFilters: Array, viewId: string, t: translate, query: object,
 *     initialGraphFilters: Array, initialGuestsFilters: Array, initialInventoryFilters: Array}}
 */
RhelView.defaultProps = {
  query: {
    [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
    [RHSM_API_QUERY_TYPES.LIMIT]: 10,
    [RHSM_API_QUERY_TYPES.OFFSET]: 0
  },
  initialGraphFilters: [
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
  initialGuestsFilters: [
    {
      id: 'displayName',
      cell: obj => {
        const { displayName, inventoryId } = obj;

        if (!inventoryId?.value) {
          return displayName?.value;
        }

        return (
          <Button
            isInline
            component="a"
            variant="link"
            target="_blank"
            href={`/insights/inventory/${inventoryId.value}/`}
          >
            {displayName.value || inventoryId.value}
          </Button>
        );
      }
    },
    {
      id: 'inventoryId'
    },
    {
      id: 'lastSeen'
    }
  ],
  initialInventoryFilters: [
    {
      id: 'displayName',
      cell: obj => {
        const { displayName, inventoryId } = obj;

        if (!inventoryId?.value) {
          return displayName?.value;
        }

        return (
          <Button
            isInline
            component="a"
            variant="link"
            target="_blank"
            href={`/insights/inventory/${inventoryId.value}/`}
          >
            {displayName.value || inventoryId.value}
          </Button>
        );
      }
    },
    {
      id: 'hardwareType',
      cell: obj => {
        const { hardwareType, numberOfGuests } = obj;
        return (
          <React.Fragment>
            {translate('curiosity-inventory.hardwareType', { context: hardwareType.value })}{' '}
            {(numberOfGuests.value && <Badge isRead>{numberOfGuests.value}</Badge>) || ''}
          </React.Fragment>
        );
      }
    },
    {
      id: 'sockets'
    },
    {
      id: 'lastSeen'
    }
  ],
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_TYPES.SLA
    },
    {
      id: RHSM_API_QUERY_TYPES.USAGE,
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
