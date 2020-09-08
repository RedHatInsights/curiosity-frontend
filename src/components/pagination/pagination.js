import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as PfPagination } from '@patternfly/react-core';
import { connect, reduxTypes, store } from '../../redux';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

// ToDo: Apply locale/translation to the PF Pagination "titles" prop.
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
   * Update page state.
   *
   * @event onPage
   * @param {object} params
   * @param {number} params.page
   */
  onPage = ({ page }) => {
    const { offsetDefault, perPageDefault, productId, query, viewId } = this.props;
    const updatedPerPage = query?.[RHSM_API_QUERY_TYPES.LIMIT] || perPageDefault;
    const offset = updatedPerPage * (page - 1) || offsetDefault;
    const updatedActions = [
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
        viewId,
        [RHSM_API_QUERY_TYPES.OFFSET]: offset
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
        viewId,
        [RHSM_API_QUERY_TYPES.LIMIT]: updatedPerPage
      }
    ];

    if (productId && productId !== viewId) {
      updatedActions.push({
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
        viewId: productId,
        [RHSM_API_QUERY_TYPES.OFFSET]: offset
      });

      updatedActions.push({
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
        viewId: productId,
        [RHSM_API_QUERY_TYPES.LIMIT]: updatedPerPage
      });
    }

    store.dispatch(updatedActions);
  };

  /**
   * Update per-page state.
   *
   * @event onPerPage
   * @param {object} params
   * @param {number} params.perPage
   */
  onPerPage = ({ perPage }) => {
    const { offsetDefault, productId, viewId } = this.props;
    const updatedActions = [
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
        viewId,
        [RHSM_API_QUERY_TYPES.OFFSET]: offsetDefault
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
        viewId,
        [RHSM_API_QUERY_TYPES.LIMIT]: perPage
      }
    ];

    if (productId && productId !== viewId) {
      updatedActions.push({
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.OFFSET],
        viewId: productId,
        [RHSM_API_QUERY_TYPES.OFFSET]: offsetDefault
      });

      updatedActions.push({
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.LIMIT],
        viewId: productId,
        [RHSM_API_QUERY_TYPES.LIMIT]: perPage
      });
    }
    store.dispatch(updatedActions);
  };

  // ToDo: Consider using the PfPagination "offset" prop
  /**
   * Render pagination.
   *
   * @returns {Node}
   */
  render() {
    const { dropDirection, isCompact, isDisabled, itemCount, perPageDefault, query, variant } = this.props;
    const updatedPage = query[RHSM_API_QUERY_TYPES.OFFSET] / query[RHSM_API_QUERY_TYPES.LIMIT] + 1 || 1;
    const updatedPerPage = query[RHSM_API_QUERY_TYPES.LIMIT] || perPageDefault;

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
 * @type {{isCompact: boolean, viewId: string, productId: string, query: object,
 *     dropDirection: string, offsetDefault: number, variant: string, perPageDefault: number,
 *     isDisabled: boolean, itemCount: number}}
 */
Pagination.propTypes = {
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
    [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number
  }),
  dropDirection: PropTypes.oneOf(['up', 'down']),
  isCompact: PropTypes.bool,
  isDisabled: PropTypes.bool,
  itemCount: PropTypes.number,
  offsetDefault: PropTypes.number,
  perPageDefault: PropTypes.number,
  productId: PropTypes.string.isRequired,
  variant: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{isCompact: boolean, viewId: string, query: object, dropDirection: string,
 *     offsetDefault: number, variant: null, perPageDefault: number, isDisabled: boolean,
 *     itemCount: number}}
 */
Pagination.defaultProps = {
  query: {},
  dropDirection: 'down',
  isCompact: false,
  isDisabled: false,
  itemCount: 0,
  offsetDefault: 0,
  perPageDefault: 10,
  variant: null,
  viewId: 'pagination'
};

/**
 * Apply state to props.
 *
 * @param {object} state
 * @param {object} state.view
 * @param {object} props
 * @param {string} props.productId
 * @returns {object}
 */
const mapStateToProps = ({ view }, { productId }) => ({ query: view.query?.[productId] });

const ConnectedPagination = connect(mapStateToProps)(Pagination);

export { ConnectedPagination as default, ConnectedPagination, Pagination };
