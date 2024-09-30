import rbacConfig from './rbac.json';
import { products as productConfig } from './products';

const config = {
  products: productConfig,
  rbac: rbacConfig
};

export { config as default, config, productConfig, rbacConfig };
