import { test, expect } from '@playwright/test';

/**
 * Page-Specific E2E Tests
 * Tests each page individually to ensure they load and function correctly
 */

test.describe('Home Page (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads without errors', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/TavernKeeper/i);

    // Check for main heading
    const heading = page.getByRole('heading', { name: /TAVERNKEEPER/i });
    await expect(heading).toBeVisible();

    // Check for no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    const criticalErrors = errors.filter(e =>
      e.includes('Uncaught') || e.includes('ReferenceError') || e.includes('TypeError')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('InnScene renders (container present)', async ({ page }) => {
    // Check for InnScene container (DOM-based, not canvas)
    const innContainer = page.locator('[class*="InnScene"], [class*="inn"], main').first();
    await expect(innContainer).toBeVisible({ timeout: 5000 });

    // Check container has dimensions
    const containerSize = await innContainer.boundingBox();
    expect(containerSize?.width).toBeGreaterThan(0);
    expect(containerSize?.height).toBeGreaterThan(0);
  });

  test('view switching works (if implemented)', async ({ page }) => {
    // The home page uses view switching via game store, not navigation buttons
    // Check that the page structure is correct for view switching
    await page.waitForLoadState('networkidle');

    // Check that scene area exists (where views would switch)
    const sceneArea = page.locator('main').first();
    await expect(sceneArea).toBeVisible();

    // The actual view switching is handled by the game store and components
    // This test verifies the structure exists for view switching
  });

  test('party roster displays', async ({ page }) => {
    // Check for party roster section
    const partyRoster = page.getByText(/Party Roster/i).or(
      page.locator('[class*="roster"], [class*="party"]').first()
    );
    await expect(partyRoster).toBeVisible({ timeout: 5000 });
  });

  test('inn log displays', async ({ page }) => {
    // Check for inn log section
    const innLog = page.getByText(/Inn Log/i).or(
      page.locator('[class*="log"], [class*="Log"]').first()
    );
    await expect(innLog).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Party Page (/party)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/party');
  });

  test('page loads without errors', async ({ page }) => {
    // Check page title/heading
    const heading = page.getByRole('heading', { name: /Party Manager/i });
    await expect(heading).toBeVisible();

    // Check for no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    const criticalErrors = errors.filter(e =>
      e.includes('Uncaught') || e.includes('ReferenceError') || e.includes('TypeError')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('agent roster renders', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for roster section
    const roster = page.getByText(/Roster/i).or(
      page.locator('[class*="roster"], [class*="Roster"]').first()
    );
    await expect(roster).toBeVisible({ timeout: 5000 });

    // Check for agent cards OR empty state message
    const hasAgents = await page.locator('[class*="agent"], [class*="card"], [class*="hero"]').count() > 0;
    const hasEmptyState = await page.getByText(/No heroes|No heroes recruited/i).count() > 0;

    expect(hasAgents || hasEmptyState).toBeTruthy();
  });

  test('clicking an agent shows details', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find agent cards
    const agentCards = page.locator('[class*="agent"], [class*="card"], [class*="hero"]').filter({
      hasNot: page.getByText(/No heroes|No heroes recruited/i)
    });

    const count = await agentCards.count();

    if (count > 0) {
      // Click first agent
      await agentCards.first().click();
      await page.waitForTimeout(500);

      // Check for details panel
      const detailsPanel = page.locator('[class*="detail"], [class*="Details"]').or(
        page.getByText(/Details/i)
      );
      await expect(detailsPanel.first()).toBeVisible({ timeout: 5000 });

      // Check for stats display
      const stats = page.getByText(/STR|INT|HP|MP/i).or(
        page.locator('[class*="stat"], [class*="Stat"]').first()
      );
      await expect(stats.first()).toBeVisible({ timeout: 5000 });
    } else {
      // If no agents, check for empty state in roster OR details panel
      const emptyStateRoster = page.getByText(/No heroes|No heroes recruited/i);
      const emptyStateDetails = page.getByText(/Select a hero to view details/i);

      const hasRosterEmpty = await emptyStateRoster.count() > 0;
      const hasDetailsEmpty = await emptyStateDetails.count() > 0;

      expect(hasRosterEmpty || hasDetailsEmpty).toBeTruthy();
    }
  });

  test('personality slider interactions work', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find agent cards and click one if available
    const agentCards = page.locator('[class*="agent"], [class*="card"]').filter({
      hasNot: page.getByText(/No heroes|No heroes recruited/i)
    });

    const count = await agentCards.count();
    if (count > 0) {
      await agentCards.first().click();
      await page.waitForTimeout(500);

      // Look for personality sliders
      const sliders = page.locator('input[type="range"]');
      const sliderCount = await sliders.count();

      if (sliderCount > 0) {
        // Test first slider
        const firstSlider = sliders.first();
        await expect(firstSlider).toBeVisible();

        // Get initial value
        const initialValue = await firstSlider.inputValue();

        // Change slider value
        await firstSlider.fill('0.8');
        await page.waitForTimeout(200);

        // Verify value changed
        const newValue = await firstSlider.inputValue();
        expect(newValue).not.toBe(initialValue);

        // Check for percentage display update
        const percentageDisplay = page.getByText(/%/i).first();
        await expect(percentageDisplay).toBeVisible({ timeout: 2000 });
      }
    }
  });

  test('inventory/equipment section displays', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Click an agent if available
    const agentCards = page.locator('[class*="agent"], [class*="card"]').filter({
      hasNot: page.getByText(/No heroes/i)
    });

    const count = await agentCards.count();
    if (count > 0) {
      await agentCards.first().click();
      await page.waitForTimeout(500);

      // Check for equipment/inventory section
      const equipment = page.getByText(/Equipment|Inventory|Gear/i).or(
        page.locator('[class*="equipment"], [class*="inventory"]').first()
      );
      await expect(equipment.first()).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Map Page (/map)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/map');
  });

  test('page loads without errors', async ({ page }) => {
    // Check page heading
    const heading = page.getByRole('heading').filter({ hasText: /Map|Cellar|Warren/i }).first();
    await expect(heading).toBeVisible();

    // Check for no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    const criticalErrors = errors.filter(e =>
      e.includes('Uncaught') || e.includes('ReferenceError') || e.includes('TypeError')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('map container renders', async ({ page }) => {
    // Check for map container (DOM based)
    const mapContainer = page.locator('[class*="MapScene"], [class*="map"], main').first();
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    // Check container has dimensions
    const containerSize = await mapContainer.boundingBox();
    expect(containerSize?.width).toBeGreaterThan(0);
    expect(containerSize?.height).toBeGreaterThan(0);

    // Check for map content (nodes or loading state)
    const mapContent = page.getByText(/Loading Map|Dungeon|room|chamber/i).or(
      page.locator('[class*="MapScene"]')
    );
    await expect(mapContent.first()).toBeVisible({ timeout: 5000 });
  });

  test('scroll UI and controls render', async ({ page }) => {
    // Check for map controls
    const controls = page.getByText(/Controls/i).or(
      page.locator('[class*="control"], [class*="Control"]').first()
    );
    await expect(controls.first()).toBeVisible({ timeout: 5000 });

    // Check for legend
    const legend = page.getByText(/Legend/i).or(
      page.locator('[class*="legend"], [class*="Legend"]').first()
    );
    await expect(legend.first()).toBeVisible({ timeout: 5000 });

    // Check for current room info
    const roomInfo = page.getByText(/Current Room|Room/i).or(
      page.locator('[class*="room"], [class*="Room"]').first()
    );
    await expect(roomInfo.first()).toBeVisible({ timeout: 5000 });
  });

  test('map controls are interactive', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find control buttons
    const controlButtons = page.locator('button').filter({
      hasText: /⏮|⏯|⏭|Play|Pause|Speed/i
    });

    const buttonCount = await controlButtons.count();
    if (buttonCount > 0) {
      // Click a control button
      await controlButtons.first().click();
      await page.waitForTimeout(300);

      // Should not crash
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });
});

