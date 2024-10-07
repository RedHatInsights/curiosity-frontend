import React from 'react';
import { BinocularsIcon } from '@patternfly/react-icons';
import { Maintenance } from '@redhat-cloud-services/frontend-components/Maintenance';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { routerHelpers } from '../router';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';
import { MessageView } from '../messageView/messageView';
import { OptinView } from '../optinView/optinView';
import { translate } from '../i18n/i18n';
import { AuthenticationContext, useGetAuthorization } from './authenticationContext';

/**
 * Authentication component wrapper.
 *
 * @memberof Components
 * @module Authentication
 * @property {module} AuthenticationContext
 */

/**
 * An authentication pass-through component.
 *
 * @param {object} props
 * @param {string} [props.appName=routerHelpers.appName]
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.isDisabled=helpers.UI_DISABLED]
 * @param {translate} [props.t=translate]
 * @param {useGetAuthorization} [props.useGetAuthorization=useGetAuthorization]
 * @returns {JSX.Element}
 */
const Authentication = ({
  appName = routerHelpers.appName,
  children,
  isDisabled = helpers.UI_DISABLED,
  t = translate,
  useGetAuthorization: useAliasGetAuthorization = useGetAuthorization
}) => {
  const { pending, data = {} } = useAliasGetAuthorization();
  const { authorized = {}, errorCodes, errorStatus } = data;
  const { [appName]: isAuthorized } = authorized;

  const renderContent = () => {
    if (isDisabled) {
      return (
        <MessageView>
          <Maintenance description={t('curiosity-auth.maintenance', { context: 'description' })} />
        </MessageView>
      );
    }

    if (isAuthorized) {
      return children;
    }

    if (pending) {
      return (
        <MessageView
          pageTitle="&nbsp;"
          message={t('curiosity-auth.pending', { context: 'description' })}
          icon={<BinocularsIcon />}
        />
      );
    }

    if (
      (errorCodes && errorCodes.includes(rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES.OPTIN)) ||
      errorStatus === 418
    ) {
      return <OptinView />;
    }

    return (
      <MessageView>
        <NotAuthorized serviceName={helpers.UI_DISPLAY_NAME} />
      </MessageView>
    );
  };

  return <AuthenticationContext.Provider value={data}>{renderContent()}</AuthenticationContext.Provider>;
};

export { Authentication as default, Authentication };
