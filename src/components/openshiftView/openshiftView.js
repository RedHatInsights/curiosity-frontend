import React from 'react';
import PropTypes from 'prop-types';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Badge, Button } from '@patternfly/react-core';
import { PageLayout, PageHeader, PageSection, PageToolbar } from '../pageLayout/pageLayout';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { apiQueries, connect, reduxSelectors } from '../../redux';
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
    const { initialGraphFilters, initialInventoryFilters } = this.props;
    const { value } = event;

    if (value !== option) {
      const filter = ({ id, optional }) => {
        if (!optional) {
          return true;
        }
        return new RegExp(value, 'i').test(id);
      };

      const graphFilters = initialGraphFilters.filter(filter);
      const inventoryFilters = initialInventoryFilters.filter(filter);

      this.setState({
        option,
        graphFilters,
        inventoryFilters
      });
    }
  };

  /**
   * Render a select/dropdown list.
   *
   * @returns {Node}
   */
  renderSelect() {
    const { option } = this.state;
    const { initialOption } = this.props;
    const options = [
      { title: 'Cores', value: 'cores' },
      { title: 'Sockets', value: 'sockets' }
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
    const { initialGuestsFilters, initialToolbarFilters, location, query, routeDetail, t, viewId } = this.props;
    const isC3 = location?.parsedSearch?.c3 === '';
    const { graphQuery, inventoryQuery, toolbarQuery } = apiQueries.parseRhsmQuery(query);

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
              filterGraphData={graphFilters}
              query={graphQuery}
              productId={routeDetail.pathParameter}
              viewId={viewId}
              cardTitle={t('curiosity-graph.cardHeading')}
              productShortLabel={viewId}
            >
              {this.renderSelect()}
            </C3GraphCard>
          )) || (
            <GraphCard
              key={routeDetail.pathParameter}
              filterGraphData={graphFilters}
              query={graphQuery}
              productId={routeDetail.pathParameter}
              viewId={viewId}
              cardTitle={t('curiosity-graph.cardHeading')}
              productShortLabel={viewId}
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
 * @type {{initialOption: string, initialToolbarFilters: Array, viewId: string, t: Function, query: object,
 *     initialGraphFilters: Array, routeDetail: object, location: object, initialGuestsFilters: Array,
 *     initialInventoryFilters: Array}}
 */
OpenshiftView.propTypes = {
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
  }),
  initialOption: PropTypes.oneOf(['cores', 'sockets']),
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
 * @type {{initialOption: string, initialToolbarFilters: Array, viewId: string, t: translate, query: object,
 *     initialGraphFilters: Array, initialGuestsFilters: Array, initialInventoryFilters: Array}}
 */
OpenshiftView.defaultProps = {
  query: {
    [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
    [RHSM_API_QUERY_TYPES.LIMIT]: 10,
    [RHSM_API_QUERY_TYPES.OFFSET]: 0
  },
  initialOption: 'cores',
  initialGraphFilters: [
    {
      id: 'cores',
      optional: true,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value
    },
    {
      id: 'sockets',
      optional: true,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value
    },
    { id: 'thresholdSockets', optional: true },
    { id: 'thresholdCores', optional: true }
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
      id: 'sockets',
      optional: true
    },
    {
      id: 'cores',
      optional: true
    },
    {
      id: 'lastSeen'
    }
  ],
  initialToolbarFilters: [
    {
      id: RHSM_API_QUERY_TYPES.SLA
    }
  ],
  t: translate,
  viewId: 'OpenShift'
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.view.makeView(OpenshiftView.defaultProps);

const ConnectedOpenshiftView = connect(makeMapStateToProps)(OpenshiftView);

export { ConnectedOpenshiftView as default, ConnectedOpenshiftView, OpenshiftView };
