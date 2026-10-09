# Introduction

Curiosity Frontend is the Subscriptions usage interface. It shows capacity graphs, subscription tables, and instance tables for Red Hat Enterprise Linux, OpenShift, and related products.

This document is the test plan for [SWATCH-5643](https://redhat.atlassian.net/browse/SWATCH-5643), the first Playwright feature suite under epic [SWATCH-5215](https://redhat.atlassian.net/browse/SWATCH-5215). The plan lists cases to automate. Specs are implemented later in [SWATCH-5712](https://redhat.atlassian.net/browse/SWATCH-5712).

The working notes for the epic were the input. Each note is included below, merged into an existing case, or listed under **Not in the first suite** with a reason. After review, this file is the source of truth.

**Purpose:** Confirm that Subscriptions usage features render and respond correctly in a real browser.

**Scope**:

* Chart labels, axes, tooltips, empty states, and error states.
* Toolbar filters, granularity, and history dropdowns.
* Subscriptions tables and instances tables.
* Export, loading, routing, and theme behavior.
* The current `iqe-curiosity-plugin` UI suite, recorded so later Playwright work can pick it up.

**Assumptions:**

* Cases run on stage in Chromium.
* Login uses the shared storage state from [SWATCH-5638](https://redhat.atlassian.net/browse/SWATCH-5638).
* Specs open the RHEL page through the RHEL page object, unless the case names another product.
* Feature cases mock RHSM APIs. Hosts, clusters, SKUs, contracts, and tally syncs that IQE created are mocked responses. The Playwright case does not create that data.
* The cookie banner is already dismissed before an assertion runs.

**Constraints**:

* This file is the plan. It does not add spec files.
* The epic implements ten cases. Those ten are marked **First suite**.
* Platform chrome and multi-user RBAC group changes stay in `iqe-curiosity-plugin`. This plan mocks the permission and opt-in states those tests produced.
* Playwright cases do not create hosts, clusters, SKUs, or contracts, and they do not sync tally.
* Helper unit tests in `iqe_curiosity/tests/unittests_utils.py` and the plugin smoke test in `iqe_curiosity/tests/test_plugin.py` are out of scope. They do not exercise the Curiosity UI.
* One case covers one pytest function. Parameter values are listed in Setup.

# Test Strategy

The first suite is risk-based. It covers RHEL behavior that Jest does not prove, because Jest stubs translated labels, and it covers error and empty paths that no current test reaches.

**Test Approach:**

* Document every UI test under `iqe_curiosity/tests/ui`, then add feature-note cases that the plugin does not already cover.
* When a note repeats a plugin test, keep a single case and record the merge.
* Specs will use TypeScript, page objects, and mocked RHSM responses on stage.

**Testing Strategy:**

* First suite: stage, Chromium, mocked APIs, RHEL page, shared login state.
* Later catalog: same harness, plus the product pages named in each case.
* IQE keeps the live pipeline suite. This plan mocks the UI behavior those runs checked.

# Test Cases

## First suite

These ten cases are the implementation cap for SWATCH-5215.

| ID | Behavior |
| --- | --- |
| chart-labels-TC002 | RHEL legend labels and x-axis follow the selected granularity |
| toolbar-TC001 | RHEL granularity dropdown shows Daily, Weekly, Monthly, and Quarterly |
| toolbar-TC002 | RHEL SLA, Usage, and Type filters select and clear |
| subscriptions-table-TC002 | RHEL subscriptions table renders the subscriptions response |
| instances-table-TC004 | RHEL instances table shows one row per socket category and matches today's graph total |
| export-TC001 | Subscription export downloads JSON and CSV |
| error-states-TC001 | Tally HTTP 500 shows an error in the chart card |
| error-states-TC002 | Instances HTTP 500 shows an error in the instances card and leaves the chart visible |
| chart-edge-TC001 | All-zero tally shows the chart empty state |
| chart-edge-TC005 | Switching granularity refetches tally and updates the chart |

## Navigation and login

**navigation-TC001 - Product pages load after login**
- **Description**: Each Subscriptions product destination renders its page for an authenticated user.
- **Setup**:
  - Stage session with permission to Subscriptions and an existing opt-in
  - Destinations: RhelAll, RedHatOpenShift, RedHatOpenShiftOnDemand, OpenShiftDedicated, RedHatOpenShiftAI, Satellite, RedHatAdvancedClusterSecurity, HostedControlPlanes, RhelSAP, RhelEUS, RhelHA, RhelRS, RhelELSOnDemand, RhelELSOnDemand3rdParty, RhelELSAnnual, AnsibleAWS, RhelAUSAnnual, AdvancedClusterManagement
- **Action**:
  - Open each destination
- **Verification**:
  - Check that the destination view is displayed
- **Expected Result**:
  - Every destination page is displayed

**navigation-TC002 - Services menu opens the RHEL page**
- **Description**: Navigation through the top Services menu lands on the RHEL Subscriptions page.
- **Setup**:
  - Stage session
  - Destination: RhelAllMenu
- **Action**:
  - Open the RHEL page through the Services menu
- **Verification**:
  - Check that the destination view is displayed
- **Expected Result**:
  - The RHEL page is displayed

**navigation-TC003 - All Services lists Subscriptions and Spend**
- **Description**: The All Services catalog shows the Subscriptions and Spend entries, and their links point at the product usage paths.
- **Setup**:
  - Stage session
  - Expected group after filtering: Subscriptions and Spend
  - Expected entries: Subscriptions Usage under Red Hat Enterprise Linux, OpenShift, Ansible, and Subscription Services
  - Link targets: `subscriptions/usage/ansible`, `subscriptions/usage/openshift`, `subscriptions/usage/rhel`
- **Action**:
  - Open All Services from the Services menu
  - Read the unfiltered catalog
  - Filter the catalog with "Subscriptions and Spend"
  - Read each Subscriptions Usage link
- **Verification**:
  - Compare the filtered Subscriptions and Spend group with the unfiltered group
  - Compare the Subscriptions Usage link paths with the expected usage URLs
- **Expected Result**:
  - The filtered catalog contains only Subscriptions and Spend
  - The filtered group matches the unfiltered Subscriptions and Spend group
  - Each Subscriptions Usage link path matches the expected usage URL

**navigation-TC004 - Insights menu opens RHEL usage**
- **Description**: The Insights left navigation includes a Subscriptions entry that opens RHEL usage and leaves the RHEL menu active.
- **Setup**:
  - Stage session on the Insights dashboard
- **Action**:
  - Open the Insights dashboard
  - Read the left navigation tree
  - Open RHEL usage from that menu
- **Verification**:
  - Check the Business and Subscriptions entries and the RHEL link href
  - Check the menu type after navigation
- **Expected Result**:
  - The tree contains Business and Subscriptions
  - The RHEL link href is `/subscriptions/usage/rhel`
  - The RHEL usage page is displayed with the RHEL menu

**navigation-TC005 - OpenShift menu opens OpenShift usage**
- **Description**: The OpenShift console left navigation includes a Subscriptions entry that opens OpenShift usage and leaves the OpenShift menu active.
- **Setup**:
  - Stage session on the OpenShift overview
- **Action**:
  - Open the OpenShift overview
  - Read the left navigation tree
  - Open OpenShift usage from Cloud console settings, Subscriptions
- **Verification**:
  - Check the Subscriptions and OpenShift Usage entries and the OpenShift link href
  - Check the menu type after navigation
- **Expected Result**:
  - Cloud console settings contains Subscriptions, and Subscriptions contains OpenShift Usage
  - The OpenShift link href is `/subscriptions/usage/openshift`
  - The OpenShift usage page is displayed with the OpenShift menu

## RBAC and opt-in

**rbac-TC001 - Mocked host data for a non-admin account**
- **Description**: The non-admin scenarios use a mocked physical RHEL host with 1 socket. IQE created that host and synced tally, then removed groups and opt-in. Playwright serves the host on the instances and tally responses and starts from a session with no Subscriptions permission.
- **Setup**:
  - Mocked instances and tally for one physical RHEL host with 1 socket
  - Session mock with no Subscriptions groups and no opt-in
- **Action**:
  - Serve the mocked host on instances and tally
- **Verification**:
  - Read the mocked instances and tally payloads
- **Expected Result**:
  - Instances and tally describe that one host
  - The session has no Subscriptions groups and no opt-in

**rbac-TC002 - Subscriptions page denies a user without permission**
- **Description**: A user with no Subscriptions permission sees the access denied page on a Subscriptions destination. The graph stays hidden.
- **Setup**:
  - Session mock with no Subscriptions permission
  - Destination is either the RHEL page or the OpenShift page
- **Action**:
  - Open the destination
- **Verification**:
  - Read the access denied message and the organization administrator guidance
  - Check that the graph is hidden
- **Expected Result**:
  - The page shows "You do not have access to Subscriptions"
  - The page tells the user to contact an organization administrator or visit My User Access
  - The graph is not displayed

**rbac-TC003 - Opt-in appears after Subscriptions permission is granted**
- **Description**: A session with only inventory permission is denied. After the mock grants Subscriptions permission and clears opt-in, the opt-in form appears. Activating subscriptions shows the success notification, and mocked usage responses then show the graph. IQE created the groups and waited for tally sync. Playwright serves those permission and usage states.
- **Setup**:
  - First session mock: inventory permission, no Subscriptions permission
  - Second session mock: Subscriptions permission, not opted in
  - Mocked tally, capacity, and instances for the period after opt-in
  - Destination is either the RHEL page or the OpenShift page
- **Action**:
  - Open the destination with the first session mock
  - Switch to the second session mock and reload
  - Click the opt-in button
  - Serve the mocked usage responses and refresh
- **Verification**:
  - Check the access denied state with the first session mock
  - Check the opt-in button, the success notification, and the graph after opt-in
- **Expected Result**:
  - With the first session mock, the page shows "You do not have access to Subscriptions" and the graph is hidden
  - With the second session mock, the opt-in button is displayed
  - Activation shows a success notification titled "Subscriptions activated" with body "It could take up to 24 hours for data to appear."
  - After the mocked usage responses load, the graph is displayed

## Chart labels

**chart-labels-TC001 - OpenShift legend labels follow the Cores and Sockets switcher**
- **Description**: The OpenShift chart legend names the active metric and the subscription threshold, and legend hover text matches the configured descriptions.
- **Setup**:
  - OpenShift Container Platform page
  - Mocked tally for Cores and for Sockets
- **Action**:
  - Open the OpenShift page
  - Read the Cores chart legend and hover text
  - Read the Sockets chart legend and hover text
- **Verification**:
  - Compare legend labels, hover text, title, and subtitle
- **Expected Result**:
  - Cores view labels are Cores and Subscription threshold
  - Sockets view labels are Sockets and Subscription threshold
  - Hover text for Cores describes CPU usage per core, and hover text for Sockets describes CPU usage per socket pair
  - Threshold hover text describes maximum capacity from annual OpenShift Container Platform subscriptions
  - Title is "Red Hat OpenShift"
  - Subtitle describes monitoring Annual and On-Demand OpenShift usage

**chart-labels-TC002 - RHEL legend labels and x-axis follow the selected granularity**
- **Description**: On the RHEL page, the chart legend lists the socket categories and the x-axis matches the selected granularity. Legend hover text matches the configured descriptions.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - Granularity values: Daily, Weekly, Monthly, Quarterly
  - Mocked sockets tally for each granularity
  - Fixed browser clock and timezone, so the expected ticks stay the same across a date boundary
- **Action**:
  - Open the RHEL page
  - Select each granularity
  - Read legend labels, legend hover text, and x-axis ticks
- **Verification**:
  - Compare labels, hover text, ticks, title, and subtitle with the product configuration
- **Expected Result**:
  - Legend labels are Physical, Virtual, Public cloud, Hypervisor, and Subscription threshold
  - Hover text matches the configured description for each label
  - X-axis ticks match the selected granularity
  - Title is "Red Hat Enterprise Linux"
  - Subtitle describes monitoring Annual and On-Demand RHEL usage

**chart-labels-TC003 - Disabling an OpenShift legend hides that series**
- **Description**: Clicking an enabled OpenShift legend item removes that series from the current point. Clicking it again restores the series.
- **Setup**:
  - OpenShift page (`RedHatOpenShift`)
  - Mocked tally that includes every legend series
  - The plugin docstring mentions RHEL pages. The parameter under test is the OpenShift page.
- **Action**:
  - Open the OpenShift page and refresh
  - Click each enabled legend item
  - Click the same item again
- **Verification**:
  - Read the current point before and after each click
- **Expected Result**:
  - After the first click, the current point omits that series
  - After the second click, the current point includes that series again

**chart-labels-TC004 - RHEL legend items stay enabled when clicked**
- **Description**: RHEL legend items cannot be turned off. A click does not remove the series from the current point.
- **Setup**:
  - RHEL for x86 page
  - Mocked sockets tally with Physical, Virtual, Public cloud, Hypervisor, and Subscription threshold
- **Action**:
  - Open the RHEL page and refresh
  - Attempt to click each enabled legend item
- **Verification**:
  - Confirm the legend click does not activate the item
  - Read the current point after the attempt
- **Expected Result**:
  - The legend item remains enabled
  - The current point still includes that series

**chart-labels-TC005 - OpenShift x-axis labels match the default granularity**
- **Description**: The OpenShift Cores and Sockets charts show the same x-axis ticks as the default daily range.
- **Setup**:
  - OpenShift Container Platform page
  - Mocked daily tally for Cores and Sockets
  - The plugin docstring mentions changing granularity. The current test reads the default axis on both charts.
- **Action**:
  - Open the OpenShift page
  - Read the x-axis on the Cores chart and on the Sockets chart
- **Verification**:
  - Compare both axes with the expected daily ticks
- **Expected Result**:
  - Both charts show the expected x-axis ticks for the default granularity

## Toolbar and filters

**toolbar-TC001 - RHEL granularity dropdown shows Daily, Weekly, Monthly, and Quarterly**
- **Description**: The RHEL granularity dropdown renders the four range labels in English.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - Mocked tally so the graph can finish loading
- **Action**:
  - Open the RHEL page
  - Wait until the graph is displayed
  - Open the granularity dropdown
- **Verification**:
  - Read the dropdown items
- **Expected Result**:
  - The dropdown contains Daily, Weekly, Monthly, and Quarterly

**toolbar-TC002 - RHEL SLA, Usage, and Type filters select and clear**
- **Description**: The RHEL filter control lists SLA, Usage, and Type, shows the matching value list for each, applies a selection, and returns to the default Usage filter after clear.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - SLA values: Premium, Standard, Self-Support, No SLA
  - Usage values: Production, Development/Test, Disaster Recovery, Unspecified
  - Type values: Physical, Virtual, Public cloud, Hypervisor
  - Mocked tally for the unfiltered page and for each selected filter
- **Action**:
  - Open the RHEL page and clear any existing filters
  - Select Usage, then Type, then SLA, and read each value list
  - Select No SLA, then Standard
  - Select Usage, then Disaster Recovery, then Development/Test
  - Clear all filters
- **Verification**:
  - Read the category button, the value button, and the value list after each change
- **Expected Result**:
  - The default category is Usage and the value button reads "Filter by usage"
  - Categories are SLA, Usage, and Type
  - Usage values match the Usage list, Type values match the Type list, and SLA values match the SLA list
  - Selecting No SLA and then Standard updates the value button to the selected SLA
  - Selecting Disaster Recovery and then Development/Test updates the value button to the selected usage
  - After clear, the category is Usage and the value button reads "Filter by usage"

**toolbar-TC003 - OpenShift SLA filter selects and clears**
- **Description**: The OpenShift page exposes an SLA filter. Selecting an SLA updates the button, and clear restores "Filter by SLA".
- **Setup**:
  - OpenShift Container Platform page
  - Variant set to the page variant label
  - SLA values: Premium, Standard, Self-Support, No SLA
  - Mocked tally for the unfiltered page, Premium, and No SLA
- **Action**:
  - Open the OpenShift page and clear existing filters
  - Select Premium, then No SLA
  - Clear all filters
- **Verification**:
  - Read the filter button and the item list after each change
- **Expected Result**:
  - The default button is "Filter by SLA" and the items are the SLA values
  - The button reads "Premium" and then "No SLA" after those selections
  - After clear, the button reads "Filter by SLA"

**toolbar-TC004 - RHEL ELS On-Demand billing provider lists that provider's accounts**
- **Description**: On RHEL ELS On-Demand, the billing provider list matches the instance billing providers. Choosing a provider fills the account list, selects the first account, and can switch to the last account.
- **Setup**:
  - RHEL for x86 ELS On-Demand page (`rhel-for-x86-els-payg-addon`)
  - Mocked instances that carry billing provider and billing account ids
- **Action**:
  - Open the ELS On-Demand page
  - Read the provider list
  - For each provider, select it, read accounts, select the last account, then clear filters
- **Verification**:
  - Compare providers and accounts with the instances API
- **Expected Result**:
  - The provider dropdown matches the providers returned for the product
  - The account dropdown matches the accounts for the selected provider
  - The first account is selected by default
  - Selecting the last account updates the account control to that id

**toolbar-TC005 - ROSA billing account filter matches the instances table**
- **Description**: On the ROSA page, filtering by the AWS billing provider and one billing account shows the instances that belong to that account.
- **Setup**:
  - ROSA page (`rosa`)
  - Mocked instances with an AWS billing account id
- **Action**:
  - Open the ROSA page
  - Select the AWS billing provider and the last billing account for that provider
  - Read the instances table
- **Verification**:
  - Compare the table with the instances response filtered by that billing account id
- **Expected Result**:
  - The instances table matches the filtered instances response

**toolbar-TC006 - Instances table returns to the same rows after filters are cleared**
- **Description**: Applying a named filter and then clearing it restores the instances table that was visible before the filter was applied.
- **Setup**:
  - Mocked instances for the destination. The unfiltered response and the response after clear return the same rows.
  - Mocked filtered responses for the named selections below
  - Destinations: RhelAll, RedHatOpenShift, Satellite, RhelSAP, RhelEUS, RhelHA, RhelRS, RhelELSOnDemand, RhelELSAnnual, RedHatAdvancedClusterSecurity, RedHatOpenShiftAI
  - SLA selection: Premium
  - Billing selection: Amazon Web Services and a known billing account id
- **Action**:
  - Open the destination and read the instances table
  - On RhelAll, Satellite, RhelSAP, RhelEUS, RhelHA, RhelRS, and RhelELSAnnual, select SLA and then Premium
  - On RedHatOpenShift, select Premium
  - On RhelELSOnDemand, RedHatAdvancedClusterSecurity, and RedHatOpenShiftAI, select Amazon Web Services and the known billing account
  - Clear all filters and read the table again
- **Verification**:
  - Compare the table before filtering with the table after clear
- **Expected Result**:
  - The selected filter value is shown on its control
  - After clear, the instances table matches the table captured before filtering

**toolbar-TC007 - Display name search returns that RHEL instance**
- **Description**: Searching the RHEL instances table by a known display name returns that instance. Adding SLA and Usage keeps the same row. Clearing search and filters restores the original row count. IQE created a physical RHEL host with SLA Premium and usage Production, then synced tally. Playwright serves that row in the mocked instances response.
- **Setup**:
  - RHEL for x86 page
  - Mocked instances that include one physical RHEL host with a known display name, SLA Premium, and usage Production, plus other rows
  - Mocked filtered responses that return only that host for the name search and for Premium plus Production
- **Action**:
  - Open the RHEL instances tab and record the row count
  - Search by the mocked display name
  - Apply SLA Premium and Usage Production
  - Clear filters and clear search
- **Verification**:
  - Read the table after search, after the extra filters, and after clear
- **Expected Result**:
  - Search returns one row whose Name is the mocked display name
  - SLA and Usage together still return that single row
  - After clear, the row count matches the count recorded before search

**toolbar-TC008 - OpenShift On-Demand history dropdown changes the graph**
- **Description**: The OpenShift On-Demand history dropdown lists this month and the previous eleven months. Choosing another month changes the graph.
- **Setup**:
  - OpenShift On-Demand page
  - Mocked monthly tally for the current month and for one earlier month
  - Dropdown labels: "This month", then month names, with the year appended when the month is in a previous year
- **Action**:
  - Open the On-Demand page
  - Read the history dropdown
  - Record the current graph
  - Select a month other than "This month"
- **Verification**:
  - Compare dropdown items with the twelve expected labels
  - Compare the graph before and after the selection
- **Expected Result**:
  - The dropdown has 12 items
  - The first item is "This month"
  - The last item is the month, and the year when that month is in a previous year
  - The graph data after the selection differs from the current month

**toolbar-TC009 - OpenShift Dedicated history dropdown changes the graph**
- **Description**: The OpenShift Dedicated history dropdown lists this month and the previous eleven months. Choosing another month changes the graph.
- **Setup**:
  - OpenShift Dedicated page
  - Mocked monthly tally for the current month and for one earlier month
  - Same twelve labels as toolbar-TC008
- **Action**:
  - Open the Dedicated page
  - Read the history dropdown
  - Select a month other than "This month"
- **Verification**:
  - Compare dropdown items with the twelve expected labels
  - Compare the graph before and after the selection
- **Expected Result**:
  - The dropdown has 12 correctly labeled items, starting with "This month"
  - The graph data after the selection differs from the current month

**toolbar-TC010 - Advanced Cluster Security history dropdown changes the graph**
- **Description**: The Advanced Cluster Security history dropdown lists this month and the previous eleven months. Choosing another month changes the graph.
- **Setup**:
  - Red Hat Advanced Cluster Security page
  - Mocked monthly tally for the current month and for one earlier month
  - Same twelve labels as toolbar-TC008
- **Action**:
  - Open the Advanced Cluster Security page
  - Read the history dropdown
  - Select a month other than "This month"
- **Verification**:
  - Compare dropdown items with the twelve expected labels
  - Compare the graph before and after the selection
- **Expected Result**:
  - The dropdown has 12 correctly labeled items, starting with "This month"
  - The graph data after the selection differs from the current month

## RHEL graph

**rhel-graph-TC001 - RHEL sockets graph matches tally and capacity**
- **Description**: The RHEL for x86 sockets graph matches the tally and capacity response at each granularity.
- **Setup**:
  - RHEL for x86 page
  - Metric: Sockets
  - Granularity values: Daily, Weekly, Monthly, Quarterly
  - Mocked tally and capacity for the account
- **Action**:
  - Open the RHEL page
  - Select each granularity
  - Read the graph
- **Verification**:
  - Compare the graph with the tally and capacity response for that granularity
- **Expected Result**:
  - The graph matches the API response at each granularity

**rhel-graph-TC002 - RHEL graph honors the SLA filter**
- **Description**: Filtering the RHEL sockets graph by SLA shows the tally restricted to that SLA.
- **Setup**:
  - RHEL for x86 page
  - Daily granularity
  - SLA values: Premium, Standard, Self-Support, No SLA
  - Mocked tally for each SLA
- **Action**:
  - Open the RHEL page
  - Apply each SLA filter
  - Read the graph
  - Clear filters
- **Verification**:
  - Compare the graph with the daily sockets tally for that SLA
- **Expected Result**:
  - The graph matches the SLA-filtered tally

**rhel-graph-TC003 - RHEL graph honors the Usage filter**
- **Description**: Filtering the RHEL sockets graph by usage shows the tally restricted to that usage.
- **Setup**:
  - RHEL for x86 page
  - Daily granularity
  - Usage values: Production, Development/Test, Disaster Recovery, Unspecified
  - Mocked tally for each usage
- **Action**:
  - Open the RHEL page
  - Apply each Usage filter
  - Read the graph
  - Clear filters
- **Verification**:
  - Compare the graph with the daily sockets tally for that usage
- **Expected Result**:
  - The graph matches the usage-filtered tally

**rhel-graph-TC004 - RHEL graph honors the Type filter**
- **Description**: Filtering the RHEL sockets graph by type shows the tally restricted to that category.
- **Setup**:
  - RHEL for x86 page
  - Daily granularity
  - Type values: Physical, Virtual, Public cloud, Hypervisor
  - Mocked tally for each type
- **Action**:
  - Open the RHEL page
  - Apply each Type filter
  - Read the graph
  - Clear filters
- **Verification**:
  - Compare the graph with the daily sockets tally for that category
- **Expected Result**:
  - The graph matches the type-filtered tally

**rhel-graph-TC005 - RHEL graph honors SLA, Usage, and Type together**
- **Description**: Applying Premium, Production, and Physical together shows the tally restricted to that combination.
- **Setup**:
  - RHEL for x86 page
  - Daily granularity
  - Filters: SLA Premium, Usage Production, Type Physical
  - Mocked tally for that combination
- **Action**:
  - Open the RHEL page
  - Apply the three filters
  - Read the graph
  - Clear filters
- **Verification**:
  - Compare the graph with the daily sockets tally for Premium, Production, and Physical
- **Expected Result**:
  - The graph matches the combined-filter tally

**rhel-graph-TC006 - RHEL graph stays correct with the navigation sidebar closed**
- **Description**: Closing the left navigation and applying the Premium SLA still shows the Premium daily sockets graph.
- **Setup**:
  - RHEL for x86 page
  - Daily granularity
  - SLA Premium
  - Mocked tally for that filter
- **Action**:
  - Open the RHEL page
  - Close the navigation sidebar
  - Clear existing filters, select Daily, and apply SLA Premium
  - Read the graph
  - Open the sidebar and clear filters
- **Verification**:
  - Confirm the sidebar is hidden while the graph is read
  - Compare the graph with the Premium daily sockets tally
- **Expected Result**:
  - The navigation sidebar is hidden
  - The graph matches the Premium daily tally
  - The sidebar is visible again after the check

**rhel-graph-TC007 - Infinite-capacity RHEL graph matches tally**
- **Description**: A mocked capacity response with unlimited RHEL quantity shows a sockets graph that matches the mocked tally at each granularity. IQE logged in as an account that owned an infinite-quantity SKU. Playwright serves that capacity flag.
- **Setup**:
  - RHEL for x86 page
  - Mocked capacity with `has_infinite_quantity` true
  - Mocked sockets tally for each granularity
  - Granularity values: Daily, Weekly, Monthly, Quarterly
- **Action**:
  - Open the RHEL page
  - Select each granularity
  - Read the graph
- **Verification**:
  - Compare the graph with the sockets tally for that account and granularity
- **Expected Result**:
  - The graph matches the API response at each granularity

**rhel-graph-TC008 - RHEL for SAP graph matches tally**
- **Description**: The RHEL for SAP x86 sockets graph matches tally at each granularity.
- **Setup**:
  - RHEL for SAP x86 page (`rhel-for-sap-x86`)
  - Granularity values: Daily, Weekly, Monthly, Quarterly
  - Mocked sockets tally
- **Action**:
  - Open the SAP page
  - Select each granularity
  - Read the graph
- **Verification**:
  - Compare the graph with the sockets tally for `rhel-for-sap-x86`
- **Expected Result**:
  - The graph matches the API response at each granularity

**rhel-graph-TC009 - RHEL EUS graph matches tally**
- **Description**: The RHEL for x86 EUS sockets graph matches tally at each granularity.
- **Setup**:
  - RHEL for x86 EUS page (`rhel-for-x86-eus`)
  - Granularity values: Daily, Weekly, Monthly, Quarterly
  - Mocked sockets tally
- **Action**:
  - Open the EUS page
  - Select each granularity
  - Read the graph
- **Verification**:
  - Compare the graph with the sockets tally for `rhel-for-x86-eus`
- **Expected Result**:
  - The graph matches the API response at each granularity

**rhel-graph-TC010 - RHEL HA graph matches tally**
- **Description**: The RHEL for x86 HA sockets graph matches tally at each granularity.
- **Setup**:
  - RHEL for x86 HA page (`rhel-for-x86-ha`)
  - Granularity values: Daily, Weekly, Monthly, Quarterly
  - Mocked sockets tally
- **Action**:
  - Open the HA page
  - Select each granularity
  - Read the graph
- **Verification**:
  - Compare the graph with the sockets tally for `rhel-for-x86-ha`
- **Expected Result**:
  - The graph matches the API response at each granularity

**rhel-graph-TC011 - RHEL Resilient Storage graph matches tally**
- **Description**: The RHEL for x86 Resilient Storage sockets graph matches tally at each granularity.
- **Setup**:
  - RHEL for x86 Resilient Storage page (`rhel-for-x86-rs`)
  - Granularity values: Daily, Weekly, Monthly, Quarterly
  - Mocked sockets tally
- **Action**:
  - Open the Resilient Storage page
  - Select each granularity
  - Read the graph
- **Verification**:
  - Compare the graph with the sockets tally for `rhel-for-x86-rs`
- **Expected Result**:
  - The graph matches the API response at each granularity

**rhel-graph-TC012 - RHEL ELS On-Demand vCPU graph matches the monthly card**
- **Description**: The ELS On-Demand vCPU hours graph matches tally, future days in the month stay empty, and the monthly card matches the monthly total. The check covers the unfiltered page and the AWS billing-provider filter.
- **Setup**:
  - Destinations: RHEL ELS On-Demand (`rhel-for-x86-els-payg-addon`) and RHEL ELS On-Demand for Third Party Linux Migration (`rhel-for-x86-els-payg`)
  - Marketplace filter: none, and AWS
  - Mocked vCPU tally and four AWS instances with one hour of usage, for the unfiltered response and for the AWS billing-provider filter
  - Metric: vCPUs, current month
- **Action**:
  - Open each destination
  - For the AWS pass, select the AWS billing provider and keep the default billing account
  - For the unfiltered pass, clear filters
  - Read the monthly card and the graph
- **Verification**:
  - Compare the graph with the vCPU tally for that billing filter
  - Compare the monthly card with the formatted monthly total
  - Check days after today
- **Expected Result**:
  - The cores monthly card is displayed
  - The graph matches the tally
  - Days after today show "no data" for the vCPU hours series
  - The monthly card equals the formatted monthly total

**rhel-graph-TC013 - RHEL ELS Annual graph matches tally**
- **Description**: The RHEL ELS Annual sockets graph matches tally at each granularity.
- **Setup**:
  - RHEL ELS Annual page (`rhel-for-x86-els-unconverted`)
  - Granularity values: Daily, Weekly, Monthly, Quarterly
  - Mocked sockets tally
- **Action**:
  - Open the ELS Annual page
  - Select each granularity
  - Read the graph
- **Verification**:
  - Compare the graph with the sockets tally for the ELS Annual product
- **Expected Result**:
  - The graph matches the API response at each granularity

**rhel-graph-TC014 - A higher mocked subscription quantity increases the threshold**
- **Description**: The RHEL daily graph threshold matches capacity and the current subscriptions quantity. Usage matches tally. A second set of mocks, with one extra socket subscription, shows a higher threshold, and the updated threshold still matches capacity and the subscriptions quantity. IQE added SKU RH00004 and synced capacity. Playwright swaps in that increased payload.
- **Setup**:
  - RHEL for x86 page
  - Daily granularity
  - First mocks: tally for usage, plus capacity and subscriptions that share one threshold
  - Second mocks: the same payloads with capacity and the subscriptions quantity increased by one socket, matching the result of adding SKU RH00004
- **Action**:
  - Open the RHEL page at Daily with the first mocks
  - Read the graph threshold, usage, and the subscriptions quantity
  - Switch to the second mocks and refresh
  - Read the same values again
- **Verification**:
  - Compare the graph threshold to capacity and the subscriptions quantity before the switch
  - Compare usage to tally before the switch
  - Compare the graph threshold to capacity and the subscriptions quantity after the switch
  - Compare usage to tally after the switch
  - Compare the new graph threshold with the original graph threshold
- **Expected Result**:
  - Before the switch, the graph threshold equals capacity and the subscriptions quantity
  - Before the switch, usage equals tally
  - After the switch, the graph threshold equals capacity and the subscriptions quantity
  - After the switch, usage equals tally
  - The updated graph threshold is greater than the original graph threshold

## OpenShift graph

**openshift-graph-TC001 - OpenShift cores and sockets graphs match tally**
- **Description**: The OpenShift Container Platform cores graph and sockets graph match their tally responses.
- **Setup**:
  - OpenShift Container Platform page
  - Mocked cluster instances
  - Mocked cores and sockets tally
- **Action**:
  - Open the OpenShift page
  - Read the cores graph and the sockets graph
- **Verification**:
  - Compare each graph with its tally response
- **Expected Result**:
  - The cores graph matches the Cores tally
  - The sockets graph matches the Sockets tally

**openshift-graph-TC002 - OpenShift graph honors the SLA filter**
- **Description**: Filtering OpenShift by SLA shows cores and sockets tally restricted to that SLA.
- **Setup**:
  - OpenShift Container Platform page
  - SLA values: Premium, Standard, Self-Support, No SLA
  - Mocked tally for each SLA
- **Action**:
  - Open the OpenShift page
  - Apply each SLA
  - Read the cores graph and the sockets graph
- **Verification**:
  - Compare each graph with the SLA-filtered tally
- **Expected Result**:
  - Both graphs match the tally for the selected SLA

**openshift-graph-TC003 - OpenShift graph stays correct with the navigation sidebar closed**
- **Description**: Closing the left navigation and applying the Standard SLA still shows the Standard cores and sockets graphs.
- **Setup**:
  - OpenShift Container Platform page
  - SLA Standard
  - Mocked tally for that SLA
- **Action**:
  - Open the OpenShift page
  - Close the navigation sidebar
  - Apply Standard
  - Read both graphs
  - Open the sidebar
- **Verification**:
  - Confirm the sidebar is hidden while the graphs are read
  - Compare both graphs with the Standard tally
- **Expected Result**:
  - The navigation sidebar is hidden
  - Both graphs match the Standard tally
  - The sidebar is visible again after the check

**openshift-graph-TC004 - Infinite-capacity OpenShift graph matches tally**
- **Description**: A mocked capacity response with unlimited OpenShift quantity shows cores and sockets graphs that match the mocked tally. IQE logged in as an account that owned an infinite-quantity SKU. Playwright serves that capacity flag.
- **Setup**:
  - OpenShift Container Platform page
  - Mocked capacity with `has_infinite_quantity` true
  - Mocked cores and sockets tally
- **Action**:
  - Open the OpenShift page
  - Read the cores graph and the sockets graph
- **Verification**:
  - Compare each graph with the tally for that account
- **Expected Result**:
  - Both graphs match the API response

**openshift-graph-TC005 - OpenShift On-Demand core hours omit future days**
- **Description**: The OpenShift On-Demand core hours graph matches the current-month tally, and days after today have no data.
- **Setup**:
  - OpenShift On-Demand page (`OpenShift-metrics`)
  - Metric: Cores
  - Current calendar month
  - Mocked hourly tally
- **Action**:
  - Open the On-Demand page
  - Read the core hours graph
- **Verification**:
  - Compare the graph with the monthly cores tally
  - Check days after today
- **Expected Result**:
  - The graph matches the tally
  - Days after today show "no data" for Core hours

**openshift-graph-TC006 - OpenShift Dedicated graphs omit future days**
- **Description**: The OpenShift Dedicated core hours graph matches the current-month cores tally, and the instance hours graph matches the current-month instance hours tally. Days after today have no data.
- **Setup**:
  - OpenShift Dedicated page (`OpenShift-dedicated-metrics`)
  - Current calendar month
  - Mocked hourly tally for core hours and for instance hours
- **Action**:
  - Open the Dedicated page
  - Read the core hours graph and the instance hours graph
- **Verification**:
  - Compare the core hours graph with the monthly cores tally
  - Compare the instance hours graph with the monthly instance hours tally
  - Check days after today
- **Expected Result**:
  - The core hours graph matches the cores tally
  - The instance hours graph matches the instance hours tally
  - Days after today show "no data" for Core hours and for Instance hours

**openshift-graph-TC007 - Advanced Cluster Security graph matches the monthly card**
- **Description**: The Advanced Cluster Security cores graph matches tally, future days stay empty, and the monthly card matches the monthly total.
- **Setup**:
  - Red Hat Advanced Cluster Security page (`rhacs`)
  - Metric: Cores
  - Current calendar month
  - Mocked tally
- **Action**:
  - Open the Advanced Cluster Security page
  - Read the graph and the monthly card
- **Verification**:
  - Compare the graph with the cores tally
  - Compare the card with the formatted monthly total
  - Check days after today
- **Expected Result**:
  - The graph matches the tally
  - Days after today show "no data" for the vCPU hours series
  - The monthly card equals the formatted monthly total

**openshift-graph-TC008 - OpenShift AI graph matches the monthly card**
- **Description**: The OpenShift AI cores graph matches tally, future days stay empty, and the monthly card matches the monthly total.
- **Setup**:
  - Red Hat OpenShift AI page (`rhods`)
  - Metric: Cores
  - Current calendar month
  - Mocked tally
- **Action**:
  - Open the OpenShift AI page
  - Read the graph and the monthly card
- **Verification**:
  - Compare the graph with the cores tally
  - Compare the card with the formatted monthly total
  - Check days after today
- **Expected Result**:
  - The graph matches the tally
  - Days after today show "no data" for the vCPU hours series
  - The monthly card equals the formatted monthly total

**openshift-graph-TC009 - ROSA graph totals match the rounded instances table**
- **Description**: ROSA vCPU hours and control plane hours on the graph equal the rounded sums of those columns in the instances table.
- **Setup**:
  - ROSA page
  - Mocked ROSA instances for the current period
- **Action**:
  - Open the ROSA page
  - Read the instances table, the vCPU hours graph, and the control plane hours graph
- **Verification**:
  - Round the table column sums up to the next integer
  - Compare each sum with the maximum value read from the matching graph
- **Expected Result**:
  - The vCPU graph total equals the rounded vCPU hours column
  - The control plane graph total equals the rounded control plane hours column

**openshift-graph-TC010 - ROSA remaining capacity matches capacity minus tally**
- **Description**: ROSA remaining vCPU hours and remaining control plane hours equal today's capacity minus the monthly prepaid tally, and they never display a negative value.
- **Setup**:
  - ROSA page
  - Mocked capacity and prepaid monthly tally for one AWS ROSA contract
  - Current month capacity for Cores and Instance-hours
  - Monthly prepaid running totals for those metrics
- **Action**:
  - Open the ROSA page
  - Read the remaining vCPU card and the remaining control plane card
- **Verification**:
  - Compute remaining capacity as today's capacity minus the monthly tally, with a floor of zero
  - Compare each card with the formatted remaining value
- **Expected Result**:
  - Neither card shows "No data"
  - Each card is at least zero
  - The vCPU card shows the remaining cores as vCPU hours
  - The hours card shows the remaining instance hours as control plane hours

## Subscriptions table

**subscriptions-table-TC001 - RHEL for IBM z shows an empty subscriptions table**
- **Description**: Selecting RHEL for IBM z on an account with no IBM z subscriptions shows the empty-state message.
- **Setup**:
  - Mocked empty subscriptions response for RHEL for IBM z
  - RHEL page, variant RHEL for IBM z
- **Action**:
  - Open the RHEL page
  - Select the RHEL for IBM z variant
  - Open the current subscriptions tab
- **Verification**:
  - Read the empty state
- **Expected Result**:
  - The empty state reads "To show more results, clear some or all filters."

**subscriptions-table-TC002 - RHEL subscriptions table renders the subscriptions response**
- **Description**: The RHEL current subscriptions table shows the same rows as the sockets subscriptions response.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - Mocked sockets subscriptions response with a known set of rows
- **Action**:
  - Open the RHEL page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the sockets subscriptions response
- **Expected Result**:
  - The table rows match the subscriptions response

**subscriptions-table-TC003 - OpenShift subscriptions table matches the API**
- **Description**: The OpenShift current subscriptions table matches the OpenShift Container Platform subscriptions response.
- **Setup**:
  - OpenShift Container Platform page
  - Mocked subscriptions response
- **Action**:
  - Open the OpenShift page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response
- **Expected Result**:
  - The table rows match the subscriptions response

**subscriptions-table-TC004 - OpenShift AI subscriptions table matches the API**
- **Description**: The OpenShift AI current subscriptions table matches the `rhods` subscriptions response.
- **Setup**:
  - Red Hat OpenShift AI page
  - Mocked subscriptions response
- **Action**:
  - Open the OpenShift AI page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response
- **Expected Result**:
  - The table rows match the subscriptions response

**subscriptions-table-TC005 - Infinite-capacity RHEL subscriptions show the infinity symbol**
- **Description**: A mocked subscriptions response with unlimited RHEL quantity shows rows that match that response, and at least one row displays the infinity symbol for sockets. IQE used an account that owned an infinite-quantity SKU. Playwright serves that payload.
- **Setup**:
  - RHEL for x86 page
  - Mocked sockets subscriptions response with `has_infinite_quantity` true on at least one row
- **Action**:
  - Open the RHEL page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the sockets subscriptions response
  - Look for the infinity symbol in the Sockets column
- **Expected Result**:
  - The table matches the subscriptions response
  - At least one row shows "∞" in Sockets

**subscriptions-table-TC006 - Infinite-capacity OpenShift subscriptions show the infinity symbol**
- **Description**: A mocked subscriptions response with unlimited OpenShift quantity shows rows that match that response, and at least one row displays the infinity symbol for sockets and cores. IQE used an account that owned an infinite-quantity SKU. Playwright serves that payload.
- **Setup**:
  - OpenShift Container Platform page
  - Mocked subscriptions response with `has_infinite_quantity` true on at least one row
- **Action**:
  - Open the OpenShift page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response
  - Look for the infinity symbol in Sockets and Cores
- **Expected Result**:
  - The table matches the subscriptions response
  - At least one row shows "∞" in both Sockets and Cores

**subscriptions-table-TC007 - RHEL for SAP subscriptions table matches the API**
- **Description**: The RHEL for SAP x86 subscriptions table matches the sockets subscriptions response.
- **Setup**:
  - RHEL for SAP x86 page (`rhel-for-sap-x86`)
  - Mocked sockets subscriptions response
- **Action**:
  - Open the SAP page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response
- **Expected Result**:
  - The table rows match the subscriptions response

**subscriptions-table-TC008 - RHEL EUS subscriptions table matches the API**
- **Description**: The RHEL for x86 EUS subscriptions table matches the sockets subscriptions response.
- **Setup**:
  - RHEL for x86 EUS page (`rhel-for-x86-eus`)
  - Mocked sockets subscriptions response
- **Action**:
  - Open the EUS page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response
- **Expected Result**:
  - The table rows match the subscriptions response

**subscriptions-table-TC009 - RHEL HA subscriptions table matches the API**
- **Description**: The RHEL for x86 HA subscriptions table matches the sockets subscriptions response.
- **Setup**:
  - RHEL for x86 HA page (`rhel-for-x86-ha`)
  - Mocked sockets subscriptions response
- **Action**:
  - Open the HA page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response
- **Expected Result**:
  - The table rows match the subscriptions response

**subscriptions-table-TC010 - RHEL Resilient Storage subscriptions table matches the API**
- **Description**: The RHEL for x86 Resilient Storage subscriptions table matches the sockets subscriptions response.
- **Setup**:
  - RHEL for x86 Resilient Storage page (`rhel-for-x86-rs`)
  - Mocked sockets subscriptions response
- **Action**:
  - Open the Resilient Storage page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response
- **Expected Result**:
  - The table rows match the subscriptions response

**subscriptions-table-TC011 - RHEL AUS Annual subscriptions table matches the API**
- **Description**: The RHEL Advanced Update Support Add-On, Annual subscriptions table matches the sockets subscriptions response.
- **Setup**:
  - RHEL AUS Annual page (`rhel-aus-addon`)
  - Mocked sockets subscriptions response
- **Action**:
  - Open the AUS Annual page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response
- **Expected Result**:
  - The table rows match the subscriptions response

**subscriptions-table-TC012 - RHEL ELS On-Demand subscriptions table matches the API**
- **Description**: The ELS On-Demand subscriptions table matches the subscriptions response on both ELS On-Demand destinations.
- **Setup**:
  - Destinations: RHEL ELS On-Demand (`rhel-for-x86-els-payg-addon`) and RHEL ELS On-Demand for Third Party Linux Migration (`rhel-for-x86-els-payg`)
  - Mocked subscriptions response with two AWS marketplace subscriptions
- **Action**:
  - Open each destination
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response for that product
- **Expected Result**:
  - The table rows match the subscriptions response

**subscriptions-table-TC013 - ROSA subscriptions follow the mocked contract payload**
- **Description**: An empty ROSA subscriptions mock shows an empty table. A mock with one AWS ROSA contract shows that row. Returning to the empty mock clears the table. IQE created the contract and then deleted it. Playwright serves those three responses.
- **Setup**:
  - ROSA page
  - Three subscriptions mocks, in order: no rows, one AWS ROSA contract row, no rows
- **Action**:
  - Open the ROSA subscriptions tab with the empty mock
  - Reload with the one-contract mock
  - Reload with the empty mock
- **Verification**:
  - Compare the table with the subscriptions mock after each load
- **Expected Result**:
  - The table is empty on the first load
  - After the one-contract mock, the table shows that row
  - After the empty mock, the table is empty again

**subscriptions-table-TC014 - Long-running ROSA account shows subscriptions and no billing banner**
- **Description**: A long-running ROSA account shows a subscriptions table that matches the API and does not show the billing banner.
- **Setup**:
  - ROSA page
  - Mocked ROSA subscriptions response with at least one row
  - Mocked banner response with no billing alert
- **Action**:
  - Open the ROSA page
  - Open the current subscriptions tab
  - Read the table and look for the billing banner
- **Verification**:
  - Compare the table with the subscriptions response
  - Check that the billing banner is hidden
- **Expected Result**:
  - The billing banner is not displayed
  - The table has at least one row and matches the subscriptions response

**subscriptions-table-TC015 - RHEL ELS Annual subscriptions table matches the API**
- **Description**: The RHEL ELS Annual subscriptions table matches the sockets subscriptions response.
- **Setup**:
  - RHEL ELS Annual page (`rhel-for-x86-els-unconverted`)
  - Mocked sockets subscriptions response
- **Action**:
  - Open the ELS Annual page
  - Open the current subscriptions tab
  - Read the table
- **Verification**:
  - Compare the table with the subscriptions response
- **Expected Result**:
  - The table rows match the subscriptions response

## Instances table

**instances-table-TC001 - RHEL for IBM z shows an empty instances table**
- **Description**: Selecting RHEL for IBM z on an account with no IBM z instances shows the empty-state message.
- **Setup**:
  - Mocked empty instances response for RHEL for IBM z
  - RHEL page, variant RHEL for IBM z
- **Action**:
  - Open the RHEL page
  - Select the RHEL for IBM z variant
  - Open the current instances tab
- **Verification**:
  - Read the empty state
- **Expected Result**:
  - The empty state reads "To show more results, clear some or all filters."

**instances-table-TC002 - OpenShift instances match the graph totals**
- **Description**: The OpenShift instances table matches the instances response, and the cores and sockets column totals equal today's graph values.
- **Setup**:
  - OpenShift Container Platform page
  - Mocked cluster instances for cores and sockets
  - Mocked cores and sockets tally for today
- **Action**:
  - Open the OpenShift instances tab
  - Read today's cores and sockets from the graphs
  - Read the table
- **Verification**:
  - Sum the Cores and Sockets columns
  - Compare those sums with today's graph values
  - Compare the table with the instances response, including the separate cores and sockets responses
- **Expected Result**:
  - The instances table is displayed
  - The sockets column total equals today's sockets graph value
  - The cores column total equals today's cores graph value
  - The table matches the instances response

**instances-table-TC003 - OpenShift On-Demand core hours match the graph**
- **Description**: The OpenShift On-Demand instances table matches the instances response, the rounded cores column matches the graph total, and the graph matches tally.
- **Setup**:
  - OpenShift On-Demand page (`OpenShift-metrics`)
  - Current calendar month
  - Mocked core-hours tally and instances for the current month
- **Action**:
  - Open the On-Demand page
  - Read the graph and the instances table
- **Verification**:
  - Compare the rounded cores column with the graph core hours total
  - Compare the table with the CORES field in the instances response
  - Compare the graph with the cores tally
- **Expected Result**:
  - The instances table is displayed
  - The rounded cores column matches the graph total
  - The table matches the instances response
  - The graph matches the tally

**instances-table-TC004 - RHEL instances table shows one row per socket category and matches today's graph total**
- **Description**: The RHEL instances table shows one mocked row for each socket category, and the Sockets column total equals today's graph total across those categories.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - Four mocked instance rows on one page, one each for Physical, Virtual, Public cloud, and Hypervisor, with known names and socket counts
  - Today's mocked sockets tally equals the sum of those rows
- **Action**:
  - Open the RHEL instances tab
  - Read today's graph and the table
- **Verification**:
  - Read each row's name, type, and socket count
  - Sum the Sockets column and compare it with today's graph total across Physical, Virtual, Public cloud, and Hypervisor
- **Expected Result**:
  - All four rows appear with their names, types, and socket counts
  - The Sockets sum equals today's graph total across Physical, Virtual, Public cloud, and Hypervisor

**instances-table-TC005 - OpenShift Dedicated instances match the graph totals**
- **Description**: The OpenShift Dedicated instances table matches the instances response. Rounded core hours match the core hours graph, and rounded instance hours match the instance hours graph. Each graph matches its tally.
- **Setup**:
  - OpenShift Dedicated page (`OpenShift-dedicated-metrics`)
  - Current calendar month
  - Mocked core-hours tally, instance-hours tally, and instances for the current month
- **Action**:
  - Open the Dedicated page
  - Read both graphs and the instances table
- **Verification**:
  - Compare the rounded Core hours column with the core hours graph
  - Compare the rounded Instance hours column with the instance hours graph
  - Compare the table with the instances response
  - Compare the core hours graph with the monthly cores tally
  - Compare the instance hours graph with the monthly instance hours tally
- **Expected Result**:
  - Rounded Core hours match the core hours graph
  - Rounded Instance hours match the instance hours graph
  - The table matches the instances response
  - The core hours graph matches the cores tally
  - The instance hours graph matches the instance hours tally

**instances-table-TC006 - Self-Support filter clears the RHEL instances table**
- **Description**: When the account has Premium RHEL instances and no Self-Support instances, selecting SLA Self-Support shows an empty table. This is the regression for SWATCH-703, where the old rows stayed on screen with zeroed values.
- **Setup**:
  - RHEL for x86 page
  - Mocked instances for Premium, and an empty instances response for Self-Support
  - Granularity label "Past 30 days (daily)"
- **Action**:
  - Open the RHEL instances tab at that granularity
  - Confirm the table has rows
  - Select SLA Self-Support
  - Read the table again
- **Verification**:
  - Read the table after the filter change
- **Expected Result**:
  - The table is empty after Self-Support is selected

**instances-table-TC007 - Satellite instances table matches the API**
- **Description**: The Satellite instances table for the current month matches the instances response.
- **Setup**:
  - Satellite Server page
  - Current calendar month
  - Mocked instances response
- **Action**:
  - Open the Satellite page
  - Read the instances table
- **Verification**:
  - Compare the table with the instances response for the current month
- **Expected Result**:
  - The table rows match the instances response

**instances-table-TC008 - RHEL ELS On-Demand instances match the monthly vCPU card**
- **Description**: On both ELS On-Demand destinations, the instances table matches the API, the vCPU hours column matches the API total, and that total matches the monthly card.
- **Setup**:
  - Destinations: RHEL ELS On-Demand and RHEL ELS On-Demand for Third Party Linux Migration
  - Mocked instances for four AWS hosts, a matching subscription, and a matching vCPU monthly total
- **Action**:
  - Open each destination
  - Open the current instances tab
  - Read the table and the monthly vCPU card
- **Verification**:
  - Sum vCPU hours in the table and in the API rows
  - Compare the formatted API total with the monthly card
  - Compare the table with the instances response
- **Expected Result**:
  - The table total equals the API total
  - The monthly card equals the formatted API total
  - The table matches the instances response

**instances-table-TC009 - RHEL instance names link to Insights inventory**
- **Description**: Every RHEL instance name links to Insights inventory for that instance's inventory id, including rows past the first page.
- **Setup**:
  - RHEL for x86 page
  - Mocked instances response where each row has a known `inventory_id`
- **Action**:
  - Open the RHEL instances tab
  - Collect the href of every name link, advancing through pages
- **Verification**:
  - For each instance, look for `insights/inventory/<inventory_id>` in the collected hrefs
- **Expected Result**:
  - Every instance has a link whose href contains `insights/inventory/` plus that instance's inventory id

**instances-table-TC010 - OpenShift On-Demand names link to cluster details**
- **Description**: Every OpenShift On-Demand instance name links to the cluster details page for that instance id, including rows past the first page.
- **Setup**:
  - OpenShift On-Demand page (`OpenShift-metrics`)
  - Mocked instances response where each row has a known `instance_id`
- **Action**:
  - Open the On-Demand page
  - Collect the href of every name link, advancing through pages
- **Verification**:
  - For each instance, look for `openshift/details/<instance_id>` in the collected hrefs
- **Expected Result**:
  - Every instance has a link whose href contains `openshift/details/` plus that instance's instance id

**instances-table-TC011 - RHEL instances pagination keeps the instances response**
- **Description**: Changing the RHEL instances page size to 10, 20, 50, or 100 still shows the rows from the instances response.
- **Setup**:
  - RHEL for x86 page
  - Page sizes: 10, 20, 50, 100
  - Mocked instances response
- **Action**:
  - Open the RHEL instances tab
  - Set each page size
  - Read the visible table
- **Verification**:
  - Compare the visible rows with the instances response
- **Expected Result**:
  - The table is displayed at each page size
  - The visible rows match the instances response

**instances-table-TC012 - A mocked GCP marketplace RHEL instance appears in the table**
- **Description**: The RHEL instances table shows a mocked virtual GCP host. IQE created that host with a valid GCP license code and synced tally. Playwright returns the resulting row.
- **Setup**:
  - RHEL for x86 page
  - Mocked instances response with one virtual GCP marketplace host and a known display name
  - Matching mocked sockets tally
- **Action**:
  - Open the RHEL instances tab
  - Read the table
- **Verification**:
  - Find the mocked display name in the table
- **Expected Result**:
  - The instances table contains a row whose Name is the mocked display name

**instances-table-TC013 - RHEL ELS Annual instances match the graph sockets total**
- **Description**: The ELS Annual instances table matches the instances response, and the sockets column total equals today's graph total.
- **Setup**:
  - RHEL ELS Annual page (`rhel-for-x86-els-unconverted`)
  - Mocked instances and sockets tally
- **Action**:
  - Open the ELS Annual instances tab
  - Read today's graph and the table
- **Verification**:
  - Sum the Sockets column and compare it with today's graph across the RHEL types
  - Compare the table with the instances response
- **Expected Result**:
  - The instances table is displayed
  - The sockets column total equals today's graph total
  - The table matches the instances response

**instances-table-TC014 - Expanded hypervisor rows list the same guests as the API**
- **Description**: Filtering RHEL instances to Hypervisor makes rows expandable. Each row's guest count equals the number of guests in the expanded section, and the expanded rows match the hypervisor instances response.
- **Setup**:
  - RHEL for x86 page
  - Type filter set to Hypervisor
  - Mocked hypervisor instances that include guest mappings
- **Action**:
  - Open the RHEL instances tab
  - Select Type, then Hypervisor
  - Expand the rows
- **Verification**:
  - Compare each Guests value with the length of that row's guest list
  - Compare the expanded table with the hypervisor instances response
- **Expected Result**:
  - The Type button reads "Type" and the value button reads "Filter by type" before Hypervisor is selected
  - The table is expandable
  - Each Guests count equals the number of hypervisor guests shown for that row
  - The expanded rows match the instances response

**instances-table-TC015 - A hypervisor with 100 or more guests loads every guest**
- **Description**: Sorting hypervisors by guest count and expanding the first row loads every guest. The loaded guest count equals the Guests value. IQE created a hypervisor mapping when the account had fewer than 100 guests. Playwright serves a mocked hypervisor with at least 100 guests.
- **Setup**:
  - RHEL for x86 page
  - Mocked hypervisor instance with at least 100 guests
  - Type filter set to Hypervisor
- **Action**:
  - Open the RHEL instances tab
  - Select Type, then Hypervisor
  - Sort Guests descending
  - Expand the first row and load guests until the last guest is in view
- **Verification**:
  - Compare the Guests value with the number of loaded guest rows
- **Expected Result**:
  - The table is expandable
  - The number of loaded guest rows equals the Guests value on that hypervisor

## Export and billing

**export-TC001 - Subscription export downloads JSON and CSV**
- **Description**: Choosing Export to JSON or Export to CSV shows an info notification, then a success notification whose body names the product and the format. JSON and CSV share one case because they use the same export path.
- **Setup**:
  - Shared login storage state
  - A Subscriptions product page. The plugin picks a product at random. The first suite uses the RHEL page.
  - Export formats: JSON and CSV
  - Mocked export response that completes the download
  - Any existing export confirmation is cancelled before the run
- **Action**:
  - Open the product page
  - Choose "Export to JSON"
  - Repeat the flow with "Export to CSV"
- **Verification**:
  - Read the pending notification and the completed notification, including the body
- **Expected Result**:
  - The export control is displayed
  - A pending info notification appears, and closing it removes that notification
  - A success notification then appears
  - The success body contains the product id in export filename form and the selected format

**export-TC002 - A failed export shows an error and starts no download**
- **Description**: Choosing an export when the mocked export status is failed shows an error notification and does not start a download. Playwright serves that failed response. JSON and CSV share this path, so one format is enough.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - Export format: JSON
  - Mocked export response whose status is failed
  - Any existing export confirmation is cancelled before the run
- **Action**:
  - Open the RHEL page
  - Choose "Export to JSON"
- **Verification**:
  - Read the notification
  - Confirm that no download starts
- **Expected Result**:
  - A pending info notification appears
  - An error notification then appears
  - The error title is "Export service failed"
  - No download starts

**billing-modal-TC001 - RHEL ELS On-Demand lists billing accounts that have usage and no subscription**
- **Description**: When the instances billing-account endpoint returns account IDs that the subscriptions billing-account endpoint omits, a banner opens a modal that lists those omitted accounts.
- **Setup**:
  - RHEL ELS On-Demand page (`rhel-for-x86-els-payg-addon`)
  - Mocked `GET /v1/instances/billing_account_ids` for this product, with multiple account IDs for each provider
  - Mocked `GET /v1/subscriptions/billing_account_ids` for this product
  - Each account ID is used once, so the same ID is not listed under another provider
  - The subscriptions response is an empty list, or it includes only some of the instance account IDs
  - At least one instance account ID is absent from the subscriptions response
- **Action**:
  - Open the ELS On-Demand page
  - Open the banner action
  - Read the modal list
  - Close the modal
- **Verification**:
  - Compare the modal list with the instance account IDs that the subscriptions response omits
- **Expected Result**:
  - The banner is displayed
  - The modal lists those omitted account IDs
  - Closing the modal hides it

## Error states

These cases come from the feature notes. No current Jest or plugin test covers the path from a rejected service call through to the rendered error.

**error-states-TC001 - Tally HTTP 500 shows an error in the chart card**
- **Description**: A failed tally request shows an error message in the chart card body.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - `GET` tally requests respond with HTTP 500
  - `GET` capacity requests respond with HTTP 200
- **Action**:
  - Open the RHEL page
- **Verification**:
  - Read the chart card body
- **Expected Result**:
  - The chart card body shows an error message whose title reports HTTP 500

**error-states-TC002 - Instances HTTP 500 shows an error in the instances card and leaves the chart visible**
- **Description**: A failed instances request shows an error in the instances card body and hides the instances card header and footer. The tally succeeds, so the chart still renders.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - `GET` instances requests respond with HTTP 500
  - Tally responds with HTTP 200 and chart data
- **Action**:
  - Open the RHEL page
  - Read the chart
  - Open the current instances tab
- **Verification**:
  - Read the chart
  - Read the instances card body, header, and footer
- **Expected Result**:
  - The chart renders the tally data
  - The instances card body shows an error message
  - The instances card header and footer are hidden

**error-states-TC003 - Subscriptions HTTP 500 shows an error in the subscriptions tab**
- **Description**: A failed subscriptions request shows an error message on the subscriptions tab.
- **Setup**:
  - RHEL for x86 page
  - `GET` subscriptions requests respond with HTTP 500
- **Action**:
  - Open the RHEL page
  - Open the current subscriptions tab
- **Verification**:
  - Read the subscriptions tab
- **Expected Result**:
  - The subscriptions tab shows an error message

**error-states-TC004 - Billing account HTTP 500 does not leave the product view spinning**
- **Description**: A failed billing-account preflight on a product that loads billing accounts shows an error and still renders the product view.
- **Setup**:
  - ROSA page, or another product that prefetches billing accounts
  - Billing account requests respond with HTTP 500
- **Action**:
  - Open the product page
  - Wait for the page to settle
- **Verification**:
  - Read the product view and any onload error
- **Expected Result**:
  - The product view is rendered
  - The page does not stay on an infinite spinner
  - The product view shows the billing-account error

**error-states-TC005 - A warning banner can be dismissed**
- **Description**: A warning banner from the banner API is visible, and closing it removes it. The ELS billing-account modal in billing-modal-TC001 is a different banner.
- **Setup**:
  - RHEL for x86 page
  - Banner API returns a warning banner
- **Action**:
  - Open the RHEL page
  - Close the banner
- **Verification**:
  - Read the banner before and after close
- **Expected Result**:
  - The warning banner is visible
  - After close, the banner is gone

**error-states-TC006 - Capacity HTTP 500 shows a chart error while subscriptions succeed**
- **Description**: A failed capacity request shows a chart error while the separate subscriptions request succeeds.
- **Setup**:
  - RHEL for x86 page with shared login storage state
  - Capacity requests respond with HTTP 500
  - Tally, instances, and subscriptions requests respond with HTTP 200
- **Action**:
  - Open the RHEL page
  - Open the subscriptions tab
- **Verification**:
  - Check the chart card error
  - Check the subscriptions response status and table
- **Expected Result**:
  - The chart card shows an error for the failed capacity request
  - The subscriptions API returns HTTP 200 and its table renders

## Chart edge cases

**chart-edge-TC001 - All-zero tally shows the chart empty state**
- **Description**: A tally whose values are all zero and whose `has_data` flag is false shows the chart empty state, a tooltip, and current usage as no data. The page does not crash.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - Fixed browser clock and timezone, so today does not move at a date boundary
  - Mocked tally inside the requested range, with every value set to 0 and `has_data` false
  - One point on a fixed past day, and one point on today
- **Action**:
  - Open the RHEL page
  - Read the chart empty state and current usage for today
  - Hover the past day
- **Verification**:
  - Read the chart empty state
  - Read the tooltip on the past day
  - Read current usage for today
- **Expected Result**:
  - The chart empty state shows "No data"
  - The past day's tooltip shows "no data"
  - Current usage for today shows "No data"
  - The page remains usable

**chart-edge-TC002 - Usage above capacity shows the above-threshold state**
- **Description**: When a mocked tally point is above the mocked capacity, the chart draws the above-threshold state.
- **Setup**:
  - RHEL for x86 page
  - Mocked tally whose usage is greater than capacity
- **Action**:
  - Open the RHEL page
- **Verification**:
  - Read the chart threshold treatment
- **Expected Result**:
  - The above-threshold visual is rendered

**chart-edge-TC003 - Very large tally values stay inside the chart**
- **Description**: A tally value of 999,999,999 renders on the y-axis without overflowing the chart.
- **Setup**:
  - RHEL for x86 page
  - Mocked tally containing 999,999,999
- **Action**:
  - Open the RHEL page
  - Read the y-axis
- **Verification**:
  - Check that the y-axis labels fit inside the chart
- **Expected Result**:
  - The y-axis renders the large value
  - The labels do not overflow the chart

**chart-edge-TC004 - Infinite quantity renders on the metric card**
- **Description**: A capacity response with `has_infinite_quantity` true shows the infinity symbol on the metric card. The same flag is the payload for rhel-graph-TC007, subscriptions-table-TC005, and subscriptions-table-TC006.
- **Setup**:
  - RHEL for x86 page
  - Mocked capacity with `has_infinite_quantity` true
- **Action**:
  - Open the RHEL page
  - Read the metric card
- **Verification**:
  - Read the card value
- **Expected Result**:
  - The metric card shows "∞"

**chart-edge-TC005 - Switching granularity refetches tally and updates the chart**
- **Description**: Changing granularity from Daily to Weekly sends a tally request with weekly granularity and replaces the chart with the weekly series.
- **Setup**:
  - RHEL for x86 page
  - Shared login storage state
  - One mocked daily tally and a different mocked weekly tally
- **Action**:
  - Open the RHEL page on Daily
  - Select Weekly
- **Verification**:
  - Read the tally request issued after the change
  - Read the chart
- **Expected Result**:
  - The request after the change uses weekly granularity
  - The chart shows the weekly series

**chart-edge-TC006 - A single data spike stays on the chart**
- **Description**: A tally with one point far above the surrounding points still draws that point.
- **Setup**:
  - RHEL for x86 page
  - Mocked tally with a single spike and otherwise modest values
- **Action**:
  - Open the RHEL page
  - Read the chart series
- **Verification**:
  - Compare the drawn series with the mocked spike
- **Expected Result**:
  - The spike is visible on the chart
  - The page does not crash

**chart-edge-TC007 - Gaps in tally render as gaps**
- **Description**: A tally with missing days renders those days as gaps and still draws the days that have values.
- **Setup**:
  - RHEL for x86 page
  - Mocked daily tally with interior days omitted
- **Action**:
  - Open the RHEL page
  - Read the chart series
- **Verification**:
  - Compare drawn points with the mocked days
- **Expected Result**:
  - Days with values are drawn
  - Missing days are gaps
  - The page does not crash

## Chart tooltips

**chart-tooltips-TC001 - Hovering a RHEL chart point shows that point's values**
- **Description**: Hovering a RHEL chart point shows a tooltip with the values for that point.
- **Setup**:
  - RHEL for x86 page
  - Mocked sockets tally with known values on at least one day
- **Action**:
  - Open the RHEL page
  - Hover a chart point that has data
- **Verification**:
  - Read the tooltip
- **Expected Result**:
  - The tooltip is visible
  - The tooltip lists the mocked values for that point

## Loading states

**loading-states-TC001 - The chart shows a skeleton while tally is delayed**
- **Description**: A tally response that is delayed shows the chart skeleton before the chart data arrives.
- **Setup**:
  - RHEL for x86 page
  - Tally response delayed by about 2 seconds, then HTTP 200 with data
- **Action**:
  - Open the RHEL page
  - Observe the chart card before the response arrives
- **Verification**:
  - Read the chart card during the delay and after the response
- **Expected Result**:
  - A skeleton or loader is visible before the data arrives
  - The chart replaces it when the tally returns

**loading-states-TC002 - The instances table shows a skeleton while instances are delayed**
- **Description**: An instances response that is delayed shows the table skeleton before the rows arrive.
- **Setup**:
  - RHEL for x86 page
  - Instances response delayed by about 2 seconds, then HTTP 200 with rows
- **Action**:
  - Open the RHEL instances tab
  - Observe the table before the response arrives
- **Verification**:
  - Read the instances card during the delay and after the response
- **Expected Result**:
  - A table skeleton is visible before the rows arrive
  - The rows replace it when the instances response returns

## Routing and theme

**routing-TC001 - An unknown Subscriptions route shows the nearest product view**
- **Description**: Closest matching stays enabled, so an unknown Subscriptions path shows the nearest product view.
- **Setup**:
  - Shared login storage state
  - `/subscriptions/bogus` is nearest to `/subscriptions/overview`
  - `/subscriptions/usage/bogus` is nearest to `/subscriptions/usage/rhel`
- **Action**:
  - Open `/subscriptions/bogus`
  - Open `/subscriptions/usage/bogus`
- **Verification**:
  - Read the view shown for each path
- **Expected Result**:
  - `/subscriptions/bogus` shows the overview content
  - `/subscriptions/usage/bogus` shows the RHEL usage content

**routing-TC002 - An SLA query parameter preselects the SLA filter**
- **Description**: Opening the RHEL page with `sla=Premium` in the query string shows Premium already selected.
- **Setup**:
  - RHEL for x86 page
  - URL query `sla=Premium`
  - Mocked tally for Premium
- **Action**:
  - Open the RHEL page with that query string
- **Verification**:
  - Read the SLA filter control
- **Expected Result**:
  - The SLA filter shows Premium without a manual selection

**theme-TC001 - The theme toggle applies dark mode**
- **Description**: Activating dark mode adds the PatternFly dark-theme class to the document element.
- **Setup**:
  - RHEL for x86 page
  - Light theme as the starting state
- **Action**:
  - Open the RHEL page
  - Activate the dark theme toggle
- **Verification**:
  - Read the class list on the document element
- **Expected Result**:
  - The document element has the `pf-v6-theme-dark` class

## Visual regression

**visual-regression-TC001 - The RHEL chart matches its screenshot baseline**
- **Description**: The RHEL chart with a fixed mocked tally matches a stored screenshot baseline.
- **Setup**:
  - RHEL for x86 page
  - Fixed mocked tally, capacity, and viewport
  - Chromium on stage
- **Action**:
  - Open the RHEL page
  - Wait until the chart has data
  - Capture the chart
- **Verification**:
  - Compare the capture with the baseline image
- **Expected Result**:
  - The chart matches the baseline

# Merged into another case

These notes do not get a second case.

* POC "chart renders with default mock data" is the mocked form of rhel-graph-TC001.
* POC "chart displays with mocked tally data on Stage" is the mocked form of rhel-graph-TC001.
* POC "chart displays with real Stage tally data" merges into rhel-graph-TC001. This plan serves a mocked tally. The live comparison stays in the plugin.
* POC "chart displays correct axis labels" is chart-labels-TC002 for RHEL and chart-labels-TC005 for OpenShift.
* POC "tooltip shows real data on hover" and the tooltip data sweep are chart-tooltips-TC001.
* POC "shows empty state when no instances" and "empty state test with mocked empty data on Stage" are instances-table-TC001.
* POC "system table displays instances" and "system table displays mocked data on Stage" are instances-table-TC004.
* POC "pagination works with real Stage data" is instances-table-TC011.
* POC "handles API error gracefully" and "API error handling with mocked error on Stage" are error-states-TC001.
* POC "shows loading state with slow API" is loading-states-TC001.
* POC "chart handles mocked data spike on Stage" is chart-edge-TC006.
* POC stage chart baseline is visual-regression-TC001.
* The notes mention a manual JSON download. That function is not in the current plugin. JSON and CSV automatic download are export-TC001.
* The notes mention `test_ui_system_table_sort`. That function is not in the current plugin. Column sort stays with the Jest table tests.
* Feature-note rows that name an existing plugin test are the matching case above. Examples: granularity and history dropdowns, SLA and usage filters, subscriptions and instances tables, RHEL graph filters, and chart legend labels.
* The check that a failed instances request leaves the chart visible is error-states-TC002.

# Not in the first suite

The epic implements ten cases. Every other case stays in this catalog.

* navigation-TC001. Real authentication across the product matrix. The first suite reuses the SWATCH-5638 login state on the RHEL page.
* navigation-TC002. Platform chrome outside this repo.
* navigation-TC003. Platform chrome outside this repo.
* navigation-TC004. Platform chrome outside this repo.
* navigation-TC005. Platform chrome outside this repo.
* rbac-TC001. Account data setup, with no UI assertion of its own.
* rbac-TC002. Multi-user RBAC.
* rbac-TC003. Multi-user RBAC.
* chart-labels-TC001. Product-matrix duplicate of the RHEL legend case.
* chart-labels-TC003. Later feature work. OpenShift legend toggle.
* chart-labels-TC004. Later feature work. The first suite checks that the RHEL legend labels render.
* chart-labels-TC005. Product-matrix duplicate. RHEL x-axis ticks are part of chart-labels-TC002.
* toolbar-TC003. Product-matrix duplicate of toolbar-TC002.
* toolbar-TC004. Later feature work. Mocked billing providers and accounts.
* toolbar-TC005. Later feature work. Mocked ROSA billing account filter.
* toolbar-TC006. Later feature work. Mocked rows before and after clear.
* toolbar-TC007. Later feature work. Display name search against mocked instances.
* toolbar-TC008. Later feature work. History dropdown on OpenShift On-Demand.
* toolbar-TC009. Product-matrix duplicate of toolbar-TC008.
* toolbar-TC010. Product-matrix duplicate of toolbar-TC008.
* rhel-graph-TC001. Later feature work. Mocked tally and capacity across granularities.
* rhel-graph-TC002. Later feature work. Mocked SLA-filtered tally. Filter controls are toolbar-TC002.
* rhel-graph-TC003. Later feature work. Mocked usage-filtered tally. Filter controls are toolbar-TC002.
* rhel-graph-TC004. Later feature work. Mocked type-filtered tally. Filter controls are toolbar-TC002.
* rhel-graph-TC005. Later feature work. Mocked combined-filter tally. Filter controls are toolbar-TC002.
* rhel-graph-TC006. Later feature work. Mocked tally with the console sidebar closed.
* rhel-graph-TC007. Later feature work. Mocked infinite capacity. The metric card is chart-edge-TC004.
* rhel-graph-TC008. Product-matrix duplicate of rhel-graph-TC001.
* rhel-graph-TC009. Product-matrix duplicate of rhel-graph-TC001.
* rhel-graph-TC010. Product-matrix duplicate of rhel-graph-TC001.
* rhel-graph-TC011. Product-matrix duplicate of rhel-graph-TC001.
* rhel-graph-TC012. Later feature work. Mocked ELS On-Demand vCPU graph and monthly card.
* rhel-graph-TC013. Product-matrix duplicate of rhel-graph-TC001.
* rhel-graph-TC014. Later feature work. Mocked threshold before and after a subscription increase.
* openshift-graph-TC001. Later feature work. Mocked cores and sockets tally.
* openshift-graph-TC002. Later feature work. Mocked SLA-filtered tally.
* openshift-graph-TC003. Later feature work. Mocked tally with the console sidebar closed.
* openshift-graph-TC004. Later feature work. Mocked infinite capacity.
* openshift-graph-TC005. Later feature work. Mocked hourly tally.
* openshift-graph-TC006. Later feature work. Mocked hourly tally.
* openshift-graph-TC007. Product-matrix duplicate of the monthly graph and card check.
* openshift-graph-TC008. Product-matrix duplicate of the monthly graph and card check.
* openshift-graph-TC009. Later feature work. Mocked ROSA graph and table totals.
* openshift-graph-TC010. Later feature work. Mocked ROSA remaining capacity.
* subscriptions-table-TC001. Later feature work. Empty IBM z subscriptions state.
* subscriptions-table-TC003. Product-matrix duplicate of subscriptions-table-TC002.
* subscriptions-table-TC004. Product-matrix duplicate of subscriptions-table-TC002.
* subscriptions-table-TC005. Later feature work. Mocked infinite-quantity subscription row.
* subscriptions-table-TC006. Later feature work. Mocked infinite-quantity subscription row.
* subscriptions-table-TC007. Product-matrix duplicate of subscriptions-table-TC002.
* subscriptions-table-TC008. Product-matrix duplicate of subscriptions-table-TC002.
* subscriptions-table-TC009. Product-matrix duplicate of subscriptions-table-TC002.
* subscriptions-table-TC010. Product-matrix duplicate of subscriptions-table-TC002.
* subscriptions-table-TC011. Product-matrix duplicate of subscriptions-table-TC002.
* subscriptions-table-TC012. Product-matrix duplicate of subscriptions-table-TC002.
* subscriptions-table-TC013. Later feature work. Mocked ROSA subscriptions before, with, and after a contract.
* subscriptions-table-TC014. Later feature work. Mocked ROSA subscriptions with no billing banner.
* subscriptions-table-TC015. Product-matrix duplicate of subscriptions-table-TC002.
* instances-table-TC001. Later feature work. Empty IBM z instances state.
* instances-table-TC002. Later feature work. Mocked OpenShift instances and graph totals.
* instances-table-TC003. Later feature work. Mocked OpenShift On-Demand hourly data.
* instances-table-TC005. Later feature work. Mocked OpenShift Dedicated hourly data.
* instances-table-TC006. Later feature work. SWATCH-703 regression.
* instances-table-TC007. Product-matrix duplicate of instances-table-TC004.
* instances-table-TC008. Later feature work. Mocked ELS On-Demand vCPU totals.
* instances-table-TC009. Later feature work. Mocked instances with known inventory ids.
* instances-table-TC010. Later feature work. Mocked instances with known instance ids.
* instances-table-TC011. Later feature work. Page sizes after the first suite.
* instances-table-TC012. Later feature work. Mocked GCP marketplace instance.
* instances-table-TC013. Product-matrix duplicate of instances-table-TC004.
* instances-table-TC014. Later feature work. Mocked hypervisor guest rows.
* instances-table-TC015. Later feature work. Mocked hypervisor with 100 or more guests.
* export-TC002. Later feature work. Mocked failed export with no download.
* billing-modal-TC001. Later feature work. Instance billing-account IDs omitted from subscriptions.
* error-states-TC003. Later feature work. Subscriptions error after the chart and instances errors.
* error-states-TC004. Later feature work. Billing-account preflight on ROSA.
* error-states-TC005. Later feature work. Generic banner dismiss.
* chart-edge-TC002. Later feature work. Above-threshold visual.
* chart-edge-TC003. Later feature work. Large y-axis values.
* chart-edge-TC004. Later feature work. Mocked infinity card.
* chart-edge-TC006. Later feature work. Data spike.
* chart-edge-TC007. Later feature work. Data gaps.
* chart-tooltips-TC001. Later feature work. Chart hover tooltip.
* loading-states-TC001. Later feature work. Chart skeleton.
* loading-states-TC002. Later feature work. Instances skeleton.
* routing-TC001. Later feature work. Unknown routes fall back to the nearest product view.
* routing-TC002. Later feature work. Query-string filter.
* theme-TC001. Later feature work. Dark mode toggle.
* visual-regression-TC001. Later feature work. Screenshot baseline.


