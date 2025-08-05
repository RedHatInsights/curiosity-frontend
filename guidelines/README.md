# Curiosity Frontend Guidelines

## Overview

This directory contains agent-specific development and workflow guidelines for the Curiosity Frontend project. These guidelines help ensure consistent agent implementation patterns, proper code organization, and streamlined development processes.

## User Guide

### Development Guidelines

The agent guidelines in this directory provide structured approaches for common development tasks in the Curiosity Frontend project:

- **Code Standards**: Consistent patterns for file naming, localization, and testing
- **Implementation Workflows**: Interactive processes that ensure all necessary steps are completed

### Getting Started

#### Workflows

Activating agent-based workflows and automation has been centered around the use of keyword prompts.

##### Available Prompts

TBD.

#### Code Standards

TBD.

#### Patternfly Development

TBD.

---

## Agent-Only Index

<!--
This section is intended for autonomous agents working with this repository.
Process guidelines in the order listed below, with specialized guidelines taking precedence for their domains.
-->

### Guidelines Processing Order

1. **Core Guidelines** (this file) - Fundamental behavior standards and overview
2. **Specialized Guidelines** - Domain-specific implementation instructions
3. **Local Guidelines** (`.agent/` directory) - Agent-generated and session-specific guidance

### Available Guidelines

TBD.

### Core Agent Behavior Standards

<!--
Before the agent runs `$ date` the agent should explain what it's going to be used for. Agents should attempt to run `$ date` to get the system date before applying dates and times anywhere.

Common uses for dates include:
- Updating "Last Updated" timestamps in documentation files
- Adding creation dates to new files or savepoints
- Timestamping conversation states or session information
- Recording when changes or updates were made to configuration files
- Ensuring accurate date references in commit messages or change logs
-->

- **Sequential Processing**: Ask questions one at a time, wait for responses
- **Reference-Based Implementation**: Always review git reference commits before implementation
- **Validation Required**: Follow file checklists completely and run validation commands
- **Confirmation Required**: Ask for user confirmation of success before completion
- **State Management**: Use `.agent/` directory for session continuity and repository context

### Agent Notes: Maintaining This File

**Important**: This file serves as an index and reference system only.

#### File Maintenance Principles
- **DO NOT recreate existing guidelines** - This file should only reference and index specialized guidelines, not duplicate their content
- **DO update agent-specific references** - When new guideline markdown files are added to the `guidelines/` directory, update the "Available Guidelines" section with appropriate metadata
- **Keep it concise** - Focus on indexing and referencing rather than comprehensive implementation details

#### When Adding New Guidelines
1. Add new guideline entry to "Available Guidelines" section
2. Include essential metadata: File, Version, Priority, Applies To, Contexts, Key Concepts, Trigger Prefixes
3. Provide brief description focusing on what the guideline covers
4. Update processing order if needed
5. Maintain alphabetical organization within categories
