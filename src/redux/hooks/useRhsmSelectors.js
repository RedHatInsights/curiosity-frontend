import { useSelector } from 'react-redux';
import { useRouteDetail } from '../../components/router/routerContext';
import { selector } from '../selectors/appMessagesSelectors';

/**
 * Get app messages selector results.
 *
 * @param {object} options
 * @param {Function} options.useRouteDetail
 * @param {Function} options.useSelector
 * @returns {object}
 */
const useAppMessages = ({
  useRouteDetail: useAliasRouteDetail = useRouteDetail,
  useSelector: useAliasSelector = useSelector
} = {}) => {
  const { pathParameter: productId, productParameter: viewId } = useAliasRouteDetail() || {};
  const result = useAliasSelector(state => selector(state, { productId, viewId }));
  return {
    ...result
  };
};

const rhsmSelectorsHooks = {
  useAppMessages
};

export { rhsmSelectorsHooks as default, rhsmSelectorsHooks, useAppMessages };
