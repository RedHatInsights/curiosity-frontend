/* eslint-disable max-len */
import React from 'react';
import {
  Brand,
  Button,
  Card,
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
import { NotificationsContext, NotificationVariant } from '../notifications/notifications';
import { reduxActions, storeHooks } from '../../redux';
import { translate } from '../i18n/i18n';
import { PageLayout, PageSection } from '../pageLayout/pageLayout';
import { helpers } from '../../common';
import graphPng2x from '../../images/graph2x.png';
import graphPng4x from '../../images/graph4x.png';

/**
 * Opt-in view
 *
 * @memberof Components
 * @module OptinView
 */

/**
 * An account opt-in view.
 *
 * @param {object} props
 * @param {translate} [props.t=translate]
 * @param {reduxActions.user.updateAccountOptIn} [props.updateAccountOptIn=reduxActions.user.updateAccountOptIn]
 * @param {storeHooks.reactRedux.useDispatch} [props.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {NotificationsContext.useNotifications} [props.useNotifications=NotificationsContext.useNotifications]
 * @param {storeHooks.reactRedux.useSelectorsResponse} [props.useSelectorsResponse=storeHooks.reactRedux.useSelectorsResponse]
 * @param {useSession} [props.useSession=useSession]
 * @fires onSubmitOptIn
 * @returns {JSX.Element}
 */
const OptinView = ({
  t = translate,
  updateAccountOptIn = reduxActions.user.updateAccountOptIn,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useNotifications: useAliasNotifications = NotificationsContext.useNotifications,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse,
  useSession: useAliasSession = useSession
}) => {
  const dispatch = useAliasDispatch();
  const { addNotification } = useAliasNotifications();
  const { errorStatus } = useAliasSession();
  const { error, fulfilled, pending } = useAliasSelectorsResponse(({ app }) => app?.optin);

  /**
   * Submit and update account opt-in.
   *
   * @event onSubmitOptIn
   * @returns {void}
   */
  const onSubmitOptIn = async () => {
    try {
      await dispatch(updateAccountOptIn());

      addNotification({
        variant: NotificationVariant.success,
        title: t('curiosity-optin.notificationsSuccessTitle', { appName: helpers.UI_DISPLAY_NAME }),
        description: t('curiosity-optin.notificationsSuccessDescription')
      });
    } catch {
      addNotification({
        variant: NotificationVariant.danger,
        title: t('curiosity-optin.notificationsErrorTitle', { appName: helpers.UI_DISPLAY_NAME }),
        description: t('curiosity-optin.notificationsErrorDescription')
      });
    }
  };

  /**
   * Render opt-in form states.
   *
   * @returns {React.ReactNode}
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
            <Button data-test="optinButtonSubmitDisabled" variant="primary" isDisabled>
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
          <Button data-test="optinButtonSubmit" variant="primary" onClick={onSubmitOptIn}>
            {t('curiosity-optin.buttonActivate', { appName: helpers.UI_DISPLAY_NAME })}
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  /**
   * Render tour copy and button.
   *
   * @returns {React.ReactNode}
   */
  const renderTour = () => (
    <Card className="curiosity-optin-tour">
      <CardHeader
        actions={{
          actions: (
            <Brand
              srcSet={`${graphPng4x} 1064w, ${graphPng2x} 600w`}
              src={graphPng4x}
              alt={t('curiosity-optin.tourTitleImageAlt')}
              aria-hidden
              className="curiosity-optin-image"
            />
          )
        }}
      />
      <CardTitle>
        <Title headingLevel="h3" size="2xl">
          {t('curiosity-optin.tourTitle')}
        </Title>
      </CardTitle>
      <CardBody>{t('curiosity-optin.tourDescription')}</CardBody>
      <CardFooter>
        <Button data-test="optinButtonTour" variant="secondary" className="uxui-curiosity__button-tour">
          {t('curiosity-optin.buttonTour')}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <PageLayout>
      <PageSection className="curiosity-page-section__optin">
        <Card data-test="optinView">
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
      </PageSection>
    </PageLayout>
  );
};

export { OptinView as default, OptinView };
