import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardFooter, CardTitle, Gallery, Title, PageSection } from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { useMount } from 'react-use';
import { PageLayout, PageHeader } from '../pageLayout/pageLayout';
import { routerContext } from '../router';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Render a missing product view.
 *
 * @fires onNavigate
 * @param {object} props
 * @param {number} props.availableProductsRedirect
 * @param {Function} props.t
 * @param {Function} props.useNavigate
 * @param {Function} props.useRouteDetail
 * @returns {Node}
 */
const ProductViewMissing = ({
  availableProductsRedirect,
  t,
  useNavigate: useAliasNavigate,
  useRouteDetail: useAliasRouteDetail
}) => {
  const navigate = useAliasNavigate();
  const { productConfig, allProductConfigs } = useAliasRouteDetail();
  const availableProducts = (productConfig?.length && productConfig) || allProductConfigs;

  useMount(() => {
    console.log('>>>> missing view mounted', availableProducts);
    if (availableProducts?.length <= availableProductsRedirect) {
      console.log('>>>> MISSING VIEW NAVIGATE', availableProducts[0].productPath);
      navigate(availableProducts[0].productPath);
    }
  });

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
              key={`missingViewCard-${productId}-${helpers.generateId()}`}
              isHoverable
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

/**
 * Prop types.
 *
 * @type {{useNavigate: Function, availableProductsRedirect: number, t: Function, useRouteDetail: Function}}
 */
ProductViewMissing.propTypes = {
  availableProductsRedirect: PropTypes.number,
  t: PropTypes.func,
  useNavigate: PropTypes.func,
  useRouteDetail: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useNavigate: Function, availableProductsRedirect: number, t: translate, useRouteDetail: Function}}
 */
ProductViewMissing.defaultProps = {
  availableProductsRedirect: 4,
  t: translate,
  useNavigate: routerContext.useNavigate,
  useRouteDetail: routerContext.useRouteDetail
};

export { ProductViewMissing as default, ProductViewMissing };
