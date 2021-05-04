import rbacConfig from './rbac';
import { routes as routesConfig } from './routes';

const config = {
  rbac: rbacConfig,
  routes: routesConfig
};

export { config as default, config, rbacConfig, routesConfig };
