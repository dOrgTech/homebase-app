import { test, expect } from "@playwright/test"

// Sample route provided in task description
const SAMPLE_PROPOSAL_PATH =
  process.env.E2E_ETHERLINK_PROPOSAL_PATH ||
  "/explorer/etherlink/dao/0x441c3A385B1ed9e904125AD9B4EfF0942E746296/proposal/104912305041609587938545659990209164322707591098069374437263956378211490308449"

test.describe("etherlink proposal author copy", () => {
  test("copies full author address to clipboard (chromium only)", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "Clipboard read support is flaky on non-Chromium")

    await context.grantPermissions(["clipboard-read", "clipboard-write"]) 

    await page.goto(SAMPLE_PROPOSAL_PATH)
    await page.waitForLoadState("domcontentloaded")

    // Ensure the section renders
    await expect(page.getByText(/Posted by:/i).first()).toBeVisible()

    // Click the copy control beside the author name
    const copyButton = page.getByLabel("Copy author address").first()
    await expect(copyButton).toBeVisible()
    await copyButton.click()

    // Read from clipboard and validate an EVM address-like string
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    expect(copied).toMatch(/^0x[a-fA-F0-9]{40}$/)
  })
})

