---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "config/*.js", "*.json"]
contexts: ["development", "product-config"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-07-03"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "sequential"
  validation_required: true
  key_concepts: ["payg", "pay-as-you-go", "hourly", "on-demand", "annual", "product", "product-config"]
  related_guidelines: []
  importance: "high"
  question_sequence: true
  wait_for_response: true
  code_examples: true
  critical_instructions: "ALWAYS ask the sequential questions when creating or adding a PRODUCT"
  trigger_prefixes: ["/workflow product"]
---

# Adding PAYG, On-demand, and Annual Variants

This guide provides step-by-step instructions for agents adding new Pay-As-You-Go (PAYG), on-demand, and annual product configurations to the curiosity-frontend application.

## Overview

## Interactive Configuration Process

Agent MUST ask these questions sequentially (ask one question, wait for answer, then proceed to the next):

1. **"What is the product ID for the variant?"** - The API identifier for the variant
  - Examples: `RHEL for x86`, `rhel-for-x86-els-unconverted`, `rhods`, `rhacs`
  - Typical variants use format: `rhel-for-[purpose]-[type]` or similar kebab-case

2. **"What is the product variant complete long, or full, name?"** - The complete display name
  - Examples: `Red Hat Enterprise Linux for x86`, `Red Hat Enterprise Linux Extended Life Cycle Support Add-On, Annual`, `Red Hat OpenShift AI`, `Red Hat Advanced Cluster Security`
  - Typical variants use format: `[Product full name] for [Purpose]`

3. **"What is the product variant short name?"** - The abbreviated display name
  - Examples: `RHEL for x86`, `RHEL for x86 EUS`, `Red Hat OpenShift AI`, `Advanced Cluster Security`
  - Should be human-readable and follow existing naming patterns
  - Used in UI menus and filters

4. **"Is this a PAYG, ON-DEMAND, or ANNUAL variant?"** - The configurable UI distinction, what graphs and inventories display
  - Examples: `RHEL for x86 is an annual display`, `Advanced Cluster Security is payg display`
  - If **PAYG**: Continue to question 6
  - If **ON-DEMAND**: Continue to question 6
  - If **ANNUAL**: Continue to question 5 Skip the remaining questions and start the Step-by-Step Implementation

5. **"Is this a RHEL or OpenShift variant?"** - The UI display dropdown and navigation where the variant will be displayed
- If **RHEL**: Skip the remaining questions and start the "Implementation for RHEL Annual"
- If **OpenShift**: Skip the remaining questions and start the "Implementation for OpenShift Annual"

6. **"What metric, or metrics, need to be displayed?"** - The primary metric(s) for charts and inventory
  - Examples: `Cores`, `vCPUs`, `Instance-hours`

7. **"What metric, or metrics, need capacity displayed?"** - The capacity for a metric to display in the chart
  - Examples: `Cores`, `vCPUs`, `Instance-hours`

8. **"Are the metric display names unique?"** - Do any technical metrics need to display differently to users?
  - If **yes**: "What should each metric display as?" (e.g., technical: "Cores" → display: "vCPUs")
  - If **no**: Use the standard metric display names 

9. **"Is there a detailed product description?"** - The stored description for alternative product views
  - If **yes**: "What is that description?" (e.g., "Monitor your Red Hat OpenShift Service on AWS Hosted Control Planes usage for monthly pre-paid and On-Demand subscriptions.")
  - If **no**: Use the standard parent product description (e.g., "Monitor your [Product] usage for On-Demand subscriptions.")


**Important:**
- Questions 6 and 8 are closely related - the metric question determines the technical API metrics, while the display name question determines how they appear to users.
- DO NOT proceed with implementation until all questions are answered
- DO NOT assume any values; always ask for explicit confirmation
- Each question MUST be asked separately, waiting for a response before proceeding
- Do NOT skip any questions unless explicitly indicated in the steps or requested by the user
- Do NOT make up any questions unless explicitly indicated in the steps or requested by the user
- Exit the process if the user requests to stop or exit, then reset any information gathered from the interactive process

## Implementation for OpenShift Annual

There is only one OpenShift annual display.

**Important:**
- The user has a unique product or has made a mistake.
- The user needs to create this implementation.
- Exit the process and explain to the user in a concise statement why you are stopping.
- Reset any information gathered from the interactive process

## Implementation for RHEL Annual

**Important:**
- Agent must review all git reference commits before continuing

### Git Reference Commits

For complete implementation details and full context, refer to these actual commits:

#### RHEL AUS Add-On Implementation
- **Commit Hash**: `7e5fe666e104bddfd1ff91a22619332407ba147b`
- **Description**: Add RHEL Advanced Update Support Add-On variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

#### RHEL for x86 ELS Unconverted Implementation
- **Commit Hash**: `bd534990f5f6c2bcf44eaa1c113cde11959c0d14`
- **Description**: Add RHEL for x86 Extended Life Cycle Support variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

#### RHEL for x86 RS Implementation
- **Commit Hash**: `0afc6e4111a9e2f18a623cbd8ab8f4f68a8e9c5f`
- **Description**: Add RHEL for x86 RS variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

#### RHEL for x86 HA Implementation
- **Commit Hash**: `23c42dea75f165e4d0dfb12910247a2c9abdda87`
- **Description**: Add RHEL for x86 HA variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

#### RHEL for x86 EUS Implementation
- **Commit Hash**: `651188ac8e18a9315b3f4dfa1b5d1018ec5e3c3c`
- **Description**: Add RHEL for x86 EUS variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

#### RHEL for SAP x86 Implementation
- **Commit Hash**: `5267af002885ef30040662dafea3f2ba339ebe72`
- **Description**: Add RHEL for SAP x86 variant
- **Files Modified**: rhsmConstants.js, en-US.json, test snapshots

### File Checklist

- [ ] Add variant constant to `src/services/rhsm/rhsmConstants.js`
- [ ] Update JSDoc type annotations (all 3+ locations)
- [ ] Add localization entries to `public/locales/en-US.json`
- [ ] Run `npm run test:ci -- --updateSnapshot` to update test snapshots
- [ ] Run `npm run test:lintfix` to format code
- [ ] Run `npm run test:ci` to verify all tests pass
- [ ] Agent concisely lists any of the previous steps that require user completion, or that the agent was unable to complete
- [ ] Agent has asked user "Can you confirm success?"
- [ ] User has confirmed success

❌ **Don't:**
- Create a new product config file for this implementation
- Forget to add all localizations

**Requirements:**
- Follow the file checklist
- After the user has confirmed success exit the process and reset any information gathered from the interactive process

## Implementation for OpenShift PAYG

**Important:**
- Agent must review all git reference commits before continuing

### Git Reference Commits

For complete implementation details and full context, refer to these actual commits:

#### RHACS Implementation
- **Commit Hash**: `4cdbc99221321daaecff3492ceaa39509ff76505`
- **Description**: Add Red Hat Advanced Cluster Security product
- **Files Modified**: rhsmConstants.js, product configuration files, en-US.json, test snapshots

#### RHACM Implementation
- **Commit Hash**: `14db2a98717df177474cad171dc673ac3770219c`
- **Description**: Add Red Hat Advanced Cluster Management product
- **Files Modified**: rhsmConstants.js, product configuration files, en-US.json, test snapshots

#### RHODS Implementation
- **Commit Hash**: `2ca0496a88618343c2bc1f17fd955a8544f268b3`
- **Description**: Add Red Hat OpenShift Data Science product
- **Files Modified**: rhsmConstants.js, product configuration files, en-US.json, test snapshots

### File Checklist

- [ ] Add product constant to `src/services/rhsm/rhsmConstants.js`
- [ ] Update JSDoc type annotations (4 locations in rhsmConstants.js)
- [ ] Create product configuration file `src/config/product.yourVariantName.js`
- [ ] Add localization entries to `public/locales/en-US.json`
- [ ] Run `npm run test:ci -- --updateSnapshot` - Update Jest snapshots
- [ ] Run `npm run test:lintfix` - Format code
- [ ] Run `npm run test:ci` - Verify all tests pass
- [ ] Agent concisely lists any of the previous steps that require user completion, or that the agent was unable to complete
- [ ] Agent has asked user "Can you confirm success?"
- [ ] User has confirmed success

❌ **Don't:**
- Forget to add all localizations
- Add a partial product configuration

**Requirements:**
- Follow the file checklist
- After the user has confirmed success exit the process and reset any information gathered from the interactive process

## Implementation for RHEL PAYG

**Important:**
- Agent must review all git reference commits before continuing

### Git Reference Commits

For complete implementation details and full context, refer to these actual commits:

#### RHEL for x86 ELS PAYG Implementation
- **Commit Hash**: `2ca7797a44320311fdca54f211636b310b492f25`
- **Description**: Add RHEL for x86 ELS PAYG variant
- **Files Modified**: rhsmConstants.js, product configuration files, en-US.json, test snapshots

#### RHEL for x86 PAYG Add-On Implementation
- **Commit Hash**: `d66edfaa93c4242ed6ea042350c9cee74565a614`
- **Description**: Add RHEL for x86 PAYG Add-On variant
- **Files Modified**: rhsmConstants.js, product configuration files, en-US.json, test snapshots

### File Checklist

- [ ] Add variant constant to appropriate section in `src/services/rhsm/rhsmConstants.js`
- [ ] Update JSDoc type annotations (all 3+ locations)
- [ ] Create product configuration file `src/config/product.yourVariantName.js`
- [ ] Add localization entries to `public/locales/en-US.json`
- [ ] Run `npm run test:ci -- --updateSnapshot` to update test snapshots
- [ ] Run `npm run test:lintfix` to format code
- [ ] Run `npm run test:ci` to verify all tests pass
- [ ] Agent concisely lists any of the previous steps that require user completion, or that the agent was unable to complete 
- [ ] Agent has asked user "Can you confirm success?"
- [ ] User has confirmed success

❌ **Don't:**
- Forget to add all localizations
- Add a partial product configuration

**Requirements:**
- Follow the file checklist
- After the user has confirmed success exit the process and reset any information gathered from the interactive process

## Localization Entries

Add the necessary translation entries to `public/locales/en-US.json` for your new variant:

```json
{
  "curiosity-toolbar": {
    "label_groupVariant_your-variant-id": "Your Variant Short Name"
  },
  "curiosity-view": {
    "title_your-variant-id": "Your Variant Full Name",
    "subtitle_your-variant-id": "Your Variant Description",
    "description_your-variant-id": "Your Variant Description"
  }
}
```

Add additional translation entries by comparing git reference commits and reviewing other entries in sections in the `public/locales/en-US.json`:

- `curiosity-graph`
- `curiosity-inventory`

```json
{
  "curiosity-graph": {},
  "curiosity-inventory": {}
}
```

**Requirements:**
- Review git reference commits for existing patterns
- Add entries to ALL relevant sections (toolbar, view, graph, inventory)
- Use the correct product ID exactly as defined in the constants
- Maintain alphabetical order within each section
- For standard descriptions that match, use the `$(curiosity-view.[locale entry]_[product group])` translation reference

## Common Pitfalls

❌ **Don't:**
- Forget to update ALL JSDoc type annotations
- Forget to update ALL localization
- Use inconsistent naming conventions (stick to existing patterns)
- Skip the alphabetical ordering in constants
- Change unrelated parts of the constants file
- Skip, or ignore, steps
- Skip git references

✅ **Do:**
- Follow alphabetical ordering in all locations
- Follow existing naming patterns from similar products and variant types
- Add descriptive aliases for product discovery if a new product configuration is created
- Export productGroup and productId from your configuration file
- Verify all tests pass before committing

## Common Mistakes and Lessons Learned

Based on recent implementations, here are specific mistakes to avoid and correct patterns to follow:

### File Naming Patterns

❌ **Don't:**
- Use unnecessary words in filenames (e.g., `product.openshiftForLoremIpsum.js`)
- Use inconsistent casing (e.g., mixing camelCase and kebab-case)

✅ **Do:**
- Follow camelCase for product config files: `product.openshiftLoremIpsum.js`
- Remove unnecessary words like "for" from filenames
- Match the pattern of existing sibling files in the config directory

### Capacity Configuration

❌ **Don't:**
- Add non-existent `capacity: [RHSM_API_PATH_METRIC_TYPES.VCPUS]` property
- Assume capacity configuration without checking existing patterns
- Apply threshold configuration to all metrics in capacity products

✅ **Do:**
- Use `productDisplay: DISPLAY_TYPES.CAPACITY` for capacity-based products
- Only apply `chartType: ChartTypeVariant.threshold` to the primary capacity metric
- Reference ROSA (`product.rosa.js`) for OpenShift capacity patterns
- Keep secondary metrics (like `INSTANCE_HOURS`) as regular usage metrics without threshold

### Graph Filters Structure

❌ **Don't:**
- Use simple metric arrays for capacity products
- Apply threshold to all metrics indiscriminately

✅ **Do:**
- Use `filters` array structure for capacity products:
```javascript
initialGraphFilters: [
  {
    filters: [
      {
        metric: RHSM_API_PATH_METRIC_TYPES.VCPUS,
        fill: chartColorBlueLight.value,
        stroke: chartColorBlueDark.value,
        color: chartColorBlueDark.value
      },
      {
        metric: RHSM_API_PATH_METRIC_TYPES.VCPUS,
        chartType: ChartTypeVariant.threshold
      }
    ]
  },
  {
    filters: [
      {
        metric: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
        fill: chartColorBlueLight.value,
        stroke: chartColorBlueDark.value,
        color: chartColorBlueDark.value
      }
    ]
  }
]
```

### Reference Patterns

**For OpenShift PAYG with Capacity:**
- **Primary Reference**: `product.rosa.js` (Red Hat OpenShift Service on AWS)
- **Secondary Reference**: `product.rhacs.js` (Red Hat Advanced Cluster Security)

**For OpenShift PAYG without Capacity:**
- **Primary Reference**: `product.rhacs.js` (Red Hat Advanced Cluster Security)

**For RHEL Annual:**
- **Primary Reference**: `product.rhel.js` (Red Hat Enterprise Linux)

### Validation Steps

Before confirming success, verify:
1. **File naming**: Matches camelCase pattern without unnecessary words
2. **Capacity configuration**: Only primary metric has threshold, secondary metrics are regular
3. **Graph filters**: Use `filters` array structure for capacity products
4. **Localization**: Product-specific entries follow `openshift-for-lorem-ipsum` pattern
5. **Tests**: All tests pass without linting errors
6. **Snapshots**: Updated and consistent

### Quick Reference Commands

```bash
# Check file naming pattern
ls src/config/product.*.js

# Verify capacity configuration
grep -r "capacity.*\[" src/config/

# Check graph filters structure
grep -A 20 "initialGraphFilters" src/config/product.yourVariant.js

# Validate localization entries
grep -r "your-variant-id" public/locales/en-US.json

# Run validation
npm run test:ci -- --testPathPattern=src/config/product.yourVariant.js
npm run test:lintfix
npm run test:ci
```

