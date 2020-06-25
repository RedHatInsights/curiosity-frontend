import React from 'react';
import PropTypes from 'prop-types';
import {
  Brand,
  Button,
  Card,
  CardHeaderMain,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Flex,
  FlexItem,
  Form,
  ActionGroup,
  Spinner,
  Title
} from '@patternfly/react-core';
import { connectTranslate, reduxActions } from '../../redux';
import { translate } from '../i18n/i18n';
import { PageLayout } from '../pageLayout/pageLayout';
import { helpers } from '../../common';
import graphPng2x from '../../images/graph2x.png';
import graphPng4x from '../../images/graph4x.png';

/**
 * An account opt-in view.
 *
 * @augments React.Component
 * @fires onSubmitOptIn
 */
class OptinView extends React.Component {
  /**
   * Submit and update account opt-in.
   *
   * @event onSubmitOptIn
   */
  onSubmitOptIn = () => {
    const { updateAccountOptIn } = this.props;
    updateAccountOptIn();
  };

  /**
   * Render opt-in form states.
   *
   * @returns {Node}
   */
  renderOptinForm() {
    const { error, fulfilled, pending, session, t } = this.props;
    const disableButton = session.status !== 403;

    if (pending) {
      return (
        <Form>
          <ActionGroup>
            <Button variant="primary" isDisabled>
              <Spinner size="sm" /> {t('curiosity-optin.buttonActivate', { appName: helpers.UI_DISPLAY_NAME })}
            </Button>
          </ActionGroup>
        </Form>
      );
    }

    if (error) {
      return (
        <p>
          {translate('curiosity-optin.cardIsErrorDescription', { appName: helpers.UI_DISPLAY_NAME }, [
            <Button
              isInline
              component="a"
              variant="link"
              target="_blank"
              href="https://access.redhat.com/account-team"
            />
          ])}
        </p>
      );
    }

    if (disableButton || fulfilled) {
      return (
        <Form>
          <ActionGroup>
            <Button variant="primary" isDisabled>
              {t('curiosity-optin.buttonIsActive', { appName: helpers.UI_DISPLAY_NAME })}
            </Button>
          </ActionGroup>
          {fulfilled && <p>{t('curiosity-optin.cardIsActiveDescription')}</p>}
        </Form>
      );
    }

    return (
      <Form>
        <ActionGroup>
          <Button variant="primary" onClick={this.onSubmitOptIn}>
            {t('curiosity-optin.buttonActivate', { appName: helpers.UI_DISPLAY_NAME })}
          </Button>
        </ActionGroup>
      </Form>
    );
  }

  /**
   * Render tour copy and button.
   *
   * @returns {Node}
   */
  renderTour() {
    const { t } = this.props;

    return (
      <Card className="curiosity-optin-tour">
        <CardHeader>
          <CardHeaderMain>
            <Brand
              srcSet={`${graphPng4x} 1064w, ${graphPng2x} 600w`}
              src={graphPng4x}
              alt={t('curiosity-optin.tourTitleImageAlt')}
              aria-hidden
              className="curiosity-optin-image"
            />
          </CardHeaderMain>
        </CardHeader>
        <CardTitle>
          <Title headingLevel="h3" size="2xl">
            {t('curiosity-optin.tourTitle')}
          </Title>
        </CardTitle>
        <CardBody>{t('curiosity-optin.tourDescription')}</CardBody>
        <CardFooter>
          <Button variant="secondary" className="uxui-curiosity__button-tour">
            {t('curiosity-optin.buttonTour')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  /**
   * Render opt-in.
   *
   * @returns {Node}
   */
  render() {
    const { t } = this.props;

    return (
      <PageLayout>
        <Card>
          <Flex>
            <Flex flex={{ default: 'flex_2' }}>
              <FlexItem>
                <CardTitle key="heading1Title">
                  <Title headingLevel="h1" size="2xl">
                    {t('curiosity-optin.cardTitle', { appName: helpers.UI_DISPLAY_NAME })}
                  </Title>
                </CardTitle>
                <CardBody key="heading1Desc">
                  {t('curiosity-optin.cardDescription', { appName: helpers.UI_DISPLAY_NAME })}
                </CardBody>

                <CardTitle key="heading2Title">
                  <Title headingLevel="h2" size="xl">
                    {t('curiosity-optin.cardSeeTitle')}
                  </Title>
                </CardTitle>
                <CardBody key="heading2Desc">{t('curiosity-optin.cardSeeDescription')}</CardBody>

                <CardTitle key="heading3Title">
                  <Title headingLevel="h2" size="xl">
                    {t('curiosity-optin.cardReportTitle')}
                  </Title>
                </CardTitle>
                <CardBody key="heading3Desc">{t('curiosity-optin.cardReportDescription')}</CardBody>

                <CardTitle key="heading4Title">
                  <Title headingLevel="h2" size="xl">
                    {t('curiosity-optin.cardFilterTitle')}
                  </Title>
                </CardTitle>
                <CardBody key="heading4Desc">{t('curiosity-optin.cardFilterDescription')}</CardBody>

                <CardFooter>{this.renderOptinForm()}</CardFooter>
              </FlexItem>
            </Flex>
            <Flex flex={{ default: 'flex_1' }} alignSelf={{ default: 'alignSelfCenter' }}>
              <FlexItem>
                <CardBody>{this.renderTour()}</CardBody>
              </FlexItem>
            </Flex>
          </Flex>
        </Card>
      </PageLayout>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{t: Function, session: object, updateAccountOptIn: Function, pending: boolean, fulfilled: boolean,
 *     error: boolean}}
 */
OptinView.propTypes = {
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  pending: PropTypes.bool,
  session: PropTypes.shape({
    status: PropTypes.number
  }),
  t: PropTypes.func,
  updateAccountOptIn: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: Function, session: {status: null}, updateAccountOptIn: Function, pending: boolean,
 *     fulfilled: boolean, error: boolean}}
 */
OptinView.defaultProps = {
  error: false,
  fulfilled: false,
  pending: false,
  session: {
    status: null
  },
  t: helpers.noopTranslate,
  updateAccountOptIn: helpers.noop
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  updateAccountOptIn: query => dispatch(reduxActions.user.updateAccountOptIn(query))
});

/**
 * Apply state to props.
 *
 * @param {object} state
 * @param {object} state.user
 * @returns {object}
 */
const mapStateToProps = ({ user }) => ({ ...user.optin, session: user.session });

const ConnectedOptinView = connectTranslate(mapStateToProps, mapDispatchToProps)(OptinView);

export { ConnectedOptinView as default, ConnectedOptinView, OptinView };
