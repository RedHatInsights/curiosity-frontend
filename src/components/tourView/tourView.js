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
import { connectTranslate } from '../../redux';
import subscriptionsSvg from '../../images/subscriptions.svg';

/**
 * FixMe: Patternfly EmptyStateIcon can't pass a basic image
 * Requires the use of function based component syntax
 */
/**
 * FixMe: Patternfly EmptyStateBody and Title appear to throw an error on translate string replacement
 * Wrap with a fragment to pass.
 */
/**
 * Render a user guided tour view.
 *
 * @returns {Node} Node containing tour view.
 */
const TourView = ({ session, t }) => (
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
            {session.errorStatus !== 418 &&
              ` ${t('curiosity-tour.emptyStateDescriptionTour', { appName: helpers.UI_DISPLAY_CONFIG_NAME })}`}
          </React.Fragment>
        </EmptyStateBody>
        <EmptyStateBody>
          <React.Fragment>
            {t('curiosity-tour.emptyStateDescriptionExtended', { appName: helpers.UI_DISPLAY_CONFIG_NAME })}
          </React.Fragment>
        </EmptyStateBody>
        {(session.errorStatus === 418 && (
          <Button
            className="uxui-curiosity__button-learn"
            variant="primary"
            component="a"
            target="_blank"
            href="https://access.redhat.com/products/subscription-central"
          >
            {t('curiosity-tour.emptyStateLinkLearnMore')}
          </Button>
        )) || (
          <Button className="uxui-curiosity__button-tour" variant="primary">
            {t('curiosity-tour.emptyStateButton')}
          </Button>
        )}
        <EmptyStateSecondaryActions>
          {session.errorStatus !== 418 && (
            <Button
              component="a"
              variant="link"
              target="_blank"
              href="https://access.redhat.com/products/subscription-central"
            >
              {t('curiosity-tour.emptyStateLinkLearnMore')}
            </Button>
          )}
          <Button component="a" variant="link" target="_blank" href="https://access.redhat.com/account-team">
            {t('curiosity-tour.emptyStateLinkContactUs')}
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    </PageSection>
  </PageLayout>
);

/**
 * Prop types.
 *
 * @type {{t: Function, session: object}}
 */
TourView.propTypes = {
  session: PropTypes.shape({
    errorStatus: PropTypes.number
  }),
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: Function, session: {errorStatus: null}}}
 */
TourView.defaultProps = {
  session: {
    errorStatus: null
  },
  t: helpers.noopTranslate
};

const mapStateToProps = state => ({ session: state.user.session });

const ConnectedTourView = connectTranslate(mapStateToProps)(TourView);

export { ConnectedTourView as default, ConnectedTourView, TourView };
