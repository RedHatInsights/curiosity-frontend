# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/RedHatInsights/curiosity-frontend/compare/v1.0.0...v1.1.0) (2020-10-26)


### Features

* **inventoryList:** issues/410 activate column sorting ([#433](https://github.com/RedHatInsights/curiosity-frontend/issues/433)) ([9d44c59](https://github.com/RedHatInsights/curiosity-frontend/commit/9d44c59e200b8313971bd76c623d0fe2352d0a9d))
* **inventoryList:** issues/414 RBAC for inventory links ([#446](https://github.com/RedHatInsights/curiosity-frontend/issues/446)) ([d2f2bfb](https://github.com/RedHatInsights/curiosity-frontend/commit/d2f2bfbbed4d84765a7df16a8f716a68d6bf94eb))
* **inventoryList:** issues/442 activate last seen tooltip ([#445](https://github.com/RedHatInsights/curiosity-frontend/issues/445)) ([2576854](https://github.com/RedHatInsights/curiosity-frontend/commit/2576854ef907a440e62757690324c7a3ee91a5a0))
* **minHeight:** issues/403 set min-height, avoid page jumps ([#439](https://github.com/RedHatInsights/curiosity-frontend/issues/439)) ([ba0e81f](https://github.com/RedHatInsights/curiosity-frontend/commit/ba0e81fa3707eb9a6bb01a7a8f9fc330159d2d34))


### Bug Fixes

* **build:** npm updates ([#420](https://github.com/RedHatInsights/curiosity-frontend/issues/420)) ([fdb15a3](https://github.com/RedHatInsights/curiosity-frontend/commit/fdb15a3fd833be42856fc839e46b1061e303b668))
* **chartArea:** resize observer test addition ([#447](https://github.com/RedHatInsights/curiosity-frontend/issues/447)) ([78683cc](https://github.com/RedHatInsights/curiosity-frontend/commit/78683ccde15bef43cc7e0de6c021a54e02464613))
* **inventoryList:** activate paging for smaller screen sizes ([#447](https://github.com/RedHatInsights/curiosity-frontend/issues/447)) ([2887696](https://github.com/RedHatInsights/curiosity-frontend/commit/28876961044a052454f1cb3519607b488f9f4a48))
* **inventoryList:** issues/403 adjust for expanded guestsList ([#460](https://github.com/RedHatInsights/curiosity-frontend/issues/460)) ([1c58435](https://github.com/RedHatInsights/curiosity-frontend/commit/1c5843542ca95c6501acd62bf76e62054311688e))
* **inventoryList:** issues/403 minHeight update on perpage ([#447](https://github.com/RedHatInsights/curiosity-frontend/issues/447)) ([4194200](https://github.com/RedHatInsights/curiosity-frontend/commit/4194200f4d3ad20b102fc928424cec9b637f7821))
* **inventoryList,graphCard:** issues/403 set minheight on update ([#439](https://github.com/RedHatInsights/curiosity-frontend/issues/439)) ([d839e51](https://github.com/RedHatInsights/curiosity-frontend/commit/d839e51f3954c14376084ebf74a222398facaf6b))
* **minHeight:** issues/403 resize events reset height ([#447](https://github.com/RedHatInsights/curiosity-frontend/issues/447)) ([74f0e7f](https://github.com/RedHatInsights/curiosity-frontend/commit/74f0e7fae7f7d1f7b1c7c2d3814b76e4a3d9a38e))
* **openshiftView,rhelView:** issues/410 update sort default ([#444](https://github.com/RedHatInsights/curiosity-frontend/issues/444)) ([fb11a05](https://github.com/RedHatInsights/curiosity-frontend/commit/fb11a052571c31a361f94a88909cfbd7b13d3f4d))
* **openshiftView,rhelView:** issues/414 inventory link prefix ([#463](https://github.com/RedHatInsights/curiosity-frontend/issues/463)) ([fc491bc](https://github.com/RedHatInsights/curiosity-frontend/commit/fc491bc2a6e9f3eb1ac46f67ce49404a6e3e374e))
* **platformServices:** issues/473 apply hideGlobalFilter ([#474](https://github.com/RedHatInsights/curiosity-frontend/issues/474)) ([94d879c](https://github.com/RedHatInsights/curiosity-frontend/commit/94d879c12cb0bb123480a4951c6340f20bf27ad7))
* **testing:** activate GitHub workflow for commits ([#432](https://github.com/RedHatInsights/curiosity-frontend/issues/432)) ([37dd445](https://github.com/RedHatInsights/curiosity-frontend/commit/37dd445cd42f777674c0671bd7d6154ab71663fc))
* **userSelectors:** issues/414 RBAC perms for inventory links ([#465](https://github.com/RedHatInsights/curiosity-frontend/issues/465)) ([5416f65](https://github.com/RedHatInsights/curiosity-frontend/commit/5416f658fab955811150c310c386d460ed13476e))


### Performance Improvements

* **authentication:** issues/414 restructure permissions ([#446](https://github.com/RedHatInsights/curiosity-frontend/issues/446)) ([846c743](https://github.com/RedHatInsights/curiosity-frontend/commit/846c74320dd69a8404ca53b40f55dd93362977f3))
* **graphCardSelectors:** expand query filters for graph ([#433](https://github.com/RedHatInsights/curiosity-frontend/issues/433)) ([48e01ea](https://github.com/RedHatInsights/curiosity-frontend/commit/48e01eac84db2a96e0322bc96eb6c5db472d0230))

## [1.0.0](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.19...v1.0.0) (2020-09-29)


### Features

* **authentication:** issues/373 use platform not authorized ([#402](https://github.com/RedHatInsights/curiosity-frontend/issues/402)) ([dd0dbf2](https://github.com/RedHatInsights/curiosity-frontend/commit/dd0dbf24edf907ce84d388b0b7914cd29ebe8e8c))
* **guestsList:** issues/10 display infinite table listing ([#390](https://github.com/RedHatInsights/curiosity-frontend/issues/390)) ([98ffe05](https://github.com/RedHatInsights/curiosity-frontend/commit/98ffe057f54a531b42130ab268b8eae903cc69f4))
* **inventoryList,views:** issues/10 display inventory list ([#372](https://github.com/RedHatInsights/curiosity-frontend/issues/372)) ([0109e0b](https://github.com/RedHatInsights/curiosity-frontend/commit/0109e0b20bd58ddf3bfaaa15f9f6071d672d5f69))
* **messageView:** issues/320 app-level maintenance mode ([#379](https://github.com/RedHatInsights/curiosity-frontend/issues/379)) ([5798e1f](https://github.com/RedHatInsights/curiosity-frontend/commit/5798e1ff5e54dabbed4db59d1bee93300dd5cd96))


### Bug Fixes

* **apiQueries,reduxHelpers:** issues/380 query schema ([#381](https://github.com/RedHatInsights/curiosity-frontend/issues/381)) ([d37641e](https://github.com/RedHatInsights/curiosity-frontend/commit/d37641e6648aa4d91a8b53a00f83b8113023fee8))
* **docs:** issues/437 update dotenv learn more link ([#438](https://github.com/RedHatInsights/curiosity-frontend/issues/438)) ([8a22ef9](https://github.com/RedHatInsights/curiosity-frontend/commit/8a22ef9479db9b6036c7cfb7d052069910ba306a))
* **graphCard:** issues/380 graph refresh on query ([#384](https://github.com/RedHatInsights/curiosity-frontend/issues/384)) ([f150ef8](https://github.com/RedHatInsights/curiosity-frontend/commit/f150ef8aa08f00702b42c671091d23228a33d31b))
* **graphCard,c3GraphCard:** issues/10 align card component ([#372](https://github.com/RedHatInsights/curiosity-frontend/issues/372)) ([cb8f925](https://github.com/RedHatInsights/curiosity-frontend/commit/cb8f925060a22a0601946e29095b95b4c8649c90))
* **graphCard,chartArea:** issues/365 increase stroke width ([#392](https://github.com/RedHatInsights/curiosity-frontend/issues/392)) ([9080259](https://github.com/RedHatInsights/curiosity-frontend/commit/9080259de23ba8d70e3ff69324f8f175331a0974))
* **guestsList:**  avoid boolean, remove nullish coalescing op ([#413](https://github.com/RedHatInsights/curiosity-frontend/issues/413)) ([cd0985c](https://github.com/RedHatInsights/curiosity-frontend/commit/cd0985cd864b724b70a4a90c1cfa56185c5c3e47))
* **guestsList:** issues/10 increase paging limit ([#390](https://github.com/RedHatInsights/curiosity-frontend/issues/390)) ([eca2a39](https://github.com/RedHatInsights/curiosity-frontend/commit/eca2a3955b5863f7ef3a9a42e1b3cf09dc8d01df))
* **helpers:** issues/416 move links to dotenv ([#438](https://github.com/RedHatInsights/curiosity-frontend/issues/438)) ([d399bf3](https://github.com/RedHatInsights/curiosity-frontend/commit/d399bf3ef3623c6806d6239210a7b16e7c3dd8c7))
* **inventoryList:** issues/10 missing platform component ([#385](https://github.com/RedHatInsights/curiosity-frontend/issues/385)) ([189ff58](https://github.com/RedHatInsights/curiosity-frontend/commit/189ff581cfb6722594fd5cd1875e0b692238e926))
* **inventoryList:** issues/421 correct prop attr ([#423](https://github.com/RedHatInsights/curiosity-frontend/issues/423)) ([e29212b](https://github.com/RedHatInsights/curiosity-frontend/commit/e29212b8b39d779d292467f81a6cedc5c2292da7))
* **inventoryListSelectors:** issues/10 itemCount, deep equals ([#372](https://github.com/RedHatInsights/curiosity-frontend/issues/372)) ([bfed7e8](https://github.com/RedHatInsights/curiosity-frontend/commit/bfed7e86cb749fcc3d42bc5714b4da14723e54ea))
* **inventoryListSelectors:** issues/10 last seen date context ([#382](https://github.com/RedHatInsights/curiosity-frontend/issues/382)) ([62141ec](https://github.com/RedHatInsights/curiosity-frontend/commit/62141ec63e0ccad9552389839e9c99225e5a9228))
* **inventoryListSelectors:** issues/421 combine query ([#423](https://github.com/RedHatInsights/curiosity-frontend/issues/423)) ([447aaf2](https://github.com/RedHatInsights/curiosity-frontend/commit/447aaf20d78b0aa086073259c6904c066f5c790e))
* **openshiftView:** issues/383 apply uom query filter ([#408](https://github.com/RedHatInsights/curiosity-frontend/issues/408)) ([f5f5657](https://github.com/RedHatInsights/curiosity-frontend/commit/f5f5657a99fe35708cb14370ed6e1b581c346a38))
* **openshiftView,rhelView:** issues/421 viewId to productLabel ([#423](https://github.com/RedHatInsights/curiosity-frontend/issues/423)) ([d073813](https://github.com/RedHatInsights/curiosity-frontend/commit/d073813f4aa7153a9ac66183088d2afc67d7105a))
* **pagination:** issues/400 page reset on limit update ([#405](https://github.com/RedHatInsights/curiosity-frontend/issues/405)) ([b016181](https://github.com/RedHatInsights/curiosity-frontend/commit/b016181aad6fdd21b2cef6dc90f780f88343d4c7))
* **pagination,toolbar:** issues/400 page reset filter update ([#412](https://github.com/RedHatInsights/curiosity-frontend/issues/412)) ([5e1a938](https://github.com/RedHatInsights/curiosity-frontend/commit/5e1a938ec1cf2a9476002dda6b4abdc1de09eed8))
* **rhsmApiTypes:** issues/380 api query types ([#381](https://github.com/RedHatInsights/curiosity-frontend/issues/381)) ([4828327](https://github.com/RedHatInsights/curiosity-frontend/commit/4828327de5f2c78d08bb7364e0aa8038efca1586))
* **table,tableSkeleton:** issues/10 align content prop to pf ([#372](https://github.com/RedHatInsights/curiosity-frontend/issues/372)) ([88e1140](https://github.com/RedHatInsights/curiosity-frontend/commit/88e1140e3e4332744dc50f8f89e0c70763def56c))
* **tableSkeleton:** allow table with zero rows ([#390](https://github.com/RedHatInsights/curiosity-frontend/issues/390)) ([1120bda](https://github.com/RedHatInsights/curiosity-frontend/commit/1120bda8c30317fa9f2bcc3c5ba4c54824d55432))
* **testing:** platform component import exceptions ([#386](https://github.com/RedHatInsights/curiosity-frontend/issues/386)) ([e4df25f](https://github.com/RedHatInsights/curiosity-frontend/commit/e4df25f229aca962f11ddb79c91f94139c27051e))


### Styles

* **pageLayout:** issues/391 remove gray padding ([#401](https://github.com/RedHatInsights/curiosity-frontend/issues/401)) ([12bba02](https://github.com/RedHatInsights/curiosity-frontend/commit/12bba022ec22581364432207139b8a33ab6856df))

### [0.1.19](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.18...v0.1.19) (2020-08-24)


### Features

* **rhelView, openshiftView:** issues/305 add sub heading ([#348](https://github.com/RedHatInsights/curiosity-frontend/issues/348)) ([9875a19](https://github.com/RedHatInsights/curiosity-frontend/commit/9875a1914e2eab5ea0bc2abb2ea00aac6ebaa9c5))
* **toolbar:** issues/10 add usage filter ([#361](https://github.com/RedHatInsights/curiosity-frontend/issues/361)) ([9ad7dcb](https://github.com/RedHatInsights/curiosity-frontend/commit/9ad7dcb43cf5128938468eb3d9fb6a27e322a67b))


### Bug Fixes

* **graphCard,rhelView,openshiftView:** issues/10 query prop ([#360](https://github.com/RedHatInsights/curiosity-frontend/issues/360)) ([2b6019d](https://github.com/RedHatInsights/curiosity-frontend/commit/2b6019d79d51d2180099e659513aed93fe6c2093))
* **i18n,translate:** issues/354 remove withTranslation ([#355](https://github.com/RedHatInsights/curiosity-frontend/issues/355)) ([63334eb](https://github.com/RedHatInsights/curiosity-frontend/commit/63334ebf5cff944b27f7f50e4ba236eb25afc419))
* **pageHeader:** issues/305 add bottom margin to h1 ([#357](https://github.com/RedHatInsights/curiosity-frontend/issues/357)) ([2b3b404](https://github.com/RedHatInsights/curiosity-frontend/commit/2b3b4042f958b07cf8e7145189c8b44d3887a3f3))
* **pageHeader:** issues/305 apply locale product context ([#371](https://github.com/RedHatInsights/curiosity-frontend/issues/371)) ([f6fc39f](https://github.com/RedHatInsights/curiosity-frontend/commit/f6fc39fcbc5c763095a46e268bf3a1f5eba1273a))
* **pageHeader:** issues/367 subheading external link icon ([#369](https://github.com/RedHatInsights/curiosity-frontend/issues/369)) ([bb97d4e](https://github.com/RedHatInsights/curiosity-frontend/commit/bb97d4e4ef6c03f81f0e453f09de49352cb8e9da))
* **queryTypes:** issues/10 rhsm to query type ([#361](https://github.com/RedHatInsights/curiosity-frontend/issues/361)) ([1070ac2](https://github.com/RedHatInsights/curiosity-frontend/commit/1070ac29c076e4d39b43dbd9c0a4825642d24832))
* **redux:** issues/10 expand rhsmTypes for filtering ([#360](https://github.com/RedHatInsights/curiosity-frontend/issues/360)) ([34d9b0c](https://github.com/RedHatInsights/curiosity-frontend/commit/34d9b0c4976ec5712d87da7a8d6292b9dae068a8))
* **select:** issues/10 pf toggleIcon prop, toggleText ([#360](https://github.com/RedHatInsights/curiosity-frontend/issues/360)) ([c225f01](https://github.com/RedHatInsights/curiosity-frontend/commit/c225f018159bae6ed4a3712618c20890ecd6261f))
* **testing:** commit message length ([#366](https://github.com/RedHatInsights/curiosity-frontend/issues/366)) ([ce4dbe8](https://github.com/RedHatInsights/curiosity-frontend/commit/ce4dbe8cbef90e0aeeb791d559695699f69b71f8))
* **toolbar:** issues/10 default usage filter category ([#368](https://github.com/RedHatInsights/curiosity-frontend/issues/368)) ([00900d2](https://github.com/RedHatInsights/curiosity-frontend/commit/00900d2759852a52d8272144ac0c35863520efcb))
* **toolbar:** issues/377 openshiftView, remove usage filter ([#378](https://github.com/RedHatInsights/curiosity-frontend/issues/378)) ([1a12310](https://github.com/RedHatInsights/curiosity-frontend/commit/1a12310ef5358f3ad7890c5e412c8dc43d8b8e97))
* **tourView:** issues/359 remove vestigial tour stylesheet ([#370](https://github.com/RedHatInsights/curiosity-frontend/issues/370)) ([d6c73c7](https://github.com/RedHatInsights/curiosity-frontend/commit/d6c73c77ec0782655ea8d0dbe2dfe13b2219a91a))

### [0.1.18](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.17...v0.1.18) (2020-07-30)


### Features

* **loader:** issues/328 loading component ([#337](https://github.com/RedHatInsights/curiosity-frontend/issues/337)) ([40d9b87](https://github.com/RedHatInsights/curiosity-frontend/commit/40d9b8716c0af6f23380ede8c58b3649fb675654))
* **rhsmServices,redux:** issues/10 inventory api, state ([#312](https://github.com/RedHatInsights/curiosity-frontend/issues/312)) ([da48f9b](https://github.com/RedHatInsights/curiosity-frontend/commit/da48f9b36c989292ce84065729cf04c06a59592f))
* **table,empty,skeleton:** issues/10 add table component ([#346](https://github.com/RedHatInsights/curiosity-frontend/issues/346)) ([fc87bdf](https://github.com/RedHatInsights/curiosity-frontend/commit/fc87bdf24b1fb05593ba76d5225f4fffcda58934))


### Bug Fixes

* **build:** issues/296 npm updates for pf4 react core ([#326](https://github.com/RedHatInsights/curiosity-frontend/issues/326)) ([5d3f0ac](https://github.com/RedHatInsights/curiosity-frontend/commit/5d3f0ace2249e928c1f192f889fb65bb621d4b83))
* **build:** issues/296 npm updates for pf4, platform ([#326](https://github.com/RedHatInsights/curiosity-frontend/issues/326)) ([5a780d0](https://github.com/RedHatInsights/curiosity-frontend/commit/5a780d0ffcfc8d7a4ec4480b6821a62c8352c979))
* **build:** issues/296 npm updates for platform ([#326](https://github.com/RedHatInsights/curiosity-frontend/issues/326)) ([5b69c99](https://github.com/RedHatInsights/curiosity-frontend/commit/5b69c99408f45efd850b83c3a60530bd553bd043))
* **build:** issues/321 commit lint, rebase ([#322](https://github.com/RedHatInsights/curiosity-frontend/issues/322)) ([73b57ef](https://github.com/RedHatInsights/curiosity-frontend/commit/73b57efdf3b4f918917ab48a9f557929252692ec))
* **build:** npm lint updates ([#313](https://github.com/RedHatInsights/curiosity-frontend/issues/313)) ([7312cfd](https://github.com/RedHatInsights/curiosity-frontend/commit/7312cfd173974212c8da8a69ec27ae75d3df414e))
* **build:** npm lint updates ([#345](https://github.com/RedHatInsights/curiosity-frontend/issues/345)) ([05d918a](https://github.com/RedHatInsights/curiosity-frontend/commit/05d918a286dd8365ed39fb715c1bb190dd9602ad))
* **build:** npm updates for pf4 react core ([#345](https://github.com/RedHatInsights/curiosity-frontend/issues/345)) ([3632fbf](https://github.com/RedHatInsights/curiosity-frontend/commit/3632fbfc617d6f8355593a9ebf93a69b46905629))
* **build:** npm victory updates ([#345](https://github.com/RedHatInsights/curiosity-frontend/issues/345)) ([803b12a](https://github.com/RedHatInsights/curiosity-frontend/commit/803b12a86444e092b86a93a2630dd5c65441adfd))
* **build,chartArea:** npm update for victory charts ([#314](https://github.com/RedHatInsights/curiosity-frontend/issues/314)) ([2aea500](https://github.com/RedHatInsights/curiosity-frontend/commit/2aea5004180e2a8166cc4ba3012373bea27172b9))
* **chartArea:** issues/318 inaccurate voronoi x coords ([#324](https://github.com/RedHatInsights/curiosity-frontend/issues/324)) ([91f30e5](https://github.com/RedHatInsights/curiosity-frontend/commit/91f30e5d4163c6ddd172d57d62cce6804a602199))
* **graphCard,selectors:** issues/10 generic selectors ([#343](https://github.com/RedHatInsights/curiosity-frontend/issues/343)) ([c470827](https://github.com/RedHatInsights/curiosity-frontend/commit/c470827516b6f0add624bee2c64db2a10a4efc67))
* **graphCardChartLegend:** issues/158 activate tooltips ([#325](https://github.com/RedHatInsights/curiosity-frontend/issues/325)) ([5ef4f27](https://github.com/RedHatInsights/curiosity-frontend/commit/5ef4f274eb63480efd41b1b1b4f1334940f44bb8))
* **graphCardHelpers:** issues/317 yAxisTickFormat locale ([#319](https://github.com/RedHatInsights/curiosity-frontend/issues/319)) ([5cc5dbd](https://github.com/RedHatInsights/curiosity-frontend/commit/5cc5dbd8bb3c2c301ed753b8b1db79ddd15d1d0b))
* **graphCardHelpers:** issues/317 yAxisTickFormatFallback ([#323](https://github.com/RedHatInsights/curiosity-frontend/issues/323)) ([5c9f805](https://github.com/RedHatInsights/curiosity-frontend/commit/5c9f8059c612a5b4912a5045d450270783178242))
* **graphCardHelpers:** yAxisTickFormat, use NumberFormat ([#315](https://github.com/RedHatInsights/curiosity-frontend/issues/315)) ([fab0bb4](https://github.com/RedHatInsights/curiosity-frontend/commit/fab0bb43f6e7cd72c6a1939dfb7f406bf0c149fe))
* **helpers:** add isDate check, enhance isPromise ([82d823b](https://github.com/RedHatInsights/curiosity-frontend/commit/82d823b4c5a51748d20a3dc85dbbceb496184915))
* **inventoryListSelectors:** issues/10 selectors, state ([#343](https://github.com/RedHatInsights/curiosity-frontend/issues/343)) ([55db9a4](https://github.com/RedHatInsights/curiosity-frontend/commit/55db9a4d5fba96ea8c5f8547027ff3b299f5b1a2))
* **loader,graphCard:** issues/10 extend loader types ([#346](https://github.com/RedHatInsights/curiosity-frontend/issues/346)) ([c2c8600](https://github.com/RedHatInsights/curiosity-frontend/commit/c2c86003faa8960ea7d96b8b6a5e604bed0d4730))
* **messageView:** remove unnecessary emptyState alias ([2312c5d](https://github.com/RedHatInsights/curiosity-frontend/commit/2312c5d51277637fc367af5b9314d7a92b56a46a))
* **messageView:** reposition empty state icon ([7c55554](https://github.com/RedHatInsights/curiosity-frontend/commit/7c5555456b7a034b73bfa7e313076b97939cde4a))
* **rhsmServices,redux:** issues/10 inventory guests, state ([#330](https://github.com/RedHatInsights/curiosity-frontend/issues/330)) ([3b48997](https://github.com/RedHatInsights/curiosity-frontend/commit/3b48997c4924fa42068bed75b21d5ded2f62ebc2))
* **routerTypes:** issues/328 lazy load routing ([#337](https://github.com/RedHatInsights/curiosity-frontend/issues/337)) ([8821359](https://github.com/RedHatInsights/curiosity-frontend/commit/8821359e0119e9c20574b13d10577bd8535b6335))
* **tableSkeleton:** issues/10 locale, borders prop ([#350](https://github.com/RedHatInsights/curiosity-frontend/issues/350)) ([22f3821](https://github.com/RedHatInsights/curiosity-frontend/commit/22f38211cffbcdda4e79fcb4f50d38322f6c1cfd))
* **testing:** add general code tests, lost console methods ([#351](https://github.com/RedHatInsights/curiosity-frontend/issues/351)) ([8d444ae](https://github.com/RedHatInsights/curiosity-frontend/commit/8d444aed766bbe98e870721216d70d0eeae85410))
* **tourView:** issues/289 remove unused tourView ([#326](https://github.com/RedHatInsights/curiosity-frontend/issues/326)) ([f36c10a](https://github.com/RedHatInsights/curiosity-frontend/commit/f36c10a7526f6e6cfd825cf711fe913018afd723))

### [0.1.17](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.16...v0.1.17) (2020-06-16)


### Features

* **c3Chart:** issues/283 add base c3 component ([958a93b](https://github.com/RedHatInsights/curiosity-frontend/commit/958a93bef4bfdf4a238f3ad3cca28ac8397e7686))
* **c3GraphCard:** issues/283 add card, display data ([1826918](https://github.com/RedHatInsights/curiosity-frontend/commit/1826918a6eaa4e3d3544b2089561ee02d469bbf2))
* **chartArea:** issues/283 victory html tooltips ([#295](https://github.com/RedHatInsights/curiosity-frontend/issues/295)) ([c9df378](https://github.com/RedHatInsights/curiosity-frontend/commit/c9df378c85b50167914d1704c748285705b3716c))
* **chartArea,graphCard:** issues/283 custom legends ([#298](https://github.com/RedHatInsights/curiosity-frontend/issues/298)) ([066bce8](https://github.com/RedHatInsights/curiosity-frontend/commit/066bce841ca1eb2f65cd9f4a6903727cfc1aa45a))
* **chartArea,graphCard:** issues/283 interactive legend ([#299](https://github.com/RedHatInsights/curiosity-frontend/issues/299)) ([4c862ce](https://github.com/RedHatInsights/curiosity-frontend/commit/4c862ce63bf91573234bee4735d7adf8534b90b0))
* **rhelView,openshiftView:** issues/283 activate c3 ([#285](https://github.com/RedHatInsights/curiosity-frontend/issues/285)) ([78ee5fd](https://github.com/RedHatInsights/curiosity-frontend/commit/78ee5fd51e553e6bf44f90a5f4a6ffad426b846f))
* **router,routerHelpers:** issues/283 location.search ([#294](https://github.com/RedHatInsights/curiosity-frontend/issues/294)) ([6fdd332](https://github.com/RedHatInsights/curiosity-frontend/commit/6fdd332a053ac10a0933f963abe577f13a3510f2))
* **userSelectors:** issues/300 rbac user permissions ([#306](https://github.com/RedHatInsights/curiosity-frontend/issues/306)) ([a8f8a0a](https://github.com/RedHatInsights/curiosity-frontend/commit/a8f8a0aa32ff3a78bd9c6fa33adb072280f106d4))


### Bug Fixes

* **graphCard:** issues/283 expand unit tests ([ca46b09](https://github.com/RedHatInsights/curiosity-frontend/commit/ca46b0912aeb71cf4c4c2f143239eb1e34731017))
* **graphCardChartLegend:** issues/158 disable tooltips ([#311](https://github.com/RedHatInsights/curiosity-frontend/issues/311)) ([ae7fd7c](https://github.com/RedHatInsights/curiosity-frontend/commit/ae7fd7c91326e1f84c16f4339af8e58b2fa481bb))
* **userSelectors:** issues/307 missing error check ([#308](https://github.com/RedHatInsights/curiosity-frontend/issues/308)) ([a799987](https://github.com/RedHatInsights/curiosity-frontend/commit/a799987d1c21d6a3cdb617e9496d5164833816d7))

### [0.1.16](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.15...v0.1.16) (2020-05-20)


### Features

* **userReducer,rhsmApiTypes:** issues/260 error codes ([#277](https://github.com/RedHatInsights/curiosity-frontend/issues/277)) ([73ab02f](https://github.com/RedHatInsights/curiosity-frontend/commit/73ab02f4a3b59e8de378226c767c0d4ff7469177))


### Bug Fixes

* **authentication:** issues/260 apply optin code ([5d70f83](https://github.com/RedHatInsights/curiosity-frontend/commit/5d70f83c59331dab716d629e40678e68fea25fe9))
* **build:** issues/274 update proxy docker port mapping ([#276](https://github.com/RedHatInsights/curiosity-frontend/issues/276)) ([254bb49](https://github.com/RedHatInsights/curiosity-frontend/commit/254bb4912482870bc02d2e55b33f02adba6220c0))
* **graphCardHelpers:** issues/180 tooltip show data facets ([#282](https://github.com/RedHatInsights/curiosity-frontend/issues/282)) ([5cc2bc9](https://github.com/RedHatInsights/curiosity-frontend/commit/5cc2bc9fe8951e45f40815048394e89f3ff84c7d))
* **graphCardHelpers:** issues/273 tooltip date ranges ([#284](https://github.com/RedHatInsights/curiosity-frontend/issues/284)) ([9f39ee8](https://github.com/RedHatInsights/curiosity-frontend/commit/9f39ee88bcf0e18bee25285e3e35b3b96ebff43f))
* **platformServices:** issues/260 confirm user permissions ([73df889](https://github.com/RedHatInsights/curiosity-frontend/commit/73df889c14ae53a79f9b694a359ccc3d9ab4b71d))
* **reduxHelpers,middleware:** issues/260 expose error data ([dfc10b7](https://github.com/RedHatInsights/curiosity-frontend/commit/dfc10b766313d39f5fd021076cef229ea5f48c9e))
* **testing:** regex for scenarios testing platform config ([#271](https://github.com/RedHatInsights/curiosity-frontend/issues/271)) ([d90a2b2](https://github.com/RedHatInsights/curiosity-frontend/commit/d90a2b23e0a59967ae1c9da7ed09926a9091a06e))

### [0.1.15](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.14...v0.1.15) (2020-05-04)


### Bug Fixes

* **authentication:** issues/262 await authorizeUser ([#264](https://github.com/RedHatInsights/curiosity-frontend/issues/264)) ([2510932](https://github.com/RedHatInsights/curiosity-frontend/commit/25109321834b061c6a3eda70d6edfbe0b990dc1e))
* **helpers:** access to an app specific window object ([6404a03](https://github.com/RedHatInsights/curiosity-frontend/commit/6404a034a93016cf1d355208c337f009b3b13cf8))
* **optinView:** issues/240 assume opt-in is activated ([#256](https://github.com/RedHatInsights/curiosity-frontend/issues/256)) ([b8a5ea0](https://github.com/RedHatInsights/curiosity-frontend/commit/b8a5ea06c01e156739379a8817666198a3f1d856))
* **redux:** rename use of http errorStatus to just status ([35e0603](https://github.com/RedHatInsights/curiosity-frontend/commit/35e06031a2343fff70ccff88e428e3f6f8ba549e))
* **services:** apply consistent exports for config ([74edcff](https://github.com/RedHatInsights/curiosity-frontend/commit/74edcff58df64ccb9cab28994671a8fdc0b789a3))

### [0.1.14](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.13...v0.1.14) (2020-04-17)


### Features

* **checkbox,formState:** issues/240 form components ([#246](https://github.com/RedHatInsights/curiosity-frontend/issues/246)) ([b1611ac](https://github.com/RedHatInsights/curiosity-frontend/commit/b1611ac915c697019e9c46389c1b7062feb68ed5))
* **i18n:** issues/240 expose translating a node ([#250](https://github.com/RedHatInsights/curiosity-frontend/issues/250)) ([dcfeb08](https://github.com/RedHatInsights/curiosity-frontend/commit/dcfeb08a657bcdd799242d31c02f5bd60f38c7ea))
* **optinView:** issues/240 add opt-in form ([#247](https://github.com/RedHatInsights/curiosity-frontend/issues/247)) ([155dd44](https://github.com/RedHatInsights/curiosity-frontend/commit/155dd44c66f3c922d9074e88afc4cafbd9002dca))
* **platformServices:** issues/240 getUserPermissions ([#249](https://github.com/RedHatInsights/curiosity-frontend/issues/249)) ([e4d3f2a](https://github.com/RedHatInsights/curiosity-frontend/commit/e4d3f2a3511c7cfa183e607c9d3ff0d3d102d601))
* **services,redux:** issues/240 add account opt-in services ([#243](https://github.com/RedHatInsights/curiosity-frontend/issues/243)) ([87fdb68](https://github.com/RedHatInsights/curiosity-frontend/commit/87fdb684fc2bd31af44fc1bda59c4847a6b2a07b))


### Bug Fixes

* **authentication,messageView:** auth empty state ([d279d34](https://github.com/RedHatInsights/curiosity-frontend/commit/d279d34e7e9bafae8790c93033bac18a9405e5d4))
* **authentication,optinView:** issues/240 expand unit tests ([#254](https://github.com/RedHatInsights/curiosity-frontend/issues/254)) ([4477963](https://github.com/RedHatInsights/curiosity-frontend/commit/4477963bee58bc183f6d7d8bcbd5348b5b60db19))
* **authentication,optinView:** issues/240 optin for all users ([#255](https://github.com/RedHatInsights/curiosity-frontend/issues/255)) ([a614d93](https://github.com/RedHatInsights/curiosity-frontend/commit/a614d93b7912a9aa7b5fe7ea329c351805b9a6b9))
* **optinView:** issues/240 copy, image update ([#258](https://github.com/RedHatInsights/curiosity-frontend/issues/258)) ([8c1d5c0](https://github.com/RedHatInsights/curiosity-frontend/commit/8c1d5c073a32f1eeb526a96ddcfd65d1eb651265))
* **platformServices:** issue/240 admin API debugging behavior ([5192152](https://github.com/RedHatInsights/curiosity-frontend/commit/5192152c5b517acdd82998ea7b3836cd9da5288f))
* **routerTypes:** locale page titles, remove title attr ([#245](https://github.com/RedHatInsights/curiosity-frontend/issues/245)) ([7c8e571](https://github.com/RedHatInsights/curiosity-frontend/commit/7c8e57180a392f93c188e1a94c1974cdea548066))

### [0.1.13](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.12...v0.1.13) (2020-04-02)


### Features

* **build:** issues/231 code documentation, linting ([#232](https://github.com/RedHatInsights/curiosity-frontend/issues/232)) ([bb46552](https://github.com/RedHatInsights/curiosity-frontend/commit/bb46552e23f38fb26fb08c8ee0e29318883d489f))
* **rhelView:** issues/226 display cloud metering data ([#237](https://github.com/RedHatInsights/curiosity-frontend/issues/237)) ([26319ae](https://github.com/RedHatInsights/curiosity-frontend/commit/26319ae66598ac30bfddd3381bdf1dcc72b47a57))
* **rhelView:** issues/234 display SLA toolbar ([#236](https://github.com/RedHatInsights/curiosity-frontend/issues/236)) ([f39426c](https://github.com/RedHatInsights/curiosity-frontend/commit/f39426ce34e40a1f0ac2abeefd4d3de00f3a207d))


### Bug Fixes

* **build:** issues/234 enable toolbar with SLA filter ([#235](https://github.com/RedHatInsights/curiosity-frontend/issues/235)) ([17a2fab](https://github.com/RedHatInsights/curiosity-frontend/commit/17a2fab1e275d730c46cef29569e0d381730b618))
* **rhelView:** sockets card heading ([45bf19e](https://github.com/RedHatInsights/curiosity-frontend/commit/45bf19ef5c5f7b553e9b26953ff10ff40b170ebe))
* **routerHelpers:** issues/218 dynamic base name tests ([e235b1c](https://github.com/RedHatInsights/curiosity-frontend/commit/e235b1c3829e5011093aef7ee73800da567bf614))

### [0.1.12](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.11...v0.1.12) (2020-03-19)


### Features

* **build:** issues/76 apply dotenv feature disabling ([fca5041](https://github.com/RedHatInsights/curiosity-frontend/commit/fca50412c511623e8731157e2097000bf895beba))
* **openshiftView:** issues/76 apply toolbar with SLA filter ([#219](https://github.com/RedHatInsights/curiosity-frontend/issues/219)) ([f3848ed](https://github.com/RedHatInsights/curiosity-frontend/commit/f3848edc7277d461a587c5e6a083010a0cd0e6ca))
* **pageToolbar,pageLayout:** issues/76 add a page toolbar section ([d518ba4](https://github.com/RedHatInsights/curiosity-frontend/commit/d518ba4ec91a94d21108332401ed830424dd5018))
* **toolbar,toolbarTypes:** issues/76 add toolbar with SLA filter ([efc9416](https://github.com/RedHatInsights/curiosity-frontend/commit/efc94169663b49d185ca30130cdcd7a93a39649c))
* **viewReducer,rhsmTypes:** issues/76 apply SLA types ([539cfaa](https://github.com/RedHatInsights/curiosity-frontend/commit/539cfaa2721d6e9155a29005180cfa44a91ba26f))
* **viewSelectors:** issues/76 add viewSelectors with graphQuery ([c39ee67](https://github.com/RedHatInsights/curiosity-frontend/commit/c39ee67e2d03c4a20fa129dd616b516ad626927f))


### Bug Fixes

* **build:** npm lint updates ([#208](https://github.com/RedHatInsights/curiosity-frontend/issues/208)) ([78eaf74](https://github.com/RedHatInsights/curiosity-frontend/commit/78eaf749eb8b4ff7561037652a482e4181ff6d80))
* **build:** npm platform component updates ([#208](https://github.com/RedHatInsights/curiosity-frontend/issues/208)) ([90af68b](https://github.com/RedHatInsights/curiosity-frontend/commit/90af68b35a8bbd209e6c1e3d7553ac802caef3ab))
* **build:** npm react scripts updated ([#208](https://github.com/RedHatInsights/curiosity-frontend/issues/208)) ([3e0df74](https://github.com/RedHatInsights/curiosity-frontend/commit/3e0df7436bcbdefe1b72193ddb5bdc85f3e60574))
* **graphCard,redux,views:** issues/76 switch to graphQuery ([b498e24](https://github.com/RedHatInsights/curiosity-frontend/commit/b498e24c365288f90db68ea8510ee22bafee75d7))
* **graphCard,views:** issues/76 add graphQuery prop ([3cf02d6](https://github.com/RedHatInsights/curiosity-frontend/commit/3cf02d6c317966a69eea4eee3a02e0f8293a275e))
* **graphCardSelectors:** improve sync for multiple api calls ([#215](https://github.com/RedHatInsights/curiosity-frontend/issues/215)) ([6935cc9](https://github.com/RedHatInsights/curiosity-frontend/commit/6935cc94d630de396ee0222893738b12c8cb2434))
* **graphCardSelectors,redux,services:** expand unit testing ([#216](https://github.com/RedHatInsights/curiosity-frontend/issues/216)) ([c6f44b6](https://github.com/RedHatInsights/curiosity-frontend/commit/c6f44b6c54602187f8698bae8c3bf4e4595bbcb2))
* **graphCardSelectors,services:** cancellable axios responses ([9b8d652](https://github.com/RedHatInsights/curiosity-frontend/commit/9b8d652ca36cfc0d7f812ce6cd0c6c4797ef7752))
* **graphReducer,rhsmActions:** clean up unused actions ([d068e3d](https://github.com/RedHatInsights/curiosity-frontend/commit/d068e3d3bd6cfcc867b0f112e54f519bf631213e))
* **select:** correct single variant check ([#217](https://github.com/RedHatInsights/curiosity-frontend/issues/217)) ([fabf6f1](https://github.com/RedHatInsights/curiosity-frontend/commit/fabf6f16a474178b264aa02ca99c85cd349e84fc))

### [0.1.11](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.10...v0.1.11) (2020-02-25)


### Features

* **graphCard,redux:** issues/185 maintain state by view ([#202](https://github.com/RedHatInsights/curiosity-frontend/issues/202)) ([5b1df0c](https://github.com/RedHatInsights/curiosity-frontend/commit/5b1df0c6b86bf5c0d80d01c50254a2ea76434b5f))
* **graphCardSelectors:** issues/188 infinite quantity, threshold ([#207](https://github.com/RedHatInsights/curiosity-frontend/issues/207)) ([41342b2](https://github.com/RedHatInsights/curiosity-frontend/commit/41342b23d7108da32fb57be69d091367aa5eb7ea))
* **openshiftView:** issues/185 add cores sockets selector ([#205](https://github.com/RedHatInsights/curiosity-frontend/issues/205)) ([a713c9e](https://github.com/RedHatInsights/curiosity-frontend/commit/a713c9ea25d29095bb706c67647533d4c76a440d))


### Bug Fixes

* **authentication:** issues/190 relax platform redirect ([#196](https://github.com/RedHatInsights/curiosity-frontend/issues/196)) ([c7d9168](https://github.com/RedHatInsights/curiosity-frontend/commit/c7d9168ad946c48a417b9998e65f18a589937651))
* **build:** dotenv app display name casing ([#194](https://github.com/RedHatInsights/curiosity-frontend/issues/194)) ([1460e3b](https://github.com/RedHatInsights/curiosity-frontend/commit/1460e3b63a8d46ceb79e1198b323494100cbeb84))
* **graphCard:** rename prop, productShortLabel ([5396223](https://github.com/RedHatInsights/curiosity-frontend/commit/5396223b762c3a5f9441d81ea53d9ad3eb3313e2))
* **graphCardSelectors:** generic rename test snapshots ([a8c5df0](https://github.com/RedHatInsights/curiosity-frontend/commit/a8c5df06c90e94c2598231e124cbc09dbadc7255))
* **graphCardSelectors:** issues/176 graph error blur ([#198](https://github.com/RedHatInsights/curiosity-frontend/issues/198)) ([d283917](https://github.com/RedHatInsights/curiosity-frontend/commit/d283917bde0d6a14451970d1efeb89ac1b714a54))
* **graphCardSelectors:** issues/185 apply response schemas ([#204](https://github.com/RedHatInsights/curiosity-frontend/issues/204)) ([319050a](https://github.com/RedHatInsights/curiosity-frontend/commit/319050a9020944b7cd49b5702e78efa11557241f))
* **graphCardSelectors,reduxHelpers:** issues/188 allow custom logic ([5e00a3b](https://github.com/RedHatInsights/curiosity-frontend/commit/5e00a3bb9506d10ea8b78dbcfda1ccf0a695bb34))
* **pageLayout:** restructure view layout ([#187](https://github.com/RedHatInsights/curiosity-frontend/issues/187)) ([1884c75](https://github.com/RedHatInsights/curiosity-frontend/commit/1884c756d4def6afc8613d536ae0a7821f624d7c))
* **pageLayout,messageView:** restructure view layout ([#184](https://github.com/RedHatInsights/curiosity-frontend/issues/184)) ([779e647](https://github.com/RedHatInsights/curiosity-frontend/commit/779e64762c920f323fcad7f9edb43875100d20df))
* **platform,userServices:** issues/43 centralize globals ([#189](https://github.com/RedHatInsights/curiosity-frontend/issues/189)) ([4d8b053](https://github.com/RedHatInsights/curiosity-frontend/commit/4d8b053034c9db36adcb5e8897b514da6398b729))
* **platformServices:** issues/179 platform app name ([#191](https://github.com/RedHatInsights/curiosity-frontend/issues/191)) ([d3cb587](https://github.com/RedHatInsights/curiosity-frontend/commit/d3cb58767e3e6a066db76021ca863966cf9a92bb))
* **platformServices:** issues/43 centralize globals ([#183](https://github.com/RedHatInsights/curiosity-frontend/issues/183)) ([253ff56](https://github.com/RedHatInsights/curiosity-frontend/commit/253ff56d27d3bf7f577ac2aeea9e389fb90c0bbd))
* **reduxHelpers:** add generated reducer unit tests ([eabba6a](https://github.com/RedHatInsights/curiosity-frontend/commit/eabba6a779822fbb25efcbb353d194ba0af8e53e))
* **reduxHelpers:** issues/185 apply consistent meta types ([#203](https://github.com/RedHatInsights/curiosity-frontend/issues/203)) ([5b9c5b4](https://github.com/RedHatInsights/curiosity-frontend/commit/5b9c5b4d7c6f29ae10cb4190d4a09c55bd945582))
* **rhsmActions:** issues/185 combine actions, promise.all ([#201](https://github.com/RedHatInsights/curiosity-frontend/issues/201)) ([d478ed3](https://github.com/RedHatInsights/curiosity-frontend/commit/d478ed3378db1ac2e2418883520851fee3e2cc6d))
* **rhsmActions,platformActions:** issues/190 toast notifications ([533250e](https://github.com/RedHatInsights/curiosity-frontend/commit/533250e6db873bfdbba84ac8e4321451719e499a))
* **rhsmApiTypes:** apply RHEL prefix to types ([dd196c6](https://github.com/RedHatInsights/curiosity-frontend/commit/dd196c6979bd22d887d375d7620fff88d7332eae))
* **router,redirect:** issues/176 restructure redirect ([#184](https://github.com/RedHatInsights/curiosity-frontend/issues/184)) ([3dab747](https://github.com/RedHatInsights/curiosity-frontend/commit/3dab747c38ab69d15c1d9d5cf35ad473173cedcf))
* **router,routerTypes:** relax path comparison ([980e859](https://github.com/RedHatInsights/curiosity-frontend/commit/980e8598ceb1fb7e7c1e075e962be65590067f52))
* **tourView:** issues/190 copy update for malformed users ([#211](https://github.com/RedHatInsights/curiosity-frontend/issues/211)) ([aab081b](https://github.com/RedHatInsights/curiosity-frontend/commit/aab081b515504baef4fbd4376ac41c2a457fa056))
* **tourView:** issues/192 update learn more link ([#197](https://github.com/RedHatInsights/curiosity-frontend/issues/197)) ([1172de2](https://github.com/RedHatInsights/curiosity-frontend/commit/1172de221af4f069a47ae6bc1ccbe9a2a1530510))
* **userServices:** issues/43 catch empty response objects ([#209](https://github.com/RedHatInsights/curiosity-frontend/issues/209)) ([b4313ca](https://github.com/RedHatInsights/curiosity-frontend/commit/b4313ca8dd18023841ad16761d4bb2f242edb379))

### [0.1.10](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.9...v0.1.10) (2020-01-15)


### Features

* **statusMiddleware:** issues/159 redux for http status ([dc4c318](https://github.com/RedHatInsights/curiosity-frontend/commit/dc4c31885981e73d0ad671cfb0fb0bf688ed655a))


### Bug Fixes

* **authentication,locale:** enUS additions ([9ac3d00](https://github.com/RedHatInsights/curiosity-frontend/commit/9ac3d002c6c5d832ea4775823682cfa2f21d65bd))
* **build:** integration version check regex updated ([e6587ec](https://github.com/RedHatInsights/curiosity-frontend/commit/e6587ec36af633b11dff3b83016234a016b9b5b4))
* **chartArea,graphCard:** use dash instead of threshold ([d4d3466](https://github.com/RedHatInsights/curiosity-frontend/commit/d4d34664084aba16808f3c8d9206043de9801b98))
* **graphCardHelpers:** consistency clean up ([a7bc253](https://github.com/RedHatInsights/curiosity-frontend/commit/a7bc253a93aa9e9e655f3c885fecfab81dd6b7ba))
* **i18n:** issues/159 correct locale load sequence ([#173](https://github.com/RedHatInsights/curiosity-frontend/issues/173)) ([b15b03a](https://github.com/RedHatInsights/curiosity-frontend/commit/b15b03aa5bfd86554d503e52e3ffb0c5e53d515e))
* **openshiftView:** test name correction ([75dcaf5](https://github.com/RedHatInsights/curiosity-frontend/commit/75dcaf5fb21fc52b6679dcc011f508681b18debb))
* **reduxHelpers:** getMessageFromResults testing baseline ([2e91262](https://github.com/RedHatInsights/curiosity-frontend/commit/2e91262883c1e2dcd51c5a3792ae2ba581873c2b))
* **reduxHelpers,helpers:** streamlined response messages ([9e85217](https://github.com/RedHatInsights/curiosity-frontend/commit/9e852171636ea8bcc256ad68a936c6c1a6f3359c))
* **rhsmActions,redirect:** comments clean up ([51e67a9](https://github.com/RedHatInsights/curiosity-frontend/commit/51e67a929667e811e3fb3b9fa4c0cdf8ef248771))
* **routerHelpers,routerTypes,redirect:** restructure components ([8eb8fab](https://github.com/RedHatInsights/curiosity-frontend/commit/8eb8fab843c1f9de9d676beeadb148548d7ac448))
* **services:** issues/167 login, update platform getUser ([#168](https://github.com/RedHatInsights/curiosity-frontend/issues/168)) ([cc08a2e](https://github.com/RedHatInsights/curiosity-frontend/commit/cc08a2e13dc2e77d0b2e16bde2ad10d395cd25be))
* **userReducer,authorization:** issues/159 managed redirect ([#170](https://github.com/RedHatInsights/curiosity-frontend/issues/170)) ([47b580d](https://github.com/RedHatInsights/curiosity-frontend/commit/47b580d28ec8d6d0e8db16535e41b6a5a8473533))
* **userServices:** issues/159 emulate response error ([1277d80](https://github.com/RedHatInsights/curiosity-frontend/commit/1277d804b1f6be90e7f0b5016d8304a923838f10))

### [0.1.9](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.8...v0.1.9) (2019-12-19)


### Bug Fixes

* **graphCard,helpers,types:** issues/161 directory, file rename ([c02c2ea](https://github.com/RedHatInsights/curiosity-frontend/commit/c02c2ea))
* **helpers:** noopTranslate display locale keys in tests ([26110ca](https://github.com/RedHatInsights/curiosity-frontend/commit/26110ca))
* **locale:** clean up default locale strings ([6ee8b89](https://github.com/RedHatInsights/curiosity-frontend/commit/6ee8b89))
* **locales:** align keys to rhsm types ([287972c](https://github.com/RedHatInsights/curiosity-frontend/commit/287972c))
* **redux:** issues/161 rename rhel to generic ([0ca9067](https://github.com/RedHatInsights/curiosity-frontend/commit/0ca9067))
* **rhelGraphCardHelpers:** issues/161 generate tooltips ([7d3b350](https://github.com/RedHatInsights/curiosity-frontend/commit/7d3b350))
* **rhelGraphCardTypes:** issues/161 pass param optionsType ([1c7cb0c](https://github.com/RedHatInsights/curiosity-frontend/commit/1c7cb0c))
* **rhelView:** issues/161 pass graph card options ([25be1ef](https://github.com/RedHatInsights/curiosity-frontend/commit/25be1ef))
* **rhsmApiTypes:** issues/161 expand rhsm types ([e4430bb](https://github.com/RedHatInsights/curiosity-frontend/commit/e4430bb))
* **tourView:** issues/133 generic learn more link ([2c7490e](https://github.com/RedHatInsights/curiosity-frontend/commit/2c7490e))
* **types,services,redux:** issues/161 rename rhel rhsm ([#162](https://github.com/RedHatInsights/curiosity-frontend/issues/162)) ([418fe91](https://github.com/RedHatInsights/curiosity-frontend/commit/418fe91))
* **userActions,userTypes,rhsmTypes:** minor restructure ([fce919e](https://github.com/RedHatInsights/curiosity-frontend/commit/fce919e))


### Features

* **openShiftView,rhelView:** issues/157 openshift route ([#164](https://github.com/RedHatInsights/curiosity-frontend/issues/164)) ([0b5be21](https://github.com/RedHatInsights/curiosity-frontend/commit/0b5be21))

### [0.1.8](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.7...v0.1.8) (2019-12-03)


### Bug Fixes

* **chartArea:** issues/133 add a css className and ID ([cbdafcd](https://github.com/RedHatInsights/curiosity-frontend/commit/cbdafcd))
* **tourView:** issues/153 additional copy and contact us link ([12cfc27](https://github.com/RedHatInsights/curiosity-frontend/commit/12cfc27))

### [0.1.7](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.6...v0.1.7) (2019-11-22)


### Bug Fixes

* **chartArea:** issues/142 update interpolation default ([#149](https://github.com/RedHatInsights/curiosity-frontend/issues/149)) ([57af67a](https://github.com/RedHatInsights/curiosity-frontend/commit/57af67a))
* **i18n:** issues/146 update system label copy ([eb7a394](https://github.com/RedHatInsights/curiosity-frontend/commit/eb7a394))
* **rhelActions:** issues/133 disable toasts ([#150](https://github.com/RedHatInsights/curiosity-frontend/issues/150)) ([ba18bbf](https://github.com/RedHatInsights/curiosity-frontend/commit/ba18bbf))
* **rhelGraphCard:** issues/148 subtle color adjustment ([219f3d2](https://github.com/RedHatInsights/curiosity-frontend/commit/219f3d2))
* **rhelGraphCard,redux:** issues/133 add tour redirect ([#145](https://github.com/RedHatInsights/curiosity-frontend/issues/145)) ([380e1e4](https://github.com/RedHatInsights/curiosity-frontend/commit/380e1e4))
* **tourView:** learn more href update ([2385189](https://github.com/RedHatInsights/curiosity-frontend/commit/2385189))
* **tourView,rhelView:** issues/133 copy updates ([#139](https://github.com/RedHatInsights/curiosity-frontend/issues/139)) ([b0b4e62](https://github.com/RedHatInsights/curiosity-frontend/commit/b0b4e62))

### [0.1.6](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.5...v0.1.6) (2019-11-19)


### Bug Fixes

* **build,routing:** issues/77 naming, routing, views ([#132](https://github.com/RedHatInsights/curiosity-frontend/issues/132)) ([400ee1d](https://github.com/RedHatInsights/curiosity-frontend/commit/400ee1d))
* **dateHelpers:** end of day adjustment for display ([#138](https://github.com/RedHatInsights/curiosity-frontend/issues/138)) ([f6c6fc3](https://github.com/RedHatInsights/curiosity-frontend/commit/f6c6fc3))
* **graphCardSelectors:** cache update for product id ([60a1a5c](https://github.com/RedHatInsights/curiosity-frontend/commit/60a1a5c))
* **i18n:** translateComponent wrapper, alias ([edc6169](https://github.com/RedHatInsights/curiosity-frontend/commit/edc6169))
* **routerTypes:** IBM Z systems name ([4ee6a8d](https://github.com/RedHatInsights/curiosity-frontend/commit/4ee6a8d))


### Features

* **tourView,i18n:** issues/133 empty state tour ([8574c1c](https://github.com/RedHatInsights/curiosity-frontend/commit/8574c1c))

### [0.1.5](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.4...v0.1.5) (2019-11-15)


### Bug Fixes

* **chartArea:** custom tooltips, remove unused properties ([#124](https://github.com/RedHatInsights/curiosity-frontend/issues/124)) ([53eb21f](https://github.com/RedHatInsights/curiosity-frontend/commit/53eb21f))
* **chartArea:** issues/79 streamline multiple data facets ([#122](https://github.com/RedHatInsights/curiosity-frontend/issues/122)) ([2fbc4e0](https://github.com/RedHatInsights/curiosity-frontend/commit/2fbc4e0))
* **graphCardSelectors:** confirm granularity loaded correctly ([#127](https://github.com/RedHatInsights/curiosity-frontend/issues/127)) ([a709f34](https://github.com/RedHatInsights/curiosity-frontend/commit/a709f34))
* **graphCardSelectors:** handle malformed api response ([cb1ab49](https://github.com/RedHatInsights/curiosity-frontend/commit/cb1ab49))
* **graphCardSelectors:** reset data facets to avoid duplication ([acf1763](https://github.com/RedHatInsights/curiosity-frontend/commit/acf1763))
* **graphHelpers,rhelGraphCardHelpers:** restructured helpers ([#125](https://github.com/RedHatInsights/curiosity-frontend/issues/125)) ([3d853d9](https://github.com/RedHatInsights/curiosity-frontend/commit/3d853d9))
* **pfReactCharts,build:** npm and related fixes ([#128](https://github.com/RedHatInsights/curiosity-frontend/issues/128)) ([5380567](https://github.com/RedHatInsights/curiosity-frontend/commit/5380567))
* **rhelApiTypes:** optimized import for granularity types ([e0f9128](https://github.com/RedHatInsights/curiosity-frontend/commit/e0f9128))


### Features

* **graphCardSelectors:** issues/79 hypervisor breakout ([#123](https://github.com/RedHatInsights/curiosity-frontend/issues/123)) ([1db2bbf](https://github.com/RedHatInsights/curiosity-frontend/commit/1db2bbf))
* **rhelGraphCard:** issues/79 activate hypervisor display ([#119](https://github.com/RedHatInsights/curiosity-frontend/issues/119)) ([83276b3](https://github.com/RedHatInsights/curiosity-frontend/commit/83276b3))
* **rhelServices,rhelApiTypes:** issues/77 allow passed id ([035e9e6](https://github.com/RedHatInsights/curiosity-frontend/commit/035e9e6))
* **rhelServices,rhelGraphCard:** issues/79 hypervisor api ([#121](https://github.com/RedHatInsights/curiosity-frontend/issues/121)) ([479f05d](https://github.com/RedHatInsights/curiosity-frontend/commit/479f05d))
* **rhelView,authentication:** issues/77 pass path parameter ([2fb501f](https://github.com/RedHatInsights/curiosity-frontend/commit/2fb501f))
* **router,routerTypes:** issues/77 navigation types ([14680bb](https://github.com/RedHatInsights/curiosity-frontend/commit/14680bb))

### [0.1.4](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.2...v0.1.4) (2019-10-21)


### Bug Fixes

* **build:** issues/105 local run chroming update ([9937f12](https://github.com/RedHatInsights/curiosity-frontend/commit/9937f12))
* **build:** issues/105 local run chroming updates ([#106](https://github.com/RedHatInsights/curiosity-frontend/issues/106)) ([b2fdd05](https://github.com/RedHatInsights/curiosity-frontend/commit/b2fdd05))
* **chartArea:** issues/103 y axis domain minimum ([#104](https://github.com/RedHatInsights/curiosity-frontend/issues/104)) ([6b49e1a](https://github.com/RedHatInsights/curiosity-frontend/commit/6b49e1a))
* **graphHelpers,chartArea:** issues/92 tooltip labels ([#113](https://github.com/RedHatInsights/curiosity-frontend/issues/113)) ([87772eb](https://github.com/RedHatInsights/curiosity-frontend/commit/87772eb))
* **i18n:** combine i18n integration and unit test ([ccf77f9](https://github.com/RedHatInsights/curiosity-frontend/commit/ccf77f9))
* **rhelGraphCard,graphHelpers:** correct y axis ticks ([351e264](https://github.com/RedHatInsights/curiosity-frontend/commit/351e264))


### Features

* **build:** commit message integration check ([#110](https://github.com/RedHatInsights/curiosity-frontend/issues/110)) ([296c11c](https://github.com/RedHatInsights/curiosity-frontend/commit/296c11c))
* **chartArea:** issues/75 aggregated tooltips ([#112](https://github.com/RedHatInsights/curiosity-frontend/issues/112)) ([0031dfd](https://github.com/RedHatInsights/curiosity-frontend/commit/0031dfd))
* **notifications:** issues/11 toast notifications ([#107](https://github.com/RedHatInsights/curiosity-frontend/issues/107)) ([cf72c5c](https://github.com/RedHatInsights/curiosity-frontend/commit/cf72c5c))
* **rhelGraphCard:** issues/80 activate threshold api ([#108](https://github.com/RedHatInsights/curiosity-frontend/issues/108)) ([294ff07](https://github.com/RedHatInsights/curiosity-frontend/commit/294ff07))

### [0.1.3](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.2...v0.1.3) (2019-10-08)


### Bug Fixes

* **build:** issues/105 local run chroming updates ([#106](https://github.com/RedHatInsights/curiosity-frontend/issues/106)) ([e4e24d0](https://github.com/RedHatInsights/curiosity-frontend/commit/e4e24d0))
* **chartArea:** issues/103 y axis domain minimum ([#104](https://github.com/RedHatInsights/curiosity-frontend/issues/104)) ([f4ce68a](https://github.com/RedHatInsights/curiosity-frontend/commit/f4ce68a))


### Features

* **notifications:** issues/11 toast notifications ([#107](https://github.com/RedHatInsights/curiosity-frontend/issues/107)) ([80f6ef5](https://github.com/RedHatInsights/curiosity-frontend/commit/80f6ef5))
* **rhelGraphCard:** issues/80 activate threshold api ([#108](https://github.com/RedHatInsights/curiosity-frontend/issues/108)) ([252afc1](https://github.com/RedHatInsights/curiosity-frontend/commit/252afc1))

### [0.1.2](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.1...v0.1.2) (2019-09-16)


### Bug Fixes

* **build:** issues/95 proxy domain updated ([#100](https://github.com/RedHatInsights/curiosity-frontend/issues/100)) ([7c6dbab](https://github.com/RedHatInsights/curiosity-frontend/commit/7c6dbab))
* **build:** issues/97 branching and integration ([7417cc4](https://github.com/RedHatInsights/curiosity-frontend/commit/7417cc4))
* **rhelGraphCard:** issues/93 remove the word daily ([#96](https://github.com/RedHatInsights/curiosity-frontend/issues/96)) ([1c56c8b](https://github.com/RedHatInsights/curiosity-frontend/commit/1c56c8b))


### Features

* **build:** issues/97 branching and qe integration ([#98](https://github.com/RedHatInsights/curiosity-frontend/issues/98)) ([07ddcdf](https://github.com/RedHatInsights/curiosity-frontend/commit/07ddcdf))
* **chartArea,graphHelpers:** issues/78,87 threshold ([#94](https://github.com/RedHatInsights/curiosity-frontend/issues/94)) ([db2855f](https://github.com/RedHatInsights/curiosity-frontend/commit/db2855f))

### [0.1.1](https://github.com/RedHatInsights/curiosity-frontend/compare/v0.1.0...v0.1.1) (2019-08-23)


### Bug Fixes

* **build:** local, proxy run updates ([#83](https://github.com/RedHatInsights/curiosity-frontend/issues/83)) ([84a6023](https://github.com/RedHatInsights/curiosity-frontend/commit/84a6023))
* **graphHelper,chartArea:** reset api timestamp start of day ([#89](https://github.com/RedHatInsights/curiosity-frontend/issues/89)) ([ee39a48](https://github.com/RedHatInsights/curiosity-frontend/commit/ee39a48))
* **graphHelpers,chartArea:** quarters granularity display ([#90](https://github.com/RedHatInsights/curiosity-frontend/issues/90)) ([62f3c58](https://github.com/RedHatInsights/curiosity-frontend/commit/62f3c58))
* **rhelGraphCard:** prevent resubmit on chosen granularity option ([fe857ae](https://github.com/RedHatInsights/curiosity-frontend/commit/fe857ae))


### Features

* **rhelGraphCard:** update responsive usage and apply ChartAxis ([#70](https://github.com/RedHatInsights/curiosity-frontend/issues/70)) ([b67efb8](https://github.com/RedHatInsights/curiosity-frontend/commit/b67efb8))
* **rhelGraphCard,chartArea:** issues/6,88 granularity dropdown ([#81](https://github.com/RedHatInsights/curiosity-frontend/issues/81)) ([0368605](https://github.com/RedHatInsights/curiosity-frontend/commit/0368605))

## 0.1.0 (2019-08-08)


### Bug Fixes

* **api spec:** issues/17 local run openapi spec ([#31](https://github.com/RedHatInsights/curiosity-frontend/issues/31)) ([1aa0bcd](https://github.com/RedHatInsights/curiosity-frontend/commit/1aa0bcd))
* **app name:** issues/14 codify app name ([#15](https://github.com/RedHatInsights/curiosity-frontend/issues/15)) ([5e2e0dd](https://github.com/RedHatInsights/curiosity-frontend/commit/5e2e0dd))
* **build:** issues/16 separate out hosts update ([#22](https://github.com/RedHatInsights/curiosity-frontend/issues/22)) ([8c2815a](https://github.com/RedHatInsights/curiosity-frontend/commit/8c2815a))
* **build:** issues/34 app id, path updates ([#73](https://github.com/RedHatInsights/curiosity-frontend/issues/73)) ([d3e7bc2](https://github.com/RedHatInsights/curiosity-frontend/commit/d3e7bc2))
* **build:** issues/34 correct deployment path prefix ([#49](https://github.com/RedHatInsights/curiosity-frontend/issues/49)) ([34cb100](https://github.com/RedHatInsights/curiosity-frontend/commit/34cb100))
* **build:** issues/34 custom dotenv, rhsm path ([#58](https://github.com/RedHatInsights/curiosity-frontend/issues/58)) ([53f409a](https://github.com/RedHatInsights/curiosity-frontend/commit/53f409a))
* **build:** issues/34 dotenv update, correct locale path ([#54](https://github.com/RedHatInsights/curiosity-frontend/issues/54)) ([bc6aecb](https://github.com/RedHatInsights/curiosity-frontend/commit/bc6aecb))
* **build:** issues/7 beta path prefix ([#28](https://github.com/RedHatInsights/curiosity-frontend/issues/28)) ([a24d037](https://github.com/RedHatInsights/curiosity-frontend/commit/a24d037))
* **build, rhelServices, auth:** issues/9 build, rhsm api updates ([66f34ef](https://github.com/RedHatInsights/curiosity-frontend/commit/66f34ef))
* **build, routerTypes:** issues/34 dynamic router baseName ([#68](https://github.com/RedHatInsights/curiosity-frontend/issues/68)) ([fdd3b06](https://github.com/RedHatInsights/curiosity-frontend/commit/fdd3b06))
* **graphHelpers:** set min y domain appropriately ([#61](https://github.com/RedHatInsights/curiosity-frontend/issues/61)) ([6402585](https://github.com/RedHatInsights/curiosity-frontend/commit/6402585))
* **integration tests:** issues/24 build html output test ([#32](https://github.com/RedHatInsights/curiosity-frontend/issues/32)) ([83ed9d5](https://github.com/RedHatInsights/curiosity-frontend/commit/83ed9d5))
* **rhelGraphCard:** issues/38 test snapshot update ([#39](https://github.com/RedHatInsights/curiosity-frontend/issues/39)) ([5e85eb3](https://github.com/RedHatInsights/curiosity-frontend/commit/5e85eb3))
* **rhelGraphCard:** issues/5 graphCard i18n ref ([#20](https://github.com/RedHatInsights/curiosity-frontend/issues/20)) ([032296f](https://github.com/RedHatInsights/curiosity-frontend/commit/032296f))
* **rhelGraphCard:** use label instead of dropdown, phase 1 ([#57](https://github.com/RedHatInsights/curiosity-frontend/issues/57)) ([9828e6a](https://github.com/RedHatInsights/curiosity-frontend/commit/9828e6a))
* **routerTypes:** root path added ([#65](https://github.com/RedHatInsights/curiosity-frontend/issues/65)) ([1128cf5](https://github.com/RedHatInsights/curiosity-frontend/commit/1128cf5))
* **services, router:** remove unused header func ([#62](https://github.com/RedHatInsights/curiosity-frontend/issues/62)) ([3a12056](https://github.com/RedHatInsights/curiosity-frontend/commit/3a12056))


### Features

* **api spec:** issues/17 local run open api spec ([#21](https://github.com/RedHatInsights/curiosity-frontend/issues/21)) ([58182e0](https://github.com/RedHatInsights/curiosity-frontend/commit/58182e0))
* **build:** issues/52 default date time override ([#64](https://github.com/RedHatInsights/curiosity-frontend/issues/64)) ([bd9239c](https://github.com/RedHatInsights/curiosity-frontend/commit/bd9239c))
* **build, helpers:** issues/52 debug config params ([#69](https://github.com/RedHatInsights/curiosity-frontend/issues/69)) ([2760ab2](https://github.com/RedHatInsights/curiosity-frontend/commit/2760ab2))
* **build, routerTypes:** issues/71 disable views config ([#72](https://github.com/RedHatInsights/curiosity-frontend/issues/72)) ([a4f7da7](https://github.com/RedHatInsights/curiosity-frontend/commit/a4f7da7))
* **chartGraph:** convert graph data, add error/loading states ([#40](https://github.com/RedHatInsights/curiosity-frontend/issues/40)) ([da2158a](https://github.com/RedHatInsights/curiosity-frontend/commit/da2158a))
* **graph-tooltip:** issues/23 tooltip, react-breakpoints ([#35](https://github.com/RedHatInsights/curiosity-frontend/issues/35)) ([dd1b46d](https://github.com/RedHatInsights/curiosity-frontend/commit/dd1b46d))
* **integration tests:** issues/24 build html output test ([#30](https://github.com/RedHatInsights/curiosity-frontend/issues/30)) ([ccb73ae](https://github.com/RedHatInsights/curiosity-frontend/commit/ccb73ae))
* **integration tests:** issues/24 build testing ([#25](https://github.com/RedHatInsights/curiosity-frontend/issues/25)) ([409150f](https://github.com/RedHatInsights/curiosity-frontend/commit/409150f))
* **locale:** use cookie to determine current locale ([#55](https://github.com/RedHatInsights/curiosity-frontend/issues/55)) ([c568794](https://github.com/RedHatInsights/curiosity-frontend/commit/c568794))
* **rhelGraphCard:** issues/5 add StackChart UI components and responsive CSS ([#13](https://github.com/RedHatInsights/curiosity-frontend/issues/13)) ([0551b11](https://github.com/RedHatInsights/curiosity-frontend/commit/0551b11))
* **rhelGraphCard:** partial data and empty array domain ([#50](https://github.com/RedHatInsights/curiosity-frontend/issues/50)) ([a9c63db](https://github.com/RedHatInsights/curiosity-frontend/commit/a9c63db))
* **rhelGraphCard redux:** issues/9 redux connect card ([#33](https://github.com/RedHatInsights/curiosity-frontend/issues/33)) ([1283e8a](https://github.com/RedHatInsights/curiosity-frontend/commit/1283e8a))
* **rhelServices, redux:** issues/17 rhsm api, and mock ([#27](https://github.com/RedHatInsights/curiosity-frontend/issues/27)) ([4641c5b](https://github.com/RedHatInsights/curiosity-frontend/commit/4641c5b))
* **rhelServices,graphHelpers:** issues/42 cores to sockets ([#48](https://github.com/RedHatInsights/curiosity-frontend/issues/48)) ([1255279](https://github.com/RedHatInsights/curiosity-frontend/commit/1255279))
