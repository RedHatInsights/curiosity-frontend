import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  PageSection,
  Title
} from '@patternfly/react-core';
import { helpers } from '../../common';
import { translateComponent } from '../i18n/i18n';
import subscriptionsSvg from '../../images/subscriptions.svg';

/**
 * FixMe: Patternfly EmptyStateIcon can't pass a basic image
 * Requires the use of function based component syntax
 */
/**
 * FixMe: Patternfly EmptyStateBody and Title appear to throw an error on translate string replacement
 * Wrap with a fragment to pass.
 */
const TourView = ({ routeDetail, t }) => (
  <React.Fragment>
    <PageHeader>
      <PageHeaderTitle
        title={(routeDetail.routeItem && routeDetail.routeItem.title) || helpers.UI_DISPLAY_START_NAME}
      />
    </PageHeader>
    <PageSection>
      <EmptyState variant={EmptyStateVariant.full}>
        <img
          src={subscriptionsSvg}
          className="curiosity-emptystate-img-icon"
          alt={t('curiosity-tour.emptyStateIconAlt', { appName: helpers.UI_DISPLAY_CONFIG_NAME })}
          aria-hidden
        />
        <Title headingLevel="h5" size="lg">
          <React.Fragment>
            {t('curiosity-tour.emptyStateTitle', { appName: helpers.UI_DISPLAY_CONFIG_NAME })}
          </React.Fragment>
        </Title>
        <EmptyStateBody>
          <React.Fragment>
            {t('curiosity-tour.emptyStateDescription', { appName: helpers.UI_DISPLAY_START_NAME })}
          </React.Fragment>
        </EmptyStateBody>
        <Button variant="primary">{t('curiosity-tour.emptyStateButton')}</Button>
        <EmptyStateSecondaryActions>
          <Button
            component="a"
            variant="link"
            target="_blank"
            href="https://access.redhat.com/products/subscription-central"
          >
            {t('curiosity-tour.emptyStateLink')}
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    </PageSection>
  </React.Fragment>
);

TourView.propTypes = {
  routeDetail: PropTypes.shape({
    routeItem: PropTypes.shape({
      title: PropTypes.string
    })
  }),
  t: PropTypes.func
};

TourView.defaultProps = {
  routeDetail: {},
  t: helpers.noopTranslate
};

const TranslatedTourView = translateComponent(TourView);

export { TranslatedTourView as default, TranslatedTourView, TourView };
