## Modules

<dl>
<dt><a href="#Actions.module_PlatformActions">PlatformActions</a></dt>
<dd><p>Platform service wrappers for dispatch, state update.</p>
</dd>
<dt><a href="#Actions.module_RhsmActions">RhsmActions</a></dt>
<dd><p>RHSM service wrappers for dispatch, state update.</p>
</dd>
<dt><a href="#Actions.module_UserActions">UserActions</a></dt>
<dd><p>User, and RHSM, service wrappers for dispatch, state update.</p>
</dd>
<dt><a href="#Helpers.module_ReduxHelpers">ReduxHelpers</a></dt>
<dd></dd>
<dt><a href="#Hooks.module_UseReactRedux">UseReactRedux</a></dt>
<dd><p>State hooks and helpers for dispatch and selectors.</p>
</dd>
<dt><a href="#Middleware.module_ActionRecordMiddleware">ActionRecordMiddleware</a></dt>
<dd></dd>
<dt><a href="#Middleware.module_MultiActionMiddleware">MultiActionMiddleware</a></dt>
<dd></dd>
<dt><a href="#Middleware.module_StatusMiddleware">StatusMiddleware</a></dt>
<dd></dd>
<dt><a href="#Reducers.module_GraphReducer">GraphReducer</a></dt>
<dd><p>Graph/Chart related API and user state reducer.</p>
</dd>
<dt><a href="#Reducers.module_InventoryReducer">InventoryReducer</a></dt>
<dd><p>Inventory, and tabs, related API and user state reducer.</p>
</dd>
<dt><a href="#Reducers.module_MessagesReducer">MessagesReducer</a></dt>
<dd><p>Banner messages related API state reducer.</p>
</dd>
<dt><a href="#Reducers.module_ToolbarReducer">ToolbarReducer</a></dt>
<dd><p>Toolbar related user state reducer.</p>
</dd>
<dt><a href="#Reducers.module_UserReducer">UserReducer</a></dt>
<dd><p>User related API, platform and user state reducer.</p>
</dd>
<dt><a href="#Reducers.module_ViewReducer">ViewReducer</a></dt>
<dd><p>View query related user state reducer.</p>
</dd>
<dt><a href="#Redux State.module_Store">Store</a></dt>
<dd><p>Redux store setup.</p>
</dd>
<dt><a href="#Types.module_ReduxTypes">ReduxTypes</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#reduxMiddleware">reduxMiddleware</a> : <code>Array</code></dt>
<dd><p>Redux middleware.</p>
</dd>
</dl>

<a name="Actions.module_PlatformActions"></a>

## PlatformActions
Platform service wrappers for dispatch, state update.


