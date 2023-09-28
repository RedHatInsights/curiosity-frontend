import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
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
 * @fires onNavigate
 * @param {object} props
 * @param {number} props.availableProductsRedirect
 * @param {Function} props.t
 * @param {Function} props.useNavigate
 * @param {Function} props.useRouteDetail
 * @returns {React.ReactNode}
 */
const ProductViewMissing = ({
  availableProductsRedirect,
  t,
  useNavigate: useAliasNavigate,
  useRouteDetail: useAliasRouteDetail
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
                (firstMatch.productPath === productPath && 'curiosity-card__selected') || ''
              }`}
              key={`missingViewCard-${productId}-${helpers.generateId()}`}
              isSelectable
              isSelected={firstMatch.productPath === productPath}
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
