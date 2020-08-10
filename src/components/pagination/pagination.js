import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as PfPagination } from '@patternfly/react-core';
import { connect, reduxTypes, store } from '../../redux';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';

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
    const { query, perPageDefault, productId, viewId } = this.props;
    const updatedPerPage = query?.[rhsmApiTypes.RHSM_API_QUERY_LIMIT] || perPageDefault;
    const offset = updatedPerPage * (page - 1) || 0;

    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_PAGE_OFFSET_RHSM,
        viewId,
        [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: offset
      },
      {
        type: reduxTypes.query.SET_QUERY_PAGE_OFFSET_RHSM,
        viewId: productId,
        [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: offset
      },
      {
        type: reduxTypes.query.SET_QUERY_PAGE_LIMIT_RHSM,
        viewId,
        [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: updatedPerPage
      },
      {
        type: reduxTypes.query.SET_QUERY_PAGE_LIMIT_RHSM,
        viewId: productId,
        [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: updatedPerPage
      }
    ]);
  };

  /**
   * Update per-page state.
   *
   * @event onPerPage
   * @param {object} params
   * @param {number} params.perPage
   */
  onPerPage = ({ perPage }) => {
    const { productId, viewId } = this.props;

    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_PAGE_LIMIT_RHSM,
        viewId,
        [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: perPage
      },
      {
        type: reduxTypes.query.SET_QUERY_PAGE_LIMIT_RHSM,
        viewId: productId,
        [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: perPage
      }
    ]);
  };

  // ToDo: Consider using the PfPagination "offset" prop
  /**
   * Render pagination.
   *
   * @returns {Node}
   */
  render() {
    const { query, dropDirection, isCompact, isDisabled, itemCount, perPageDefault, variant } = this.props;
    const updatedPage = query[rhsmApiTypes.RHSM_API_QUERY_OFFSET] / query[rhsmApiTypes.RHSM_API_QUERY_LIMIT] + 1 || 1;
    const updatedPerPage = query[rhsmApiTypes.RHSM_API_QUERY_LIMIT] || perPageDefault;

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
 * @type {{}}
 */
Pagination.propTypes = {
  query: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_LIMIT]: PropTypes.number,
    [rhsmApiTypes.RHSM_API_QUERY_OFFSET]: PropTypes.number
  }),
  dropDirection: PropTypes.oneOf(['up', 'down']),
  isCompact: PropTypes.bool,
  isDisabled: PropTypes.bool,
  itemCount: PropTypes.number,
  perPageDefault: PropTypes.number,
  productId: PropTypes.string.isRequired,
  variant: PropTypes.string,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{}}
 */
Pagination.defaultProps = {
  query: {},
  dropDirection: 'down',
  isCompact: false,
  isDisabled: false,
  itemCount: 0,
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
