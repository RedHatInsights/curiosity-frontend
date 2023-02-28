import moment from 'moment/moment';
import { helpers } from './helpers';
import { dateHelpers } from './dateHelpers';

/**
 * @memberof Helpers
 * @module Downloads
 */

/**
 * Download data to a file
 *
 * @param {object} options
 * @param {string} options.data
 * @param {string} options.fileName
 * @param {string} options.fileType
 * @returns {Promise}
 */
const downloadData = options => {
  const { data = '', fileName = 'download.txt', fileType = 'text/plain' } = options || {};
  return new Promise((resolve, reject) => {
    try {
      const { document, navigator, URL } = window;
      const blob = new Blob([data], { type: fileType });

      if (navigator?.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
        resolve({ fileName, data });
      } else {
        const anchorTag = document.createElement('a');

        anchorTag.href = URL.createObjectURL(blob);
        anchorTag.style.display = 'none';
        anchorTag.download = fileName;

        document.body.appendChild(anchorTag);

        anchorTag.click();

        setTimeout(() => {
          document.body.removeChild(anchorTag);
          URL.revokeObjectURL(blob);
          resolve({ fileName, data });
        }, 250);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Download the debug log file.
 */
const debugLog = async () => {
  try {
    const { sessionStorage } = window;
    const fileName = `${helpers.UI_LOGGER_FILE}`.replace(
      '{0}',
      moment(dateHelpers.getCurrentDate()).format('YYYYMMDD_HHmmss')
    );
    const data = JSON.stringify(JSON.parse(sessionStorage.getItem(`${helpers.UI_LOGGER_ID}`)), null, 2);

    await downloadData({ data, fileName, fileType: 'application/json' });
  } catch (e) {
    throw new Error(`debuglog error, ${e.message}`);
  }
};

const downloadHelpers = {
  downloadData,
  debugLog
};

helpers.browserExpose({ debugLog }, { limit: false });

export { downloadHelpers as default, downloadHelpers, downloadData, debugLog };