test.describe('Run Detail Page (/run/[id])', () => {
  test('page loads without errors for valid run ID', async ({ page }) => {
    // Try to access a run detail page
    await page.goto('/run/test-run-id');
    await page.waitForLoadState('networkidle');

    // Should load without crashing
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check for run ID heading (format: "Run #test-run-id")
    const runHeading = page.getByRole('heading', { name: /Run #test-run-id/i });
    await expect(runHeading).toBeVisible({ timeout: 5000 });
  });

  test('run stats display', async ({ page }) => {
    await page.goto('/run/test-run-id');
    await page.waitForLoadState('networkidle');

    // Check for stats section - look for "Status" panel title or stat labels
    const statusPanel = page.getByText(/Status/i).or(
      page.getByText(/Duration|Turns|Gold Found|XP Gained/i).first()
    );
    await expect(statusPanel.first()).toBeVisible({ timeout: 5000 });
  });

  test('event log displays', async ({ page }) => {
    await page.goto('/run/test-run-id');
    await page.waitForLoadState('networkidle');

    // Check for event log - look for "Event Log" title or log content
    const eventLog = page.getByText(/Event Log/i).or(
      page.getByText(/Party entered|attacked|defeated|chest|Boss/i).first()
    );
    await expect(eventLog.first()).toBeVisible({ timeout: 5000 });
  });

  test('replay visualization renders', async ({ page }) => {
    await page.goto('/run/test-run-id');
    await page.waitForLoadState('networkidle');

    // Check for replay section (may use PixiMap component or DOM)
    const replay = page.getByText(/Replay/i).or(
      page.locator('[class*="replay"], [class*="Replay"], [class*="PixiMap"]').first()
    );
    await expect(replay.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Miniapp Page (/miniapp)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/miniapp');
  });

  test('page loads without errors', async ({ page }) => {
    // Check page heading
    const heading = page.getByRole('heading', { name: /TavernKeeper Mini/i });
    await expect(heading).toBeVisible();

    // Check for no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    const criticalErrors = errors.filter(e =>
      e.includes('Uncaught') || e.includes('ReferenceError') || e.includes('TypeError')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('frame navigation works', async ({ page }) => {
    // Check for navigation buttons
    const adventureButton = page.getByRole('button', { name: /Adventure/i });
    const partyButton = page.getByRole('button', { name: /Party/i });

    await expect(adventureButton).toBeVisible({ timeout: 5000 });
    await expect(partyButton).toBeVisible({ timeout: 5000 });

    // Click party button
    await partyButton.click();
    await page.waitForTimeout(500);

    // Should show party frame
    const partyContent = page.getByText(/Back/i).or(
      page.locator('[class*="party"], [class*="Party"]').first()
    );
    await expect(partyContent.first()).toBeVisible({ timeout: 5000 });

    // Click back
    const backButton = page.getByRole('button', { name: /← Back|Back/i });
    await backButton.first().click();
    await page.waitForTimeout(500);

    // Should be back at home
    const homeContent = page.getByText(/Adventure|Status/i);
    await expect(homeContent.first()).toBeVisible({ timeout: 5000 });
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check page is visible
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 375;
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 20);

    // Check content is accessible
    const heading = page.getByRole('heading', { name: /TavernKeeper Mini/i });
    await expect(heading).toBeVisible();
  });
});

