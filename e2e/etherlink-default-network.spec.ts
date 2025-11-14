import { test, expect } from "@playwright/test"

const EXAMPLE_ETHERLINK_DAO =
  process.env.E2E_ETHERLINK_DAO_ADDRESS || "0x7a2C766A2b11a3D7AB984883Cff64388aDb8c1Aa"

test.describe("url-driven default network", () => {
  test("deep-link under /explorer/etherlink sets etherlink_mainnet when unset", async ({ page }) => {
    // Fresh context should start with empty localStorage; ensure it
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())

    await page.goto(`/explorer/etherlink/dao/${EXAMPLE_ETHERLINK_DAO}/overview`)
    await page.waitForLoadState("domcontentloaded")

    // Local storage is persisted by the bootstrap logic
    const storedNetwork = await page.evaluate(() => localStorage.getItem("homebase:network"))
    expect(storedNetwork).toBe("etherlink_mainnet")

    // The header should show "Etherlink Mainnet" via the ChangeNetworkButton
    await expect(page.getByText(/Etherlink Mainnet/i).first()).toBeVisible()
  })

  test("does not override an existing user-selected network", async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => {
      localStorage.setItem("homebase:network", "ghostnet")
    })

    await page.goto(`/explorer/etherlink/dao/${EXAMPLE_ETHERLINK_DAO}/overview`)
    await page.waitForLoadState("domcontentloaded")

    const storedNetwork = await page.evaluate(() => localStorage.getItem("homebase:network"))
    expect(storedNetwork).toBe("ghostnet")

    // Tezos network label remains as Ghostnet (DAO metadata may switch later; bootstrap should not)
    await expect(page.getByText(/Tezos Ghostnet/i).first()).toBeVisible()
  })
})

