import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton, AlertVariant, Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import _isEqual from 'lodash/isEqual';
import { apiQueries, connect, reduxActions, reduxSelectors } from '../../redux';
import { translate } from '../i18n/i18n';
import { dateHelpers, helpers } from '../../common';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

/**
 * Render banner messages.
 *
 * @augments React.Component
 */
class BannerMessages extends React.Component {
  state = {};

  componentDidMount() {
    this.onUpdateData();
  }

  componentDidUpdate(prevProps) {
    const { query, productId } = this.props;

    if (productId !== prevProps.productId || !_isEqual(query, prevProps.query)) {
      this.onUpdateData();
    }
  }

  /**
   * Call the RHSM APIs, apply filters.
   *
   * @event onUpdateGraphData
   */
  onUpdateData = () => {
    const { getMessageReports, productId, query } = this.props;
    const { graphTallyQuery } = apiQueries.parseRhsmQuery(query);

    if (productId) {
      const { startDate, endDate } = dateHelpers.getRangedDateTime('CURRENT');
      const updatedGraphQuery = {
        ...graphTallyQuery,
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_TYPES.START_DATE]: startDate.toISOString(),
        [RHSM_API_QUERY_TYPES.END_DATE]: endDate.toISOString()
      };

      getMessageReports(productId, updatedGraphQuery);
    }
  };

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
 * @type {{appMessages: object, productId: string, getMessageReports: Function, query: object, messages: Array}}
 */
BannerMessages.propTypes = {
  appMessages: PropTypes.object.isRequired,
  getMessageReports: PropTypes.func,
  query: PropTypes.object,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.node.isRequired,
      message: PropTypes.node.isRequired,
      variant: PropTypes.oneOf([...Object.values(AlertVariant)])
    })
  ),
  productId: PropTypes.string.isRequired
};

/**
 * Default props.
 *
 * @type {{getMessageReports: Function, query: object, messages: Array}}
 */
BannerMessages.defaultProps = {
  getMessageReports: helpers.noop,
  query: {},
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
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getMessageReports: (id, query) => dispatch(reduxActions.rhsm.getMessageReports(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.appMessages.makeAppMessages();

const ConnectedBannerMessages = connect(makeMapStateToProps, mapDispatchToProps)(BannerMessages);

export { ConnectedBannerMessages as default, ConnectedBannerMessages, BannerMessages };
