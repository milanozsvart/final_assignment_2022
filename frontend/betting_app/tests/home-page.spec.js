const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("localhost:3000/");
});

test.describe("login", () => {
  test("clicking login button", async ({ page }) => {
    // Click login button
    await page.locator("#login-btn").click();
    await expect(
      page.locator("#login-form"),
      "login form should appear"
    ).toBeVisible();
    // Try logging in with no data provided
    await page.locator("#login-button").click();
    await expect(page.locator("text=Password is required")).toBeVisible();
    await expect(page.locator("text=Email is required")).toBeVisible();

    // Try logging in with wrong password
    await page.fill("#login-form input[type=email]", "admin@admin.com");
    await page.fill("#login-form input[type=password]", "wrongpassword");
    await page.locator("#login-button").click();
    await expect(
      page.locator("text=Wrong password, please try again!")
    ).toBeVisible();

    //Try logging in with wrong email
    await page.fill("#login-form input[type=email]", "admin@admin.co");
    await page.fill("#login-form input[type=password]", "wrongpassword");
    await page.locator("#login-button").click();
    await expect(
      page.locator(
        "text=There is no account registered with this email address"
      )
    ).toBeVisible();

    // Log in
    await page.fill("#login-form input[type=email]", "admin@admin.com");
    await page.fill("#login-form input[type=password]", "admin123");
    await page.locator("#login-button").click();
    await expect(page.locator("#login-form")).not.toBeVisible();
    await expect(page.locator("text=My account")).toBeVisible();

    // Log out
    await page.locator("text=My account").click();
    await page.locator("text=Logout").click();
    await expect(page.locator("text=My account")).not.toBeVisible();
    await expect(page.locator("#login-btn")).toBeVisible();
  });
});

test.describe("add to bets", () => {
  test("without login", async ({ page }) => {
    await page.locator("text=Add to bets").first().click();
    await expect(page.locator("text=Match cannot be added")).toBeVisible();
  });
  test("with login", async ({ page }) => {
    await page.locator("#login-btn").click();
    await page.fill("#login-form input[type=email]", "admin@admin.com");
    await page.fill("#login-form input[type=password]", "admin123");
    await page.locator("#login-button").click();
    await expect(page.locator("#login-form")).not.toBeVisible();
    await expect(page.locator("text=My account")).toBeVisible();
    await page.locator("text=Add to bets").first().click();
    await expect(page.locator("#account-btn > #bets-number")).toHaveText("1");
    await page.locator("text=Remove from bets").first().click();
    await expect(page.locator("#account-btn > #bets-number")).not.toBeVisible();
  });
});

test.describe("handle bets", () => {
  test("handle bets", async ({ page }) => {
    await page.locator("#login-btn").click();
    await page.fill("#login-form input[type=email]", "admin@admin.com");
    await page.fill("#login-form input[type=password]", "admin123");
    await page.locator("#login-button").click();
    await expect(page.locator("#login-form")).not.toBeVisible();
    await expect(page.locator("text=My account")).toBeVisible();
    await page.locator("text=Add to bets").first().click();
    await expect(page.locator("#account-btn > #bets-number")).toHaveText("1");

    await page.locator("text=My account").click();
    await expect(page.locator("#account-manager-window")).toBeVisible();
    await expect(page.locator("#selected-matches > #bets-number")).toHaveText(
      "1"
    );
    await page.locator("#selected-matches").click();
    await expect(page.locator(".bets-wrapper")).toBeVisible();
    const list = page.locator(".bet-item");
    await expect(list).toHaveCount(1);
    await page.locator("#remove-match-from-bets").first().click();
    const matches = page.locator(".bet-item");
    await expect(matches).toHaveCount(0);
  });

  test("save bets", async ({ page }) => {
    await page.locator("#login-btn").click();
    await page.fill("#login-form input[type=email]", "admin@admin.com");
    await page.fill("#login-form input[type=password]", "admin123");
    await page.locator("#login-button").click();
    await expect(page.locator("#login-form")).not.toBeVisible();
    await expect(page.locator("text=My account")).toBeVisible();
    await page.locator("text=Add to bets").first().click();
    await expect(page.locator("#account-btn > #bets-number")).toHaveText("1");

    await page.locator("text=My account").click();
    await expect(page.locator("#account-manager-window")).toBeVisible();
    await expect(page.locator("#selected-matches > #bets-number")).toHaveText(
      "1"
    );
    const randNum = Math.floor(Math.random() * 10000);
    await page.locator("#selected-matches").click();
    await expect(page.locator(".bets-wrapper")).toBeVisible();
    await page.fill("#insert-bet-name", `test_bet_${randNum}`);
    await page.locator("text=Save").click();
    await expect(page.locator(".bets-wrapper")).not.toBeVisible();
    await expect(page.locator("#account-manager-window")).not.toBeVisible();
    await page.locator("text=My account").click();
    await page.locator("text=My bets").click();
    await expect(page.locator(`text=test_bet_${randNum}`)).toBeVisible();
  });

  test("save bets - with errors", async ({ page }) => {
    await page.locator("#login-btn").click();
    await page.fill("#login-form input[type=email]", "admin@admin.com");
    await page.fill("#login-form input[type=password]", "admin123");
    await page.locator("#login-button").click();
    await expect(page.locator("#login-form")).not.toBeVisible();
    await expect(page.locator("text=My account")).toBeVisible();
    await page.locator("text=Add to bets").first().click();
    await expect(page.locator("#account-btn > #bets-number")).toHaveText("1");
    await page.locator("text=My account").click();
    await expect(page.locator("#account-manager-window")).toBeVisible();
    await page.locator("#selected-matches").click();
    await page.fill("#insert-bet-name", `test_bet_31`);
    await page.locator("text=Save").click();
    await expect(page.locator("text=already exists")).toBeVisible();
    await page.locator("#remove-match-from-bets").click();
    const matches = page.locator(".bet-item");
    await expect(matches).toHaveCount(0);
    await page.locator("text=Save").click();
    await expect(page.locator("text=select matches to bet on")).toBeVisible();
  });
});

test.describe("register", () => {
  test("register", async ({ page }) => {
    await page.locator("#login-btn").click();
    await expect(
      page.locator("#login-form"),
      "login form should appear"
    ).toBeVisible();
    await page.locator("text=Register").click();
    await page.locator("#register-btn").click();
    await expect(page.locator("text=Password is required")).toBeVisible();
    await expect(page.locator("text=Email is required")).toBeVisible();
    await page.fill("#register-form input[type=email]", "admin@admin.com");
    await page.fill("#register-form #password-textField", "kiskutya");
    await expect(page.locator("text=Password is required")).not.toBeVisible();
    await expect(page.locator("text=Email is required")).not.toBeVisible();
    await page.locator("#register-btn").click();
    await expect(page.locator("text=Passwords don't match")).toBeVisible();
    await page.fill("#register-form #confirmPassword-textField", "kiskutya");
    await page.locator("#register-btn").click();
    await expect(
      page.locator(
        "text=There is already an account registered with this email address"
      )
    ).toBeVisible();
  });
});
