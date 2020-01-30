import axios from 'axios';
import { platformServices } from './platformServices';

const serviceConfig = (passedConfig = {}) => ({
  headers: {},
  timeout: process.env.REACT_APP_AJAX_TIMEOUT,
  ...passedConfig
});

const serviceCall = async config => {
  await platformServices.getUser();
  return axios(serviceConfig(config));
};

export { serviceConfig as default, serviceConfig, serviceCall };
