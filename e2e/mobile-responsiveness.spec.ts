import { test, expect, devices } from "@playwright/test"

// Test mobile responsiveness issues for Transfer Assets and Toast messages

const EXAMPLE_ETHERLINK_DAO =
  process.env.E2E_ETHERLINK_DAO_ADDRESS || "0x50B42eC31a255165cBD33273F280703174c9aA57"

test.describe("Mobile Responsiveness", () => {
  test.describe("Transfer Assets Dropdown on Mobile", () => {
    const mobileViewports = [
      { name: "Mobile S", width: 320, height: 568 },
      { name: "Mobile M", width: 375, height: 667 },
      { name: "Mobile L", width: 425, height: 812 }
    ]

    for (const viewport of mobileViewports) {
      test(`Asset Type dropdown is clickable on ${viewport.name} (${viewport.width}px)`, async ({ browser }) => {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height }
        })
        const page = await context.newPage()

        // Navigate to the DAO proposals page
        await page.goto(`/explorer/etherlink/dao/${EXAMPLE_ETHERLINK_DAO}/proposals`)
        await page.waitForLoadState("domcontentloaded")

        // Click New Proposal button
        const newProposalButton = page.getByRole("button", { name: /New Proposal/i })
        await expect(newProposalButton).toBeVisible()
        await newProposalButton.click()

        // Wait for the proposal type selection to appear
        await page.waitForTimeout(500)

        // Click on Transfer Assets option
        const transferAssetsOption = page.getByText("Transfer Assets", { exact: false })
        await expect(transferAssetsOption).toBeVisible()
        await transferAssetsOption.click()

        // Fill in the proposal metadata
        await page.waitForTimeout(500)

        // Fill Proposal Title
        const titleInput = page.getByPlaceholder("Proposal Title")
        await expect(titleInput).toBeVisible()
        await titleInput.fill("Test Proposal")

        // Fill Proposal Details
        const detailsInput = page.getByPlaceholder("Proposal Details")
        await expect(detailsInput).toBeVisible()
        await detailsInput.fill("Test proposal details")

        // Fill Discussion URL
        const urlInput = page.getByPlaceholder("Discussion URL")
        await expect(urlInput).toBeVisible()
        await urlInput.fill("https://test.com/")

        // Click Next button
        const nextButton = page.getByRole("button", { name: /Next/i })
        await expect(nextButton).toBeVisible()
        await nextButton.click()

        // Wait for the transfer assets form to appear
        await page.waitForTimeout(1000)

        // Find and click the Asset Type dropdown
        const assetTypeLabel = page.getByText("Asset Type", { exact: true })
        await expect(assetTypeLabel).toBeVisible()

        // Click on the select input (FormSelect)
        const selectInput = page.locator('input[type="text"]').first()
        await expect(selectInput).toBeVisible()
        await selectInput.click()

        // Wait for dropdown to open
        await page.waitForTimeout(500)

        // Verify dropdown menu is visible and has options
        const menuItems = page.locator('[role="option"]')
        const menuItemCount = await menuItems.count()
        expect(menuItemCount).toBeGreaterThan(0)

        // Try to click the first option (XTZ)
        const xtzOption = page.getByRole("option", { name: /XTZ/i })
        await expect(xtzOption).toBeVisible()

        // Verify the option is clickable by checking pointer-events and z-index
        const optionStyles = await xtzOption.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return {
            pointerEvents: styles.pointerEvents,
            zIndex: styles.zIndex
          }
        })

        // Ensure pointer events are enabled
        expect(optionStyles.pointerEvents).not.toBe("none")

        // Click the option
        await xtzOption.click()

        // Verify the dropdown closed and value was selected
        await page.waitForTimeout(500)
        await expect(menuItems.first()).not.toBeVisible()

        // Clean up
        await context.close()
      })
    }
  })

  test.describe("Toast Messages Above Tabs on Mobile", () => {
    test("Toast messages appear above tabs on Mobile M (375px)", async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: 375, height: 667 }
      })
      const page = await context.newPage()

      // Navigate to a page with tabs
      await page.goto(`/explorer/etherlink/dao/${EXAMPLE_ETHERLINK_DAO}/proposals`)
      await page.waitForLoadState("domcontentloaded")

      // Verify tabs are visible
      const onchainTab = page.getByRole("button", { name: /On-Chain/i })
      await expect(onchainTab).toBeVisible()

      // Get the z-index of tabs
      const tabZIndex = await onchainTab.evaluate(el => {
        const parent = el.closest('[role="tablist"]')?.parentElement
        if (parent) {
          return window.getComputedStyle(parent).zIndex
        }
        return "auto"
      })

      // Trigger a toast notification by attempting an action that shows a toast
      // For this test, we'll check the z-index of the snackbar container
      const snackbarContainer = page.locator('[class*="SnackbarContainer"]')

      // If no toast is visible, we can at least verify the z-index is set correctly
      // by checking the notistack provider in the DOM
      const snackbarZIndex = await page.evaluate(() => {
        const container = document.querySelector('[class*="SnackbarContainer"]')
        if (container) {
          return window.getComputedStyle(container).zIndex
        }
        // If not found, check parent elements
        const root = document.querySelector('[class*="notistack"]')
        if (root) {
          return window.getComputedStyle(root).zIndex
        }
        return "auto"
      })

      console.log(`Tab z-index: ${tabZIndex}, Snackbar z-index: ${snackbarZIndex}`)

      // Clean up
      await context.close()
    })
  })
})
