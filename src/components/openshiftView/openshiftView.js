import React from 'react';
import PropTypes from 'prop-types';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Button, Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';
import moment from 'moment';
import { PageLayout, PageHeader, PageMessages, PageSection, PageToolbar } from '../pageLayout/pageLayout';
import {
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES
} from '../../types/rhsmApiTypes';
import { apiQueries, connect, reduxSelectors } from '../../redux';
import GraphCard from '../graphCard/graphCard';
import { ToolbarFieldUom } from '../toolbar/toolbarFieldUom';
import Toolbar from '../toolbar/toolbar';
import InventoryList from '../inventoryList/inventoryList';
import InventorySubscriptions from '../inventorySubscriptions/inventorySubscriptions';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import BannerMessages from '../bannerMessages/bannerMessages';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * An OpenShift encompassing view.
 *
 * @augments React.Component
 * @fires onSelect
 */
class OpenshiftView extends React.Component {
  componentDidMount() {}

  /**
   * Render an OpenShift view.
   *
   * @returns {Node}
   */
  render() {
    const {
      initialGuestsFilters,
      initialToolbarFilters,
      initialInventorySettings,
      initialGraphFilters,
      initialInventoryFilters,
      initialSubscriptionsInventoryFilters,
      initialOption,
      productLabel,
      query,
      graphTallyQuery,
      inventoryHostsQuery,
      inventorySubscriptionsQuery,
      routeDetail,
      t,
      viewId
    } = this.props;
    const {
      graphTallyQuery: initialGraphTallyQuery,
      inventoryHostsQuery: initialInventoryHostsQuery,
      inventorySubscriptionsQuery: initialInventorySubscriptionsQuery,
      toolbarQuery
    } = apiQueries.parseRhsmQuery(query, { graphTallyQuery, inventoryHostsQuery, inventorySubscriptionsQuery });

    const filter = ({ id, isOptional }) => {
      if (!isOptional) {
        return true;
      }
      return new RegExp(query[RHSM_API_QUERY_TYPES.UOM] || initialOption, 'i').test(id);
    };

    const graphFilters = initialGraphFilters.filter(filter);
    const inventoryFilters = initialInventoryFilters.filter(filter);
    const subscriptionsInventoryFilters = initialSubscriptionsInventoryFilters.filter(filter);

    return (
      <PageLayout>
        <PageHeader productLabel={productLabel} includeTour>
          {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: productLabel })}
        </PageHeader>
        <PageMessages>
          <BannerMessages productId={routeDetail.pathParameter} viewId={viewId} query={query} />
        </PageMessages>
        <PageToolbar>
          <Toolbar
            filterOptions={initialToolbarFilters}
            productId={routeDetail.pathParameter}
            query={toolbarQuery}
            viewId={viewId}
          />
        </PageToolbar>
        <PageSection>
          <GraphCard
            key={routeDetail.pathParameter}
            filterGraphData={graphFilters}
            query={initialGraphTallyQuery}
            productId={routeDetail.pathParameter}
            viewId={viewId}
            cardTitle={t('curiosity-graph.cardHeading')}
            productLabel={productLabel}
          >
            <ToolbarFieldUom value={initialOption} viewId={viewId} />
          </GraphCard>
        </PageSection>
        <PageSection>
          <InventoryTabs productId={routeDetail.pathParameter}>
            <InventoryTab key="hostsTab" title={t('curiosity-inventory.tab', { context: 'hosts' })}>
              <InventoryList
                key={routeDetail.pathParameter}
                filterGuestsData={initialGuestsFilters}
                filterInventoryData={inventoryFilters}
                productId={routeDetail.pathParameter}
                settings={initialInventorySettings}
                query={initialInventoryHostsQuery}
                viewId={viewId}
              />
            </InventoryTab>
            {!helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS && (
              <InventoryTab key="subscriptionsTab" title={t('curiosity-inventory.tab', { context: 'subscriptions' })}>
                <InventorySubscriptions
                  key={routeDetail.pathParameter}
                  filterInventoryData={subscriptionsInventoryFilters}
                  productId={routeDetail.pathParameter}
                  query={initialInventorySubscriptionsQuery}
                  viewId={viewId}
                />
              </InventoryTab>
            )}
          </InventoryTabs>
        </PageSection>
      </PageLayout>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{productLabel: string, initialOption: string, inventorySubscriptionsQuery: object, query: object,
 *     initialSubscriptionsInventoryFilters: Array, initialInventorySettings: object, initialToolbarFilters: Array,
 *     viewId: string, t: Function, graphTallyQuery: object, inventoryHostsQuery: object, initialGraphFilters: Array,
 *     routeDetail: object, initialGuestsFilters: Array, initialInventoryFilters: Array}}
 */
