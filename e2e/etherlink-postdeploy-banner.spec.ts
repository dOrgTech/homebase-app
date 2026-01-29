import { test, expect } from "@playwright/test"

test("shows post-deploy banner with explorer link", async ({ page }) => {
  const tx = `0x${"a".repeat(64)}`
  await page.goto(`/explorer/daos?postDeploy=dao-created&network=etherlink_shadownet&tx=${tx}`)

  await page.waitForLoadState("domcontentloaded")

  // Banner title
  await expect(page.getByText(/DAO deployed/i).first()).toBeVisible()

  // View transaction button and URL
  const viewTx = page.getByRole("button", { name: /View transaction/i })
  await expect(viewTx).toBeVisible()

  const href = await viewTx.getAttribute("href")
  expect(href).toContain("https://shadownet.explorer.etherlink.com")
  expect(href).toContain("/tx/")
})

