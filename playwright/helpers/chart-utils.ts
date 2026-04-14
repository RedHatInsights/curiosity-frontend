/**
 * Chart Testing Utilities for Playwright
 *
 * Provides helpers for testing PatternFly React Charts (SVG-based)
 */

import { Page, Locator, expect } from '@playwright/test';

export class ChartUtils {
  constructor(private page: Page) {}

  /**
   * Get Y-axis maximum value (highest value displayed on chart)
   *
   * @example
   * const maxValue = await chartUtils.getYAxisMaxValue();
   * expect(maxValue).toBeGreaterThanOrEqual(125); // Mocked data max was 130
   */
  async getYAxisMaxValue(): Promise<number> {
    const values = await this.getYAxisValues();
    return Math.max(...values);
  }

  /**
   * Get date range from X-axis labels
   *
   * @example
   * const dates = await chartUtils.getXAxisDateRange();
   * expect(dates).toContain('Apr 1');
   */
  async getXAxisDateRange(): Promise<string[]> {
    return this.getXAxisLabels();
  }

  /**
   * Wait for chart to render (SVG exists)
   *
   * @example
   * await chartUtils.waitForChart();
   */
  async waitForChart(timeout: number = 5000): Promise<void> {
    const chartArea = this.getChartArea();
    await chartArea.waitFor({ state: 'visible', timeout });

    // Wait for the main chart SVG
    const svg = this.getSvg();
    await svg.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get chart area locator
   */
  getChartArea(): Locator {
    return this.page
      .locator('[data-test="graphStandalone"]')
      .locator('[data-test="curiosity-chartarea"]');
  }

  /**
   * Get SVG locator (main chart SVG, not legend icons)
   */
  getSvg(): Locator {
    // Chart area contains multiple SVGs (main chart + legend icon SVGs)
    // Get the first SVG which is the main chart container
    return this.getChartArea().locator('svg').first();
  }

  /**
   * Count data series (lines/areas) in chart
   *
   * @example
   * const seriesCount = await chartUtils.countDataSeries();
   * expect(seriesCount).toBe(3); // Physical, Virtual, Cloud
   */
  async countDataSeries(): Promise<number> {
    const svg = this.getSvg();

    // PatternFly charts render data series as paths
    const paths = svg.locator('path[role="presentation"]').filter({
      hasNot: this.page.locator('[fill="none"]')
    });

    return paths.count();
  }

  /**
   * Count data points (circles) in chart
   *
   * Note: Not all charts render circle markers. Area/line charts may return 0.
   * Use getChartData() for reliable data point counting from the data-test-data attribute.
   *
   * @example
   * const pointCount = await chartUtils.countDataPoints();
   * expect(pointCount).toBeGreaterThanOrEqual(0);
   */
  async countDataPoints(): Promise<number> {
    const svg = this.getSvg();
    const circles = svg.locator('circle[role="presentation"]');
    return circles.count();
  }

  /**
   * Get X-axis labels (dates/time periods)
   */
  async getXAxisLabels(): Promise<string[]> {
    const svg = this.getSvg();

    // X-axis labels have IDs starting with "chart-axis-0-ChartLabel"
    const labels = svg.locator('[id^="chart-axis-0-ChartLabel"]');
    const count = await labels.count();

    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await labels.nth(i).textContent();
      if (text) {
        texts.push(text.trim());
      }
    }

    return texts;
  }

  /**
   * Get Y-axis labels (numeric values as strings)
   */
  async getYAxisLabels(): Promise<string[]> {
    const svg = this.getSvg();

    // Y-axis labels have IDs starting with "chart-axis-1-ChartLabel"
    const labels = svg.locator('[id^="chart-axis-1-ChartLabel"]');
    const count = await labels.count();

    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await labels.nth(i).textContent();
      if (text) {
        texts.push(text.trim());
      }
    }

