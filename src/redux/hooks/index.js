import { reactReduxHooks } from './useReactRedux';
import { rhsmActionsHooks } from './useRhsmActions';
import { rhsmSelectorsHooks } from './useRhsmSelectors';

const storeHooks = {
  reactRedux: reactReduxHooks,
  rhsmActions: rhsmActionsHooks,
  rhsmSelectors: rhsmSelectorsHooks
};

export { storeHooks as default, storeHooks, reactReduxHooks, rhsmActionsHooks, rhsmSelectorsHooks };
