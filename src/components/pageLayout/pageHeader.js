import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader as RcsPageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * @memberof PageLayout
 * @module PageHeader
 */

/**
 * Render a platform page header.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.productLabel
 * @param {Function} props.t
 * @returns {React.ReactNode}
 */
const PageHeader = ({ children, productLabel, t }) => (
  <RcsPageHeader>
    <Flex justifyContent={{ sm: 'justifyContentSpaceBetween' }}>
      <FlexItem>
        <PageHeaderTitle title={children} className="pf-u-mb-sm" />
      </FlexItem>
    </Flex>
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
 * @type {{children: React.ReactNode, productLabel: string, t: Function}}
 */
PageHeader.propTypes = {
  children: PropTypes.node.isRequired,
  productLabel: PropTypes.string,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{includeTour: boolean, productLabel: null, t: translate}}
 */
PageHeader.defaultProps = {
  productLabel: null,
  t: translate
};

export { PageHeader as default, PageHeader };
