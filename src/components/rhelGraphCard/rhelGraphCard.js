import React from 'react';
import PropTypes from 'prop-types';
import { connect, reduxActions } from '../../redux';
import { helpers } from '../../common/helpers';

class RhelGraphCard extends React.Component {
  componentDidMount() {
    const { getGraphReports } = this.props;

    getGraphReports();
  }

  render() {
    const { error, fulfilled, graphData, pending } = this.props;

    return (
      <React.Fragment>
        Graph ipsum... {(error && 'error') || (fulfilled && 'loaded') || (pending && 'pending')}{' '}
        {graphData.dailyUsage.length && 'data'}
      </React.Fragment>
    );
  }
}

RhelGraphCard.propTypes = {
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  getGraphReports: PropTypes.func,
  graphData: PropTypes.shape({
    dailyUsage: PropTypes.array
  }),
  pending: PropTypes.bool
};

RhelGraphCard.defaultProps = {
  error: false,
  fulfilled: false,
  getGraphReports: helpers.noop,
  graphData: {
    dailyUsage: []
  },
  pending: false
};

const mapStateToProps = state => ({
  ...state.rhelGraph
});

const mapDispatchToProps = dispatch => ({
  getGraphReports: () => dispatch(reduxActions.rhel.getGraphReports())
});

const ConnectedRhelGraphCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(RhelGraphCard);

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
