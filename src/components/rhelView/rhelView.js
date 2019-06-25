import React from 'react';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { PageSection } from '@patternfly/react-core';
import { connectRouter } from '../../redux';
import RhelGraphCard from '../rhelGraphCard/rhelGraphCard';

class RhelView extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <PageHeader>
          <PageHeaderTitle title="Red Hat Enterprise Linux" />
        </PageHeader>
        <PageSection>
          <RhelGraphCard />
        </PageSection>
      </React.Fragment>
    );
  }
}

RhelView.propTypes = {};

RhelView.defaultProps = {};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const ConnectedRhelView = connectRouter(mapStateToProps, mapDispatchToProps)(RhelView);

export { ConnectedRhelView as default, ConnectedRhelView, RhelView };
