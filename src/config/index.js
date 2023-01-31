import rbacConfig from './rbac.json';
import { products as productConfig } from './products';
import { routes as routesConfig } from './routes';

const config = {
  products: productConfig,
  rbac: rbacConfig,
  routes: routesConfig
};

export { config as default, config, productConfig, rbacConfig, routesConfig };