OpenshiftView.propTypes = {
  query: PropTypes.object,
  graphTallyQuery: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
  }),
  inventoryHostsQuery: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
    [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
    [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SORT_TYPES)]),
    [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
  }),
  inventorySubscriptionsQuery: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
    [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
    [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES)]),
    [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
  }),
  initialOption: PropTypes.oneOf(Object.values(RHSM_API_QUERY_UOM_TYPES)),
  initialGraphFilters: PropTypes.array,
  initialGuestsFilters: PropTypes.array,
  initialInventoryFilters: PropTypes.array,
  initialInventorySettings: PropTypes.shape({
    hasGuests: PropTypes.func
  }),
  initialSubscriptionsInventoryFilters: PropTypes.array,
  initialToolbarFilters: PropTypes.array,
  productLabel: PropTypes.string,
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
 * @type {{productLabel: string, initialOption: string, inventorySubscriptionsQuery: object, query: object,
 *     initialSubscriptionsInventoryFilters: Array, initialInventorySettings: object, initialToolbarFilters: Array,
 *     viewId: string, t: translate, graphTallyQuery: object, inventoryHostsQuery: object,
 *     initialGraphFilters: Array, initialGuestsFilters: Array, initialInventoryFilters: Array}}
 */
OpenshiftView.defaultProps = {
  query: {
    [RHSM_API_QUERY_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.CORES
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  inventoryHostsQuery: {
    [RHSM_API_QUERY_TYPES.SORT]: RHSM_API_QUERY_SORT_TYPES.LAST_SEEN,
    [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.ASCENDING,
    [RHSM_API_QUERY_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_TYPES.OFFSET]: 0
  },
  inventorySubscriptionsQuery: {
    [RHSM_API_QUERY_TYPES.SORT]: RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES.UPCOMING_EVENT_DATE,
    [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.ASCENDING,
    [RHSM_API_QUERY_TYPES.LIMIT]: 100,
    [RHSM_API_QUERY_TYPES.OFFSET]: 0
  },
  initialOption: RHSM_API_QUERY_UOM_TYPES.CORES,
  initialGraphFilters: [
    {
      id: 'cores',
      isOptional: true,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value
    },
    {
      id: 'sockets',
      isOptional: true,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value
    },
    { id: 'thresholdSockets', isOptional: true },
    { id: 'thresholdCores', isOptional: true }
  ],
  initialGuestsFilters: [
    {
      id: 'displayName',
      header: translate('curiosity-inventory.header', { context: 'guestsDisplayName' }),
      cell: (data, session) => {
        const { displayName, inventoryId } = data;
        const { inventory: authorized } = session?.authorized || {};

        if (!inventoryId?.value) {
          return displayName?.value;
        }

        if (!authorized) {
          return displayName?.value || inventoryId?.value;
        }

        return (
          <Button
            isInline
            component="a"
            variant="link"
            target="_blank"
            href={`${helpers.UI_DEPLOY_PATH_PREFIX}/insights/inventory/${inventoryId.value}/`}
          >
            {displayName.value || inventoryId.value}
          </Button>
        );
      }
    },
    {
      id: 'inventoryId',
      cellWidth: 40
    },
    {
      id: 'lastSeen',
      cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
      cellWidth: 15
    }
  ],
  initialInventoryFilters: [
    {
      id: 'displayName',
      cell: (data, session) => {
        const { displayName = {}, inventoryId = {}, numberOfGuests = {} } = data;
        const { inventory: authorized } = session?.authorized || {};

        if (!inventoryId.value) {
          return displayName.value;
        }

        let updatedDisplayName = displayName.value || inventoryId.value;

        if (authorized) {
          updatedDisplayName = (
            <Button
              isInline
              component="a"
              variant="link"
              target="_blank"
              href={`${helpers.UI_DEPLOY_PATH_PREFIX}/insights/inventory/${inventoryId.value}/`}
            >
              {displayName.value || inventoryId.value}
            </Button>
          );
        }

        return (
          <React.Fragment>
            {updatedDisplayName}{' '}
            {(numberOfGuests.value &&
              translate('curiosity-inventory.label', { context: 'numberOfGuests', count: numberOfGuests.value }, [
                <PfLabel color="blue" />
              ])) ||
              ''}
          </React.Fragment>
        );
      },
      isSortable: true
    },
    {
      id: 'measurementType',
      cell: data => {
        const { cloudProvider = {}, measurementType = {} } = data;
        return (
          <React.Fragment>
            {translate('curiosity-inventory.measurementType', { context: measurementType.value })}{' '}
            {(cloudProvider.value && (
              <PfLabel color="purple">
                {translate('curiosity-inventory.cloudProvider', { context: cloudProvider.value })}
              </PfLabel>
            )) ||
              ''}
          </React.Fragment>
        );
      },
      isSortable: true,
      cellWidth: 20
    },
    {
      id: 'sockets',
      isOptional: true,
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: 'cores',
      isOptional: true,
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: 'lastSeen',
      cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialInventorySettings: {},
  initialSubscriptionsInventoryFilters: [
    {
      id: 'productName',
      isSortable: true
    },
    {
      id: 'serviceLevel',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    },
    {
      id: 'upcomingEventDate',
      cell: data =>
        (data?.upcomingEventDate?.value && moment.utc(data?.upcomingEventDate?.value).format('YYYY-DD-MM')) || '',
      isSortable: true,
      isWrappable: true,
      cellWidth: 15
    }
  ],
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_TYPES.SLA
    }
  ],
  productLabel: 'OpenShift',
  t: translate,
  viewId: 'viewOpenShift'
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.view.makeView(OpenshiftView.defaultProps);

const ConnectedOpenshiftView = connect(makeMapStateToProps)(OpenshiftView);

export { ConnectedOpenshiftView as default, ConnectedOpenshiftView, OpenshiftView };
