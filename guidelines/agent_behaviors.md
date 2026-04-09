# Agent Behaviors

## Overview
Core behavior standards for autonomous agents working in the project.

## For Agents
### Processing Priority
Critical - Process this document first when establishing operational context.

### Related Guidelines
See the [Guidelines Index](./README.md#guidelines-index) for all guidelines.

## 1. Repository Context
### Key Architectural Components
For a detailed overview of the application design, see [docs/architecture.md](../docs/architecture.md).

## 2. Core Behavior Standards
- **Sequential Processing**: Ask questions one at a time; process requests in logical order; complete one task before starting another.
- **Architectural Alignment**: Always confirm changes against the [application architecture](../docs/architecture.md) and existing [product configurations](../src/config/README.md) before proceeding.
- **Reference-Based Implementation**: Review git history; study existing patterns; maintain code style consistency and follow [standard Git workflows](../CONTRIBUTING.md#using-git).
    - **History Searchability**: Up to version `4.19.0`, the repository has strictly followed conventional commit syntax since its inception. Agents should leverage these commit messages for highly accurate history searches and context gathering.
- **Commit Messaging Standards**: Follow the project's [commit messaging standards](../CONTRIBUTING.md#pull-request-commits-messaging).
- **Validation Required**: Follow checklists; verify requirements; test thoroughly. Review [pull request warning signs](../CONTRIBUTING.md#pull-requests) to avoid common pitfalls.
- **Confirmation Required**: Confirm success; summarize changes; explain impact; verify understanding.
- **Guidance Review Scope**: Unless the user explicitly asks, do not make recommendations on improving guidance if all you're asked to do is review guidance.
- **Environment Awareness**: Always verify environment compatibility and package dependencies when proposing solutions. 
- **Chat Session Management**: Use `.agent/` directory for local guidance and state; maintain context; preserve session information.

## 3. Trigger-Based Workflows
1. **Analyze**
- Confirm the installed `React`, `@patternfly/*` and `@redhat-cloud-services/*` package dependency versions
- Research the error
- Identify conflict scenarios with code
- Identify potential test cases

2. **Test**
- Run typing, lint, unit and e2e tests
- Confirm conflicts
- Test resolution options

3. **Resolve**
- Adjust codebase
- Change code or confirm a solution
- Implement resolution

4. **Validate**
- Test conflict resolution
- Confirm approach

## 4. Decision-Making Guidelines

1. **Consistency vs. Improvement**
- Favor consistency for minor changes
- Favor improvement for bugs and features
- Balance both when possible

2. **Strictness vs. Flexibility**
- Strict for quality/security
- Flexible for style preferences
- Consider developer experience

3. **Backward Compatibility**
- Minimize breaking changes
- Document when necessary

4. **Architectural Alignment**
- Always verify that the proposed solution fits within the project's [architecture](../docs/architecture.md).
- Consult the roadmap before introducing major features or structural changes.

## 5. Validation Procedures

For all workflows:

1. **Testing**: Run appropriate tests, ensure they pass, update snapshots only when intentional
2. **Documentation**: Verify accuracy, consistency, and helpful examples
3. **Code Quality**: Follow patterns, check edge cases, ensure clear comments

## Date and Time Management

Run `$ date` to get system date before applying dates. Used for:
- Updating timestamps in documentation
- Adding creation dates
- Recording when changes were made
