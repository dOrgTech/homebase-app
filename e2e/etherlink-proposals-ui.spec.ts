import { test, expect } from "@playwright/test"

// Basic UI smoke test for Etherlink proposals page using the unified shell
// Uses a stable example address from the prompt; test asserts static UI parts only

const EXAMPLE_ETHERLINK_DAO =
  process.env.E2E_ETHERLINK_DAO_ADDRESS || "0x7a2C766A2b11a3D7AB984883Cff64388aDb8c1Aa"

test.describe("etherlink proposals ui", () => {
  test("renders shell with tabs, filter, and new proposal", async ({ page }) => {
    await page.goto(`/explorer/etherlink/dao/${EXAMPLE_ETHERLINK_DAO}/proposals`)
    await page.waitForLoadState("domcontentloaded")

    // Title
    await expect(page.getByText("Proposals").first()).toBeVisible()

    // Tabs
    await expect(page.getByRole("button", { name: /On-Chain/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /Off-Chain/i })).toBeVisible()

    // Filter trigger and New Proposal action
    await expect(page.getByText(/Filter & Sort/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /New Proposal/i })).toBeVisible()

    // Open Filter dialog and close
    await page.getByText(/Filter & Sort/i).click()
    await expect(page.getByText(/Proposal Status/i)).toBeVisible()
    await expect(page.getByText(/^Type$/i)).toBeVisible()
    await page.getByRole("button", { name: /Apply/i }).click()
  })
})