    return texts;
  }

  /**
   * Parse Y-axis label to number
   * Handles formatted values like "1K" (1000), "2.5M" (2500000)
   *
   * @example
   * parseYAxisValue("1K") // 1000
   * parseYAxisValue("2.5M") // 2500000
   * parseYAxisValue("500") // 500
   */
  parseYAxisValue(value: string): number {
    const trimmed = value.trim();

    // Handle K (thousands)
    if (trimmed.endsWith('K')) {
      return parseFloat(trimmed.slice(0, -1)) * 1000;
    }

    // Handle M (millions)
    if (trimmed.endsWith('M')) {
      return parseFloat(trimmed.slice(0, -1)) * 1000000;
    }

    // Handle B (billions)
    if (trimmed.endsWith('B')) {
      return parseFloat(trimmed.slice(0, -1)) * 1000000000;
    }

    // Plain number
    return parseFloat(trimmed);
  }

  /**
   * Get Y-axis labels as numbers
   *
   * @example
   * const values = await chartUtils.getYAxisValues();
   * // [0, 1000, 2000, 3000, 4000, 5000]
   */
  async getYAxisValues(): Promise<number[]> {
    const labels = await this.getYAxisLabels();
    return labels.map(label => this.parseYAxisValue(label));
  }

  /**
   * Hover over a data point to show tooltip
   *
   * @example
   * await chartUtils.hoverDataPoint(0); // Hover over first data point
   * await expect(page.locator('[role="tooltip"]')).toBeVisible();
   */
  async hoverDataPoint(index: number = 0): Promise<void> {
    const svg = this.getSvg();

    // Try circles first (scatter/line charts with markers)
    const circles = svg.locator('circle[role="presentation"]');
    const circleCount = await circles.count();

    if (circleCount > 0 && index < circleCount) {
      await circles.nth(index).hover();
    } else {
      // Fallback: hover over path at specific point
      const paths = svg.locator('path[role="presentation"]').first();
      const box = await paths.boundingBox();

      if (box) {
        // Hover at different points along the path
        const x = box.x + (box.width / 10) * (index + 1);
        const y = box.y + box.height / 2;
        await this.page.mouse.move(x, y);
      }
    }

    // Wait a bit for tooltip animation
    await this.page.waitForTimeout(500);
  }

  /**
   * Get tooltip data after hovering
   * Returns structured data with date and category values
   *
   * @example
   * await chartUtils.hoverDataPoint(0);
   * const data = await chartUtils.getTooltipData();
   * // { date: 'March 20', categories: { Physical: 40, Virtual: 24, ... } }
   */
  async getTooltipData(): Promise<{ date: string; categories: Record<string, number> } | null> {
    const tooltip = this.page.locator('.curiosity-chartarea__tooltip');
    const count = await tooltip.count();

    if (count === 0) {
      return null;
    }

    // Get date from table header
    const dateHeader = tooltip.locator('thead th');
    const date = await dateHeader.textContent();

    // Get all category rows from tbody
    const rows = tooltip.locator('tbody tr');
    const rowCount = await rows.count();

    const categories: Record<string, number> = {};

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const category = await row.locator('th').textContent();
      const valueText = await row.locator('td').textContent();

      if (category && valueText) {
        const cleanCategory = category.replace(/\s+/g, ' ').trim();
        const value = parseInt(valueText.trim());

        if (!isNaN(value)) {
          categories[cleanCategory] = value;
        }
      }
    }

    return {
      date: date?.trim() || '',
      categories
    };
  }

  /**
   * Get tooltip value after hovering (legacy method, returns raw text)
   *
   * @example
   * await chartUtils.hoverDataPoint(0);
   * const value = await chartUtils.getTooltipValue();
   */
  async getTooltipValue(): Promise<string | null> {
    const tooltip = this.page.locator('.curiosity-chartarea__tooltip');
    const count = await tooltip.count();

    if (count > 0) {
      const text = await tooltip.textContent();
      if (text && text.trim()) {
        return text.trim();
      }
    }

    return null;
  }

  /**
   * Get all data values by sweeping across the chart and reading tooltips
   * Moves pixel by pixel until tooltip changes (iqe-core approach)
   * Works with any granularity: daily, monthly, quarterly, yearly
   *
   * @example
   * const dataPoints = await chartUtils.getAllDataValuesBySweep();
   * console.log(dataPoints);
   * // [{ date: 'March 20', categories: { Physical: 40, Virtual: 24, ... } }, ...]
   */
  async getAllDataValuesBySweep(): Promise<Array<{ date: string; categories: Record<string, number> }>> {
    const svg = this.getSvg();
    const box = await svg.boundingBox();

    if (!box) {
      throw new Error('Cannot get chart bounding box');
    }

    const dataPoints: Array<{ date: string; categories: Record<string, number> }> = [];
    let previousDate = '';
    const pixelStep = 20; // Move 10 pixels at a time

    // Sweep horizontally across the chart
    for (let x = box.x + 50; x < box.x + box.width - 50; x += pixelStep) {
      const y = box.y + box.height / 2;

      // Move mouse to this position
      await this.page.mouse.move(x, y);
      await this.page.waitForTimeout(100);

      // Read tooltip data
      const tooltipData = await this.getTooltipData();

      if (tooltipData && tooltipData.date !== previousDate) {
        // Date changed - we've moved to a new data point
        dataPoints.push({
          date: tooltipData.date,
          categories: tooltipData.categories
        });

        previousDate = tooltipData.date;
      }
    }

    return dataPoints;
  }

  /**
   * Get all data values by hovering over chart points
   *
   * @example
   * const values = await chartUtils.getAllDataValues();
   * expect(values).toContain('130'); // Our max mocked value
   */
  async getAllDataValues(maxPoints: number = 10): Promise<string[]> {
    const values: string[] = [];

    for (let i = 0; i < maxPoints; i++) {
      await this.hoverDataPoint(i);
      const value = await this.getTooltipValue();

      if (value) {
        values.push(value);
      } else {
        break; // No more data points
      }
    }

    return values;
  }

  /**
   * Verify chart has data (not empty)
   */
  async assertHasData(): Promise<void> {
    await this.waitForChart();

    const svg = this.getSvg();
    const paths = svg.locator('path[role="presentation"]');
    const pathCount = await paths.count();

    expect(pathCount).toBeGreaterThan(0);
  }

  /**
   * Verify chart is empty
   */
  async assertIsEmpty(): Promise<void> {
    // Chart area should exist but have no paths
    const chartArea = this.getChartArea();
    await expect(chartArea).toBeVisible();

    const svg = this.getSvg();
    const paths = svg.locator('path[role="presentation"]').filter({
      hasNot: this.page.locator('[fill="none"]')
    });
    const pathCount = await paths.count();

    expect(pathCount).toBe(0);
  }

  /**
   * Wait for chart to finish loading/animating
   */
  async waitForChartStable(timeout: number = 2000): Promise<void> {
    await this.waitForChart();

    // Wait for any animations to complete
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Get chart screenshot for visual regression
   */
  async getChartScreenshot(): Promise<Buffer> {
    await this.waitForChartStable();

    const chartArea = this.getChartArea();
    return chartArea.screenshot();
  }

  /**
   * Debug helper: log all SVG elements
   */
  async debugSvgStructure(): Promise<void> {
    const svg = this.getSvg();
    const elements = await svg.locator('*').all();

    console.log('=== SVG Structure ===');
    for (const element of elements) {
      const tagName = await element.evaluate(el => el.tagName);
      const role = await element.getAttribute('role');
      const text = await element.textContent();

      console.log(`<${tagName}${role ? ` role="${role}"` : ''}>`, text || '');
    }
    console.log('===================');
  }
}
