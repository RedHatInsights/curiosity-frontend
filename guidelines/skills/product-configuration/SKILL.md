---
name: product-configuration
description: Adds or updates subscription product variants (PAYG, on-demand, annual RHEL paths) in curiosity-frontend—rhsmConstants, product config modules, locales, tests. Use when the user asks to add a product variant, PAYG/on-demand/annual subscription UI, update rhsmConstants, or wire a new product config under src/config.
---

# Product configuration

## Preconditions

- Follow [agent_behaviors.md](../../agent_behaviors.md) and [agent_coding.md](../../agent_coding.md). Repo rules override generic PatternFly or external examples.

## Workflow

1. **Classify** the variant with the user (annual RHEL add-on vs OpenShift PAYG vs RHEL PAYG vs on-demand, etc.). If the app does not support the case (e.g. duplicate OpenShift annual), **stop** and explain—see [reference.md](reference.md#stop-conditions).
2. **Gather** required fields using the **sequential** question list in [reference.md](reference.md#interactive-questions)—one question at a time, no invented IDs or metrics.
3. **Review git examples**: Open [reference.md — Git reference commits (examples)](reference.md#git-reference-commits-examples). Pick the **closest** historical commit for your variant class and run `git show <hash>`; confirm the diff still matches today’s patterns (files may have moved or been refactored). Supplement with `git log --oneline -- src/services/rhsm/rhsmConstants.js` and `src/config/` for **newer** precedents if needed.
4. **Apply** the matching checklist in the same reference section (RHEL annual, OpenShift PAYG, or RHEL PAYG).
5. **Validate**: `npm run test:lintfix` (or `npm run test:lint`), `npm run test:ci`; update snapshots only when changes are intentional (see [agent_testing.md](../../agent_testing.md)). Optional: [Quick validation commands](reference.md#quick-validation-commands).
6. **Handoff**: List anything only a human can verify (APIs, entitlements, stage). Ask whether the user confirms success before treating the task as closed.

## Do not

- Add partial configs or skip `public/locales/en-US.json` keys used by the new variant.
- Introduce a new top-level config pattern without matching neighboring products under `src/config/`.

## Additional detail

- Git **example hashes**, full question script, localization, naming, capacity/graph pitfalls, validation commands: [reference.md](reference.md)
