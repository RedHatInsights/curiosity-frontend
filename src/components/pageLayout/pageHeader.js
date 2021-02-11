import React from 'react';
import PropTypes from 'prop-types';
import {
  PageHeader as RcsPageHeader,
  PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/components/PageHeader';
import { Button, Flex, FlexItem, Label as PfLabel } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Render a platform page header.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {boolean} props.includeTour
 * @param {string} props.productLabel
 * @param {Function} props.t
 * @returns {Node}
 */
const PageHeader = ({ children, includeTour, productLabel, t }) => (
  <RcsPageHeader>
    <Flex justifyContent={{ sm: 'justifyContentSpaceBetween' }}>
      <FlexItem>
        <PageHeaderTitle title={children} className="pf-u-mb-sm" />
      </FlexItem>
      <FlexItem>
        {includeTour && (
          <Button variant="link" className="uxui-curiosity__button-tour" isInline>
            <PfLabel color="blue">{t('curiosity-optin.buttonTour')}</PfLabel>
          </Button>
        )}
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
 * @type {{children: Node, includeTour: boolean, productLabel: string, t: Function}}
 */
PageHeader.propTypes = {
  children: PropTypes.node.isRequired,
  includeTour: PropTypes.bool,
  productLabel: PropTypes.string,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{includeTour: boolean, productLabel: null, t: translate}}
 */
PageHeader.defaultProps = {
  includeTour: false,
  productLabel: null,
  t: translate
};

export { PageHeader as default, PageHeader };
