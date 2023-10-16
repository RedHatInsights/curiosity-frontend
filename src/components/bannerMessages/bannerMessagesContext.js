import { useCallback } from 'react';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct } from '../productView/productViewContext';
import { helpers } from '../../common/helpers';

/**
 * @memberof BannerMessages
 * @module BannerMessagesContext
 */

/**
 * Retrieve, set and remove application banner messages from state.
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useSelector
 * @returns {{ bannerMessages: Array, setBannerMessages: Function, removeBannerMessages: Function }}
 */
const useBannerMessages = ({
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { productId } = useAliasProduct();
  return useAliasSelector(({ messages }) => messages?.bannerMessages?.[productId], []);
};

/**
 * Provide a callback for removing application banner messages from state.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useBannerMessages
 * @returns {Function}
 */
const useRemoveBannerMessages = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useBannerMessages: useAliasBannerMessages = useBannerMessages
} = {}) => {
  const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();
  const bannerMessages = useAliasBannerMessages();

  /**
   * Remove a banner message from state.
   *
   * @callback removeBannerMessages
   * @param {string} idTitle
   */
  return useCallback(
    idTitle => {
      if (productId && Array.isArray(bannerMessages) && bannerMessages.length) {
        const filteredMessages = bannerMessages.filter(({ id, title }) => id !== idTitle && title !== idTitle);

        dispatch({
          type: reduxTypes.message.SET_BANNER_MESSAGES,
          viewId: productId,
          bannerMessages: filteredMessages || []
        });
      }
    },
    [bannerMessages, dispatch, productId]
  );
};

/**
 * Provide a callback for setting application banner messages from state.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useBannerMessages
 * @returns {Function}
 */
const useSetBannerMessages = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useBannerMessages: useAliasBannerMessages = useBannerMessages
} = {}) => {
  const dispatch = useAliasDispatch();
  const { productId } = useAliasProduct();
  const bannerMessages = useAliasBannerMessages();

  /**
   * Set application messages for banner display
   *
   * @callback setBannerMessages
   * @param {Array|{ id: string, message: string, title: string, variant: string }} messages
   */
  return useCallback(
    messages => {
      if (productId) {
        const updatedMessages = (Array.isArray(messages) && messages) || [messages];

        dispatch({
          type: reduxTypes.message.SET_BANNER_MESSAGES,
          viewId: productId,
          bannerMessages: [
            ...(bannerMessages || []),
            ...updatedMessages
              .map(value => {
                if (value?.id || value?.title || value?.message || value?.variant) {
                  return value;
                }

                if (typeof value === 'string' || typeof value === 'number') {
                  return {
                    id: value,
                    title: value
                  };
                }

                return undefined;
              })
              .filter(value => value !== undefined)
          ]
        });
      } else if (helpers.DEV_MODE) {
        console.warn(
          'Banner messages currently require the use of "product id". Product context is unavailable, try moving your banner message "set" lower in the component order.'
        );
      }
    },
    [bannerMessages, dispatch, productId]
  );
};

const context = {
  useBannerMessages,
  useRemoveBannerMessages,
  useSetBannerMessages
};

export { context as default, context, useBannerMessages, useRemoveBannerMessages, useSetBannerMessages };
