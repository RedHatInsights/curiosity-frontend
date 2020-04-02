import React from 'react';
import PropTypes from 'prop-types';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { PageLayout, PageHeader, PageSection, PageToolbar } from '../pageLayout/pageLayout';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, rhsmApiTypes } from '../../types/rhsmApiTypes';
import { connectTranslate, reduxSelectors } from '../../redux';
import GraphCard from '../graphCard/graphCard';
import { Select } from '../select/select';
import Toolbar from '../toolbar/toolbar';
import { helpers } from '../../common';

/**
 * An OpenShift encompassing view.
 *
 * @augments React.Component
 * @fires onSelect
 */
class OpenshiftView extends React.Component {
  state = {
    option: null,
    filters: []
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
    const { initialFilters } = this.props;
    const { value } = event;

    if (value !== option) {
      const filters = initialFilters.filter(val => new RegExp(value, 'i').test(val.id));
      this.setState({
        option,
        filters
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
    const { filters } = this.state;
    const { graphQuery, routeDetail, t, viewId } = this.props;

    return (
      <PageLayout>
        <PageHeader>{t('curiosity-view.openshift', helpers.UI_DISPLAY_CONFIG_NAME)}</PageHeader>
        <PageToolbar>
          <Toolbar graphQuery={graphQuery} viewId={viewId} />
        </PageToolbar>
        <PageSection>
          <GraphCard
            key={routeDetail.pathParameter}
            filterGraphData={filters}
            graphQuery={graphQuery}
            productId={routeDetail.pathParameter}
            viewId={viewId}
            cardTitle={t('curiosity-graph.cardHeading')}
            productShortLabel={viewId}
          >
            {this.renderSelect()}
          </GraphCard>
        </PageSection>
      </PageLayout>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{initialFilters: Array, initialOption: string, viewId: string, t: Function, routeDetail: object, graphQuery: object}}
 */
OpenshiftView.propTypes = {
  graphQuery: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
  }),
  initialOption: PropTypes.oneOf(['cores', 'sockets']),
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
 * @type {{initialFilters: Array, initialOption: string, viewId: string, t: Function, graphQuery: object}}
 */
OpenshiftView.defaultProps = {
  graphQuery: {
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  initialOption: 'cores',
  initialFilters: [
    { id: 'cores', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
    { id: 'sockets', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
    { id: 'thresholdSockets' },
    { id: 'thresholdCores' }
  ],
  t: helpers.noopTranslate,
  viewId: 'OpenShift'
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.view.makeView(OpenshiftView.defaultProps);

const ConnectedOpenshiftView = connectTranslate(makeMapStateToProps)(OpenshiftView);

export { ConnectedOpenshiftView as default, ConnectedOpenshiftView, OpenshiftView };
