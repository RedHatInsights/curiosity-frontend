import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHead,
  CardActions,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownPosition
} from '@patternfly/react-core';
import { Chart, ChartBar, ChartStack } from '@patternfly/react-charts';
import { connectTranslate, reduxActions } from '../../redux';
import { helpers } from '../../common/helpers';
import { graphHelpers } from '../../common/graphHelpers';

class RhelGraphCard extends React.Component {
  state = { isOpen: false };

  componentDidMount() {
    const { getGraphReports } = this.props;

    getGraphReports();
  }

  onToggle = isOpen => {
    this.setState({
      isOpen
    });
  };

  onSelect = () => {
    this.setState(prevState => ({
      isOpen: !prevState.state.isOpen
    }));
  };

  render() {
    const { error, fulfilled, graphData, pending, t } = this.props;
    const { isOpen } = this.state;

    if (error) {
      return null;
    }

    // todo: construct chartData using graphData in the reducer...
    const chartData = graphHelpers.convertGraphData({ ...graphData });

    const dropdownToggle = (
      <DropdownToggle isDisabled onToggle={this.onToggle}>
        {t('curiosity-graph.dropdownDefault', 'Last 30 Days')}
      </DropdownToggle>
    );

    // todo: correct pending/loading display
    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{t('curiosity-graph.heading', 'Daily CPU socket usage')}</h2>
          <CardActions>
            <Dropdown
              onSelect={this.onSelect}
              position={DropdownPosition.right}
              toggle={dropdownToggle}
              isOpen={isOpen}
              dropdownItems={[]}
            />
          </CardActions>
        </CardHead>
        {pending && (
          <CardBody>
            <div className="stack-chart-container">
              <small>Loading...</small>
            </div>
          </CardBody>
        )}
        {fulfilled && (
          <CardBody>
            <div className="stack-chart-container">
              <Chart height={200} domainPadding={{ x: [10, 2], y: [1, 1] }}>
                <ChartStack>
                  <ChartBar data={chartData} />
                </ChartStack>
              </Chart>
            </div>
          </CardBody>
        )}
      </Card>
    );
  }
}

RhelGraphCard.propTypes = {
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  getGraphReports: PropTypes.func,
  graphData: PropTypes.shape({
    usage: PropTypes.array
  }),
  pending: PropTypes.bool,
  t: PropTypes.func
};

RhelGraphCard.defaultProps = {
  error: false,
  fulfilled: false,
  getGraphReports: helpers.noop,
  graphData: {
    usage: []
  },
  pending: false,
  t: helpers.noopTranslate
};

const mapStateToProps = state => ({
  ...state.rhelGraph
});

const mapDispatchToProps = dispatch => ({
  getGraphReports: () => dispatch(reduxActions.rhel.getGraphReports())
});

const ConnectedRhelGraphCard = connectTranslate(mapStateToProps, mapDispatchToProps)(RhelGraphCard);

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
