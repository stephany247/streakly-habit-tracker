import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("habit-tracker-users");
      localStorage.removeItem("habit-tracker-session");
      localStorage.removeItem("habit-tracker-habits");
    });
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL("/login", { timeout: 3000 });
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "u1", email: "a@b.com" }),
      );
      localStorage.setItem("habit-tracker-habits", "[]");
    });
    await page.goto("/");
    await expect(page).toHaveURL("/dashboard", { timeout: 3000 });
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login", { timeout: 3000 });
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill("newuser@test.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();
    await expect(page).toHaveURL("/dashboard", { timeout: 3000 });
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-users",
        JSON.stringify([
          {
            id: "u1",
            email: "user1@test.com",
            password: "pass",
            createdAt: "",
          },
          {
            id: "u2",
            email: "user2@test.com",
            password: "pass",
            createdAt: "",
          },
        ]),
      );
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          {
            id: "h1",
            userId: "u1",
            name: "Drink Water",
            description: "",
            frequency: "daily",
            createdAt: "",
            completions: [],
          },
          {
            id: "h2",
            userId: "u2",
            name: "Run",
            description: "",
            frequency: "daily",
            createdAt: "",
            completions: [],
          },
        ]),
      );
    });
    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill("user1@test.com");
    await page.getByTestId("auth-login-password").fill("pass");
    await page.getByTestId("auth-login-submit").click();
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
    await expect(page.getByTestId("habit-card-run")).toHaveCount(0);
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "u1", email: "a@b.com" }),
      );
      localStorage.setItem("habit-tracker-habits", "[]");
    });
    await page.goto("/dashboard");
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Morning Run");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-morning-run")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "u1", email: "a@b.com" }),
      );
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          {
            id: "h1",
            userId: "u1",
            name: "Meditate",
            description: "",
            frequency: "daily",
            createdAt: "",
            completions: [],
          },
        ]),
      );
    });
    await page.goto("/dashboard");
    await expect(page.getByTestId("habit-streak-meditate")).toHaveText(
      "0 day streak",
    );
    await page.getByTestId("habit-complete-meditate").click();
    await expect(page.getByTestId("habit-streak-meditate")).toHaveText(
      "1 day streak",
    );
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill("persist@test.com");
    await page.getByTestId("auth-signup-password").fill("pass");
    await page.getByTestId("auth-signup-submit").click();
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Persist Habit");
    await page.getByTestId("habit-save-button").click();
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("habit-card-persist-habit")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "u1", email: "a@b.com" }),
      );
      localStorage.setItem("habit-tracker-habits", "[]");
    });
    await page.goto("/dashboard");
    await page.getByTestId("auth-logout-button").click();
    await expect(page).toHaveURL("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "u1", email: "a@b.com" }),
      );
      localStorage.setItem("habit-tracker-habits", "[]");
    });
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await context.setOffline(true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("dashboard-page")).toBeVisible({
      timeout: 5000,
    });
    await context.setOffline(false);
  });
});
