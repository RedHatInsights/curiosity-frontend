import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton, AlertVariant, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { connect, reduxSelectors } from '../../redux';
import { translate } from '../i18n/i18n';
import { helpers } from '../../common';

/**
 * Render banner messages.
 *
 * @augments React.Component
 */
class BannerMessages extends React.Component {
  state = {};

  /**
   * Apply messages' configuration to alerts.
   *
   * @returns {Node}
   */
  renderAlerts() {
    const { state } = this;
    const { appMessages, messages } = this.props;
    const updatedMessages = [];

    if (messages.length) {
      Object.entries(appMessages).forEach(([key, value]) => {
        if (state[key] !== true && value === true) {
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

    return updatedMessages.map(({ key, message, title, variant = AlertVariant.info }) => {
      const actionClose = <AlertActionCloseButton onClose={() => this.setState({ [key]: true })} />;

      return (
        <Alert actionClose={actionClose} key={key} title={title} variant={variant}>
          {message}
        </Alert>
      );
    });
  }

  /**
   * Render a banner messages container.
   *
   * @returns {Node}
   */
  render() {
    const alerts = this.renderAlerts();

    if (alerts.length) {
      return <div className="curiosity-banner-messages">{alerts}</div>;
    }

    return null;
  }
}

/**
 * Prop types.
 *
 * @type {{appMessages: object, messages: Array}}
 */
BannerMessages.propTypes = {
  appMessages: PropTypes.object.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.node.isRequired,
      message: PropTypes.node.isRequired,
      variant: PropTypes.oneOf([...Object.values(AlertVariant)])
    })
  )
};

/**
 * Default props.
 *
 * @type {{messages: Array}}
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
  ]
};

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.appMessages.makeAppMessages();

const ConnectedBannerMessages = connect(makeMapStateToProps)(BannerMessages);

export { ConnectedBannerMessages as default, ConnectedBannerMessages, BannerMessages };
