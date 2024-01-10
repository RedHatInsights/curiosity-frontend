/**
 * Breakout individual commits.
 *
 * @param {string} commits
 * @returns {{issueNumber: string, description: string, trimmedMessage: string, hash: string, typeScope: string}[]}
 */
const messages = commits =>
  commits
    .trim()
    .replace(/\n/g, '')
    .replace(/\+\s/g, '\n')
    .replace(/\n/, '')
    .split(/\n/g)
    .map(message => {
      const [hashTypeScope, ...issueNumberDescription] =
        (/:/.test(message) && message.split(/:/)) || message.split(/\s/);

      const [hash, typeScope = ''] = hashTypeScope.split(/\s/);
      const [issueNumber, ...description] = issueNumberDescription.join(' ').trim().split(/\s/g);

      const updatedTypeScope = (typeScope && `${typeScope}:`) || '';
      const updatedDescription = description.join(' ');
      const [updatedMessage, remainingMessage = ''] = `${updatedTypeScope} ${issueNumber} ${updatedDescription}`.split(
        /\(#\d{1,5}\)/
      );

      return {
        trimmedMessage:
          (remainingMessage.trim().length === 0 && updatedMessage.trim()) ||
          `${updatedTypeScope} ${issueNumber} ${updatedDescription}`,
        hash,
        typeScope: updatedTypeScope,
        issueNumber,
        description: updatedDescription
      };
    });

/**
 * Apply valid/invalid checks.
 *
 * @param {Array} parsedMessages
 * @param {object} options Default options, update accordingly
 * @param {Array|undefined} options.issueNumberExceptions An "undefined" or "false" or "falsy" value
 *     will ignore issue numbers. An array of issue type exceptions can be used to identify which commit message
 *     type scopes to ignore, i.e. ['chore', 'fix', 'build', 'perf']. See NPM conventional-commit-types for full
 *     listing options, https://bit.ly/2L0yr6I
 * @param {number} options.maxMessageLength Max length of the main message string. Messages considered "body"
 *     do not count against this limit.
 * @returns {Array}
 */
const messagesList = (
  parsedMessages,
  { issueNumberExceptions = ['chore', 'fix', 'perf', 'docs', 'build'], maxMessageLength = 65 } = {}
) =>
  parsedMessages.map(message => {
    const { trimmedMessage = null, typeScope = null, issueNumber = null, description = null } = message;

    const issueNumberRegex = `(^{0}\\([\\d\\D]+\\))`;
    const issueNumberException = !issueNumberExceptions
      ? true
      : new RegExp(
          `${issueNumberExceptions.map(issueType => issueNumberRegex.replace('{0}', issueType)).join('|')}`
        ).test(typeScope) || /\(#[\d\D]+\)$/.test(description);

    const typeScopeValid = (/(^[\d\D]+\([\d\D]+\):$)|(^[\d\D]+:$)/.test(typeScope) && 'valid') || 'INVALID: type scope';

    const issueNumberValid =
      (/(^issues\/[\d,]+$)/.test(issueNumber) && 'valid') ||
      (/(^[a-zA-Z]+-[\d,]+$)/.test(issueNumber) && 'valid') ||
      (issueNumberException && 'valid') ||
      'INVALID: issue number';

    const descriptionValid =
      (/(^[\d\D]+$)/.test(description || (issueNumberException && issueNumber)) && 'valid') ||
      (issueNumberException && !description && issueNumber && 'valid') ||
      'INVALID: description';

    const lengthValid =
      (trimmedMessage && trimmedMessage.length <= maxMessageLength && 'valid') ||
      `INVALID: message length (${trimmedMessage && trimmedMessage.length} > ${maxMessageLength})`;

    // <type>([scope]): issues/<number> <description> <messageLength>
    return `${typeScope}<${typeScopeValid}> ${issueNumber}<${issueNumberValid}> ${description}<${descriptionValid}><${lengthValid}>`;
  });

/**
 * Remove valid commits.
 *
 * @param {Array} parsedMessagesList
 * @returns {Array}
 */
const filteredMessages = parsedMessagesList =>
  parsedMessagesList.filter(value => !/<valid>[\d\D]*<valid>[\d\D]*<valid><valid>/.test(value));

/**
 * If commits exist, lint them.
 *
 * @param {string} commits
 * @returns {{resultsArray: Array, resultsString: string}}
 */
module.exports = commits => {
  const lintResults = { resultsArray: [], resultsString: '' };

  if (commits) {
    const parsedResults = filteredMessages(messagesList(messages(commits)));
    lintResults.resultsArray = parsedResults;
    lintResults.resultsString = JSON.stringify(parsedResults, null, 2);
  }

  return lintResults;
};
