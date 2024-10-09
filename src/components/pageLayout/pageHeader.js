import React from 'react';
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
 * @param {string} [props.productLabel]
 * @param {translate} [props.t=translate]
 * @returns {JSX.Element}
 */
const PageHeader = ({ children, productLabel, t = translate }) => (
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

export { PageHeader as default, PageHeader };
