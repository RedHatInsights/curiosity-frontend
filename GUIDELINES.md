# Guidelines

## Overview

This document provides core guidelines for agent behavior and request handling. Additional refined and specialized guidelines are located under `./guidelines/**/*` which provide more detailed, context-specific instructions for various workflows and procedures.

## Agent Section

### Summary

As an agent working with this codebase, you should:

1. **Follow sequential workflows** when modifying products and configurations
2. **Ask clarifying questions** when information is incomplete
3. **Validate input** before implementing any changes
4. **Reference existing patterns** when creating new components
5. **Maintain code quality** through consistent formatting and comprehensive testing

For more detailed, specialized guidelines covering specific workflows, procedures, and domain-specific instructions, refer to the guidelines located under: `./guidelines/**/*`.

These additional guidelines provide refined instructions for:
- Project workflows and procedures
- Technical implementation details

When working on specific tasks, consult both this core guidelines document and any relevant specialized guidelines in the guidelines directory structure.

### Request and Question Handling

This section outlines how agents should handle requests and questions based on specific keywords, phrases, or question patterns.

#### Workflow Guidelines

1. **Initial Assessment**
   - Identify key phrases and keywords in user requests
   - Detect guideline trigger prefixes identified in "Trigger Words, Statements or Phrases, and Questions"
   - Determine the category of request based on recognized patterns
   - Prioritize urgent or time-sensitive requests appropriately

2. **Response Protocol**
   - Match identified keywords to appropriate response templates
   - For guideline trigger prefixes, follow the structured question sequence
   - Use standardized responses for common questions
   - Escalate complex inquiries to specialized agents when necessary

3. **Question Classification**
   - Product information requests
   - Technical support inquiries
   - Account and subscription questions
   - Feature requests and feedback

4. **Handling Ambiguous Requests**
   - Ask clarifying questions when intent is unclear
   - Provide options when multiple interpretations are possible
   - Confirm understanding before proceeding with complex requests

5. **Follow-up Actions**
   - Document conversation outcomes
   - Set reminders for pending items
   - Schedule follow-ups for unresolved issues

#### Code Example Handling

When working with code examples in guidelines:
1. **Reference Commit Integration** - Use git commit references to understand implementation details
2. **Pattern Recognition** - Identify similar patterns across implementations
3. **Adaptation** - Adapt examples to match the specific requirements provided
4. **Validation** - Ensure examples are updated to work with current codebase versions

#### Error Handling and Edge Cases

When following guideline workflows:
1. **Validation Failures** - If user input fails validation, explain the specific requirements and ask again
2. **Conflicting Requirements** - If requirements conflict with existing patterns, highlight the conflict and seek clarification
3. **Missing Information** - If critical information is unavailable, explain what's missing and why it's needed
4. **Process Interruptions** - If a workflow is interrupted, document progress and provide resumption guidance

#### Local Processing Context

Agent request and question handling should:
1. **Respect Timing Constraints** - Follow timing guidelines specified in specialized workflows
2. **Prioritize Critical Requirements** - Items marked with "critical_instructions" should be given highest priority
3. **Maintain Context Across Interactions** - Preserve information gathered during sequential questions
4. **Apply Local Overrides** - Check GUIDELINES.local.md for developer-specific preferences that override defaults

#### Trigger Words, Statements or Phrases, and Questions

The following prefix words are used to trigger specific guideline-related interactions:

| Category | Trigger Words/Phrases | **Important Action**                 |
|----------|----------------------|--------------------------------------|
| Guideline Requests | "/workflow" | 1. Identify matching guideline document in `guidelines/` directory<br>2. Check frontmatter for `trigger_prefixes` that match the command<br>3. Follow sequential question process defined in guideline<br>4. Provide implementation steps with code examples |

When these prefix words are detected at the beginning of a request, the agent will automatically respond with a step-by-step workflow.

#### Workflow Trigger Implementation

When a user begins a request with a workflow trigger prefix (e.g., `/workflow product`), follow these implementation steps:

1. **Match Guideline Document**:
   - Parse the workflow command to identify the workflow type (`product`)
   - Search the `guidelines/` directory for matching documents
   - Check each guideline's frontmatter for `trigger_prefixes` that match the command
   - Select the most specific matching guideline document

2. **Follow Sequential Question Process**:
   - If the guideline has `question_sequence: true` in its `agent_hints`, follow the numbered question sequence
   - Ask only one question at a time, waiting for a user response before proceeding
   - Do not skip questions unless explicitly instructed in the guideline
   - Do not make up new questions unless explicitly instructed in the guideline
   - Validate each answer against any validation criteria in the guideline

3. **Provide Implementation Guidance**:
   - Once all required information is collected, provide the step-by-step implementation instructions
   - Include relevant code examples from the guideline document
   - Reference specific file locations and naming conventions
   - Concisely highlight any critical requirements or common pitfalls

4. **Complete the Workflow**:
   - Concisely summarize the actions to be taken
   - Concisely provide a checklist of implementation steps
   - Offer continued assistance for implementation questions
   - Run guidance scripts
   - Complete the workflow by following the listed steps

Example match patterns:
- `/workflow product` → `guidelines/adding-product-configs.md`

