import React from 'react';
import { Alert, AlertActionCloseButton, AlertGroup, AlertVariant } from '@patternfly/react-core';
import { useBannerMessages, useRemoveBannerMessages } from './bannerMessagesContext';

/**
 * Banner alert messages for a product view.
 *
 * @memberof Components
 * @module BannerMessages
 * @property {module} BannerMessagesContext
 */

/**
 * Banner message variants.
 *
 * @type {{success: AlertVariant.success, custom: AlertVariant.custom, warning: AlertVariant.warning,
 *     danger: AlertVariant.danger, info: AlertVariant.info}}
 */
const BannerMessageVariant = { ...AlertVariant };

/**
 * Render banner messages.
 *
 * @param {object} props
 * @param {useBannerMessages} [props.useBannerMessages=useBannerMessages]
 * @param {useRemoveBannerMessages} [props.useRemoveBannerMessages=useRemoveBannerMessages]
 * @returns {JSX.Element}
 */
const BannerMessages = ({
  useBannerMessages: useAliasBannerMessages = useBannerMessages,
  useRemoveBannerMessages: useAliasRemoveBannerMessages = useRemoveBannerMessages
}) => {
  const bannerMessages = useAliasBannerMessages();
  const removeBannerMessages = useAliasRemoveBannerMessages();

  if (bannerMessages?.length) {
    return (
      <div className="curiosity-banner-messages">
        <AlertGroup isLiveRegion>
          {bannerMessages?.map(({ id, message, title, variant = BannerMessageVariant.info }) => {
            const actionClose = <AlertActionCloseButton onClose={() => removeBannerMessages(id || title)} />;

            return (
              <Alert actionClose={actionClose} key={id || title} title={title} variant={variant} isInline>
                {message}
              </Alert>
            );
          })}
        </AlertGroup>
      </div>
    );
  }

  return null;
};

export { BannerMessages as default, BannerMessages, BannerMessageVariant };
