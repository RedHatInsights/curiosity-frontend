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
import { useSession } from '../authentication/authenticationContext';
import { reduxActions, storeHooks } from '../../redux';
import { translate } from '../i18n/i18n';
import { PageLayout } from '../pageLayout/pageLayout';
import { helpers } from '../../common';
import graphPng2x from '../../images/graph2x.png';
import graphPng4x from '../../images/graph4x.png';

/**
 * An account opt-in view.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.updateAccountOptIn
 * @param {Function} props.useDispatch
 * @param {Function} props.useSelectorsResponse
 * @param {Function} props.useSession
 * @fires onSubmitOptIn
 * @returns {Node}
 */
const OptinView = ({
  t,
  updateAccountOptIn,
  useDispatch: useAliasDispatch,
  useSelectorsResponse: useAliasSelectorsResponse,
  useSession: useAliasSession
}) => {
  const dispatch = useAliasDispatch();
  const { errorStatus } = useAliasSession();
  const { error, fulfilled, pending } = useAliasSelectorsResponse(({ user }) => user?.optin);

  /**
   * Submit and update account opt-in.
   *
   * @event onSubmitOptIn
   * @returns {void}
   */
  const onSubmitOptIn = () => updateAccountOptIn()(dispatch);

  /**
   * Render opt-in form states.
   *
   * @returns {Node}
   */
  const renderOptinForm = () => {
    const disableButton = errorStatus !== 403;

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
          {t('curiosity-optin.cardIsErrorDescription', { appName: helpers.UI_DISPLAY_NAME }, [
            <Button isInline component="a" variant="link" target="_blank" href={helpers.UI_LINK_CONTACT_US} />
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
          <Button variant="primary" onClick={onSubmitOptIn}>
            {t('curiosity-optin.buttonActivate', { appName: helpers.UI_DISPLAY_NAME })}
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  /**
   * Render tour copy and button.
   *
   * @returns {Node}
   */
  const renderTour = () => (
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

              <CardFooter>{renderOptinForm()}</CardFooter>
            </FlexItem>
          </Flex>
          <Flex flex={{ default: 'flex_1' }} alignSelf={{ default: 'alignSelfCenter' }}>
            <FlexItem>
              <CardBody>{renderTour()}</CardBody>
            </FlexItem>
          </Flex>
        </Flex>
      </Card>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{useSession: Function, t: Function, updateAccountOptIn: Function, useDispatch: Function, useSelectorsResponse: Function}}
 */
OptinView.propTypes = {
  t: PropTypes.func,
  updateAccountOptIn: PropTypes.func,
  useDispatch: PropTypes.func,
  useSelectorsResponse: PropTypes.func,
  useSession: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useSession: Function, t: Function, updateAccountOptIn: Function, useDispatch: Function, useSelectorsResponse: Function}}
 */
OptinView.defaultProps = {
  t: translate,
  updateAccountOptIn: reduxActions.user.updateAccountOptIn,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useSelectorsResponse: storeHooks.reactRedux.useSelectorsResponse,
  useSession
};

export { OptinView as default, OptinView };
