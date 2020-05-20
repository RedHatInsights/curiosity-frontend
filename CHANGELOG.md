# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
