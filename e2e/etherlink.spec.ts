import { test, expect } from "@playwright/test"

test("shows v4 daos on switching to etherlink testnet", async ({ page }) => {
  await page.goto(`/explorer/daos`)

  await page.waitForLoadState("domcontentloaded")

  const etherlink = await page.locator('//*[@id="root"]/div/header/div/div/div[2]/div/div/div[1]/div')
  await etherlink.click()

  const modalTitle = await page.locator(".MuiDialog-container .MuiGrid-root").first()
  const modalTitleText = await modalTitle.textContent()
  console.log("Modal Title", modalTitleText)
  await expect(modalTitleText).toContain("Choose Network")

  const etherlinkTestnet = await modalTitle.locator("text=Etherlink Testnet")
  await expect(etherlinkTestnet).toBeVisible()

  await etherlinkTestnet.click()

  await page.waitForTimeout(10000)
  await page.reload()
  await page.waitForLoadState("domcontentloaded")

  const v4Daos = await page.locator("text=V4").first()
  await expect(v4Daos).toBeVisible()
})
