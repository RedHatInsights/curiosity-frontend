import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { PageLayout, PageHeader, PageSection } from '../pageLayout/pageLayout';
import GraphCard from '../graphCard/graphCard';
import { Select } from '../select/select';
import { helpers } from '../../common';

class OpenshiftView extends React.Component {
  state = {
    option: null,
    filters: []
  };

  componentDidMount() {
    const { initialOption } = this.props;
    this.onSelect({ value: initialOption });
  }

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

  renderSelect() {
    const { option } = this.state;
    const { initialOption } = this.props;
    const options = [{ title: 'Cores', value: 'cores' }, { title: 'Sockets', value: 'sockets' }];

    return <Select onSelect={this.onSelect} options={options} selectedOptions={option || initialOption} />;
  }

  render() {
    const { filters } = this.state;
    const { routeDetail, t } = this.props;

    return (
      <PageLayout>
        <PageHeader>
          {(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_CONFIG_NAME}
        </PageHeader>
        <PageSection>
          <GraphCard
            key={routeDetail.pathParameter}
            filterGraphData={filters}
            productId={routeDetail.pathParameter}
            viewId={routeDetail.pathId}
            cardTitle={t('curiosity-graph.cardHeading')}
            productShortLabel="OpenShift"
          >
            {this.renderSelect()}
          </GraphCard>
        </PageSection>
      </PageLayout>
    );
  }
}

OpenshiftView.propTypes = {
  initialOption: PropTypes.oneOf(['cores', 'sockets']),
  initialFilters: PropTypes.array,
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string.isRequired,
    pathId: PropTypes.string.isRequired,
    routeItem: PropTypes.shape({
      title: PropTypes.string
    })
  }).isRequired,
  t: PropTypes.func
};

OpenshiftView.defaultProps = {
  initialOption: 'cores',
  initialFilters: [
    { id: 'cores', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
    { id: 'sockets', fill: chartColorBlueLight.value, stroke: chartColorBlueDark.value },
    { id: 'thresholdSockets' },
    { id: 'thresholdCores' }
  ],
  t: helpers.noopTranslate
};

const TranslatedOpenshiftView = withTranslation()(OpenshiftView);

export { TranslatedOpenshiftView as default, TranslatedOpenshiftView, OpenshiftView };
