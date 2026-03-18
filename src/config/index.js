import rbacConfig from './rbac.json';
import { products as productConfig } from './products';
import { banners as bannersConfig } from './banners';

const config = {
  products: productConfig,
  banners: bannersConfig,
  rbac: rbacConfig
};

export { config as default, config, productConfig, rbacConfig, bannersConfig };
