import React from 'react';
import PropTypes from 'prop-types';
import {
  PageHeader as RcsPageHeader,
  PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/components/cjs/PageHeader';
import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Render a platform page header.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {string} props.productLabel
 * @param {Function} props.t
 * @returns {Node}
 */
const PageHeader = ({ children, t, productLabel }) => (
  <RcsPageHeader>
    <PageHeaderTitle title={children} className="pf-u-mb-sm" />
    {productLabel && (
      <p>
        {t(`curiosity-view.subtitle`, { appName: helpers.UI_DISPLAY_NAME, context: productLabel }, [
          <Button
            isInline
            component="a"
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            target="_blank"
            href={helpers.UI_LINK_LEARN_MORE}
          />
        ])}
      </p>
    )}
  </RcsPageHeader>
);

/**
 * Prop types.
 *
 * @type {{productLabel: string, t: Function, children: Node}}
 */
PageHeader.propTypes = {
  children: PropTypes.node.isRequired,
  productLabel: PropTypes.string,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{productLabel: null, t: translate}}
 */
PageHeader.defaultProps = {
  productLabel: null,
  t: translate
};

export { PageHeader as default, PageHeader };
