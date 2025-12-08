import { test, expect } from "@playwright/test"

/**
 * Debug test to check HTML rendering issue in off-chain proposals
 * This test captures console logs to see what the API returns vs what gets rendered
 */
test.describe("Off-chain proposal HTML rendering debug", () => {
  const proposalUrl =
    "/explorer/lite/dao/64ef1c7d514de7b078cb8ed2/community/proposal/6916b6a14ee78564d7029f3f"

  test("should log API response and debug info", async ({ page }) => {
    const consoleLogs: string[] = []

    // Capture all console logs
    page.on("console", msg => {
      const text = msg.text()
      consoleLogs.push(text)
      console.log(`[Browser Console] ${text}`)
    })

    // Navigate to proposal page
    await page.goto(proposalUrl)

    // Wait for page to load and API to be called
    await page.waitForTimeout(3000)

    // Find logs from our debug code
    const apiLogs = consoleLogs.filter(log => log.includes("🔍 RAW API RESPONSE") || log.includes("Description"))

    console.log("\n📊 Summary of Console Logs:")
    console.log("=" .repeat(50))
    apiLogs.forEach(log => console.log(log))
    console.log("=" .repeat(50))

    // Check if we got the debug logs
    expect(
      consoleLogs.some(log => log.includes("🔍 RAW API RESPONSE")),
      "Should have API response debug logs"
    ).toBeTruthy()

    // Try to find the description info in logs
    const descLengthLog = consoleLogs.find(log => log.includes("Description length from API:"))
    const hasHtmlLog = consoleLogs.find(log => log.includes("Has HTML tags:"))

    if (descLengthLog) console.log("\n✅ Found:", descLengthLog)
    if (hasHtmlLog) console.log("✅ Found:", hasHtmlLog)

    // Check the actual rendered content
    const proposalContent = await page.locator(".proposal-details").textContent()
    console.log("\n📄 Rendered content length:", proposalContent?.length || 0)
    console.log("📄 First 100 chars:", proposalContent?.substring(0, 100))

    // Check if debug panel is visible
    const debugPanel = page.locator('div:has-text("🔍 DEBUG INFO")')
    const debugPanelExists = await debugPanel.count()

    if (debugPanelExists > 0) {
      const debugText = await debugPanel.textContent()
      console.log("\n🐛 Debug Panel Content:")
      console.log(debugText)
    }
  })
})
