## Modules

<dl>
<dt><a href="#Helpers.module_ServiceHelpers">ServiceHelpers</a></dt>
<dd></dd>
<dt><a href="#Helpers.module_ServiceConfig">ServiceConfig</a></dt>
<dd><p>Axios config for cancelling, caching, and emulated service calls.</p>
</dd>
<dt><a href="#Platform.module_PlatformConstants">PlatformConstants</a></dt>
<dd></dd>
<dt><a href="#Platform.module_PlatformSchemas">PlatformSchemas</a></dt>
<dd></dd>
<dt><a href="#Platform.module_PlatformServices">PlatformServices</a></dt>
<dd><p>Emulated service calls for platform globals.</p>
</dd>
<dt><a href="#Platform.module_PlatformTransformers">PlatformTransformers</a></dt>
<dd><p>Transform platform responses. Replaces selector usage.</p>
</dd>
<dt><a href="#Rhsm.module_RhsmConstants">RhsmConstants</a></dt>
<dd></dd>
<dt><a href="#Rhsm.module_RhsmHelpers">RhsmHelpers</a></dt>
<dd></dd>
<dt><a href="#Rhsm.module_RhsmSchemas">RhsmSchemas</a></dt>
<dd></dd>
<dt><a href="#Rhsm.module_RhsmServices">RhsmServices</a></dt>
<dd><p>RHSM API service calls.</p>
</dd>
<dt><a href="#Rhsm.module_RhsmTransformers">RhsmTransformers</a></dt>
<dd><p>Transform RHSM responses. Replaces selector usage.</p>
</dd>
<dt><a href="#User.module_UserServices">UserServices</a></dt>
<dd><p>User, and RHSM, calls for locale and Opt-In.</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#Services">Services</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#serviceConfig">serviceConfig(passedConfig)</a> ⇒ <code>object</code></dt>
<dd><p>Apply a global custom service configuration.</p>
</dd>
<dt><a href="#serviceCall">serviceCall(config)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Use a global Axios configuration.</p>
</dd>
</dl>

<a name="Helpers.module_ServiceHelpers"></a>

## ServiceHelpers

