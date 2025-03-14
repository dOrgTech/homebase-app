import { test, expect } from "@playwright/test"

test("shows dao name", async ({ page }) => {
  await page.goto("/explorer/dao/KT1PY9PXm8NMAgSEZg7bUtFjmV2Sj64bKuVV/overview")

  await Promise.race([page.waitForLoadState("networkidle"), page.waitForTimeout(40000)])

  const title = await page.locator("//*[@id='root']/div/div[1]/div/div[1]/div/div[1]/div/div[1]/p")
  const daoDescriptionEl = await page.locator("//*[@id='root']/div/div[1]/div/div[1]/div/div[2]/p")
  const daoDescription = await daoDescriptionEl.textContent()

  await expect(title).toHaveText("Humanitez")
  expect(daoDescription?.length).toBeGreaterThan(10)
})
