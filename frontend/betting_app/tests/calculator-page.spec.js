const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("localhost:3000/calculator");
});

test.describe("toggler", () => {
  // Toggle toggler to compare
  test("compare", async ({ page }) => {
    await page.locator("text=Compare").click();
    await expect(page.locator("text=Compare")).toHaveCSS(
      "backgroundColor",
      "rgb(100, 149, 237)"
    );
    await expect(page.locator("text=Individual")).toHaveCSS(
      "backgroundColor",
      "rgb(255, 255, 255)"
    );
    const inputs = page.locator("#player-name-text-input");
    await expect(inputs).toHaveCount(2);
    await page.fill("#player-name-text-input >> nth=0", "sa");
    await expect(page.locator("text=Sabalenka")).toBeVisible();
    await expect(page.locator("text=Badosa")).toBeVisible();
    await expect(page.locator("text=Sakkari")).toBeVisible();
    await page.locator("text=Sakkari").click();
    await expect(page.locator("#player-name-text-input >> nth=0")).toHaveValue(
      "Sakkari, Maria"
    );
    await expect(page.locator("text=Badosa")).not.toBeVisible();
    await expect(page.locator("text=Sabalenka")).not.toBeVisible();

    await page.fill("#player-name-text-input >> nth=1", "si");
    await expect(page.locator("text=Siniakova")).toBeVisible();
    await expect(page.locator("text=Anisimova")).toBeVisible();
    await page.locator("text=Anisimova").click();
    await expect(page.locator("#player-name-text-input >> nth=1")).toHaveValue(
      "Anisimova, Amanda"
    );
    await expect(page.locator("text=Siniakova")).not.toBeVisible();
    await page.locator("text=submit").click();
    await expect(
      page.locator(".wrapper-calculator-form-properties")
    ).toBeVisible();
    const courtValue = await page.inputValue(
      ".wrapper-calculator-form-inner select >> nth=0"
    );
    const tournamentValue = await page.inputValue(
      ".wrapper-calculator-form-inner select >> nth=1"
    );
    const roundValue = await page.inputValue(
      ".wrapper-calculator-form-inner select >> nth=2"
    );
    const dateValue = await page.inputValue(
      ".wrapper-calculator-form-inner input"
    );
    await page.locator("text=Submit").click();
    await expect(page.locator("#compare-results")).toBeVisible();
    await expect(page.locator("#compare-results select >> nth=0")).toHaveValue(
      courtValue
    );
    await expect(page.locator("#compare-results select >> nth=1")).toHaveValue(
      tournamentValue
    );
    await expect(page.locator("#compare-results select >> nth=2")).toHaveValue(
      roundValue
    );
    await expect(page.locator("#compare-results input")).toHaveValue(dateValue);
    let matchesPlayed = await page.textContent(
      ".perfromance-stats-individual > div >> nth=1"
    );
    await page.locator(".circle-info-player-stats >> nth=0").click();
    await expect(page.locator(".get-player-matches >> nth=0")).toBeVisible();
    await page.locator("text=All matches").first().click();
    // +1 because of header
    await expect(page.locator(".player-matches")).toHaveCount(
      parseInt(matchesPlayed) + 1
    );
    await expect(
      page.locator(".get-player-matches >> nth=0")
    ).not.toBeVisible();

    matchesPlayed = await page.textContent("#Matcheswon_count >> nth=0");
    await page.locator(".circle-info-player-stats >> nth=0").click();
    await expect(page.locator(".get-player-matches >> nth=0")).toBeVisible();
    await page.locator("#won").first().click();
    await expect(
      page.locator(".get-player-matches >> nth=0")
    ).not.toBeVisible();
    // +1 because of header
    await expect(page.locator(".player-matches")).toHaveCount(
      parseInt(matchesPlayed) + 1
    );

    matchesPlayed = await page.textContent("#Matcheswon2-0_count >> nth=0");
    await page.locator(".circle-info-player-stats >> nth=0").click();
    await expect(page.locator(".get-player-matches >> nth=0")).toBeVisible();
    await page.locator("#won-2-0").first().click();
    await expect(
      page.locator(".get-player-matches >> nth=0")
    ).not.toBeVisible();
    // +1 because of header
    await expect(page.locator(".player-matches")).toHaveCount(
      parseInt(matchesPlayed) + 1
    );

    let allMatchesPlayed = await page.textContent(
      ".perfromance-stats-individual > div >> nth=1"
    );
    let wonMatches = await page.textContent("#Matcheswon_count >> nth=0");
    await page.locator(".circle-info-player-stats >> nth=0").click();
    await expect(page.locator(".get-player-matches >> nth=0")).toBeVisible();
    await page.locator("#lost").first().click();
    await expect(
      page.locator(".get-player-matches >> nth=0")
    ).not.toBeVisible();
    // +1 because of header
    await expect(page.locator(".player-matches")).toHaveCount(
      parseInt(allMatchesPlayed) - parseInt(wonMatches) + 1
    );
  });

  test("compare - errors - not found", async ({ page }) => {
    await page.locator("text=Compare").click();
    await expect(page.locator("text=Compare")).toHaveCSS(
      "backgroundColor",
      "rgb(100, 149, 237)"
    );
    await expect(page.locator("text=Individual")).toHaveCSS(
      "backgroundColor",
      "rgb(255, 255, 255)"
    );
    const inputs = page.locator("#player-name-text-input");
    await expect(inputs).toHaveCount(2);
    await page.fill("#player-name-text-input >> nth=0", "lebron james");

    await page.fill("#player-name-text-input >> nth=1", "cristiano ronaldo");
    await page.locator("text=Submit").click();
    await expect(
      page.locator(".wrapper-calculator-form-properties")
    ).toBeVisible();
    await page.locator("text=Submit").click();
    await expect(
      page.locator("text=Could not find these players")
    ).toBeVisible();
  });

  test("compare - errors - same names", async ({ page }) => {
    await page.locator("text=Compare").click();
    await expect(page.locator("text=Compare")).toHaveCSS(
      "backgroundColor",
      "rgb(100, 149, 237)"
    );
    await expect(page.locator("text=Individual")).toHaveCSS(
      "backgroundColor",
      "rgb(255, 255, 255)"
    );
    const inputs = page.locator("#player-name-text-input");
    await expect(inputs).toHaveCount(2);
    await page.fill("#player-name-text-input >> nth=0", "lebron james");

    await page.fill("#player-name-text-input >> nth=1", "lebron james");
    await page.locator("text=Submit").click();
    await expect(
      page.locator(".wrapper-calculator-form-properties")
    ).toBeVisible();
    await page.locator("text=Submit").click();
    await expect(page.locator("text=cannot be the same")).toBeVisible();
  });
  // INDIVIDUAL TEST
  test("individual", async ({ page }) => {
    await expect(page.locator("text=Individual")).toHaveCSS(
      "backgroundColor",
      "rgb(100, 149, 237)"
    );
    await expect(page.locator("text=Compare")).toHaveCSS(
      "backgroundColor",
      "rgb(255, 255, 255)"
    );
    await expect(page.locator("#player-name-text-input")).toBeVisible();
    await page.fill("#player-name-text-input", "ba");
    await expect(page.locator("text=Sabalenka")).toBeVisible();
    await expect(page.locator("text=Badosa")).toBeVisible();
    await expect(page.locator("text=Bara")).toBeVisible();

    await page.locator("text=Badosa").click();
    await expect(
      page.locator(".wrapper-calculator-form-properties")
    ).toBeVisible();
    const courtValue = await page.inputValue(
      ".wrapper-calculator-form-inner select >> nth=0"
    );
    const tournamentValue = await page.inputValue(
      ".wrapper-calculator-form-inner select >> nth=1"
    );
    const roundValue = await page.inputValue(
      ".wrapper-calculator-form-inner select >> nth=2"
    );
    const dateValue = await page.inputValue(
      ".wrapper-calculator-form-inner input"
    );
    await page.locator("text=Submit").click();
    await expect(page.locator(".wrapper-calculator-results")).toBeVisible();
    await expect(
      page.locator(".calculator-results-form select >> nth=0")
    ).toHaveValue(courtValue);
    await expect(
      page.locator(".calculator-results-form select >> nth=1")
    ).toHaveValue(tournamentValue);
    await expect(
      page.locator(".calculator-results-form select >> nth=2")
    ).toHaveValue(roundValue);
    await expect(page.locator(".calculator-results-form input")).toHaveValue(
      dateValue
    );

    let matchesPlayed = await page.textContent(
      ".perfromance-stats-individual > div >> nth=1"
    );
    await page.locator(".circle-info-player-stats >> nth=0").click();
    await expect(page.locator(".get-player-matches >> nth=0")).toBeVisible();
    await page.locator("text=All matches").first().click();
    // +1 because of header
    await expect(page.locator(".player-matches")).toHaveCount(
      parseInt(matchesPlayed) + 1
    );
    await expect(
      page.locator(".get-player-matches >> nth=0")
    ).not.toBeVisible();

    matchesPlayed = await page.textContent("#Matcheswon_count >> nth=0");
    await page.locator(".circle-info-player-stats >> nth=0").click();
    await expect(page.locator(".get-player-matches >> nth=0")).toBeVisible();
    await page.locator("#won").first().click();
    await expect(
      page.locator(".get-player-matches >> nth=0")
    ).not.toBeVisible();
    // +1 because of header
    await expect(page.locator(".player-matches")).toHaveCount(
      parseInt(matchesPlayed) + 1
    );

    matchesPlayed = await page.textContent("#Matcheswon2-0_count >> nth=0");
    await page.locator(".circle-info-player-stats >> nth=0").click();
    await expect(page.locator(".get-player-matches >> nth=0")).toBeVisible();
    await page.locator("#won-2-0").first().click();
    await expect(
      page.locator(".get-player-matches >> nth=0")
    ).not.toBeVisible();
    // +1 because of header
    await expect(page.locator(".player-matches")).toHaveCount(
      parseInt(matchesPlayed) + 1
    );

    let allMatchesPlayed = await page.textContent(
      ".perfromance-stats-individual > div >> nth=1"
    );
    let wonMatches = await page.textContent("#Matcheswon_count >> nth=0");
    await page.locator(".circle-info-player-stats >> nth=0").click();
    await expect(page.locator(".get-player-matches >> nth=0")).toBeVisible();
    await page.locator("#lost").first().click();
    await expect(
      page.locator(".get-player-matches >> nth=0")
    ).not.toBeVisible();
    // +1 because of header
    await expect(page.locator(".player-matches")).toHaveCount(
      parseInt(allMatchesPlayed) - parseInt(wonMatches) + 1
    );
  });

  test("individual - errors", async ({ page }) => {
    await expect(page.locator("#player-name-text-input")).toBeVisible();
    await page.fill("#player-name-text-input", "lebron james");
    await page.locator("text=Submit").click();
    await expect(
      page.locator(".wrapper-calculator-form-properties")
    ).toBeVisible();
    await page.locator("text=Submit").click();
    await expect(
      page.locator("text=Could not find these players")
    ).toBeVisible();
  }); 
});
