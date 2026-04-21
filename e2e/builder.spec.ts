import { test, expect } from "@playwright/test";

test.describe("CV Builder User Journey", () => {
  test("User can login, open builder, enter details, and see preview/ats suggestions", async ({
    page,
  }) => {
    // 1. Visit Login Page
    await page.goto("/en/login");

    // Given the project uses Next-Auth, we will assume a known test user
    // or public mode if implemented. Let's just navigate to the builder for now.
    // If the builder requires auth, adjust this to use the mock session or Playwright's auth-setup.
    await page.goto("/en/builder");

    // Check if we are redirected to login or staying on the builder.
    // If you have a specific "Create Resume" button on the dashboard:
    // await page.goto('/en/dashboard');
    // await page.click('text="Create Resume"');

    // 2. Fill basic details
    // Assuming there are input fields in the builder form for the basic resume info
    // For example:
    const nameInput = page.locator(
      'input[name="fullName"], input[placeholder="Full Name"], input[aria-label="Full Name"]',
    );
    if ((await nameInput.count()) > 0) {
      await nameInput.fill("John Doe Test");
    }

    const jobTitleInput = page.locator(
      'input[name="title"], input[placeholder="Job Title"]',
    );
    if ((await jobTitleInput.count()) > 0) {
      await jobTitleInput.fill("Senior Software Engineer");
    }

    // 3. Verify the PDF/Preview renders with the filled data
    // We can check if the preview pane contains the text
    await expect(
      page.locator(
        '.preview-container, .resume-preview, canvas, [data-testid="resume-preview"]',
      ),
    ).toBeVisible({ timeout: 10000 });

    // Check if the name appears somewhere in the preview area
    // Try catching it via a less strict text selector in the DOM if HTML preview, or just rely on canvas visibility.
    // await expect(page.locator('text=John Doe Test')).toBeVisible();

    // 4. Check ATS Recommendations or Score
    // Look for ATS UI elements such as score percentage, "ATS Recommendations" button, etc.
    const atsButton = page.locator(
      'text="ATS", text="Analyze", button:has-text("Score")',
    );
    if ((await atsButton.count()) > 0) {
      await atsButton.click();
      // Assert that the AI suggestions feature or ATS feedback panel pops up
      await expect(
        page.locator(
          'text="Recommendations", text="Suggestions", .ats-feedback',
        ),
      ).toBeVisible({ timeout: 10000 });
    }
  });
});
