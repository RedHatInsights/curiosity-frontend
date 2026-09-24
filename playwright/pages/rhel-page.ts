import { expect, type Locator, type Page } from '@playwright/test';

export const RHEL_PRODUCT = 'RHEL for x86';
export const RHEL_METRIC = 'Sockets';
export const RHEL_PATH = '/subscriptions/usage/rhel';

export interface RHELPageOptions {
  url?: string;
}

/**
 * Page object for the RHEL usage view.
 */
export class RHELPage {
  private readonly defaultUrl: string;

  constructor(
    private readonly page: Page,
    options: RHELPageOptions = {}
  ) {
    this.defaultUrl = options.url ?? RHEL_PATH;
  }

  /**
   * The page heading used to confirm that the RHEL view has loaded.
   */
  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Red Hat Enterprise Linux' });
  }

  /**
   * The chart container rendered by the RHEL view.
   */
  get chart(): Locator {
    return this.page.locator('[data-test="graphStandalone"]');
  }

  /**
   * The chart area inside the chart container.
   */
  get chartArea(): Locator {
    return this.chart.locator('[data-test="curiosity-chartarea"]');
  }

  /**
   * Tooltip rendered by the chart or PatternFly.
   */
  get chartTooltip(): Locator {
    return this.page.locator('[role="tooltip"], .pf-c-tooltip, .VictoryTooltip, .curiosity-chartarea__tooltip').first();
  }

  /**
   * The tab that displays the current instances table.
   */
  get currentInstancesTab(): Locator {
    return this.page.getByRole('tab', { name: 'Current instances' });
  }

  /**
   * The current instances table.
   */
  get instancesTable(): Locator {
    return this.page.locator('.curiosity-inventory-card table');
  }

  /**
   * Rows in the current instances table.
   */
  get instanceRows(): Locator {
    return this.instancesTable.locator('tbody tr');
  }

  /**
   * Empty-state content displayed when no instances or graph data is available.
   */
  get emptyState(): Locator {
    return this.page.getByText(/no data|no results|clear some or all filters/i).first();
  }

  /**
   * Graph error message displayed when an API request fails.
   */
  get errorMessage(): Locator {
    return this.page.getByText('Internal service error. Graph display is unavailable.');
  }

  /**
   * Button that opens the graph error details.
   */
  get viewErrorButton(): Locator {
    return this.page.getByRole('button', { name: 'View error' }).first();
  }

  /**
   * Loading indicator displayed while the view is fetching data.
   */
  get loadingIndicator(): Locator {
    return this.page.locator('.pf-c-spinner, [role="progressbar"]').first();
  }

  /**
   * Pagination range for the instances table.
   */
  get paginationRange(): Locator {
    return this.page.getByText(/^\d+[-–]\d+ of \d+$/).first();
  }

  /**
   * Button used to move to the next instances page.
   */
  get nextPageButton(): Locator {
    return this.page.getByRole('button', { name: /next|Next page/i }).first();
  }

  /**
   * Navigate to the RHEL usage view and wait for its heading.
   *
   * @param url - Optional absolute or relative URL that overrides the configured default.
   */
  async goto(url: string = this.defaultUrl): Promise<void> {
    await this.page.goto(url);
    await this.heading.waitFor({ state: 'visible' });
  }

  /**
   * Open the current instances tab.
   */
  async navigateToInstances(): Promise<void> {
    await this.currentInstancesTab.click();
    await expect(this.currentInstancesTab).toHaveAttribute('aria-selected', 'true');
  }

  /**
   * Wait for at least one current instance row to be visible.
   *
   * @param timeout - Maximum wait time in milliseconds.
   */
  async waitForInstances(timeout: number = 10000): Promise<void> {
    await expect(this.instanceRows.first()).toBeVisible({ timeout });
  }

  /**
   * Return the number of currently rendered instance rows.
   */
  async getInstanceCount(): Promise<number> {
    return this.instanceRows.count();
  }

  /**
   * Return a locator for an instance display name.
   *
   * @param displayName - Host name rendered in the instances table.
   */
  instance(displayName: string): Locator {
    return this.instancesTable.getByText(displayName, { exact: true });
  }

  /**
   * Wait for an instance display name to be visible.
   *
   * @param displayName - Host name rendered in the instances table.
   * @param timeout - Maximum wait time in milliseconds.
   */
  async expectInstanceVisible(displayName: string, timeout: number = 10000): Promise<void> {
    await expect(this.instance(displayName)).toBeVisible({ timeout });
  }

  /**
   * Wait for a guest count to be visible in the instances table.
   *
   * @param guestCount - Number of guests rendered in the table.
   */
  async expectGuestCountVisible(guestCount: number): Promise<void> {
    await expect(this.instancesTable.getByText(String(guestCount), { exact: true }).first()).toBeVisible();
  }

  /**
   * Wait for the view's empty state.
   *
   * @param timeout - Maximum wait time in milliseconds.
   */
  async waitForEmptyState(timeout: number = 10000): Promise<void> {
    await expect(this.emptyState).toBeVisible({ timeout });
  }

  /**
   * Wait for the graph error message.
   *
   * @param timeout - Maximum wait time in milliseconds.
   */
  async waitForError(timeout: number = 10000): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout });
  }

  /**
   * Wait for the loading indicator to appear.
   *
   * @param timeout - Maximum wait time in milliseconds.
   */
  async waitForLoading(timeout: number = 2000): Promise<void> {
    await expect(this.loadingIndicator).toBeVisible({ timeout });
  }

  /**
   * Wait for the loading indicator to disappear.
   *
   * @param timeout - Maximum wait time in milliseconds.
   */
  async waitForLoadingToFinish(timeout: number = 5000): Promise<void> {
    await expect(this.loadingIndicator).not.toBeVisible({ timeout });
  }

  /**
   * Wait for a pagination range to be visible.
   *
   * @param range - Expected pagination text.
   * @param timeout - Maximum wait time in milliseconds.
   */
  async expectPaginationRange(range: RegExp | string, timeout: number = 10000): Promise<void> {
    await expect(this.page.getByText(range).first()).toBeVisible({ timeout });
  }

  /**
   * Click the next-page button when another page is available.
   *
   * @returns Whether the next-page button was visible and enabled.
   */
  async goToNextPage(): Promise<boolean> {
    if (!(await this.nextPageButton.isVisible()) || !(await this.nextPageButton.isEnabled())) {
      return false;
    }

    await this.nextPageButton.click();
    return true;
  }
}
