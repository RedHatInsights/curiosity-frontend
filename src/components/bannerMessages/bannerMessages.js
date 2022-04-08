import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton, AlertVariant, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useShallowCompareEffect } from 'react-use';
import { useGetAppMessages } from './bannerMessagesContext';
import { helpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Render banner messages.
 *
 * @param {object} props
 * @param {Array} props.messages
 * @param {Function} props.useGetAppMessages
 * @returns {Node}
 */
const BannerMessages = ({ messages, useGetAppMessages: useAliasGetAppMessages }) => {
  const [hideAlerts, setHideAlerts] = useState({});
  const [alerts, setAlerts] = useState([]);
  const { data: appMessages } = useAliasGetAppMessages();

  useShallowCompareEffect(() => {
    const updatedMessages = [];

    if (messages.length) {
      Object.entries(appMessages).forEach(([key, value]) => {
        if (hideAlerts[key] !== true && value === true) {
          const message = messages.find(({ id }) => id === key);

          if (message) {
            updatedMessages.push({
              key,
              ...message
            });
          }
        }
      });
    }

    setAlerts(
      updatedMessages.map(({ key, message, title, variant = AlertVariant.info }) => {
        const actionClose = <AlertActionCloseButton onClose={() => setHideAlerts({ ...hideAlerts, [key]: true })} />;

        return (
          <Alert actionClose={actionClose} key={key} title={title} variant={variant}>
            {message}
          </Alert>
        );
      })
    );
  }, [appMessages, hideAlerts, messages]);

  if (alerts?.length) {
    return <div className="curiosity-banner-messages">{alerts}</div>;
  }

  return null;
};

/**
 * Prop types.
 *
 * @type {{useGetAppMessages: Function, messages: Array}}
 */
BannerMessages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.node.isRequired,
      message: PropTypes.node.isRequired,
      variant: PropTypes.oneOf([...Object.values(AlertVariant)])
    })
  ),
  useGetAppMessages: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGetAppMessages: Function, messages: Array}}
 */
BannerMessages.defaultProps = {
  messages: [
    {
      id: 'cloudigradeMismatch',
      title: translate('curiosity-banner.dataMismatchTitle'),
      message: translate(
        'curiosity-banner.dataMismatchMessage',
        {
          context: helpers.UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS !== '' && 'cloudigradeMismatch',
          appName: helpers.UI_DISPLAY_NAME
        },
        [
          <Button
            isInline
            component="a"
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            target="_blank"
            href={helpers.UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS}
          />
        ]
      )
    }
  ],
  useGetAppMessages
};

export { BannerMessages as default, BannerMessages };
