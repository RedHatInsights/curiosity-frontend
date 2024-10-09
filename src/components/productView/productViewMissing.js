import React, { useLayoutEffect } from 'react';
import { Button, Card, CardBody, CardFooter, CardTitle, Gallery, Title, PageSection } from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { PageLayout, PageHeader } from '../pageLayout/pageLayout';
import { routerContext } from '../router';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * @memberof ProductView
 * @module ProductViewMissing
 */

/**
 * Render a missing product view.
 *
 * @param {object} props
 * @param {number} [props.availableProductsRedirect=4]
 * @param {translate} [props.t=translate]
 * @param {routerContext.useNavigate} [props.useNavigate=routerContext.useNavigate]
 * @param {routerContext.useRouteDetail} [props.useRouteDetail=routerContext.useRouteDetail]
 * @fires onNavigate
 * @returns {JSX.Element}
 */
const ProductViewMissing = ({
  availableProductsRedirect = 4,
  t = translate,
  useNavigate: useAliasNavigate = routerContext.useNavigate,
  useRouteDetail: useAliasRouteDetail = routerContext.useRouteDetail
}) => {
  const navigate = useAliasNavigate();
  const { firstMatch, allConfigs } = useAliasRouteDetail();
  const availableProducts = (!helpers.DEV_MODE && firstMatch && [firstMatch]) || allConfigs;
  const isRedirect = availableProducts?.length <= availableProductsRedirect;

  useLayoutEffect(() => {
    if (isRedirect) {
      navigate(availableProducts[0].productPath);
    }
  });

  if (isRedirect) {
    return null;
  }

  /**
   * On click, update history.
   *
   * @event onNavigate
   * @param {string} path
   * @returns {void}
   */
  const onNavigate = path => navigate(path);

  return (
    <PageLayout className="curiosity-missing-view">
      <PageHeader productLabel="missing">{t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME })}</PageHeader>
      <PageSection isFilled>
        <Gallery hasGutter>
          {availableProducts?.map(({ productGroup, productId, productPath }) => (
            <Card
              className={`curiosity-card ${
                (firstMatch?.productPath === productPath && 'curiosity-card__selected') || ''
              }`}
              key={`missingViewCard-${productId}-${helpers.generateId()}`}
              isSelectable
              isSelected={firstMatch?.productPath === productPath}
              onClick={() => onNavigate(productPath)}
            >
              <CardTitle>
                <Title headingLevel="h2" size="lg">
                  {t('curiosity-view.title', {
                    appName: helpers.UI_DISPLAY_NAME,
                    context: productId
                  })}
                </Title>
              </CardTitle>
              <CardBody className="curiosity-missing-view__card-description">
                {t('curiosity-view.description', {
                  appName: helpers.UI_DISPLAY_NAME,
                  context: productGroup
                })}
              </CardBody>
              <CardFooter>
                <Button
                  variant="link"
                  isInline
                  onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    onNavigate(productPath);
                  }}
                  icon={<ArrowRightIcon />}
                  iconPosition="right"
                >
                  Open
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Gallery>
      </PageSection>
    </PageLayout>
  );
};

export { ProductViewMissing as default, ProductViewMissing };
