import React from 'react';
import PropTypes from 'prop-types';
import {
  PageHeader as RcsPageHeader,
  PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/components/cjs/PageHeader';
import { Button } from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import { translate } from '../i18n/i18n';

/**
 * Render a platform page header.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {string} props.viewId
 * @returns {Node}
 */
const PageHeader = ({ children, viewId }) => (
  <RcsPageHeader>
    <PageHeaderTitle title={children} className="pf-u-mb-sm" />
    {viewId && (
      <p>
        {translate(`curiosity-view.${viewId}Subtitle`, {}, [
          <Button
            isInline
            component="a"
            variant="link"
            icon={<ExternalLinkSquareAltIcon />}
            iconPosition="right"
            target="_blank"
            href="https://access.redhat.com/documentation/en-us/subscription_central/2020-04/html/getting_started_with_subscription_watch/con-how-does-subscriptionwatch-show-data_assembly-opening-subscriptionwatch-ctxt/"
          />
        ])}
      </p>
    )}
  </RcsPageHeader>
);

/**
 * Prop types.
 *
 * @type {{children: Node, viewId: string}}
 */
PageHeader.propTypes = {
  children: PropTypes.node.isRequired,
  viewId: PropTypes.string
};

/**
 * Default props.
 */
PageHeader.defaultProps = {
  viewId: null
};

export { PageHeader as default, PageHeader };
