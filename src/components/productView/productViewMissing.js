import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardFooter, CardTitle, Gallery, Title, PageSection } from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router-dom';
import { PageLayout, PageHeader } from '../pageLayout/pageLayout';
import { routerHelpers } from '../router/router';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Render a missing product view.
 *
 * @fires onClick
 * @param {object} props
 * @param {Function} props.t
 * @returns {Node}
 */
const ProductViewMissing = ({ t }) => {
  const history = useHistory();

  /**
   * Return a list of available products.
   *
   * @returns {Array}
   */
  const filterAvailableProducts = () => {
    const { configs, allConfigs } = routerHelpers.getRouteConfigByPath();
    return (configs.length && configs) || allConfigs.filter(({ isSearchable }) => isSearchable === true);
  };

  /**
   * On click, update history.
   *
   * @event onUpdateHistory
   * @param {string} id
   * @returns {void}
   */
  const onClick = id => {
    const { routeHref } = routerHelpers.getRouteConfig({ id });
    history.push(routeHref);
  };

  return (
    <PageLayout className="curiosity-missing-view">
      <PageHeader productLabel="missing" includeTour>
        {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME })}
      </PageHeader>
      <PageSection isFilled>
        <Gallery hasGutter>
          {filterAvailableProducts().map(product => (
            <Card key={`missingViewCard-${product.id}`} isHoverable onClick={() => onClick(product.id)}>
              <CardTitle>
                <Title headingLevel="h2" size="lg">
                  {t('curiosity-view.title', {
                    appName: helpers.UI_DISPLAY_NAME,
                    context:
                      (Array.isArray(product.pathParameter) && product.pathParameter?.[0]) || product.pathParameter
                  })}
                </Title>
              </CardTitle>
              <CardBody className="curiosity-missing-view__card-description">
                {t('curiosity-view.description', {
                  appName: helpers.UI_DISPLAY_NAME,
                  context:
                    (Array.isArray(product.productParameter) && product.productParameter?.[0]) ||
                    product.productParameter
                })}
              </CardBody>
              <CardFooter>
                <Button
                  variant="link"
                  isInline
                  onClick={() => onClick(product.id)}
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
 * @type {{t: Function}}
 */
ProductViewMissing.propTypes = {
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: translate}}
 */
ProductViewMissing.defaultProps = {
  t: translate
};

export { ProductViewMissing as default, ProductViewMissing };
