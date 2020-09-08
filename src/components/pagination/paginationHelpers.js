import { reduxTypes } from '../../redux/types';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { store } from '../../redux';

const resetPage = ({ offsetDefault = 0, productId, viewId }) => {
  const updatedActions = [];

  if (productId) {
    updatedActions.push({
      type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
      viewId: productId,
      [RHSM_API_QUERY_TYPES.OFFSET]: offsetDefault
    });
  }

  if (viewId && productId !== viewId) {
    updatedActions.push({
      type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
      viewId,
      [RHSM_API_QUERY_TYPES.OFFSET]: offsetDefault
    });
  }

  store.dispatch(updatedActions);
};

const paginationHelpers = {
  resetPage
};

export { paginationHelpers as default, paginationHelpers, resetPage };
