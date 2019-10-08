const { execSync } = require('child_process');

/**
 * See CONTRIBUTING.md for commit messaging guidelines
 *
 * TypeScope is required and should be in the form of "<type>([scope]):" or "<type>:"
 *
 * IssueNumber is conditional and should be in the form of "issues/[issue number]"
 * Exceptions are available for chore and fix type scopes, and "build" type scope "scopes".
 * i.e. "chore([scope])", "fix([scope])", "<type>(build):"
 * An exception for having a PR reference at the end of the description is also allowed,
 * i.e. "<description> (#10)"
 *
 * Minimal description is required, can be in the form of "<string>"
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
      stdout = execSync(`git cherry -v master`);
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
        const [issueNumber, ...description] = issueNumberDescription
          .join(' ')
          .trim()
          .split(/\s/g);

        return {
          hash,
          typeScope: (typeScope && `${typeScope}:`) || '',
          issueNumber,
          description: description.join(' ')
        };
      });

    const messagesList = messages.map(message => {
      const { typeScope = null, issueNumber = null, description = null } = message;

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

      // <type>([scope]): issues/<number> <description>
      return `${typeScope}<${typeScopeValid}> ${issueNumber}<${issueNumberValid}> ${description}<${descriptionValid}>`;
    });

    expect(messagesList.filter(value => !/<valid>[\d\D]*<valid>[\d\D]*<valid>/.test(value))).toEqual([]);
  });
});
