/**
 * Breakout individual files for filtering.
 *
 * @param {string} files
 * @returns {Array<string>}
 */
const filterFiles = files =>
  files
    .trim()
    .split(/\n/g)
    .filter(file => {
      const updatedFile = file.trim();
      return updatedFile.length > 0 && /README\.md$/.test(updatedFile);
    })
    .map(file => `File > ${file} > is modified. Update README with '$ yarn build:docs'`);

/**
 * If modified files exist, throw an error.
 *
 * @param {string} files
 * @returns {{resultsArray: Array, resultsString: string}}
 */
module.exports = files => {
  const lintResults = { resultsArray: [], resultsString: '' };

  if (files) {
    const parsedResults = filterFiles(files);
    lintResults.resultsArray = parsedResults;
    lintResults.resultsString = JSON.stringify(parsedResults, null, 2);
  }

  return lintResults;
};
