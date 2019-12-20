import axios from 'axios';
import { userServices } from './userServices';

const serviceConfig = (passedConfig = {}) => ({
  headers: {},
  timeout: process.env.REACT_APP_AJAX_TIMEOUT,
  ...passedConfig
});

const serviceCall = async config => {
  await userServices.authorizeUser();
  return axios(serviceConfig(config));
};

export { serviceConfig as default, serviceConfig, serviceCall };
