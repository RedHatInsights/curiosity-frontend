import React from 'react';
import { Pagination as PfPagination } from '@patternfly/react-core';
import { helpers } from '../../common';
import { paginationHelpers } from './paginationHelpers';

/**
 * Inventory paging.
 *
 * @memberof Components
 * @module Pagination
 * @property {module} PaginationHelpers
 */

/**
 * Available pagination dropdown direction types
 *
 * @type {{up: string, down: string}}
 */
const PaginationDirectionType = {
  down: 'down',
  up: 'up'
};

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
 * @param {PaginationDirectionType} [props.dropDirection=PaginationDirectionType.down]
 * @param {boolean} [props.isDisabled=false]
 * @param {boolean} [props.isCompact=false]
 * @param {number} [props.itemCount=0]
 * @param {number} [props.offset=0]
 * @param {Function} [props.onPage=helpers.noop]
 * @param {Function} [props.onPerPage=helpers.noop]
 * @param {number} [props.perPage=10]
 * @param {string} [props.variant]
 * @returns {JSX.Element}
 */
const Pagination = ({
  dropDirection = PaginationDirectionType.down,
  isDisabled = false,
  isCompact = false,
  itemCount = 0,
  offset = 0,
  onPage = helpers.noop,
  onPerPage = helpers.noop,
  perPage = 10,
  variant
}) => (
  <PfPagination
    dropDirection={dropDirection}
    isCompact={isCompact}
    isDisabled={isDisabled || !itemCount}
    itemCount={itemCount}
    onSetPage={(event, page, limit) =>
      onPage({ event, perPage: limit, offset: paginationHelpers.calculateOffsetFromPage(page, limit) })
    }
    onPerPageSelect={(event, limit) => onPerPage({ event, perPage: limit, offset: 0 })}
    page={paginationHelpers.calculatePageFromOffset(offset, perPage)}
    perPage={perPage}
    variant={variant}
  />
);

export { Pagination as default, Pagination, PaginationDirectionType };
