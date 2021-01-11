import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as PfPagination } from '@patternfly/react-core';
import { reduxTypes, store } from '../../redux';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

/**
 * ToDo: Apply locale/translation to the PF Pagination "titles" prop.
 */
/**
 * Contained pagination.
 *
 * @augments React.Component
 * @fires onClear
 * @fires onPage
 * @fires onPerPage
 */
class Pagination extends React.Component {
  /**
   * Call page update.
   *
   * @event onPage
   * @param {object} params
   * @param {number} params.page
   */
  onPage = ({ page }) => {
    const { offsetDefault, perPageDefault, query } = this.props;
    const updatedPerPage = query?.[RHSM_API_QUERY_TYPES.LIMIT] || perPageDefault;
    const offset = updatedPerPage * (page - 1) || offsetDefault;

    this.setOffset(offset);
    this.setLimit(updatedPerPage);
  };

  /**
   * Call per-page update.
   *
   * @event onPerPage
   * @param {object} params
   * @param {number} params.perPage
   */
  onPerPage = ({ perPage }) => {
    this.setOffset();
    this.setLimit(perPage);
  };

  /**
   * Set page state.
   *
   * @param {number} offset
   */
  setOffset(offset) {
    const { offsetDefault, offsetType, productId } = this.props;
    const updatedActions = [];

    updatedActions.push({
      type: offsetType,
      viewId: productId,
      [RHSM_API_QUERY_TYPES.OFFSET]: offset ?? offsetDefault
    });

    store.dispatch(updatedActions);
  }

  /**
   * Set per-page state.
   *
   * @param {number} limit
   */
  setLimit(limit) {
    const { limitType, perPageDefault, productId } = this.props;
    const updatedActions = [];

    updatedActions.push({
      type: limitType,
      viewId: productId,
      [RHSM_API_QUERY_TYPES.LIMIT]: limit ?? perPageDefault
    });

    store.dispatch(updatedActions);
  }

  // ToDo: Consider using the PfPagination "offset" prop
  /**
   * Render pagination.
   *
   * @returns {Node}
   */
  render() {
    const { dropDirection, isCompact, isDisabled, itemCount, perPageDefault, query, variant } = this.props;
    const updatedPage = query?.[RHSM_API_QUERY_TYPES.OFFSET] / query?.[RHSM_API_QUERY_TYPES.LIMIT] + 1 || 1;
    const updatedPerPage = query?.[RHSM_API_QUERY_TYPES.LIMIT] || perPageDefault;

    return (
      <PfPagination
        className={(!itemCount && 'hidden') || ''}
        dropDirection={dropDirection}
        isCompact={isCompact}
        isDisabled={isDisabled || !itemCount}
        itemCount={itemCount}
        page={updatedPage}
        perPage={updatedPerPage}
        onSetPage={(event, page) => this.onPage({ event, page })}
        onPerPageSelect={(event, perPage) => this.onPerPage({ event, perPage })}
        variant={variant}
      />
    );
  }
}

/**
 * Prop types
 *
 * @type {{isCompact: boolean, productId: string, query: object, dropDirection: string,
 *     offsetDefault: number, variant: string, offsetType: string, perPageDefault: number,
 *     isDisabled: boolean, limitType: string, itemCount: number}}
 */
Pagination.propTypes = {
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number.isRequired,
    [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number.isRequired
  }).isRequired,
  dropDirection: PropTypes.oneOf(['up', 'down']),
  isCompact: PropTypes.bool,
  isDisabled: PropTypes.bool,
  itemCount: PropTypes.number,
  limitType: PropTypes.oneOf([
    reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
    reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT]
  ]).isRequired,
  offsetDefault: PropTypes.number,
  offsetType: PropTypes.oneOf([
    reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
    reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET]
  ]).isRequired,
  perPageDefault: PropTypes.number,
  productId: PropTypes.string.isRequired,
  variant: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{isCompact: boolean, dropDirection: string, offsetDefault: number,
 *     variant: null, perPageDefault: number, isDisabled: boolean, itemCount: number}}
 */
Pagination.defaultProps = {
  dropDirection: 'down',
  isCompact: false,
  isDisabled: false,
  itemCount: 0,
  offsetDefault: 0,
  perPageDefault: 10,
  variant: null
};

export { Pagination as default, Pagination };