* [PlatformActions](#Actions.module_PlatformActions)
    * [~addNotification(data)](#Actions.module_PlatformActions..addNotification) ⇒ <code>\*</code>
    * [~removeNotification(id)](#Actions.module_PlatformActions..removeNotification) ⇒ <code>\*</code>
    * [~clearNotifications()](#Actions.module_PlatformActions..clearNotifications) ⇒ <code>\*</code>
    * [~authorizeUser(appName)](#Actions.module_PlatformActions..authorizeUser) ⇒ <code>function</code>
    * [~hideGlobalFilter(isHidden)](#Actions.module_PlatformActions..hideGlobalFilter) ⇒ <code>Object</code>

<a name="Actions.module_PlatformActions..addNotification"></a>

### PlatformActions~addNotification(data) ⇒ <code>\*</code>
Add a platform plugin toast notification.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>data</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Actions.module_PlatformActions..removeNotification"></a>

### PlatformActions~removeNotification(id) ⇒ <code>\*</code>
Remove a platform plugin toast notification.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Actions.module_PlatformActions..clearNotifications"></a>

### PlatformActions~clearNotifications() ⇒ <code>\*</code>
Clear all platform plugin toast notifications.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  
<a name="Actions.module_PlatformActions..authorizeUser"></a>

### PlatformActions~authorizeUser(appName) ⇒ <code>function</code>
Get an emulated and combined API response from the platforms "getUser" and "getUserPermissions" global methods.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>appName</td><td><code>string</code> | <code>Array</code></td>
    </tr>  </tbody>
</table>

<a name="Actions.module_PlatformActions..hideGlobalFilter"></a>

### PlatformActions~hideGlobalFilter(isHidden) ⇒ <code>Object</code>
Hide platform global filter.

**Kind**: inner method of [<code>PlatformActions</code>](#Actions.module_PlatformActions)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>isHidden</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>

<a name="Actions.module_RhsmActions"></a>

## RhsmActions
RHSM service wrappers for dispatch, state update.


* [RhsmActions](#Actions.module_RhsmActions)
    * [~getGraphMetrics(idMetric, query, options)](#Actions.module_RhsmActions..getGraphMetrics) ⇒ <code>function</code>
    * [~getInstancesInventory(id, query)](#Actions.module_RhsmActions..getInstancesInventory) ⇒ <code>function</code>
    * [~getInstancesInventoryGuests(id, query)](#Actions.module_RhsmActions..getInstancesInventoryGuests) ⇒ <code>function</code>
    * [~getSubscriptionsInventory(id, query)](#Actions.module_RhsmActions..getSubscriptionsInventory) ⇒ <code>function</code>

<a name="Actions.module_RhsmActions..getGraphMetrics"></a>

### RhsmActions~getGraphMetrics(idMetric, query, options) ⇒ <code>function</code>
Get a RHSM response from multiple Tally, or Capacity, IDs and metrics.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>idMetric</td><td><code>object</code> | <code>Array</code></td><td><p>An object, or an Array of objects, in the form of { id: PRODUCT_ID, metric: METRIC_ID,
    isCapacity: boolean }</p>
</td>
    </tr><tr>
    <td>query</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.cancelId</td><td><code>string</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Actions.module_RhsmActions..getInstancesInventory"></a>

### RhsmActions~getInstancesInventory(id, query) ⇒ <code>function</code>
Get an instances response listing from RHSM subscriptions.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><code>null</code></td>
    </tr><tr>
    <td>query</td><td><code>object</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Actions.module_RhsmActions..getInstancesInventoryGuests"></a>

### RhsmActions~getInstancesInventoryGuests(id, query) ⇒ <code>function</code>
Get an instance guest response listing from RHSM subscriptions.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><code>null</code></td>
    </tr><tr>
    <td>query</td><td><code>object</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Actions.module_RhsmActions..getSubscriptionsInventory"></a>

### RhsmActions~getSubscriptionsInventory(id, query) ⇒ <code>function</code>
Get a subscriptions response from RHSM subscriptions.

**Kind**: inner method of [<code>RhsmActions</code>](#Actions.module_RhsmActions)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><code>null</code></td>
    </tr><tr>
    <td>query</td><td><code>object</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Actions.module_UserActions"></a>

## UserActions
User, and RHSM, service wrappers for dispatch, state update.


* [UserActions](#Actions.module_UserActions)
    * [~getLocale()](#Actions.module_UserActions..getLocale) ⇒ <code>Object</code>
    * [~deleteAccountOptIn()](#Actions.module_UserActions..deleteAccountOptIn) ⇒ <code>function</code>
    * [~getAccountOptIn()](#Actions.module_UserActions..getAccountOptIn) ⇒ <code>function</code>
    * [~updateAccountOptIn(query)](#Actions.module_UserActions..updateAccountOptIn) ⇒ <code>function</code>

<a name="Actions.module_UserActions..getLocale"></a>

### UserActions~getLocale() ⇒ <code>Object</code>
Get a user's locale.

**Kind**: inner method of [<code>UserActions</code>](#Actions.module_UserActions)  
<a name="Actions.module_UserActions..deleteAccountOptIn"></a>

### UserActions~deleteAccountOptIn() ⇒ <code>function</code>
Delete a user's opt-in.

**Kind**: inner method of [<code>UserActions</code>](#Actions.module_UserActions)  
<a name="Actions.module_UserActions..getAccountOptIn"></a>

### UserActions~getAccountOptIn() ⇒ <code>function</code>
Get a user's opt-in config.

**Kind**: inner method of [<code>UserActions</code>](#Actions.module_UserActions)  
<a name="Actions.module_UserActions..updateAccountOptIn"></a>

### UserActions~updateAccountOptIn(query) ⇒ <code>function</code>
Update a user's opt-in.

**Kind**: inner method of [<code>UserActions</code>](#Actions.module_UserActions)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>query</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers"></a>

## ReduxHelpers

* [ReduxHelpers](#Helpers.module_ReduxHelpers)
    * [~FULFILLED_ACTION(base)](#Helpers.module_ReduxHelpers..FULFILLED_ACTION) ⇒ <code>string</code>
    * [~PENDING_ACTION(base)](#Helpers.module_ReduxHelpers..PENDING_ACTION) ⇒ <code>string</code>
    * [~REJECTED_ACTION(base)](#Helpers.module_ReduxHelpers..REJECTED_ACTION) ⇒ <code>string</code>
    * [~HTTP_STATUS_RANGE(status)](#Helpers.module_ReduxHelpers..HTTP_STATUS_RANGE) ⇒ <code>string</code>
    * [~setApiQuery(values, schema, [initialValue])](#Helpers.module_ReduxHelpers..setApiQuery) ⇒ <code>object</code>
    * [~setResponseSchemas(schemas, [initialValue])](#Helpers.module_ReduxHelpers..setResponseSchemas) ⇒ <code>Array</code>
    * [~setNormalizedResponse(...responses)](#Helpers.module_ReduxHelpers..setNormalizedResponse) ⇒ <code>Array</code>
    * [~getSingleResponseFromResultArray(results)](#Helpers.module_ReduxHelpers..getSingleResponseFromResultArray) ⇒ <code>object</code>
    * [~getMessageFromResults(results)](#Helpers.module_ReduxHelpers..getMessageFromResults) ⇒ <code>string</code> \| <code>null</code> \| <code>\*</code>
    * [~getDateFromResults(results)](#Helpers.module_ReduxHelpers..getDateFromResults) ⇒ <code>null</code> \| <code>string</code> \| <code>Date</code>
    * [~getStatusFromResults(results)](#Helpers.module_ReduxHelpers..getStatusFromResults) ⇒ <code>number</code>
    * [~setStateProp(prop, data, options)](#Helpers.module_ReduxHelpers..setStateProp) ⇒ <code>object</code>
    * [~singlePromiseDataResponseFromArray(results)](#Helpers.module_ReduxHelpers..singlePromiseDataResponseFromArray) ⇒ <code>Array</code> \| <code>object</code>
    * [~getDataFromResults(results)](#Helpers.module_ReduxHelpers..getDataFromResults) ⇒ <code>Array</code> \| <code>object</code>
    * [~generatedPromiseActionReducer(types, state, action)](#Helpers.module_ReduxHelpers..generatedPromiseActionReducer) ⇒ <code>object</code>

<a name="Helpers.module_ReduxHelpers..FULFILLED_ACTION"></a>

### ReduxHelpers~FULFILLED\_ACTION(base) ⇒ <code>string</code>
Apply a "fulfilled" suffix for Redux Promise Middleware action responses.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>base</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..PENDING_ACTION"></a>

### ReduxHelpers~PENDING\_ACTION(base) ⇒ <code>string</code>
Apply a "pending" suffix for Redux Promise Middleware action responses.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>base</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..REJECTED_ACTION"></a>

### ReduxHelpers~REJECTED\_ACTION(base) ⇒ <code>string</code>
Apply a "rejected" suffix for Redux Promise Middleware action responses.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>base</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..HTTP_STATUS_RANGE"></a>

### ReduxHelpers~HTTP\_STATUS\_RANGE(status) ⇒ <code>string</code>
Apply a "status range" suffix for Status Middleware action responses.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>status</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..setApiQuery"></a>

### ReduxHelpers~setApiQuery(values, schema, [initialValue]) ⇒ <code>object</code>
Set an API query based on specific API "acceptable values" schema.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>values</td><td><code>object</code></td>
    </tr><tr>
    <td>schema</td><td><code>object</code></td>
    </tr><tr>
    <td>[initialValue]</td><td><code>*</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..setResponseSchemas"></a>

### ReduxHelpers~setResponseSchemas(schemas, [initialValue]) ⇒ <code>Array</code>
Apply a set of schemas using either an array of objects in the
form of [{ madeUpKey: 'some_api_key' }], or an array of arrays
in the form of [['some_api_key','another_api_key']]

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>schemas</td><td><code>Array</code></td>
    </tr><tr>
    <td>[initialValue]</td><td><code>*</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..setNormalizedResponse"></a>

### ReduxHelpers~setNormalizedResponse(...responses) ⇒ <code>Array</code>
Normalize an API response.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>...responses</td><td><code>*</code></td>
    </tr><tr>
    <td>responses.response</td><td><code>object</code></td>
    </tr><tr>
    <td>responses.response.schema</td><td><code>object</code></td>
    </tr><tr>
    <td>responses.response.data</td><td><code>Array</code> | <code>object</code></td>
    </tr><tr>
    <td>responses.response.keyCase</td><td><code>string</code></td>
    </tr><tr>
    <td>responses.response.customResponseEntry</td><td><code>function</code></td>
    </tr><tr>
    <td>responses.response.customResponseValue</td><td><code>function</code></td>
    </tr><tr>
    <td>responses.response.keyPrefix</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..getSingleResponseFromResultArray"></a>

### ReduxHelpers~getSingleResponseFromResultArray(results) ⇒ <code>object</code>
Create a single response from an array of service call responses.
Aids in handling a Promise.all response.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>results</td><td><code>Array</code> | <code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..getMessageFromResults"></a>

### ReduxHelpers~getMessageFromResults(results) ⇒ <code>string</code> \| <code>null</code> \| <code>\*</code>
Get a http status message from a service call.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>results</td><td><code>Array</code> | <code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..getDateFromResults"></a>

### ReduxHelpers~getDateFromResults(results) ⇒ <code>null</code> \| <code>string</code> \| <code>Date</code>
Get a date string from a service call.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>results</td><td><code>Array</code> | <code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..getStatusFromResults"></a>

### ReduxHelpers~getStatusFromResults(results) ⇒ <code>number</code>
Get a http status from a service call response.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>results</td><td><code>Array</code> | <code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..setStateProp"></a>

### ReduxHelpers~setStateProp(prop, data, options) ⇒ <code>object</code>
Convenience method for setting object properties, specifically Redux reducer based state objects.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>prop</td><td><code>string</code></td>
    </tr><tr>
    <td>data</td><td><code>object</code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.state</td><td><code>object</code></td>
    </tr><tr>
    <td>options.initialState</td><td><code>object</code></td>
    </tr><tr>
    <td>options.reset</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..singlePromiseDataResponseFromArray"></a>

### ReduxHelpers~singlePromiseDataResponseFromArray(results) ⇒ <code>Array</code> \| <code>object</code>
Retrieve a data property either from an array of responses, or a single response.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>results</td><td><code>Array</code> | <code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..getDataFromResults"></a>

### ReduxHelpers~getDataFromResults(results) ⇒ <code>Array</code> \| <code>object</code>
Alias for singlePromiseDataResponseFromArray.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>results</td><td><code>Array</code> | <code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Helpers.module_ReduxHelpers..generatedPromiseActionReducer"></a>

### ReduxHelpers~generatedPromiseActionReducer(types, state, action) ⇒ <code>object</code>
Automatically apply reducer logic to state by handling promise responses from redux-promise-middleware.

**Kind**: inner method of [<code>ReduxHelpers</code>](#Helpers.module_ReduxHelpers)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>types</td><td><code>Array</code></td>
    </tr><tr>
    <td>state</td><td><code>object</code></td>
    </tr><tr>
    <td>action</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>type</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="Hooks.module_UseReactRedux"></a>

## UseReactRedux
State hooks and helpers for dispatch and selectors.


* [UseReactRedux](#Hooks.module_UseReactRedux)
    * [~deepEqual](#Hooks.module_UseReactRedux..deepEqual) ⇒ <code>boolean</code>
    * [~createSimpleSelector(selectors, callback)](#Hooks.module_UseReactRedux..createSimpleSelector) ⇒ <code>function</code>
    * [~useDispatch()](#Hooks.module_UseReactRedux..useDispatch) ⇒ <code>function</code>
    * [~useSelector(selector, value, options)](#Hooks.module_UseReactRedux..useSelector) ⇒ <code>\*</code>
    * [~useSelectors(selectors, value, options)](#Hooks.module_UseReactRedux..useSelectors) ⇒ <code>Array</code> \| <code>object</code>
    * [~useSelectorsResponse(selectors, options)](#Hooks.module_UseReactRedux..useSelectorsResponse) ⇒ <code>Object</code>
    * [~useSelectorsAllSettledResponse(selectors, options)](#Hooks.module_UseReactRedux..useSelectorsAllSettledResponse) ⇒ <code>Object</code>
    * [~useSelectorsAnyResponse(selectors, options)](#Hooks.module_UseReactRedux..useSelectorsAnyResponse) ⇒ <code>Object</code>
    * [~useSelectorsRaceResponse(selectors, options)](#Hooks.module_UseReactRedux..useSelectorsRaceResponse) ⇒ <code>Object</code>

<a name="Hooks.module_UseReactRedux..deepEqual"></a>

### UseReactRedux~deepEqual ⇒ <code>boolean</code>
Deep equal comparison with extended memoized cache. Is argument A equal to argument B.

**Kind**: inner constant of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>args</td><td><code>object</code></td>
    </tr><tr>
    <td>args.A</td><td><code>object</code> | <code>any</code></td>
    </tr><tr>
    <td>args.B</td><td><code>object</code> | <code>any</code></td>
    </tr>  </tbody>
</table>

<a name="Hooks.module_UseReactRedux..createSimpleSelector"></a>

### UseReactRedux~createSimpleSelector(selectors, callback) ⇒ <code>function</code>
Create a simple selector. Groups selector function arguments into a single memoized result function for
use as a Redux selector.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>selectors</td><td><code>function</code> | <code>Array.&lt;function()&gt;</code></td>
    </tr><tr>
    <td>callback</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="Hooks.module_UseReactRedux..useDispatch"></a>

### UseReactRedux~useDispatch() ⇒ <code>function</code>
Wrapper for store.dispatch, emulating useDispatch.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<a name="Hooks.module_UseReactRedux..useSelector"></a>

### UseReactRedux~useSelector(selector, value, options) ⇒ <code>\*</code>
Wrapper for Redux hook, useSelector. Applies test mode and a fallback value.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>selector</td><td><code>function</code></td><td></td>
    </tr><tr>
    <td>value</td><td><code>*</code></td><td><code></code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.equality</td><td><code>*</code></td><td></td>
    </tr><tr>
    <td>options.useSelector</td><td><code>function</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Hooks.module_UseReactRedux..useSelectors"></a>

### UseReactRedux~useSelectors(selectors, value, options) ⇒ <code>Array</code> \| <code>object</code>
Generate a selector from multiple selectors for use in "useSelector".

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>selectors</td><td><code>Array</code> | <code>function</code></td><td><p>A selector function or array of functions. Or an array of objects in the form of
    { selector: Function, id: string } If an &quot;ID&quot; is used for each selector the returned response will be in the
    form of an object whose properties reflect said IDs with the associated selector value.</p>
</td>
    </tr><tr>
    <td>value</td><td><code>*</code></td><td><p>Pass-through value similar to charging the response.</p>
</td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.useSelector</td><td><code>function</code></td><td></td>
    </tr><tr>
    <td>options.equality</td><td><code>*</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="Hooks.module_UseReactRedux..useSelectorsResponse"></a>

### UseReactRedux~useSelectorsResponse(selectors, options) ⇒ <code>Object</code>
Return a combined selector response using a "Promise.all" like response.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>selectors</td><td><code>Array</code> | <code>function</code></td><td><p>A selector function or array of functions. Or an array of objects in the form of
    { selector: Function, id: string } If an &quot;ID&quot; is used for each selector the returned response will be in the
    form of an object whose properties reflect said IDs with the associated selector value.</p>
</td>
    </tr><tr>
    <td>options</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>options.useSelectors</td><td><code>function</code></td><td></td>
    </tr><tr>
    <td>options.customResponse</td><td><code>function</code></td><td><p>Callback for customizing your own response</p>
</td>
    </tr>  </tbody>
</table>

<a name="Hooks.module_UseReactRedux..useSelectorsAllSettledResponse"></a>

### UseReactRedux~useSelectorsAllSettledResponse(selectors, options) ⇒ <code>Object</code>
Return a combined selector response using a "Promise.allSettled" like response.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>selectors</td><td><code>Array</code> | <code>function</code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.useSelectorsResponse</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="Hooks.module_UseReactRedux..useSelectorsAnyResponse"></a>

### UseReactRedux~useSelectorsAnyResponse(selectors, options) ⇒ <code>Object</code>
Return a combined selector response using a "Promise.any" like response.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>selectors</td><td><code>Array</code> | <code>function</code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.useSelectorsResponse</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="Hooks.module_UseReactRedux..useSelectorsRaceResponse"></a>

### UseReactRedux~useSelectorsRaceResponse(selectors, options) ⇒ <code>Object</code>
Return a combined selector response using a "Promise.race" like response.

**Kind**: inner method of [<code>UseReactRedux</code>](#Hooks.module_UseReactRedux)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>selectors</td><td><code>Array</code> | <code>function</code></td>
    </tr><tr>
    <td>options</td><td><code>object</code></td>
    </tr><tr>
    <td>options.useSelectorsResponse</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="Middleware.module_ActionRecordMiddleware"></a>

## ActionRecordMiddleware

* [ActionRecordMiddleware](#Middleware.module_ActionRecordMiddleware)
    * [~sanitizeActionHeaders(action)](#Middleware.module_ActionRecordMiddleware..sanitizeActionHeaders) ⇒ <code>object</code>
    * [~sanitizeData(action)](#Middleware.module_ActionRecordMiddleware..sanitizeData) ⇒ <code>object</code>
    * [~getActions(id, limit)](#Middleware.module_ActionRecordMiddleware..getActions) ⇒ <code>Array</code>
    * [~recordAction(action, config)](#Middleware.module_ActionRecordMiddleware..recordAction)
    * [~actionRecordMiddleware(config)](#Middleware.module_ActionRecordMiddleware..actionRecordMiddleware) ⇒ <code>function</code>

<a name="Middleware.module_ActionRecordMiddleware..sanitizeActionHeaders"></a>

### ActionRecordMiddleware~sanitizeActionHeaders(action) ⇒ <code>object</code>
Modify actions' payload for privacy.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>action</td><td><code>object</code></td>
    </tr><tr>
    <td>action.payload</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Middleware.module_ActionRecordMiddleware..sanitizeData"></a>

### ActionRecordMiddleware~sanitizeData(action) ⇒ <code>object</code>
Modify actions' payload data for privacy.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>action</td><td><code>object</code></td>
    </tr><tr>
    <td>action.type</td><td><code>string</code></td>
    </tr><tr>
    <td>action.payload</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Middleware.module_ActionRecordMiddleware..getActions"></a>

### ActionRecordMiddleware~getActions(id, limit) ⇒ <code>Array</code>
Return existing sessionStorage log.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  
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
    <td>limit</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

<a name="Middleware.module_ActionRecordMiddleware..recordAction"></a>

### ActionRecordMiddleware~recordAction(action, config)
Store actions against an id in sessionStorage.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>action</td><td><code>object</code></td>
    </tr><tr>
    <td>config</td><td><code>object</code></td>
    </tr><tr>
    <td>config.id</td><td><code>number</code></td>
    </tr><tr>
    <td>config.limit</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

<a name="Middleware.module_ActionRecordMiddleware..actionRecordMiddleware"></a>

### ActionRecordMiddleware~actionRecordMiddleware(config) ⇒ <code>function</code>
Expose settings and record middleware.

**Kind**: inner method of [<code>ActionRecordMiddleware</code>](#Middleware.module_ActionRecordMiddleware)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>config</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Middleware.module_MultiActionMiddleware"></a>

## MultiActionMiddleware
<a name="Middleware.module_MultiActionMiddleware..multiActionMiddleware"></a>

### MultiActionMiddleware~multiActionMiddleware(store) ⇒ <code>function</code>
Allow passing an array of actions for batch dispatch.

**Kind**: inner method of [<code>MultiActionMiddleware</code>](#Middleware.module_MultiActionMiddleware)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>store</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Middleware.module_StatusMiddleware"></a>

## StatusMiddleware
<a name="Middleware.module_StatusMiddleware..statusMiddleware"></a>

### StatusMiddleware~statusMiddleware(config) ⇒ <code>function</code>
Apply a status type based on actions, such as those generated from redux-promise-middleware.

**Kind**: inner method of [<code>StatusMiddleware</code>](#Middleware.module_StatusMiddleware)  
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
    <td>config.statusSuffix</td><td><code>string</code></td>
    </tr><tr>
    <td>config.rangeSuffix</td><td><code>string</code></td>
    </tr><tr>
    <td>config.rangeFiller</td><td><code>string</code></td>
    </tr><tr>
    <td>config.statusDelimiter</td><td><code>string</code></td>
    </tr><tr>
    <td>config.statusRange</td><td><code>boolean</code></td>
    </tr><tr>
    <td>config.dispatchStatus</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>

<a name="Reducers.module_GraphReducer"></a>

## GraphReducer
Graph/Chart related API and user state reducer.

<a name="Reducers.module_GraphReducer..graphReducer"></a>

### GraphReducer~graphReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply graph interaction, and generated graph observer/reducer for reportCapacity to state,
against actions.

**Kind**: inner method of [<code>GraphReducer</code>](#Reducers.module_GraphReducer)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>state</td><td><code>object</code></td>
    </tr><tr>
    <td>action</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Reducers.module_InventoryReducer"></a>

## InventoryReducer
Inventory, and tabs, related API and user state reducer.

<a name="Reducers.module_InventoryReducer..inventoryReducer"></a>

### InventoryReducer~inventoryReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply generated inventory observer/reducer for system and subscriptions inventory to state,
against actions.

**Kind**: inner method of [<code>InventoryReducer</code>](#Reducers.module_InventoryReducer)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>state</td><td><code>object</code></td>
    </tr><tr>
    <td>action</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Reducers.module_MessagesReducer"></a>

## MessagesReducer
Banner messages related API state reducer.

<a name="Reducers.module_MessagesReducer..messagesReducer"></a>

### MessagesReducer~messagesReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Generated daily observer/reducer for messages to state,
against actions.

**Kind**: inner method of [<code>MessagesReducer</code>](#Reducers.module_MessagesReducer)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>state</td><td><code>object</code></td>
    </tr><tr>
    <td>action</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Reducers.module_ToolbarReducer"></a>

## ToolbarReducer
Toolbar related user state reducer.

<a name="Reducers.module_ToolbarReducer..toolbarReducer"></a>

### ToolbarReducer~toolbarReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply user observer/reducer logic for toolbar to state, against actions.

**Kind**: inner method of [<code>ToolbarReducer</code>](#Reducers.module_ToolbarReducer)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>state</td><td><code>object</code></td>
    </tr><tr>
    <td>action</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Reducers.module_UserReducer"></a>

## UserReducer
User related API, platform and user state reducer.

<a name="Reducers.module_UserReducer..userReducer"></a>

### UserReducer~userReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply user observer/reducer logic for session to state, against actions.

**Kind**: inner method of [<code>UserReducer</code>](#Reducers.module_UserReducer)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>state</td><td><code>object</code></td>
    </tr><tr>
    <td>action</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Reducers.module_ViewReducer"></a>

## ViewReducer
View query related user state reducer.

<a name="Reducers.module_ViewReducer..viewReducer"></a>

### ViewReducer~viewReducer(state, action) ⇒ <code>object</code> \| <code>Object</code>
Apply user observer/reducer logic for views to state, against actions.

**Kind**: inner method of [<code>ViewReducer</code>](#Reducers.module_ViewReducer)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>state</td><td><code>object</code></td>
    </tr><tr>
    <td>action</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

<a name="Redux State.module_Store"></a>

## Store
Redux store setup.

<a name="Redux State.module_Store..store"></a>

### Store~store : <code>Object</code>
Create a Redux store.

**Kind**: inner constant of [<code>Store</code>](#Redux State.module_Store)  
<a name="Types.module_ReduxTypes"></a>

## ReduxTypes

* [ReduxTypes](#Types.module_ReduxTypes)
    * [~appTypes](#Types.module_ReduxTypes..appTypes) : <code>Object</code>
    * [~graphTypes](#Types.module_ReduxTypes..graphTypes) : <code>Object</code>
    * [~inventoryTypes](#Types.module_ReduxTypes..inventoryTypes) : <code>Object</code>
    * [~messageTypes](#Types.module_ReduxTypes..messageTypes) : <code>Object</code>
    * [~platformTypes](#Types.module_ReduxTypes..platformTypes) : <code>Object</code>
    * [~queryTypes](#Types.module_ReduxTypes..queryTypes) : <code>Object</code>
    * [~rhsmTypes](#Types.module_ReduxTypes..rhsmTypes) : <code>Object</code>
    * [~toolbarTypes](#Types.module_ReduxTypes..toolbarTypes) : <code>Object</code>
    * [~userTypes](#Types.module_ReduxTypes..userTypes) : <code>Object</code>

<a name="Types.module_ReduxTypes..appTypes"></a>

### ReduxTypes~appTypes : <code>Object</code>
Application action, reducer types.

**Kind**: inner constant of [<code>ReduxTypes</code>](#Types.module_ReduxTypes)  
<a name="Types.module_ReduxTypes..graphTypes"></a>

### ReduxTypes~graphTypes : <code>Object</code>
Graph action, reducer types.

**Kind**: inner constant of [<code>ReduxTypes</code>](#Types.module_ReduxTypes)  
<a name="Types.module_ReduxTypes..inventoryTypes"></a>

### ReduxTypes~inventoryTypes : <code>Object</code>
Inventory action, reducer types.

**Kind**: inner constant of [<code>ReduxTypes</code>](#Types.module_ReduxTypes)  
<a name="Types.module_ReduxTypes..messageTypes"></a>

### ReduxTypes~messageTypes : <code>Object</code>
Banner message action, reducer types.

**Kind**: inner constant of [<code>ReduxTypes</code>](#Types.module_ReduxTypes)  
<a name="Types.module_ReduxTypes..platformTypes"></a>

### ReduxTypes~platformTypes : <code>Object</code>
Platform action, reducer types.

**Kind**: inner constant of [<code>ReduxTypes</code>](#Types.module_ReduxTypes)  
<a name="Types.module_ReduxTypes..queryTypes"></a>

### ReduxTypes~queryTypes : <code>Object</code>
Query/filter action, reducer types.

**Kind**: inner constant of [<code>ReduxTypes</code>](#Types.module_ReduxTypes)  
<a name="Types.module_ReduxTypes..rhsmTypes"></a>

### ReduxTypes~rhsmTypes : <code>Object</code>
RHSM API action, reducer types.

**Kind**: inner constant of [<code>ReduxTypes</code>](#Types.module_ReduxTypes)  
<a name="Types.module_ReduxTypes..toolbarTypes"></a>

### ReduxTypes~toolbarTypes : <code>Object</code>
Filter, toolbar action, reducer types.

**Kind**: inner constant of [<code>ReduxTypes</code>](#Types.module_ReduxTypes)  
<a name="Types.module_ReduxTypes..userTypes"></a>

### ReduxTypes~userTypes : <code>Object</code>
User action, reducer types.

**Kind**: inner constant of [<code>ReduxTypes</code>](#Types.module_ReduxTypes)  
<a name="reduxMiddleware"></a>

## reduxMiddleware : <code>Array</code>
Redux middleware.

**Kind**: global constant  
