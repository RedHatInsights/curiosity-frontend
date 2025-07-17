# Curiosity Frontend Guidelines

## Overview

This directory contains development and workflow guidelines for the Curiosity Frontend project. These guidelines help ensure consistent implementation patterns, proper code organization, and streamlined development processes.

## User Guide

### Development Guidelines

The guidelines in this directory provide structured approaches for common development tasks in the Curiosity Frontend project:

- **Product Configuration**: Step-by-step processes for adding new product variants (PAYG, on-demand, and annual subscriptions)
- **Code Standards**: Consistent patterns for file naming, localization, and testing
- **Implementation Workflows**: Interactive processes that ensure all necessary steps are completed

### Getting Started

1. **Review the specific guideline** for your task (see index below)
2. **Follow the sequential processes** outlined in each guideline
3. **Reference the provided git commits** for implementation examples
4. **Run the validation steps** to ensure proper implementation

### Key Principles

- **Interactive Configuration**: Many workflows use sequential question-and-answer processes
- **Reference-Based Implementation**: Guidelines include specific git commit references for examples
- **Validation-First Approach**: All implementations include testing and validation steps
- **Consistent Patterns**: Follow established naming conventions and file structures

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

#### Product Configuration
- **File**: `adding-product-configs.md`
- **Version**: 1.0.0
- **Priority**: 3 (High)
- **Applies To**: `*.js`, `config/*.js`, `*.json`
- **Contexts**: `development`, `product-config`
- **Key Concepts**: `payg`, `pay-as-you-go`, `hourly`, `on-demand`, `annual`, `product`, `product-config`
- **Trigger Prefixes**: `/workflow product`
- **Description**: Comprehensive guide for adding PAYG, on-demand, and annual product variants with interactive sequential question process, implementation patterns, and validation steps

### Core Agent Behavior Standards

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
