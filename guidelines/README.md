# Agent Guidelines

## Overview
Agent-specific guidelines for curiosity-frontend, optimized for machine processing.

## Guidelines Index

### Agent Guidelines

- [Agent Behaviors](./agent_behaviors.md) (Critical) - Comprehensive guide to agent behaviors, workflows, and standards
- [Agent Coding](./agent_coding.md) (High) - Coding standards
- [Agent Testing](./agent_testing.md) (High) - Testing procedures

### Skills
- [Product Configuration](./skills/product-configuration/SKILL.md) - Add/update product variants.
- [Configurable Banners](./skills/configurable-banners/SKILL.md) - Manage global alerts.

**Note:** `guidelines/skills/` is the canonical location for skills. Repo symlinks point here so agents can discover them: `.agents/skills` (Cursor), `.claude/skills` (Claude). The `.agent/` directory (no “s”) is reserved for each developer’s local work and is off limits—do not use it for shared skills or guidelines.

### PatternFly MCP
- [PatternFly MCP server quick start](https://github.com/patternfly/patternfly-mcp?tab=readme-ov-file#quick-start)

## User Guide

### Available Trigger Phrases

Agents should use these phrases as signals to consult specific documentation and source code:

| Task / Intent                     | Reference                                                                                                |
|-----------------------------------|----------------------------------------------------------------------------------------------------------|
| **"review the repo guidelines"**  | [README.md](../README.md) agent block, this file, `CONTRIBUTING.md#ai-agent`                             |
| **Product / UI change**           | [Product Configuration skill](./skills/product-configuration/SKILL.md), [Agent Coding](./agent_coding.md)|
| **Global banner**                 | [Configurable Banners skill](./skills/configurable-banners/SKILL.md), `docs/architecture.md`             |
| **Release / Deploy**              | [CONTRIBUTING.md](../CONTRIBUTING.md) (Process)                                                          |
| **Dependencies**                  | [CONTRIBUTING.md](../CONTRIBUTING.md) (NPM maintenance)                                                  |
| **Git history**                   | [Agent Behaviors](./agent_behaviors.md) (Searchability), [CONTRIBUTING.md](../CONTRIBUTING.md) (Messaging) |

## Guidelines Processing Order

1. **Guidelines Directory** (all files in the `guidelines/` directory)
2. **Local guidelines** (`.agent/` directory) — reserved for each user’s agent interaction; gitignored and off limits for shared repo assets. Do not create or reference shared skills or guidelines in `.agent/`.

## Maintaining This Directory

### File Maintenance Principles
- Update this index immediately when adding/removing guidelines or skills.
- Reference `CONTRIBUTING.md` and `docs/` instead of duplicating content.
- Update references when adding new files.
- Keep descriptions concise and focused.

### File Naming Convention
- `agent_*.md`: Always-on rules (behaviors, coding, testing).
- `skills/<name>/SKILL.md`: Task-specific workflows and triggers.
- `mcp/plugin-*/`: PatternFly MCP tool plugins.

### Adding New Guidelines
1. Add entry to "Guidelines Index" section
2. Include essential metadata
3. Provide brief description
4. Update processing order if needed
