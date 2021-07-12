import { config as rhel } from './product.rhel';
import { config as openshiftContainer } from './product.openshiftContainer';
import { config as openshiftMetrics } from './product.openshiftMetrics';
import { config as openshiftDedicated } from './product.openshiftDedicated';
import { config as satelliteProduct } from './product.satellite';
import rbacConfig from './rbac';
import { routes as routesConfig } from './routes';

const productsConfig = {
  rhel,
  openshiftContainer,
  openshiftMetrics,
  openshiftDedicated,
  satelliteProduct
};

const config = {
  products: productsConfig,
  rbac: rbacConfig,
  routes: routesConfig
};

export { config as default, config, productsConfig, rbacConfig, routesConfig };
