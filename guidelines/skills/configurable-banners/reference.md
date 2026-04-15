# Configurable banners — reference

## Banner object (typical)

| Field | Purpose |
|-------|---------|
| `id` | Stable string; combined with `productId` when dispatching to Redux |
| `title` / `message` | String or `({ productId }) => …`; only `productId` is available, **Redux `state` is NOT passed**. Note: Use `translate` from `src/components/i18n/i18n` for user-visible copy (pulls from `public/locales/`). |
| `variant` | PatternFly `AlertVariant.*` |
| `dataTest` | Selector for tests (`data-test`) |
| `productIds` | Optional allow-list of RHSM product id constants; omit for all products |
| `condition` | Optional `({ productId }) => boolean`; only `productId` is available |
| `actions` | Optional link/button configs (`title`, `href`, `isExternal`, `onClick`) |

## Related files

- [`src/config/banners.js`](../../../src/config/banners.js) — source list
- [`src/config/index.js`](../../../src/config/index.js) — exports `bannersConfig`
- [`src/components/productView/productViewOnloadContext.js`](../../../src/components/productView/productViewOnloadContext.js) — `useConfigBanners`
- [`src/components/bannerMessages/`](../../../src/components/bannerMessages/) — context / modal helpers
- [`src/redux/reducers/messagesReducer.js`](../../../src/redux/reducers/messagesReducer.js) — stored messages

## Validation

```bash
npm run test:lint
npx jest src/components/productView/__tests__/productViewOnloadContext.test.js
```

See [docs/development.md](../../../docs/development.md#testing) for wider test commands.
