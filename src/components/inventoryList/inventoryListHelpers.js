import { translate } from '../i18n/i18n';

/**
 * Parse and return formatted/filtered table cells.
 *
 * @param {object} params
 * @param {Array} params.filters
 * @param {object}params.cellData
 * @returns {{columnHeaders: Array, cells: Array, data: object}}
 */
const parseRowCellsListData = ({ filters = [], cellData = {} }) => {
  const updatedColumnHeaders = [];
  const updatedCells = [];
  const allCells = {};

  // Apply translation and value, "pre" filters/callbacks
  Object.entries(cellData).forEach(([key, value]) => {
    allCells[key] = {
      title: translate('curiosity-inventory.header', { context: key }),
      value
    };

    updatedColumnHeaders.push(allCells[key].title);
    updatedCells.push(value);
  });

  // Apply header and cell values, apply filters/callbacks
  if (filters?.length) {
    updatedColumnHeaders.length = 0;
    updatedCells.length = 0;

    filters.forEach(({ id, cell, header }) => {
      let headerUpdated;
      let cellUpdated;

      if (allCells[id]) {
        headerUpdated = allCells[id].title;
        cellUpdated = allCells[id].value;
      }

      if (header) {
        headerUpdated = (typeof header === 'function' && header({ ...allCells })) || header;
      }

      if (cell) {
        cellUpdated = (typeof cell === 'function' && cell({ ...allCells })) || cell;
      }

      updatedColumnHeaders.push(headerUpdated);
      updatedCells.push(cellUpdated);
    });
  }

  return {
    columnHeaders: updatedColumnHeaders,
    cells: updatedCells,
    data: { ...allCells }
  };
};

const inventoryListHelpers = {
  parseRowCellsListData
};

export { inventoryListHelpers as default, inventoryListHelpers, parseRowCellsListData };
