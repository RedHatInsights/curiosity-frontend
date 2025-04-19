import React from 'react';
import { Card, CardBody } from '@patternfly/react-core';
import { BinocularsIcon } from '@patternfly/react-icons';
import { useProductOnload } from './productViewContext';
import { ErrorMessage } from '../errorMessage/errorMessage';
import { MessageView } from '../messageView/messageView';
import { translate } from '../i18n/i18n';

/**
 * @memberof ProductView
 * @module ProductViewOnload
 */

/**
 * Product conditional configuration loading.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {translate} [props.t=translate]
 * @param {useProductOnload} [props.useProductOnload=useProductOnload]
 * @returns {JSX.Element}
 */
const ProductViewOnload = ({ children, t = translate, useProductOnload: useAliasProductOnload = useProductOnload }) => {
  const { isReady, error, message, productId } = useAliasProductOnload();

  return (
    (error && (
      <Card isPlain className="curiosity-card curiosity-error__product-onload">
        <CardBody className="curiosity-card__body">
          <ErrorMessage
            message={message}
            title={t('curiosity-view.error', { product: productId, context: ['title', 'onload'] })}
          />
        </CardBody>
      </Card>
    )) ||
    (isReady && children) || (
      <MessageView
        pageTitle="&nbsp;"
        message={t('curiosity-view.pending', { context: 'description' })}
        icon={<BinocularsIcon />}
      />
    )
  );
};

export { ProductViewOnload as default, ProductViewOnload };
