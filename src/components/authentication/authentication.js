import React from 'react';
import PropTypes from 'prop-types';
import { BinocularsIcon } from '@patternfly/react-icons';
import { Maintenance } from '@redhat-cloud-services/frontend-components/Maintenance';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { routerHelpers, Redirect } from '../router';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';
import MessageView from '../messageView/messageView';
import { translate } from '../i18n/i18n';
import { AuthenticationContext, useGetAuthorization } from './authenticationContext';

/**
 * An authentication pass-through component.
 *
 * @param {object} props
 * @param {string} props.appName
 * @param {React.ReactNode} props.children
 * @param {boolean} props.isDisabled
 * @param {Function} props.t
 * @param {Function} props.useGetAuthorization
 * @returns {React.ReactNode}
 */
const Authentication = ({ appName, children, isDisabled, t, useGetAuthorization: useAliasGetAuthorization }) => {
  const { pending, data = {} } = useAliasGetAuthorization();
  const { authorized = {}, errorCodes, errorStatus } = data;
  const { [appName]: isAuthorized } = authorized;

  const renderContent = () => {
    if (isDisabled) {
      return (
        <MessageView>
          <Maintenance description={t('curiosity-auth.maintenanceCopy', '...')} />
        </MessageView>
      );
    }

    if (isAuthorized) {
      return children;
    }

    if (pending) {
      return <MessageView pageTitle="&nbsp;" message={t('curiosity-auth.pending', '...')} icon={BinocularsIcon} />;
    }

    if (
      (errorCodes && errorCodes.includes(rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES.OPTIN)) ||
      errorStatus === 418
    ) {
      return <Redirect route={routerHelpers.errorRoute.path} />;
    }

    return (
      <MessageView>
        <NotAuthorized serviceName={helpers.UI_DISPLAY_NAME} />
      </MessageView>
    );
  };

  return <AuthenticationContext.Provider value={data}>{renderContent()}</AuthenticationContext.Provider>;
};

/**
 * Prop types.
 *
 * @type {{useGetAuthorization: Function, children: React.ReactNode, appName: string, isDisabled: boolean}}
 */
Authentication.propTypes = {
  appName: PropTypes.string,
  children: PropTypes.node.isRequired,
  isDisabled: PropTypes.bool,
  t: PropTypes.func,
  useGetAuthorization: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGetAuthorization: Function, t: Function, appName: string, isDisabled: boolean}}
 */
Authentication.defaultProps = {
  appName: routerHelpers.appName,
  isDisabled: helpers.UI_DISABLED,
  t: translate,
  useGetAuthorization
};

export { Authentication as default, Authentication };
