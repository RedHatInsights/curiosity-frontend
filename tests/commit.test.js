const { execSync } = require('child_process');

describe('Commit Message', () => {
  it('should have consistently formatted commit messages', () => {
    const stdout = execSync(`git cherry -v master`);
    const messages = stdout
      .toString()
      .trim()
      .split(/\n/g)
      .map(message => {
        const [hash, typeScope, issueNumber, ...description] = message.split(/\s/g).slice(1);
        return {
          hash,
          typeScope,
          issueNumber,
          description: description.join(' ')
        };
      });

    const messagesList = messages.map(message => {
      const { typeScope = null, issueNumber = null, description = null } = message;

      const issueNumberException = /(^chore\([\d\D]+\))|(^fix\([\d\D]+\))|(^[\d\D]+\(build\))/.test(typeScope);

      const typeScopeValid =
        (/(^[\d\D]+\([\d\D]+\):$)|(^[\d\D]+:$)/.test(typeScope) && 'valid') || 'INVALID: type scope';

      const issueNumberValid =
        (/(^issues\/[\d]+$)/.test(issueNumber) && 'valid') ||
        (issueNumberException && 'valid') ||
        'INVALID: issue number';

      const descriptionValid =
        (/(^[\d\D]+$)/.test(description || (issueNumberException && issueNumber)) && 'valid') ||
        (issueNumberException && !description && issueNumber && 'valid') ||
        'INVALID: description';

      /**
       * See CONTRIBUTING.md for commit messaging guidelines
       *
       * TypeScope is required and should be in the form of "<type>([scope]):" or "<type>:"
       *
       * IssueNumber is conditional and should be in the form of "issues/[issue number]"
       * Exceptions are available for chore and fix type scopes, and "build" type scope "scopes"
       *
       * Description is required, can be in the form of "<string>"
       */
      return `${typeScope}<${typeScopeValid}> ${issueNumber}<${issueNumberValid}> ${description}<${descriptionValid}>`;
    });

    expect(messagesList.filter(value => !/<valid>[\d\D]*<valid>[\d\D]*<valid>/.test(value))).toEqual([]);
  });
});
