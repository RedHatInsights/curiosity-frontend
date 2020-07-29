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
 * @param {Function} props.t
 * @returns {Node}
 */
const PageHeader = ({ children, t, viewId }) => (
  <RcsPageHeader>
    <PageHeaderTitle title={children} className="pf-u-mb-sm" />
    {viewId && (
      <p>
        {t(`curiosity-view.${viewId}Subtitle`, {}, [
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
 * @type {{viewId: string, t: Function, children: Node}}
 */
PageHeader.propTypes = {
  children: PropTypes.node.isRequired,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: null, t: translate}}
 */
PageHeader.defaultProps = {
  t: translate,
  viewId: null
};

export { PageHeader as default, PageHeader };
