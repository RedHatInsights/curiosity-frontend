/**
 * @memberof Pagination
 * @module PaginationHelpers
 */

/**
 * Calculate offset from page and perPage/limit.
 *
 * @param {number} page
 * @param {number} perPage
 * @returns {number}
 */
const calculateOffsetFromPage = (page, perPage) => perPage * (page - 1) || 0;

/**
 * Calculate page from offset and perPage/limit
 *
 * @param {number} offset
 * @param {number} perPage
 * @returns {number}
 */
const calculatePageFromOffset = (offset, perPage) => offset / perPage + 1 || 1;

/**
 * Determine if paging is on the last page.
 *
 * @param {number} offset
 * @param {number} perPage
 * @param {number} itemCount
 * @returns {boolean}
 */
const isLastPage = (offset, perPage, itemCount) =>
  calculatePageFromOffset(offset, perPage) === Math.ceil(itemCount / perPage);

const paginationHelpers = {
  calculateOffsetFromPage,
  calculatePageFromOffset,
  isLastPage
};

export {
  paginationHelpers as default,
  paginationHelpers,
  calculateOffsetFromPage,
  calculatePageFromOffset,
  isLastPage
};
