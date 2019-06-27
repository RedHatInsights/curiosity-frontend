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
    // todo: add error, fulfilled, pending back
    const { t } = this.props;
    const { isOpen } = this.state;
    const dropdownItems = [];

    const dropdownToggle = (
      <DropdownToggle isDisabled onToggle={this.onToggle}>
        {t('curiosity-graph.dropdownDefault', 'Last 30 Days')}
      </DropdownToggle>
    );

    // todo: construct chartData using graphData in the reducer...
    const chartData = [
      { x: 'May 25', y: 1 },
      { x: 'May 26', y: 1 },
      { x: 'May 27', y: 1 },
      { x: 'May 28', y: 1 },
      { x: 'May 29', y: 2 },
      { x: 'May 30', y: 2 },
      { x: 'May 31', y: 2 },
      { x: 'Jun 1', y: 2 },
      { x: 'Jun 2', y: 2 },
      { x: 'Jun 3', y: 2 },
      { x: 'Jun 4', y: 2 },
      { x: 'Jun 5', y: 2 },
      { x: 'Jun 6', y: 3 },
      { x: 'Jun 7', y: 3 },
      { x: 'Jun 8', y: 3 },
      { x: 'Jun 9', y: 3 },
      { x: 'Jun 10', y: 4 },
      { x: 'Jun 11', y: 4 },
      { x: 'Jun 12', y: 4 },
      { x: 'Jun 13', y: 4 },
      { x: 'Jun 14', y: 4 },
      { x: 'Jun 15', y: 4 },
      { x: 'Jun 16', y: 4 },
      { x: 'Jun 17', y: 3 },
      { x: 'Jun 18', y: 3 },
      { x: 'Jun 19', y: 1 },
      { x: 'Jun 20', y: 2 },
      { x: 'Jun 21', y: 5 },
      { x: 'Jun 22', y: 3 },
      { x: 'Jun 23', y: 1 },
      { x: 'Jun 24', y: 1 }
    ];

    // todo: add error, fulfilled, pending back
    return (
      <Card className="curiosity-usage-graph">
        <CardHead>
          <h2>{t('curiosity-graph.heading', 'Daily CPU socket usage')}</h2>
          <CardActions>
            <Dropdown
              onSelect={this.onSelect}
              position={DropdownPosition.right}
              toggle={dropdownToggle}
              isOpen={isOpen}
              dropdownItems={dropdownItems}
            />
          </CardActions>
        </CardHead>
        <CardBody>
          <div className="stack-chart-container">
            <Chart height={200} domainPadding={{ x: [10, 2], y: [1, 1] }}>
              <ChartStack>
                <ChartBar data={chartData} />
              </ChartStack>
            </Chart>
          </div>
        </CardBody>
      </Card>
    );
  }
}

// todo: add error, fulfilled, pending back
RhelGraphCard.propTypes = {
  getGraphReports: PropTypes.func,
  t: PropTypes.func
};

// todo: add error, fulfilled, pending back
RhelGraphCard.defaultProps = {
  getGraphReports: helpers.noop,
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