**Important:**
- The agent will only look for workflows in the `guidelines/` directory
- The agent will follow the steps listed in guidelines files

### Project Knowledge Discovery

When examining a project for understanding, agents should look beyond just the code. Below are essential sources of information that provide context, history, and guidance:

#### Documentation Sources

1. **README Files**
   - **Location**: Check for `README.md` in the root directory and subdirectories
   - **Contains**: Project overview, quick start guides, high-level architecture
   - **Priority**: Always examine this first for project context
   - **Key Sections**: Requirements, installation steps, development setup

2. **CONTRIBUTING Guide**
   - **Location**: `CONTRIBUTING.md` in the root directory
   - **Contains**: Workflow processes, PR requirements, commit message formats
   - **Priority**: Important for understanding development practices
   - **Key Sections**: Pull request workflow, testing guidelines, release procedures, AI agent guidance

3. **CHANGELOG**
   - **Location**: `CHANGELOG.md` in the root directory
   - **Contains**: History of changes, feature additions, and bug fixes
   - **Priority**: Important for understanding recent work and feature evolution
   - **Key Sections**: Recent entries showing the direction of development

4. **GUIDELINES**
  - **Location**: `GUIDELINES.md` in the root directory
  - **Contains**: Agent behavior instructions
  - **Priority**: Critical for understanding user requests and questions
  - **Key Sections**: Recent entries showing the direction of development

5. **Guidelines**
   - **Location**: `guidelines/**/*` directories and files
   - **Contains**: Specialized workflows, domain-specific requirements
   - **Priority**: Critical for understanding agent behavior
   - **Key Sections**: Product-specific guidelines, workflow instructions
   - **Metadata**: Each guideline includes YAML frontmatter with:
     - `guideline_version`: Version of the guideline
     - `agent_hints`: Processing instructions (question_sequence, validation_required)
     - `trigger_prefixes`: Commands that activate this guideline (e.g., `/workflow payg`)
     - `related_guidelines`: Links to related workflow documents

#### Version Control History

1. **Git Commit History**
   - **Purpose**: Understand recent changes and development patterns
   - **Key Information**: 
     - Commit messages showing feature development and bug fixes
     - Authorship patterns indicating expertise areas
     - Commit frequency in different areas indicating active development
   - **How to Use**: Review recent commits to understand current focus areas

2. **Git Diffs**
   - **Purpose**: Understand precise code changes
   - **Key Information**:
     - Implementation details of features and fixes
     - Code evolution patterns
     - Breaking changes and their mitigations
   - **How to Use**: Examine diffs when needing to understand specific changes

3. **Pull Requests**
   - **Purpose**: Understand feature development process and decisions
   - **Key Information**:
     - Discussions revealing design decisions
     - Review comments highlighting important considerations
     - Implementation approaches for complex features
   - **How to Use**: Review PRs related to areas of interest

#### Knowledge Synthesis

When providing assistance:
1. **Integrate Multiple Sources**: Combine information from code, documentation, and version control
2. **Prioritize Recent Information**: More recent commits and changes have higher relevance
3. **Consider Project Standards**: Use CONTRIBUTING.md to understand project-specific practices
4. **Reference Guidelines**: Cite relevant guidelines when providing recommendations
5. **Acknowledge Context**: Note when information might be outdated or conflicting

When faced with incomplete information, clearly indicate areas of uncertainty and suggest where additional information might be found.

### Guideline Document Structure

When working with guideline documents, understand their common structure:

1. **Frontmatter** (YAML metadata)
   ```yaml
   ---
   guideline_version: "1.0.0"
   priority: 3
   agent_hints:
     processing_order: "sequential"
     validation_required: true
     question_sequence: true
     trigger_prefixes: ["/workflow payg", "/workflow on-demand"," "/workflow annual"]
   ---
   ```

2. **Overview Section**
   - Provides context and purpose of the workflow
   - Explains relevant domain concepts

3. **Interactive Configuration Process**
   - Sequential questions to gather necessary information
   - Validation requirements for each question
   - Decision paths based on user responses

4. **Step-by-Step Implementation**
   - File locations to modify
   - Code examples with placeholders
   - Testing and validation steps

5. **Examples and References**
   - Real-world implementations
   - Git commit references
   - Common pitfalls to avoid

When processing a workflow request, analyze the guideline document structure to understand the complete process before beginning the interactive sequence.

### Local Guidelines Detection

As an agent working with this repository, you should be aware that developers may have personalized guidelines:

1. **Check for GUIDELINES.local.md**
   - This file may or may not exist in the repository root
   - It contains developer-specific preferences and overrides
   - It is git-ignored and thus not visible in the repository
   - If present, the preferences in this file take precedence over standard guidelines

2. **Processing Order**
   - First process the main GUIDELINES.md (this document)
   - Then check for and process GUIDELINES.local.md if it exists
   - Finally, process any relevant specialized guidelines from the guidelines/ directory

3. **Respecting Developer Preferences**
   - Local guidelines may modify workflow sequences, validation rules, or other behaviors
   - Always adapt your responses to align with local guideline specifications
   - If local guidelines conflict with repository standards, follow the local preference
