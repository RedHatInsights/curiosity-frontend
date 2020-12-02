import React from 'react';
import PropTypes from 'prop-types';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Button, Label as PfLabel } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';
import { PageLayout, PageHeader, PageSection, PageToolbar } from '../pageLayout/pageLayout';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SORT_TYPES as SORT_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_UOM_TYPES
} from '../../types/rhsmApiTypes';
import { apiQueries, connect, reduxSelectors, reduxTypes, store } from '../../redux';
import GraphCard from '../graphCard/graphCard';
import C3GraphCard from '../c3GraphCard/c3GraphCard';
import { Select } from '../form/select';
import Toolbar from '../toolbar/toolbar';
import InventoryList from '../inventoryList/inventoryList';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * An OpenShift encompassing view.
 *
 * @augments React.Component
 * @fires onSelect
 */
class OpenshiftView extends React.Component {
  state = {
    option: null,
    graphFilters: [],
    inventoryFilters: []
  };

  componentDidMount() {
    const { initialOption } = this.props;
    this.onSelect({ value: initialOption });
  }

  /**
   * Apply a selected filtered value.
   *
   * @event onSelect
   * @param {object} event
   */
  onSelect = (event = {}) => {
    const { option } = this.state;
    const { initialGraphFilters, initialInventoryFilters, viewId } = this.props;
    const { value } = event;

    if (value !== option) {
      const filter = ({ id, isOptional }) => {
        if (!isOptional) {
          return true;
        }
        return new RegExp(value, 'i').test(id);
      };

      const graphFilters = initialGraphFilters.filter(filter);
      const inventoryFilters = initialInventoryFilters.filter(filter);

      this.setState(
        {
          option,
          graphFilters,
          inventoryFilters
        },
        () => {
          store.dispatch([
            {
              type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST
            },
            {
              type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.UOM],
              viewId,
              [RHSM_API_QUERY_TYPES.UOM]: value
            }
          ]);
        }
      );
    }
  };

  /**
   * Render a select/dropdown list.
   *
   * @returns {Node}
   */
  renderSelect() {
    const { option } = this.state;
    const { initialOption, t } = this.props;
    const options = [
      {
        title: t('curiosity-toolbar.uom', { context: RHSM_API_QUERY_UOM_TYPES.CORES }),
        value: RHSM_API_QUERY_UOM_TYPES.CORES
      },
      {
        title: t('curiosity-toolbar.uom', { context: RHSM_API_QUERY_UOM_TYPES.SOCKETS }),
        value: RHSM_API_QUERY_UOM_TYPES.SOCKETS
      }
    ];

    return <Select onSelect={this.onSelect} options={options} selectedOptions={option || initialOption} />;
  }

  /**
   * Render an OpenShift view.
   *
   * @returns {Node}
   */
  render() {
    const { graphFilters, inventoryFilters } = this.state;
    const {
      initialGuestsFilters,
      initialToolbarFilters,
      location,
      productLabel,
      query,
      routeDetail,
      t,
      viewId
    } = this.props;
    const isC3 = location?.parsedSearch?.c3 === '';
    const {
      graphQuery: initialGraphQuery,
      inventoryQuery: initialInventoryQuery,
      toolbarQuery
    } = apiQueries.parseRhsmQuery(query);

    return (
      <PageLayout>
        <PageHeader productLabel={productLabel}>
          {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: productLabel })}
        </PageHeader>
        <PageToolbar>
          <Toolbar
            filterOptions={initialToolbarFilters}
            productId={routeDetail.pathParameter}
            query={toolbarQuery}
            viewId={viewId}
          />
        </PageToolbar>
        <PageSection>
          {(isC3 && (
            <C3GraphCard
              key={routeDetail.pathParameter}
              filterGraphData={graphFilters}
              query={initialGraphQuery}
              productId={routeDetail.pathParameter}
              viewId={viewId}
              cardTitle={t('curiosity-graph.cardHeading')}
              productShortLabel={productLabel}
            >
              {this.renderSelect()}
            </C3GraphCard>
          )) || (
            <GraphCard
              key={routeDetail.pathParameter}
              filterGraphData={graphFilters}
              query={initialGraphQuery}
              productId={routeDetail.pathParameter}
              viewId={viewId}
              cardTitle={t('curiosity-graph.cardHeading')}
              productLabel={productLabel}
            >
              {this.renderSelect()}
            </GraphCard>
          )}
        </PageSection>
        <PageSection>
          <InventoryList
            key={routeDetail.pathParameter}
            filterGuestsData={initialGuestsFilters}
            filterInventoryData={inventoryFilters}
            query={initialInventoryQuery}
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
 * @type {{productLabel: string, initialOption: string, initialToolbarFilters: Array, viewId: string,
 *     t: Function, query: object, initialGraphFilters: Array, routeDetail: object, location: object,
 *     initialGuestsFilters: Array, initialInventoryFilters: Array}}
 */
