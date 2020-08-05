const { execSync } = require('child_process');

/**
 * ToDo: evaluate moving this check to Github actions
 * And evaluate removing the `grep "+"` filter to check for rebase
 */
/**
 * See CONTRIBUTING.md for commit messaging guidelines
 *
 * TypeScope is required and should be in the form of "<type>([scope]):" or "<type>:"
 *
 * IssueNumber is conditional and should be in the form of "issues/[issue number]"
 * Exceptions are available for chore and fix type scopes, and "build" scope descriptions.
 * i.e. "chore([scope])", "fix([scope])", "<type>(build):"
 * An exception for having a PR reference at the end of the description is also allowed,
 * i.e. "<description> (#10)"
 *
 * Minimal description is required, can be in the form of "<string>"
 *
 * Message lengths should not be greater than 65 characters. Appended PR numbers in the
 * form of (#<number>) are ignored i.e. <message> (#10)
 */
describe('Commit Message', () => {
  it('should have consistently formatted commit messages on pull requests', () => {
    // see .travis.yml globals
    if (!process.env.IS_PR || process.env.IS_PR === 'false') {
      expect(1).toBe(1);
      return;
    }

    let stdout = '';

    try {
      stdout = execSync(`git cherry -v master | grep "+"`);
    } catch (e) {
      console.log(`Skipping commit check... ${e.message}`);
    }

    const messages = stdout
      .toString()
      .trim()
      .replace(/\+\s/g, '')
      .split(/\n/g)
      .map(message => {
        const [hashTypeScope, ...issueNumberDescription] =
          (/:/.test(message) && message.split(/:/)) || message.split(/\s/);

        const [hash, typeScope = ''] = hashTypeScope.split(/\s/);
        const [issueNumber, ...description] = issueNumberDescription.join(' ').trim().split(/\s/g);

        const updatedTypeScope = (typeScope && `${typeScope}:`) || '';
        const updatedDescription = description.join(' ');
        const [
          updatedMessage,
          remainingMessage = ''
        ] = `${updatedTypeScope} ${issueNumber} ${updatedDescription}`.split(/\(#\d{1,5}\)/);

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

    const messagesList = messages.map(message => {
      const { trimmedMessage = null, typeScope = null, issueNumber = null, description = null } = message;

      const issueNumberException =
        /(^chore\([\d\D]+\))|(^fix\([\d\D]+\))|(^[\d\D]+\(build\))/.test(typeScope) ||
        /\(#[\d\D]+\)$/.test(description);

      const typeScopeValid =
        (/(^[\d\D]+\([\d\D]+\):$)|(^[\d\D]+:$)/.test(typeScope) && 'valid') || 'INVALID: type scope';

      const issueNumberValid =
        (/(^issues\/[\d,]+$)/.test(issueNumber) && 'valid') ||
        (issueNumberException && 'valid') ||
        'INVALID: issue number';

      const descriptionValid =
        (/(^[\d\D]+$)/.test(description || (issueNumberException && issueNumber)) && 'valid') ||
        (issueNumberException && !description && issueNumber && 'valid') ||
        'INVALID: description';

      const lengthValid =
        (trimmedMessage && trimmedMessage.length <= 65 && 'valid') ||
        `INVALID: message length (${trimmedMessage && trimmedMessage.length} > 65)`;

      // <type>([scope]): issues/<number> <description> <messageLength>
      return `${typeScope}<${typeScopeValid}> ${issueNumber}<${issueNumberValid}> ${description}<${descriptionValid}><${lengthValid}>`;
    });

    expect(messagesList.filter(value => !/<valid>[\d\D]*<valid>[\d\D]*<valid><valid>/.test(value))).toEqual([]);
  });
});
