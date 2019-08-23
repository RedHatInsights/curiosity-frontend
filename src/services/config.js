const serviceConfig = (passedConfig = {}) => ({
  headers: {},
  timeout: process.env.REACT_APP_AJAX_TIMEOUT,
  ...passedConfig
});

export { serviceConfig as default, serviceConfig };
