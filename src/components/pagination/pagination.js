import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as PfPagination } from '@patternfly/react-core';
import { helpers } from '../../common';
import { paginationHelpers } from './paginationHelpers';

/**
 * ToDo: Apply locale/translation to the PF Pagination "titles" prop.
 */
/**
 * FixMe: PF Pagination component offset property is either broken, confusing to implement, ...
 * or requires an equivalent effort to using page. There appears to be confusing behavior in how
 * the next offset range is calculated. It fails to update when passing in the next expected
 * sequence using the returned starting index. We'll continue emulating the use of "offset"
 * by performing our own calculation and applying it to the page property instead.
 */
/**
 * Pagination component.
 *
 * @param {object} props
 * @param {string} props.dropDirection
 * @param {boolean} props.isDisabled
 * @param {boolean} props.isCompact
 * @param {number} props.itemCount
 * @param {number} props.offset
 * @param {Function} props.onPage
 * @param {Function} props.onPerPage
 * @param {number} props.perPage
 * @param {string} props.variant
 * @returns {Node}
 */
const Pagination = ({
  dropDirection,
  isDisabled,
  isCompact,
  itemCount,
  offset,
  onPage,
  onPerPage,
  perPage,
  variant
}) => (
  <PfPagination
    className={(!itemCount && 'hidden') || ''}
    dropDirection={dropDirection}
    isCompact={isCompact}
    isDisabled={isDisabled || !itemCount}
    itemCount={itemCount}
    onSetPage={(event, page, limit) =>
      onPage({ event, perPage: limit, offset: paginationHelpers.calculateOffsetFromPage(page, limit) })
    }
    onPerPageSelect={(event, limit) => onPerPage({ event, perPage: limit, offset: Pagination.defaultProps.offset })}
    page={paginationHelpers.calculatePageFromOffset(offset || Pagination.defaultProps.offset, perPage)}
    perPage={perPage}
    variant={variant}
  />
);

/**
 * Prop types
 *
 * @type {{isCompact: boolean, onPage: Function, perPage: number, offset: number,
 *     dropDirection: string, onPerPage: Function, variant: null, isDisabled: boolean,
 *     itemCount: number}}
 */
Pagination.propTypes = {
  dropDirection: PropTypes.oneOf(['up', 'down']),
  isCompact: PropTypes.bool,
  isDisabled: PropTypes.bool,
  itemCount: PropTypes.number,
  offset: PropTypes.number,
  onPage: PropTypes.func,
  onPerPage: PropTypes.func,
  perPage: PropTypes.number,
  variant: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{isCompact: boolean, onPage: Function, perPage: number, offset: number,
 *     dropDirection: string, onPerPage: Function, variant: null, isDisabled: boolean,
 *     itemCount: number}}
 */
Pagination.defaultProps = {
  dropDirection: 'down',
  isCompact: false,
  isDisabled: false,
  itemCount: 0,
  offset: 0,
  onPage: helpers.noop,
  onPerPage: helpers.noop,
  perPage: 10,
  variant: null
};

export { Pagination as default, Pagination };
