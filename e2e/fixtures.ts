import { test as base, expect, Page } from "@playwright/test"

// Firestore enforces App Check, which a headless browser cannot pass with reCAPTCHA. A debug
// token registered for the web app (APP_CHECK_DEBUG_TOKEN) is handed to the Firebase SDK
// before the app boots.
const appCheckDebugToken = process.env.APP_CHECK_DEBUG_TOKEN

export const test = base.extend<{ pageErrors: string[] }>({
  context: async ({ context }, use) => {
    if (appCheckDebugToken) {
      await context.addInitScript(token => {
        Object.assign(self, { FIREBASE_APPCHECK_DEBUG_TOKEN: token })
      }, appCheckDebugToken)
    }
    await use(context)
  },
  // Every test fails if the page throws an uncaught error.
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on("pageerror", error => errors.push(error.message))
      await use(errors)
      expect(errors, "uncaught page errors").toEqual([])
    },
    { auto: true }
  ]
})

export { expect }

export type Network = "mainnet" | "etherlink_mainnet" | "etherlink_shadownet"

// Opens a page with the network selector already set, as a returning visitor would have it.
export const open = async (page: Page, path: string, network?: Network) => {
  if (network) {
    await page.addInitScript(value => localStorage.setItem("homebase:network", value), network)
  }
  await page.goto(path)
}
