# Product configuration — reference

## Git reference commits (examples)

These hashes come from historical implementations (see `.agent/20260409-ai-resources/20250702-sw-3714-product-configs/adding-product-configs.md`). They are **examples**, not live truth—always run `git show <hash>` and compare to **current** `main` before mirroring; use `git log --oneline -- <path>` to find newer precedents when behavior has drifted.

### RHEL annual add-on

| Commit | Description | Typical files touched |
|--------|-------------|------------------------|
| `7e5fe666e104bddfd1ff91a22619332407ba147b` | RHEL Advanced Update Support Add-On variant | `rhsmConstants.js`, `en-US.json`, snapshots |
| `bd534990f5f6c2bcf44eaa1c113cde11959c0d14` | RHEL for x86 Extended Life Cycle Support (unconverted) | same pattern |
| `0afc6e4111a9e2f18a623cbd8ab8f4f68a8e9c5f` | RHEL for x86 RS variant | same pattern |
| `23c42dea75f165e4d0dfb12910247a2c9abdda87` | RHEL for x86 HA variant | same pattern |
| `651188ac8e18a9315b3f4dfa1b5d1018ec5e3c3c` | RHEL for x86 EUS variant | same pattern |
| `5267af002885ef30040662dafea3f2ba339ebe72` | RHEL for SAP x86 variant | same pattern |

**RHEL annual checklist (from reference implementations):**

- [ ] Variant constant in `src/services/rhsm/rhsmConstants.js`
- [ ] JSDoc type annotations (all **3+** locations in that file)
- [ ] `public/locales/en-US.json` (toolbar, view, graph, inventory as needed)
- [ ] `npm run test:ci -- --updateSnapshot` when snapshots change intentionally
- [ ] `npm run test:lintfix` then `npm run test:ci`

**Do not** (annual add-on pattern): create a new `src/config/product.*.js` unless a maintainer confirms this variant family needs it—reference commits above are mostly constants + locales only.

### OpenShift PAYG

| Commit | Description | Typical files touched |
|--------|-------------|------------------------|
| `4cdbc99221321daaecff3492ceaa39509ff76505` | Red Hat Advanced Cluster Security (RHACS) | `rhsmConstants.js`, `src/config/product.*.js`, `en-US.json`, snapshots |
| `14db2a98717df177474cad171dc673ac3770219c` | Red Hat Advanced Cluster Management (RHACM) | same pattern |
| `2ca0496a88618343c2bc1f17fd955a8544f268b3` | Red Hat OpenShift Data Science (RHODS) | same pattern |

**OpenShift PAYG checklist:**

