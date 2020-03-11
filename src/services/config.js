import axios, { CancelToken } from 'axios';
import { platformServices } from './platformServices';

const serviceConfig = (passedConfig = {}) => ({
  headers: {},
  timeout: process.env.REACT_APP_AJAX_TIMEOUT,
  ...passedConfig
});

const cancelTokens = {};

const serviceCall = async config => {
  await platformServices.getUser();

  const updatedConfig = { ...config };
  const cancelTokensId = updatedConfig.url;

  if (updatedConfig.cancel === true) {
    if (cancelTokens[cancelTokensId]) {
      cancelTokens[cancelTokensId].cancel('cancelled request');
    }

    cancelTokens[cancelTokensId] = CancelToken.source();
    updatedConfig.cancelToken = cancelTokens[cancelTokensId].token;

    delete updatedConfig.cancel;
  }

  return axios(serviceConfig(updatedConfig));
};

export { serviceConfig as default, serviceConfig, serviceCall };