* [ServiceHelpers](#Helpers.module_ServiceHelpers)
    * [~timeoutFunctionCancel(func, options)](#Helpers.module_ServiceHelpers..timeoutFunctionCancel) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~camelCase(obj)](#Helpers.module_ServiceHelpers..camelCase) ⇒ <code>object</code> \| <code>Array</code> \| <code>\*</code>
    * [~passDataToCallback(callback, ...data)](#Helpers.module_ServiceHelpers..passDataToCallback) ⇒ <code>Object</code>
    * [~schemaResponse(options)](#Helpers.module_ServiceHelpers..schemaResponse) ⇒ <code>\*</code> \| <code>Object</code>

<a name="Helpers.module_ServiceHelpers..timeoutFunctionCancel"></a>

### ServiceHelpers~timeoutFunctionCancel(func, options) ⇒ <code>Promise.&lt;\*&gt;</code>
A timeout cancel for function calls.

**Kind**: inner method of [<code>ServiceHelpers</code>](#Helpers.module_ServiceHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>func</td><td><code>function</code></td><td><p>Callback to be executed or cancelled</p>
</td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.timeout</td><td><code>number</code></td><td><p>Function timeout in milliseconds</p>
</td>
    </tr><tr>
    <td>options.errorMessage</td><td><code>string</code></td><td><p>What the error message will read</p>
</td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ServiceHelpers..camelCase"></a>

### ServiceHelpers~camelCase(obj) ⇒ <code>object</code> \| <code>Array</code> \| <code>\*</code>
Return objects with the keys camelCased. Normally applied to an array of objects.

**Kind**: inner method of [<code>ServiceHelpers</code>](#Helpers.module_ServiceHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>obj</td><td><code>object</code> | <code>Array</code> | <code>*</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ServiceHelpers..passDataToCallback"></a>

### ServiceHelpers~passDataToCallback(callback, ...data) ⇒ <code>Object</code>
Apply data to a callback, pass original data on error.

**Kind**: inner method of [<code>ServiceHelpers</code>](#Helpers.module_ServiceHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>callback</td><td><code>function</code></td>
    </tr><tr>
    <td>...data</td><td><code>Array</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ServiceHelpers..schemaResponse"></a>

### ServiceHelpers~schemaResponse(options) ⇒ <code>\*</code> \| <code>Object</code>
A callback for schema validation, and after-the-fact casing adjustments.

**Kind**: inner method of [<code>ServiceHelpers</code>](#Helpers.module_ServiceHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.casing</td><td><code>string</code></td>
    </tr><tr>
    <td>options.convert</td><td><code>boolean</code></td>
    </tr><tr>
    <td>options.id</td><td><code>string</code></td>
    </tr><tr>
    <td>options.response</td><td><code>object</code> | <code>Array</code></td>
    </tr><tr>
    <td>options.schema</td><td><code>*</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ServiceConfig"></a>

## ServiceConfig
Axios config for cancelling, caching, and emulated service calls.


* [ServiceConfig](#Helpers.module_ServiceConfig)
    * [~globalXhrTimeout](#Helpers.module_ServiceConfig..globalXhrTimeout) : <code>number</code>
    * [~globalCancelTokens](#Helpers.module_ServiceConfig..globalCancelTokens) : <code>object</code>
    * [~globalResponseCache](#Helpers.module_ServiceConfig..globalResponseCache) : <code>object</code>
    * [~axiosServiceCall(config, options)](#Helpers.module_ServiceConfig..axiosServiceCall) ⇒ <code>Promise.&lt;\*&gt;</code>

<a name="Helpers.module_ServiceConfig..globalXhrTimeout"></a>

### ServiceConfig~globalXhrTimeout : <code>number</code>
Set Axios XHR default timeout.

**Kind**: inner constant of [<code>ServiceConfig</code>](#Helpers.module_ServiceConfig)  
<a name="Helpers.module_ServiceConfig..globalCancelTokens"></a>

### ServiceConfig~globalCancelTokens : <code>object</code>
Cache Axios service call cancel tokens.

**Kind**: inner constant of [<code>ServiceConfig</code>](#Helpers.module_ServiceConfig)  
<a name="Helpers.module_ServiceConfig..globalResponseCache"></a>

### ServiceConfig~globalResponseCache : <code>object</code>
Cache Axios service call responses.

**Kind**: inner constant of [<code>ServiceConfig</code>](#Helpers.module_ServiceConfig)  
<a name="Helpers.module_ServiceConfig..axiosServiceCall"></a>

### ServiceConfig~axiosServiceCall(config, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Set Axios configuration. This includes response schema validation and caching.
Call platform "getUser" auth method, and apply service config. Service configuration
includes the ability to cancel all and specific calls, cache and normalize a response
based on both a provided schema and a successful API response. The cache will refresh
its timeout on continuous calls. To reset it a user will either need to refresh the
page or wait the "maxAge".

**Kind**: inner method of [<code>ServiceConfig</code>](#Helpers.module_ServiceConfig)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>config</td><td><code>object</code></td>
    </tr><tr>
    <td>config.cache</td><td><code>object</code></td>
    </tr><tr>
    <td>config.cancel</td><td><code>boolean</code></td>
    </tr><tr>
    <td>config.cancelId</td><td><code>string</code></td>
    </tr><tr>
    <td>config.params</td><td><code>object</code></td>
    </tr><tr>
    <td>config.schema</td><td><code>Array</code></td>
    </tr><tr>
    <td>config.transform</td><td><code>Array</code></td>
    </tr><tr>
    <td>config.url</td><td><code>string</code> | <code>function</code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.cancelledMessage</td><td><code>string</code></td>
    </tr><tr>
    <td>options.responseCache</td><td><code>object</code></td>
    </tr><tr>
    <td>options.xhrTimeout</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

<a name="Platform.module_PlatformConstants"></a>

## PlatformConstants

* [PlatformConstants](#Platform.module_PlatformConstants)
    * [~PLATFORM_API_RESPONSE_USER_ENTITLEMENTS](#Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_ENTITLEMENTS) : <code>string</code>
    * [~PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES](#Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES) : <code>Object</code>
    * [~PLATFORM_API_RESPONSE_USER_IDENTITY](#Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_IDENTITY) : <code>string</code>
    * [~PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES](#Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES) : <code>Object</code>
    * [~PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES](#Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES) : <code>Object</code>
    * [~PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES](#Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES) : <code>Object</code>

<a name="Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_ENTITLEMENTS"></a>

### PlatformConstants~PLATFORM\_API\_RESPONSE\_USER\_ENTITLEMENTS : <code>string</code>
Platform response entitlements type.

**Kind**: inner constant of [<code>PlatformConstants</code>](#Platform.module_PlatformConstants)  
<a name="Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES"></a>

### PlatformConstants~PLATFORM\_API\_RESPONSE\_USER\_ENTITLEMENTS\_APP\_TYPES : <code>Object</code>
Platform response of ENTITLEMENTS type values.
Schema/map of expected response entitlement types.

**Kind**: inner constant of [<code>PlatformConstants</code>](#Platform.module_PlatformConstants)  
<a name="Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_IDENTITY"></a>

### PlatformConstants~PLATFORM\_API\_RESPONSE\_USER\_IDENTITY : <code>string</code>
Platform response identity type.

**Kind**: inner constant of [<code>PlatformConstants</code>](#Platform.module_PlatformConstants)  
<a name="Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES"></a>

### PlatformConstants~PLATFORM\_API\_RESPONSE\_USER\_IDENTITY\_TYPES : <code>Object</code>
Platform response of IDENTITY type values.
Schema/map of expected response identity types.

**Kind**: inner constant of [<code>PlatformConstants</code>](#Platform.module_PlatformConstants)  
<a name="Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES"></a>

### PlatformConstants~PLATFORM\_API\_RESPONSE\_USER\_IDENTITY\_USER\_TYPES : <code>Object</code>
Platform response of IDENTITY USER type values.
Schema/map of expected response identity user types.

**Kind**: inner constant of [<code>PlatformConstants</code>](#Platform.module_PlatformConstants)  
<a name="Platform.module_PlatformConstants..PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES"></a>

### PlatformConstants~PLATFORM\_API\_RESPONSE\_USER\_PERMISSION\_TYPES : <code>Object</code>
Platform response of USER PERMISSION type values.
Schema/map of expected response identity user permission types.

**Kind**: inner constant of [<code>PlatformConstants</code>](#Platform.module_PlatformConstants)  
<a name="Platform.module_PlatformSchemas"></a>

## PlatformSchemas

* [PlatformSchemas](#Platform.module_PlatformSchemas)
    * [~Joi](#Platform.module_PlatformSchemas..Joi) : <code>\*</code>
    * [~userResponseSchema](#Platform.module_PlatformSchemas..userResponseSchema) : <code>\*</code>
    * [~permissionsItem](#Platform.module_PlatformSchemas..permissionsItem) : <code>\*</code>
    * [~permissionsResponseSchema](#Platform.module_PlatformSchemas..permissionsResponseSchema) : <code>\*</code>

<a name="Platform.module_PlatformSchemas..Joi"></a>

### PlatformSchemas~Joi : <code>\*</code>
Extend Joi with date.

**Kind**: inner constant of [<code>PlatformSchemas</code>](#Platform.module_PlatformSchemas)  
<a name="Platform.module_PlatformSchemas..userResponseSchema"></a>

### PlatformSchemas~userResponseSchema : <code>\*</code>
User response item.

**Kind**: inner constant of [<code>PlatformSchemas</code>](#Platform.module_PlatformSchemas)  
<a name="Platform.module_PlatformSchemas..permissionsItem"></a>

### PlatformSchemas~permissionsItem : <code>\*</code>
Permissions response item.

**Kind**: inner constant of [<code>PlatformSchemas</code>](#Platform.module_PlatformSchemas)  
<a name="Platform.module_PlatformSchemas..permissionsResponseSchema"></a>

### PlatformSchemas~permissionsResponseSchema : <code>\*</code>
Authorize response.

**Kind**: inner constant of [<code>PlatformSchemas</code>](#Platform.module_PlatformSchemas)  
<a name="Platform.module_PlatformServices"></a>

## PlatformServices
Emulated service calls for platform globals.


* [PlatformServices](#Platform.module_PlatformServices)
    * [~getUser(options)](#Platform.module_PlatformServices..getUser) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~getUserPermissions(appName, options)](#Platform.module_PlatformServices..getUserPermissions) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~hideGlobalFilter(isHidden)](#Platform.module_PlatformServices..hideGlobalFilter) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~onNavigation(callback)](#Platform.module_PlatformServices..onNavigation) ⇒ <code>function</code>

<a name="Platform.module_PlatformServices..getUser"></a>

### PlatformServices~getUser(options) ⇒ <code>Promise.&lt;\*&gt;</code>
Basic user authentication.

**Kind**: inner method of [<code>PlatformServices</code>](#Platform.module_PlatformServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Platform.module_PlatformServices..getUserPermissions"></a>

### PlatformServices~getUserPermissions(appName, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Basic user permissions.

**Kind**: inner method of [<code>PlatformServices</code>](#Platform.module_PlatformServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>appName</td><td><code>string</code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Platform.module_PlatformServices..hideGlobalFilter"></a>

### PlatformServices~hideGlobalFilter(isHidden) ⇒ <code>Promise.&lt;\*&gt;</code>
Disables the Platform's global filter display.

**Kind**: inner method of [<code>PlatformServices</code>](#Platform.module_PlatformServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>isHidden</td><td><code>boolean</code></td><td><code>true</code></td>
    </tr>  </tbody>
</table>

<a name="Platform.module_PlatformServices..onNavigation"></a>

### PlatformServices~onNavigation(callback) ⇒ <code>function</code>
Apply on "app_navigation" event. Return an un-listener.

**Kind**: inner method of [<code>PlatformServices</code>](#Platform.module_PlatformServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>callback</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="Platform.module_PlatformTransformers"></a>

## PlatformTransformers
Transform platform responses. Replaces selector usage.


* [PlatformTransformers](#Platform.module_PlatformTransformers)
    * [~user(response)](#Platform.module_PlatformTransformers..user) ⇒ <code>object</code>
    * [~userPermissions(response, options)](#Platform.module_PlatformTransformers..userPermissions) ⇒ <code>object</code>

<a name="Platform.module_PlatformTransformers..user"></a>

### PlatformTransformers~user(response) ⇒ <code>object</code>
Parse platform getUser response.

**Kind**: inner method of [<code>PlatformTransformers</code>](#Platform.module_PlatformTransformers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>response</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Platform.module_PlatformTransformers..userPermissions"></a>

### PlatformTransformers~userPermissions(response, options) ⇒ <code>object</code>
Parse platform getUserPermissions response.

**Kind**: inner method of [<code>PlatformTransformers</code>](#Platform.module_PlatformTransformers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>response</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.config</td><td><code>object</code></td><td><p>Pass in a configuration object, RBAC</p>
</td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmConstants"></a>

## RhsmConstants

* [RhsmConstants](#Rhsm.module_RhsmConstants)
    * [~RHSM_API_PATH_PRODUCT_ARCHITECTURE_RHEL_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_PATH_PRODUCT_ARCHITECTURE_RHEL_TYPES) : <code>Object</code>
    * [~RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES) : <code>Object</code>
    * [~RHSM_API_PATH_PRODUCT_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_PATH_PRODUCT_TYPES) : <code>Object</code>
    * [~RHSM_API_PATH_METRIC_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_PATH_METRIC_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_DATA](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_DATA) : <code>string</code>
    * [~RHSM_API_RESPONSE_META](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_META) : <code>string</code>
    * [~RHSM_API_RESPONSE_META_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_META_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_ERRORS](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_ERRORS) : <code>string</code>
    * [~RHSM_API_RESPONSE_ERRORS_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_ERRORS_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_ERRORS_CODE_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_ERRORS_CODE_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_HOSTS_DATA_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_HOSTS_DATA_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_HOSTS_META_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_HOSTS_META_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_INSTANCES_DATA_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_INSTANCES_DATA_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_INSTANCES_META_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_INSTANCES_META_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_GRANULARITY_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_GRANULARITY_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_SLA_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_SLA_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_SUBSCRIPTION_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_SUBSCRIPTION_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_UOM_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_UOM_TYPES) : <code>Object</code>
    * [~RHSM_API_RESPONSE_USAGE_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_USAGE_TYPES) : <code>Object</code>
    * [~RHSM_API_QUERY_CATEGORY_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_QUERY_CATEGORY_TYPES) : <code>Object</code>
    * [~RHSM_API_QUERY_INVENTORY_HOSTS_SORT_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_QUERY_INVENTORY_HOSTS_SORT_TYPES) : <code>Object</code>
    * [~RHSM_API_QUERY_INVENTORY_SORT_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_QUERY_INVENTORY_SORT_TYPES) : <code>Object</code>
    * [~RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES) : <code>Object</code>
    * [~RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES) : <code>Object</code>
    * [~RHSM_API_QUERY_SET_INVENTORY_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_QUERY_SET_INVENTORY_TYPES) : <code>Object</code>
    * [~RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES) : <code>Object</code>
    * [~RHSM_API_QUERY_SET_TYPES](#Rhsm.module_RhsmConstants..RHSM_API_QUERY_SET_TYPES) : <code>Object</code>
    * [~RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES](#Rhsm.module_RhsmConstants..RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES) : <code>Object</code>
    * [~rhsmConstants](#Rhsm.module_RhsmConstants..rhsmConstants) : <code>Object</code>

<a name="Rhsm.module_RhsmConstants..RHSM_API_PATH_PRODUCT_ARCHITECTURE_RHEL_TYPES"></a>

### RhsmConstants~RHSM\_API\_PATH\_PRODUCT\_ARCHITECTURE\_RHEL\_TYPES : <code>Object</code>
RHSM path IDs for product RHEL variants.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_PATH_PRODUCT_VARIANT_SATELLITE_TYPES"></a>

### RhsmConstants~RHSM\_API\_PATH\_PRODUCT\_VARIANT\_SATELLITE\_TYPES : <code>Object</code>
RHSM path IDs for product Satellite variants.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_PATH_PRODUCT_TYPES"></a>

### RhsmConstants~RHSM\_API\_PATH\_PRODUCT\_TYPES : <code>Object</code>
RHSM path IDs for products.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_PATH_METRIC_TYPES"></a>

### RhsmConstants~RHSM\_API\_PATH\_METRIC\_TYPES : <code>Object</code>
RHSM path IDs for metrics.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_DATA"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_DATA : <code>string</code>
RHSM response data type.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_META"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_META : <code>string</code>
RHSM response meta type.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_META_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_META\_TYPES : <code>Object</code>
RHSM response general meta types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_ERRORS"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_ERRORS : <code>string</code>
RHSM response errors type.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_ERRORS_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_ERRORS\_TYPES : <code>Object</code>
RHSM response errors types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_ERRORS_CODE_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_ERRORS\_CODE\_TYPES : <code>Object</code>
RHSM response error codes.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_HOSTS_DATA_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_HOSTS\_DATA\_TYPES : <code>Object</code>
RHSM response Hosts DATA types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_HOSTS_META_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_HOSTS\_META\_TYPES : <code>Object</code>
RHSM response Hosts META types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_INSTANCES_DATA_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_INSTANCES\_DATA\_TYPES : <code>Object</code>
RHSM response Instance DATA types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_INSTANCES_META_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_INSTANCES\_META\_TYPES : <code>Object</code>
RHSM response Instances META types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_SUBSCRIPTIONS\_DATA\_TYPES : <code>Object</code>
RHSM response Subscriptions DATA types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_SUBSCRIPTIONS\_META\_TYPES : <code>Object</code>
RHSM response Subscriptions META types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_TALLY\_CAPACITY\_DATA\_TYPES : <code>Object</code>
RHSM response Tally DATA types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_TALLY_CAPACITY_META_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_TALLY\_CAPACITY\_META\_TYPES : <code>Object</code>
RHSM response Tally META types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_GRANULARITY_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_GRANULARITY\_TYPES : <code>Object</code>
RHSM response, query parameters for GRANULARITY.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_BILLING_PROVIDER_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_BILLING\_PROVIDER\_TYPES : <code>Object</code>
RHSM response, query parameters for BILLING_PROVIDER

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_SLA_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_SLA\_TYPES : <code>Object</code>
RHSM response, query parameters for SLA.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_SUBSCRIPTION_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_SUBSCRIPTION\_TYPES : <code>Object</code>
RHSM response, general parameters for subscription types

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_UOM_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_UOM\_TYPES : <code>Object</code>
RHSM response, query parameters for UOM.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_RESPONSE_USAGE_TYPES"></a>

### RhsmConstants~RHSM\_API\_RESPONSE\_USAGE\_TYPES : <code>Object</code>
RHSM response, query parameters for USAGE.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_QUERY_CATEGORY_TYPES"></a>

### RhsmConstants~RHSM\_API\_QUERY\_CATEGORY\_TYPES : <code>Object</code>
RHSM query/search parameter CATEGORY type values for TALLY/CAPACITY.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_QUERY_INVENTORY_HOSTS_SORT_TYPES"></a>

### RhsmConstants~RHSM\_API\_QUERY\_INVENTORY\_HOSTS\_SORT\_TYPES : <code>Object</code>
RHSM API query/search parameter SORT type values for HOSTS.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_QUERY_INVENTORY_SORT_TYPES"></a>

### RhsmConstants~RHSM\_API\_QUERY\_INVENTORY\_SORT\_TYPES : <code>Object</code>
RHSM API query/search parameter SORT type values for general inventory displays.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES"></a>

### RhsmConstants~RHSM\_API\_QUERY\_INVENTORY\_SORT\_DIRECTION\_TYPES : <code>Object</code>
RHSM API query/search parameter SORT DIRECTION type values.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES"></a>

### RhsmConstants~RHSM\_API\_QUERY\_INVENTORY\_SUBSCRIPTIONS\_SORT\_TYPES : <code>Object</code>
RHSM API query/search parameter SORT type values for SUBSCRIPTIONS.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_QUERY_SET_INVENTORY_TYPES"></a>

### RhsmConstants~RHSM\_API\_QUERY\_SET\_INVENTORY\_TYPES : <code>Object</code>
RHSM API query/search parameter INVENTORY type values.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES"></a>

### RhsmConstants~RHSM\_API\_QUERY\_SET\_TALLY\_CAPACITY\_TYPES : <code>Object</code>
RHSM query parameter options for TALLY, CAPACITY endpoints.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_API_QUERY_SET_TYPES"></a>

### RhsmConstants~RHSM\_API\_QUERY\_SET\_TYPES : <code>Object</code>
Aggregate all query set types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES"></a>

### RhsmConstants~RHSM\_INTERNAL\_PRODUCT\_DISPLAY\_TYPES : <code>Object</code>
Product display types.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmConstants..rhsmConstants"></a>

### RhsmConstants~rhsmConstants : <code>Object</code>
RHSM constants.

**Kind**: inner constant of [<code>RhsmConstants</code>](#Rhsm.module_RhsmConstants)  
<a name="Rhsm.module_RhsmHelpers"></a>

## RhsmHelpers
<a name="Rhsm.module_RhsmHelpers..filterArchitectureVariant"></a>

### RhsmHelpers~filterArchitectureVariant(id, params) ⇒ <code>string</code>
Patch for returning a made up API architecture, variant param as a product ID

**Kind**: inner method of [<code>RhsmHelpers</code>](#Rhsm.module_RhsmHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td>
    </tr><tr>
    <td>params</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmSchemas"></a>

## RhsmSchemas

* [RhsmSchemas](#Rhsm.module_RhsmSchemas)
    * [~Joi](#Rhsm.module_RhsmSchemas..Joi) : <code>\*</code>
    * [~errorItem](#Rhsm.module_RhsmSchemas..errorItem) : <code>\*</code>
    * [~errorResponseSchema](#Rhsm.module_RhsmSchemas..errorResponseSchema) : <code>\*</code>
    * [~metaResponseSchema](#Rhsm.module_RhsmSchemas..metaResponseSchema) : <code>\*</code>
    * [~capacityMetaSchema](#Rhsm.module_RhsmSchemas..capacityMetaSchema) : <code>\*</code>
    * [~capacityItem](#Rhsm.module_RhsmSchemas..capacityItem) : <code>\*</code>
    * [~capacityResponseSchema](#Rhsm.module_RhsmSchemas..capacityResponseSchema) : <code>\*</code>
    * [~guestsMetaSchema](#Rhsm.module_RhsmSchemas..guestsMetaSchema) : <code>\*</code>
    * [~guestsItem](#Rhsm.module_RhsmSchemas..guestsItem) : <code>\*</code>
    * [~guestsResponseSchema](#Rhsm.module_RhsmSchemas..guestsResponseSchema) : <code>\*</code>
    * [~hostsMetaSchema](#Rhsm.module_RhsmSchemas..hostsMetaSchema) : <code>\*</code>
    * [~hostsItem](#Rhsm.module_RhsmSchemas..hostsItem) : <code>\*</code>
    * [~hostsResponseSchema](#Rhsm.module_RhsmSchemas..hostsResponseSchema) : <code>\*</code>
    * [~instancesMetaSchema](#Rhsm.module_RhsmSchemas..instancesMetaSchema) : <code>\*</code>
    * [~instancesItem](#Rhsm.module_RhsmSchemas..instancesItem) : <code>\*</code>
    * [~instancesResponseSchema](#Rhsm.module_RhsmSchemas..instancesResponseSchema) : <code>\*</code>
    * [~subscriptionsMetaSchema](#Rhsm.module_RhsmSchemas..subscriptionsMetaSchema) : <code>\*</code>
    * [~subscriptionsItem](#Rhsm.module_RhsmSchemas..subscriptionsItem) : <code>\*</code>
    * [~subscriptionsResponseSchema](#Rhsm.module_RhsmSchemas..subscriptionsResponseSchema) : <code>\*</code>
    * [~tallyItem](#Rhsm.module_RhsmSchemas..tallyItem) : <code>\*</code>
    * [~tallyMetaSchema](#Rhsm.module_RhsmSchemas..tallyMetaSchema) : <code>\*</code>
    * [~tallyResponseSchema](#Rhsm.module_RhsmSchemas..tallyResponseSchema) : <code>\*</code>

<a name="Rhsm.module_RhsmSchemas..Joi"></a>

### RhsmSchemas~Joi : <code>\*</code>
Extend Joi with date.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..errorItem"></a>

### RhsmSchemas~errorItem : <code>\*</code>
Error response item.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..errorResponseSchema"></a>

### RhsmSchemas~errorResponseSchema : <code>\*</code>
Error response.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..metaResponseSchema"></a>

### RhsmSchemas~metaResponseSchema : <code>\*</code>
RHSM base response meta field.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..capacityMetaSchema"></a>

### RhsmSchemas~capacityMetaSchema : <code>\*</code>
Capacity response meta field.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..capacityItem"></a>

### RhsmSchemas~capacityItem : <code>\*</code>
Capacity response item.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..capacityResponseSchema"></a>

### RhsmSchemas~capacityResponseSchema : <code>\*</code>
Capacity response.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..guestsMetaSchema"></a>

### RhsmSchemas~guestsMetaSchema : <code>\*</code>
Guests response meta field.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..guestsItem"></a>

### RhsmSchemas~guestsItem : <code>\*</code>
Guests response item.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..guestsResponseSchema"></a>

### RhsmSchemas~guestsResponseSchema : <code>\*</code>
Guests response.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..hostsMetaSchema"></a>

### RhsmSchemas~hostsMetaSchema : <code>\*</code>
Hosts response meta field.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..hostsItem"></a>

### RhsmSchemas~hostsItem : <code>\*</code>
Hosts response item.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..hostsResponseSchema"></a>

### RhsmSchemas~hostsResponseSchema : <code>\*</code>
Hosts response.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..instancesMetaSchema"></a>

### RhsmSchemas~instancesMetaSchema : <code>\*</code>
Instances response meta field.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..instancesItem"></a>

### RhsmSchemas~instancesItem : <code>\*</code>
Instances response item.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..instancesResponseSchema"></a>

### RhsmSchemas~instancesResponseSchema : <code>\*</code>
Instances response.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..subscriptionsMetaSchema"></a>

### RhsmSchemas~subscriptionsMetaSchema : <code>\*</code>
Subscriptions response meta field.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..subscriptionsItem"></a>

### RhsmSchemas~subscriptionsItem : <code>\*</code>
Subscriptions response item.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..subscriptionsResponseSchema"></a>

### RhsmSchemas~subscriptionsResponseSchema : <code>\*</code>
Subscriptions response.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..tallyItem"></a>

### RhsmSchemas~tallyItem : <code>\*</code>
Tally and capacity metric response item.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..tallyMetaSchema"></a>

### RhsmSchemas~tallyMetaSchema : <code>\*</code>
Tally response meta field.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmSchemas..tallyResponseSchema"></a>

### RhsmSchemas~tallyResponseSchema : <code>\*</code>
Tally response.

**Kind**: inner constant of [<code>RhsmSchemas</code>](#Rhsm.module_RhsmSchemas)  
<a name="Rhsm.module_RhsmServices"></a>

## RhsmServices
RHSM API service calls.


* [RhsmServices](#Rhsm.module_RhsmServices)
    * [~getApiVersion(options)](#Rhsm.module_RhsmServices..getApiVersion) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~getGraphReports(id, params, options)](#Rhsm.module_RhsmServices..getGraphReports) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~getGraphCapacity(id, params, options)](#Rhsm.module_RhsmServices..getGraphCapacity) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~getHostsInventory(id, params, options)](#Rhsm.module_RhsmServices..getHostsInventory) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~getHostsInventoryGuests(id, params, options)](#Rhsm.module_RhsmServices..getHostsInventoryGuests) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~getInstancesInventory(id, params, options)](#Rhsm.module_RhsmServices..getInstancesInventory) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~getSubscriptionsInventory(id, params, options)](#Rhsm.module_RhsmServices..getSubscriptionsInventory) ⇒ <code>Promise.&lt;\*&gt;</code>

<a name="Rhsm.module_RhsmServices..getApiVersion"></a>

### RhsmServices~getApiVersion(options) ⇒ <code>Promise.&lt;\*&gt;</code>
Get RHSM API version information.

**Kind**: inner method of [<code>RhsmServices</code>](#Rhsm.module_RhsmServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.cancel</td><td><code>boolean</code></td>
    </tr><tr>
    <td>options.cancelId</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmServices..getGraphReports"></a>

### RhsmServices~getGraphReports(id, params, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Get RHSM API reporting/tally graph/chart data.

**Kind**: inner method of [<code>RhsmServices</code>](#Rhsm.module_RhsmServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><p>Product ID</p>
</td>
    </tr><tr>
    <td>params</td><td><code>object</code></td><td><p>Query/search params</p>
</td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.cancel</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.cancelId</td><td><code>string</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmServices..getGraphCapacity"></a>

### RhsmServices~getGraphCapacity(id, params, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Get RHSM API capacity/threshold graph/chart data.

**Kind**: inner method of [<code>RhsmServices</code>](#Rhsm.module_RhsmServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code> | <code>Array</code></td><td><p>String ID, or an array of identifiers to update a dotenv url path</p>
</td>
    </tr><tr>
    <td>params</td><td><code>object</code></td><td><p>Query/search params</p>
</td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.cancel</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.cancelId</td><td><code>string</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmServices..getHostsInventory"></a>

### RhsmServices~getHostsInventory(id, params, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Get RHSM API hosts table/inventory data.

**Kind**: inner method of [<code>RhsmServices</code>](#Rhsm.module_RhsmServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><p>Product ID</p>
</td>
    </tr><tr>
    <td>params</td><td><code>object</code></td><td><p>Query/search params</p>
</td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.cancel</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.cancelId</td><td><code>string</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmServices..getHostsInventoryGuests"></a>

### RhsmServices~getHostsInventoryGuests(id, params, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Get RHSM API hosts table/inventory guests data.

**Kind**: inner method of [<code>RhsmServices</code>](#Rhsm.module_RhsmServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><p>Subscription Manager ID</p>
</td>
    </tr><tr>
    <td>params</td><td><code>object</code></td><td><p>Query/search params</p>
</td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.cache</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.cancel</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.cancelId</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>options.schema</td><td><code>Array</code></td><td><p>An array of callbacks used to transform the response, ie. [SUCCESS SCHEMA, ERROR SCHEMA]</p>
</td>
    </tr><tr>
    <td>options.transform</td><td><code>Array</code></td><td><p>An array of callbacks used to transform the response, ie. [SUCCESS TRANSFORM, ERROR TRANSFORM]</p>
</td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmServices..getInstancesInventory"></a>

### RhsmServices~getInstancesInventory(id, params, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Get RHSM API instances data.

**Kind**: inner method of [<code>RhsmServices</code>](#Rhsm.module_RhsmServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><p>Product ID</p>
</td>
    </tr><tr>
    <td>params</td><td><code>object</code></td><td><p>Query/search params</p>
</td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.cache</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.cancel</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.cancelId</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>options.schema</td><td><code>Array</code></td><td><p>An array of callbacks used to transform the response, ie. [SUCCESS SCHEMA, ERROR SCHEMA]</p>
</td>
    </tr><tr>
    <td>options.transform</td><td><code>Array</code></td><td><p>An array of callbacks used to transform the response, ie. [SUCCESS TRANSFORM, ERROR TRANSFORM]</p>
</td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmServices..getSubscriptionsInventory"></a>

### RhsmServices~getSubscriptionsInventory(id, params, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Get RHSM API subscriptions data.

**Kind**: inner method of [<code>RhsmServices</code>](#Rhsm.module_RhsmServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><p>Product ID</p>
</td>
    </tr><tr>
    <td>params</td><td><code>object</code></td><td><p>Query/search params</p>
</td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.cache</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.cancel</td><td><code>boolean</code></td><td></td>
    </tr><tr>
    <td>options.cancelId</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>options.schema</td><td><code>Array</code></td><td><p>An array of callbacks used to transform the response, ie. [SUCCESS SCHEMA, ERROR SCHEMA]</p>
</td>
    </tr><tr>
    <td>options.transform</td><td><code>Array</code></td><td><p>An array of callbacks used to transform the response, ie. [SUCCESS TRANSFORM, ERROR TRANSFORM]</p>
</td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmTransformers"></a>

## RhsmTransformers
Transform RHSM responses. Replaces selector usage.


* [RhsmTransformers](#Rhsm.module_RhsmTransformers)
    * [~rhsmHosts(response)](#Rhsm.module_RhsmTransformers..rhsmHosts) ⇒ <code>object</code>
    * [~rhsmInstances(response)](#Rhsm.module_RhsmTransformers..rhsmInstances) ⇒ <code>object</code>
    * [~rhsmTallyCapacity(response, config)](#Rhsm.module_RhsmTransformers..rhsmTallyCapacity) ⇒ <code>object</code>

<a name="Rhsm.module_RhsmTransformers..rhsmHosts"></a>

### RhsmTransformers~rhsmHosts(response) ⇒ <code>object</code>
Parse RHSM hosts response for caching.

**Kind**: inner method of [<code>RhsmTransformers</code>](#Rhsm.module_RhsmTransformers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>response</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmTransformers..rhsmInstances"></a>

### RhsmTransformers~rhsmInstances(response) ⇒ <code>object</code>
Parse RHSM instances response for caching.

**Kind**: inner method of [<code>RhsmTransformers</code>](#Rhsm.module_RhsmTransformers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>response</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Rhsm.module_RhsmTransformers..rhsmTallyCapacity"></a>

### RhsmTransformers~rhsmTallyCapacity(response, config) ⇒ <code>object</code>
Parse RHSM tally response for caching.

**Kind**: inner method of [<code>RhsmTransformers</code>](#Rhsm.module_RhsmTransformers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>response</td><td><code>object</code></td>
    </tr><tr>
    <td>config</td><td><code>object</code></td>
    </tr><tr>
    <td>config._isCapacity</td><td><code>boolean</code></td>
    </tr><tr>
    <td>config.params</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="User.module_UserServices"></a>

## UserServices
User, and RHSM, calls for locale and Opt-In.


* [UserServices](#User.module_UserServices)
    * [~getLocale()](#User.module_UserServices..getLocale) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~deleteAccountOptIn()](#User.module_UserServices..deleteAccountOptIn) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~getAccountOptIn(options)](#User.module_UserServices..getAccountOptIn) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [~updateAccountOptIn(params)](#User.module_UserServices..updateAccountOptIn) ⇒ <code>Promise.&lt;\*&gt;</code>

<a name="User.module_UserServices..getLocale"></a>

### UserServices~getLocale() ⇒ <code>Promise.&lt;\*&gt;</code>
Return a browser locale, or fallback towards the platform locale cookie

**Kind**: inner method of [<code>UserServices</code>](#User.module_UserServices)  
<a name="User.module_UserServices..deleteAccountOptIn"></a>

### UserServices~deleteAccountOptIn() ⇒ <code>Promise.&lt;\*&gt;</code>
Delete a RHSM account opt-in config.

**Kind**: inner method of [<code>UserServices</code>](#User.module_UserServices)  
<a name="User.module_UserServices..getAccountOptIn"></a>

### UserServices~getAccountOptIn(options) ⇒ <code>Promise.&lt;\*&gt;</code>
Get a RHSM account opt-in config.

**Kind**: inner method of [<code>UserServices</code>](#User.module_UserServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.cancel</td><td><code>boolean</code></td>
    </tr><tr>
    <td>options.cancelId</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="User.module_UserServices..updateAccountOptIn"></a>

### UserServices~updateAccountOptIn(params) ⇒ <code>Promise.&lt;\*&gt;</code>
Update a RHSM account opt-in config.

**Kind**: inner method of [<code>UserServices</code>](#User.module_UserServices)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>params</td><td><code>object</code></td><td><p>Query/search params</p>
</td>
    </tr>  </tbody>
</table>

<a name="Services"></a>

## Services : <code>object</code>
**Kind**: global namespace  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>Helpers</td><td><code>module</code></td>
    </tr><tr>
    <td>Platform</td><td><code>module</code></td>
    </tr><tr>
    <td>Rhsm</td><td><code>module</code></td>
    </tr><tr>
    <td>User</td><td><code>module</code></td>
    </tr>  </tbody>
</table>

<a name="serviceConfig"></a>

## serviceConfig(passedConfig) ⇒ <code>object</code>
Apply a global custom service configuration.

**Kind**: global function  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>passedConfig</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="serviceCall"></a>

## serviceCall(config) ⇒ <code>Promise.&lt;\*&gt;</code>
Use a global Axios configuration.

**Kind**: global function  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>config</td><td><code>object</code></td>
    </tr><tr>
    <td>config.cache</td><td><code>object</code></td>
    </tr><tr>
    <td>config.cancel</td><td><code>boolean</code></td>
    </tr><tr>
    <td>config.cancelId</td><td><code>string</code></td>
    </tr><tr>
    <td>config.params</td><td><code>object</code></td>
    </tr><tr>
    <td>config.schema</td><td><code>Array</code></td>
    </tr><tr>
    <td>config.transform</td><td><code>Array</code></td>
    </tr><tr>
    <td>config.url</td><td><code>string</code> | <code>function</code></td>
    </tr>  </tbody>
</table>
