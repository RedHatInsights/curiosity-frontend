const authHeader = () => {
  const authToken = '';

  if (authToken === '') {
    return {};
  }

  return {
    [process.env.REACT_APP_AUTH_HEADER]: process.env.REACT_APP_AUTH_HEADER_CONTENT.replace('{0}', ` ${authToken}`)
  };
};

const serviceConfig = (passedConfig = {}, auth = true) =>
  Object.assign(
    {
      headers: auth ? authHeader() : {},
      timeout: process.env.REACT_APP_AJAX_TIMEOUT
    },
    passedConfig
  );

export { serviceConfig as default, serviceConfig };