- [ ] Product constant in `src/services/rhsm/rhsmConstants.js`
- [ ] JSDoc (**4** locations in `rhsmConstants.js` per reference implementations)
- [ ] New `src/config/product.<camelCaseVariant>.js` (see [File naming](#file-naming-patterns))
- [ ] `public/locales/en-US.json`
- [ ] `npm run test:ci -- --updateSnapshot`, `npm run test:lintfix`, `npm run test:ci`

### RHEL PAYG

| Commit | Description | Typical files touched |
|--------|-------------|------------------------|
| `2ca7797a44320311fdca54f211636b310b492f25` | RHEL for x86 ELS PAYG variant | `rhsmConstants.js`, product config, `en-US.json`, snapshots |
| `d66edfaa93c4242ed6ea042350c9cee74565a614` | RHEL for x86 PAYG Add-On | same pattern |

**RHEL PAYG checklist:**

- [ ] Variant constant in the appropriate section of `rhsmConstants.js`
- [ ] JSDoc (**3+** locations)
- [ ] `src/config/product.<camelCaseVariant>.js`
- [ ] Locales + tests/snapshots as above

## Stop conditions

- **OpenShift annual**: The app expects a single OpenShift annual display; if the user asks for another, stop and explain—requires product decision, not a silent code change.
- **Unsupported billing model**: If the variant does not map to an existing pattern after checking `src/config/` and `rhsmConstants.js`, stop and ask for a maintainer or issue reference.

## Interactive questions

Ask **one at a time**; wait for an answer before the next.

1. **Product ID** for the variant (API identifier)—examples: `RHEL for x86`, `rhel-for-x86-els-unconverted`, `rhods`, `rhacs`; often kebab-case.
2. **Full / long display name**—e.g. `Red Hat Enterprise Linux for x86`, `Red Hat OpenShift AI`.
3. **Short display name**—toolbar/menus; human-readable, matches sibling patterns.
4. **PAYG, ON-DEMAND, or ANNUAL?** — If **ANNUAL**, go to question 5; if PAYG or ON-DEMAND, go to question 6.
5. **RHEL or OpenShift (annual)?** — RHEL → RHEL annual implementation; OpenShift annual → [stop condition](#stop-conditions).
6. **Metrics** to display (e.g. Cores, vCPUs, Instance-hours).
7. **Capacity metrics** to show on charts.
8. **Metric display names**—if technical ids differ from UI labels, capture each mapping.
9. **Detailed product description** for alternate views—or confirm standard parent description pattern.

**Rules:** Do not skip questions unless the user already answered in-thread. Exit if the user asks to stop; discard gathered answers.

## Localization

Add entries under `public/locales/en-US.json` for the variant id. Compare **git reference commits** and sibling products for full key sets.

Illustrative shape:

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

Also review and extend when needed:

- `curiosity-graph`
- `curiosity-inventory`

**Requirements:** Use the product id consistently; keep **alphabetical order** within each section where the file already does; for shared description text, use existing translation reference patterns (e.g. `$(curiosity-view.[locale entry]_[product group])`) when siblings do.

## File naming patterns

- **Do** use camelCase: `product.openshiftLoremIpsum.js`; align with `ls src/config/product.*.js`.
- **Don’t** add filler words like `for` in filenames (e.g. avoid `product.openshiftForLoremIpsum.js`).

## Capacity and graph filters (OpenShift PAYG)

- **Don’t** invent a `capacity: [...]` property on metrics without matching live `src/config` patterns.
- **Do** use `productDisplay: DISPLAY_TYPES.CAPACITY` when the product is capacity-style; typically only the **primary** capacity metric uses `chartType: ChartTypeVariant.threshold`; secondary metrics (e.g. instance hours) stay normal usage metrics.
- **Do** use the `initialGraphFilters` **filters array** structure for capacity products (nested `filters` per group)—see `product.rosa.js` and sibling OpenShift configs.
 
## Platform integration

For entirely new product categories (not just variants), you may need to update the platform navigation:

- **[`deploy/frontend.yaml`](../../../deploy/frontend.yaml)**: update `bundleSegments` / `navItems` for sidebar entries and `serviceTiles` / `searchEntries` for landing page tiles.
- See **[`docs/development.md`](../../../docs/development.md#platform-integration)** for details on navigation control.

## Reference files in repo (verify current names on disk):

- OpenShift PAYG **with** capacity: primary **`product.rosa.js`**; secondary **`product.rhacs.js`**.
- OpenShift PAYG **without** capacity: **`product.rhacs.js`**.
- RHEL annual family: **`product.rhel.js`**.

## Common pitfalls

- Missing **any** JSDoc location in `rhsmConstants.js` that the type pattern requires.
- Missing **any** locale section (toolbar, view, graph, inventory).
- Ignoring **alphabetical** ordering in constants where the codebase enforces it.
- Unrelated edits in shared constant files.
- Skipping git examples without `git show` validation.

## Quick validation commands

```bash
ls src/config/product.*.js
grep -r "capacity.*\[" src/config/
grep -A 20 "initialGraphFilters" src/config/product.yourVariant.js
grep -r "your-variant-id" public/locales/en-US.json
npm run test:ci -- --testPathPattern=src/config/product.yourVariant.js
npm run test:lintfix
npm run test:ci
```

(Adjust `yourVariant` / `your-variant-id` to the actual variant.)
