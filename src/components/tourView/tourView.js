import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Title
} from '@patternfly/react-core';
import { PageLayout, PageHeader, PageSection } from '../pageLayout/pageLayout';
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
const TourView = ({ t }) => (
  <PageLayout>
    <PageHeader>{helpers.UI_DISPLAY_CONFIG_NAME}</PageHeader>
    <PageSection>
      <EmptyState variant={EmptyStateVariant.full} className="fadein">
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
            {t('curiosity-tour.emptyStateDescription', { appName: helpers.UI_DISPLAY_CONFIG_NAME })}
          </React.Fragment>
        </EmptyStateBody>
        <EmptyStateBody>
          <React.Fragment>
            {t('curiosity-tour.emptyStateDescriptionExtended', { appName: helpers.UI_DISPLAY_CONFIG_NAME })}
          </React.Fragment>
        </EmptyStateBody>
        <Button variant="primary">{t('curiosity-tour.emptyStateButton')}</Button>
        <EmptyStateSecondaryActions>
          <Button
            component="a"
            variant="link"
            target="_blank"
            href="https://access.redhat.com/documentation/Subscription_Central/"
          >
            {t('curiosity-tour.emptyStateLinkLearnMore')}
          </Button>
          <Button component="a" variant="link" target="_blank" href="https://access.redhat.com/account-team">
            {t('curiosity-tour.emptyStateLinkContactUs')}
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    </PageSection>
  </PageLayout>
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
