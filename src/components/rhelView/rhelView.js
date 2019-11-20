import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { PageSection } from '@patternfly/react-core';
import { connectRouter } from '../../redux';
import RhelGraphCard from '../rhelGraphCard/rhelGraphCard';
import { helpers } from '../../common';

class RhelView extends React.Component {
  componentDidMount() {}

  render() {
    const { routeDetail } = this.props;

    return (
      <React.Fragment>
        <PageHeader>
          <PageHeaderTitle
            title={(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_CONFIG_NAME}
          />
        </PageHeader>
        <PageSection>
          <RhelGraphCard key={routeDetail.pathParameter} productId={routeDetail.pathParameter} />
        </PageSection>
      </React.Fragment>
    );
  }
}

RhelView.propTypes = {
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string.isRequired,
    routeItem: PropTypes.shape({
      title: PropTypes.string
    })
  })
};

RhelView.defaultProps = {
  routeDetail: {}
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

// Todo: clean up "connected" component appears unnecessary, look at converting from class
const ConnectedRhelView = connectRouter(mapStateToProps, mapDispatchToProps)(RhelView);

export { ConnectedRhelView as default, ConnectedRhelView, RhelView };
