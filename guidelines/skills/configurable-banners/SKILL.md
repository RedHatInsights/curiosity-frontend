---
name: configurable-banners
description: Adds or updates global configurable PatternFly alerts driven from src/config/banners.js—product scoping, conditions, locales, Redux messages, and tests. Use when the user asks for maintenance banners, global announcements, bannerMessages, useConfigBanners, or src/config/banners.
---

# Configurable banners

Global banners are **config-driven** (not hard-coded only in components). Introduced in [`feat: swatch-175 configurable banners`](https://github.com/RedHatInsights/curiosity-frontend/commit/d3c944e9368ffd2e5fe7629c551094bf369bea4a) (`#1820`).

## Preconditions

- Follow [agent_behaviors.md](../../agent_behaviors.md) and [agent_coding.md](../../agent_coding.md).
- Prefer matching existing **usage** and **config** banner patterns in [`productViewOnloadContext.js`](../../../src/components/productView/productViewOnloadContext.js) (`useUsageBanner` vs `useConfigBanners`).

## Workflow

1. **Author** banner entries in [`src/config/banners.js`](../../../src/config/banners.js). Each object supports `id`, `title`, `message` (often `() => translate(...)`), `variant` (`AlertVariant` from PatternFly), `dataTest`, optional `productIds`, optional `condition`, optional `actions` (links/buttons). See the JSDoc example at the top of that file and [reference.md](reference.md).
2. **Wire locales** in `public/locales/en-US.json` (and follow existing `curiosity-banner.*` key shapes). Do not ship English-only copy without team agreement on locale policy.
3. **Confirm runtime path**: `bannersConfig` is imported from config into [`productViewOnloadContext.js`](../../../src/components/productView/productViewOnloadContext.js); `useConfigBanners` runs `bannersConfig.forEach` and calls `setBannerMessages` when `productIds` / `condition` allow.
4. **Redux**: new banner payloads flow through existing `messagesReducer` / banner context; avoid bypassing reducers unless you are fixing an established bug.
5. **Tests**: update or add tests alongside [`productViewOnloadContext.test.js`](../../../src/components/productView/__tests__/productViewOnloadContext.test.js) and snapshots; run `npm run test:lint` / targeted tests per [agent_testing.md](../../agent_testing.md).

## Do not

- Add banners only in a product component when the requirement is **global/config**—extend `banners.js` so behavior stays consistent across products.
- Skip `dataTest` where the testing team relies on stable selectors; coordinate changes to `data-test` with QA when in doubt.

## Reference

- Field checklist and patterns: [reference.md](reference.md)
- Generated config API notes: [`src/config/README.md`](../../../src/config/README.md) (`banners` section)
