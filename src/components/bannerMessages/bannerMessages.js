import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton, AlertVariant, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useShallowCompareEffect } from 'react-use';
import { apiQueries, storeHooks } from '../../redux';
import { translate } from '../i18n/i18n';
import { dateHelpers, helpers } from '../../common';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { useRouteDetail } from '../../hooks/useRouter';

/**
 * Render banner messages.
 *
 * @param {object} props
 * @param {Array} props.messages
 * @param {Function} props.useRouteDetail
 * @param {Function} props.useAppMessages
 * @returns {Node}
 */
const BannerMessages = ({ messages, useRouteDetail: useAliasRouteDetail, useAppMessages: useAliasAppMessages }) => {
  const [hideAlerts, setHideAlerts] = useState({});
  const [alerts, setAlerts] = useState([]);
  const { pathParameter: productId, productConfig } = useAliasRouteDetail() || {};
  const isProductConfig = productConfig?.length === 1 && productConfig?.[0];
  const { query } = apiQueries.parseRhsmQuery(productConfig?.[0]?.query || {});
  const { appMessages } = useAliasAppMessages();

  useShallowCompareEffect(() => {
    if (productId && isProductConfig) {
      const { startDate, endDate } = dateHelpers.getRangedDateTime('CURRENT');
      const updatedGraphQuery = {
        ...query,
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.START_DATE]: startDate.toISOString(),
        [RHSM_API_QUERY_TYPES.END_DATE]: endDate.toISOString()
      };

      storeHooks.rhsmActions.useGetMessageReports(productId, updatedGraphQuery);
    }
  }, [productId, isProductConfig, query]);

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
 * @type {{useAppMessages: Function, messages: Array, useRouteDetail: Function}}
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
  useAppMessages: PropTypes.func,
  useRouteDetail: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useAppMessages: Function, messages: Array, useRouteDetail: Function}}
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
  useAppMessages: storeHooks.rhsmSelectors.useAppMessages,
  useRouteDetail
};

export { BannerMessages as default, BannerMessages };
