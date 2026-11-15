import { test, expect, open } from "./fixtures"

// Read-only checks against a deployed build (the PR's deploy preview in CI). The fixtures are
// long-lived production DAOs and closed proposals, so their content does not change.
const TEZOS_DAO = "KT1PY9PXm8NMAgSEZg7bUtFjmV2Sj64bKuVV" // Humanitez
const TEZOS_PROPOSAL = "abc12edb682bfa5d8af7b4c915919d29b40f5c122f0d13590da589e6acce598f"
const LITE_DAO = "6536c7151901bb3e1fe38d8d" // Tezos Domains
const LITE_POLL = "682f5ef88a8ff1b61d75a29f" // P-024
const ETHERLINK_DAO = "0x1291F817f1865E4186E7D9917B7BC22BFD6B0B09" // 4 Chains T
const ETHERLINK_PROPOSAL = "35226985079609692402590430439922856491577133624984980043048492349185345817905"

const daoCount = /^\d+ DAOs$/

test.describe("Tezos", () => {
  test("explorer lists on-chain and Lite DAOs", async ({ page }) => {
    await open(page, "/explorer/daos", "mainnet")
    await expect(page.getByText(daoCount)).toBeVisible()
    await expect(page.getByText("Tezos Domains", { exact: true })).toBeVisible()
    await expect(page.getByText("Lite", { exact: true }).first()).toBeVisible()
  })

  test("DAO overview loads from the indexer", async ({ page }) => {
    await open(page, `/explorer/dao/${TEZOS_DAO}/overview`, "mainnet")
    await expect(page.getByText("Humanitez", { exact: true })).toBeVisible()
    await expect(page.getByText("Voting Addresses")).toBeVisible()
    await expect(page.getByText("Current Cycle")).toBeVisible()
  })

  test("executed proposal shows its transfer and history", async ({ page }) => {
    await open(page, `/explorer/dao/${TEZOS_DAO}/proposal/${TEZOS_PROPOSAL}`, "mainnet")
    await expect(page.getByText("Token Transfer")).toBeVisible()
    await expect(page.getByText("tz1crxFJQJsAD18uHStYuqBLEv2AcZKKQJ8G")).toBeVisible()
    await expect(page.getByText("Executed", { exact: true }).first()).toBeVisible()
  })

  test("Lite community and poll load from the backend", async ({ page }) => {
    await open(page, `/explorer/lite/dao/${LITE_DAO}/community`, "mainnet")
    await expect(page.getByText(/^P-024: Restore 1 Tez Pricing/)).toBeVisible()

    await open(page, `/explorer/lite/dao/${LITE_DAO}/community/proposal/${LITE_POLL}`)
    await expect(page.getByText("P-024: Restore 1 Tez Pricing for 5+ Character Domains")).toBeVisible()
    await expect(page.getByText("Off-Chain Proposal", { exact: false })).toBeVisible()
  })
})

test.describe("Etherlink", () => {
  test("explorer lists DAOs from Firestore", async ({ page }) => {
    await open(page, "/explorer/daos", "etherlink_mainnet")
    await expect(page.getByText(daoCount)).toBeVisible()
    await expect(page.locator(`a[href="/explorer/etherlink/dao/${ETHERLINK_DAO}"]`)).toBeVisible()
  })

  test("Economy DAOs are left out of the Shadownet list", async ({ page }) => {
    await open(page, "/explorer/daos", "etherlink_shadownet")
    await expect(page.getByText("Prolifer8", { exact: true })).toBeVisible()
    await expect(page.getByText("Jamaica", { exact: true })).toHaveCount(0)
  })

  test("a direct DAO link selects Etherlink Mainnet for a new visitor", async ({ page }) => {
    await open(page, `/explorer/etherlink/dao/${ETHERLINK_DAO}/overview`)
    await expect(page.getByText("4 Chains T", { exact: true })).toBeVisible()
    await expect(page.getByText("Etherlink Mainnet").first()).toBeVisible()
    expect(await page.evaluate(() => localStorage.getItem("homebase:network"))).toBe("etherlink_mainnet")
  })

  test("proposal list and proposal page", async ({ page }) => {
    await open(page, `/explorer/etherlink/dao/${ETHERLINK_DAO}/proposals`, "etherlink_mainnet")
    await page.getByText("topilu", { exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/proposal/${ETHERLINK_PROPOSAL}$`))
    await expect(page.getByText("editRegistry(string,string)", { exact: false })).toBeVisible()
    await expect(page.getByText("Quorum Not Met")).toBeVisible()
  })
})