OpenshiftView.propTypes = {
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
  }),
  initialOption: PropTypes.oneOf(Object.values(RHSM_API_QUERY_UOM_TYPES)),
  initialGraphFilters: PropTypes.array,
  initialGuestsFilters: PropTypes.array,
  initialInventoryFilters: PropTypes.array,
  initialToolbarFilters: PropTypes.array,
  location: PropTypes.shape({
    parsedSearch: PropTypes.objectOf(PropTypes.string)
  }).isRequired,
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
 * @type {{productLabel: string, initialOption: string, initialToolbarFilters: Array, viewId: string,
 *     t: translate, query: object, initialGraphFilters: Array, initialGuestsFilters: Array,
 *     initialInventoryFilters: Array}}
 */
OpenshiftView.defaultProps = {
  query: {
    [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
    [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
    [RHSM_API_QUERY_TYPES.LIMIT]: 10,
    [RHSM_API_QUERY_TYPES.OFFSET]: 0,
    [RHSM_API_QUERY_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.CORES,
    [RHSM_API_QUERY_TYPES.SORT]: SORT_TYPES.DATE
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
      id: 'inventoryId'
    },
    {
      id: 'lastSeen',
      cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || ''
    }
  ],
  initialInventoryFilters: [
    {
      id: 'displayName',
      cell: (data, session) => {
        const { displayName, inventoryId, numberOfGuests } = data;
        const { inventory: authorized } = session?.authorized || {};

        if (!inventoryId?.value) {
          return displayName?.value;
        }

        if (!authorized) {
          return (
            <React.Fragment>
              {displayName?.value || inventoryId?.value}{' '}
              {(numberOfGuests.value &&
                translate('curiosity-inventory.label', { context: 'numberOfGuests', value: numberOfGuests.value }, [
                  <PfLabel color="blue" />
                ])) ||
                ''}
            </React.Fragment>
          );
        }

        return (
          <Button
            isInline
            component="a"
            variant="link"
            target="_blank"
            href={`${helpers.UI_DEPLOY_PATH_PREFIX}/insights/inventory/${inventoryId.value}/`}
          >
            {displayName.value || inventoryId.value}{' '}
            {(numberOfGuests.value &&
              translate('curiosity-inventory.label', { context: 'numberOfGuests', value: numberOfGuests.value }, [
                <PfLabel color="blue" />
              ])) ||
              ''}
          </Button>
        );
      },
      isSortable: true
    },
    {
      id: 'hardwareType',
      cell: data => {
        const { cloudProvider, hardwareType } = data;
        return (
          <React.Fragment>
            {translate('curiosity-inventory.hardwareType', { context: hardwareType.value })}{' '}
            {(cloudProvider?.value && (
              <PfLabel color="purple">
                {translate('curiosity-inventory.cloudProvider', { context: cloudProvider.value })}
              </PfLabel>
            )) ||
              ''}
          </React.Fragment>
        );
      },
      isSortable: true
    },
    {
      id: 'sockets',
      isOptional: true,
      isSortable: true
    },
    {
      id: 'cores',
      isOptional: true,
      isSortable: true
    },
    {
      id: 'lastSeen',
      cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
      isSortable: true
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
