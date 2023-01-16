import { makeStyles, ThemeProvider } from "@material-ui/core"
import { InMemorySigner } from "@taquito/signer"
import { TezosToolkit } from "@taquito/taquito"
import { render, waitFor } from "@testing-library/react"
import App from "App"
import { createMemoryHistory } from "history"
import { MigrationParams } from "modules/creator/state"
import { ActionSheetProvider } from "modules/explorer/context/ActionSheets"
import { SnackbarProvider } from "notistack"
import { QueryClient, QueryClientProvider } from "react-query"
import { Router } from "react-router-dom"
import { rpcNodes, TezosProvider } from "services/beacon"
import { theme } from "theme"

import puppeteer from "puppeteer-core"
import { BaseDAO, fromStateToBaseStorage } from "services/contracts/baseDAO"
import { deployMetadataCarrier } from "services/contracts/metadataCarrier/deploy"
import { generateStorageContract } from "services/baseDAODocker"
import baseDAOContractCode from "../services/contracts/baseDAO/michelson/baseDAO"
import { getDAOs, getProposals } from "services/indexer/dao/services"
import { DAOListItem } from "services/indexer/types"

import { bobPrivKey, alicePrivKey, network, url, metadataParams, params } from "./constants"
import { createTestDAO } from "./helper"
import { Proposal, ProposalStatus } from "services/indexer/dao/mappers/proposal/types"
console.log("bobPrivKey: ", bobPrivKey)
import { useProposals } from "services/indexer/dao/hooks/useProposals"
import { getDAO } from "services/indexer/dao/services"
import { client } from "services/indexer/graphql"
import { GET_PROPOSALS_QUERY } from "services/indexer/dao/queries"

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    devtools: false
  }
  return debugging_mode
}

let Tezos: TezosToolkit

const initTezosToolKit = async (pk: string) => {
  Tezos = new TezosToolkit(rpcNodes.ghostnet)
  console.log("Tezos Connected: ")
  return Tezos
}

let browser: any
let page: any

beforeAll(async () => {
  browser = await puppeteer.launch({ executablePath: "/opt/homebrew/bin/chromium", headless: false, devtools: true })
  page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768 })
  await initTezosToolKit(alicePrivKey)
}, 5000000)

afterAll(() => {
  if (isDebugging()) {
    browser.close()
  }
})

const setTezosSignerProvider = async (pk: string) => {
  console.log("pk: ", pk)
  const signer = await InMemorySigner.fromSecretKey(pk)
  Tezos.setProvider({ signer })
}

// it("Check if treasury proposal can be created", async () => {
//   const amountToTransfer = "1"
//   await setTezosSignerProvider(bobPrivKey)

//   //   const daoContract = await createTestDAO(Tezos)
//   //   const addressContract = daoContract.address

//   //   const contractStorage = await daoContract.storage()
//   //   expect(contractStorage).not.toBe(null)
//   //   if (contractStorage instanceof Object) {
//   if (true) {
//     // expect((contractStorage as any).governance_token.address).toBe(params.orgSettings.governanceToken.address)
//     await page.goto(url)
//     await page.evaluate(() => {
//       localStorage.setItem("homebase:network", "ghostnet") // not work, produce errors :(
//     })
//     await page.goto(url + "/explorer/daos")
//     await page.waitForSelector("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
//     const dao = await page.$("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
//     if (dao) {
//       console.log("dao: ", dao)
//       const daoElem = await dao.$("#dao-name")
//       const name = await daoElem?.evaluate((el: any) => el.textContent)
//       console.log("name: ", name)
//       // expect(params.orgSettings.name).toBe(name)
//       expect("LevelDAO").toBe(name)
//       await page.click("#warning-close-button")
//       await page.click("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
//       await page.waitForSelector("#page-Treasury")
//       await page.click("#page-Treasury")

//       await page.waitForSelector("#new-transfer:not([disabled])", { timeout: 60000 })
//       await page.click("#new-transfer")

//       await page.waitForSelector("#simple-tab-0")
//       await page.click("#simple-tab-0")

//       await page.click(`button[aria-label="Open"]`)
//       await page.click(`li[data-option-index="0"]`)

//       await page.waitForSelector(`input[name="transferForm.transfers.0.recipient"]`)
//       await page.click(`input[name="transferForm.transfers.0.recipient"]`)
//       await page.$eval(
//         `input[name="transferForm.transfers.0.recipient"]`,
//         (el: any, value: any) => (el.value = value),
//         params.orgSettings.administrator.substring(0, params.orgSettings.administrator.length - 1)
//       )
//       await page.type(
//         `input[name="transferForm.transfers.0.recipient"]`,
//         params.orgSettings.administrator.charAt(params.orgSettings.administrator.length - 1)
//       )

//       await page.waitForSelector(`input[name="transferForm.transfers.0.amount"]`)
//       await page.click(`input[name="transferForm.transfers.0.amount"]`)
//       await page.$eval(
//         `input[name="transferForm.transfers.0.amount"]`,
//         (el: any, value: any) => (el.value = value),
//         amountToTransfer.substring(0, amountToTransfer.length - 1)
//       )
//       await page.type(
//         `input[name="transferForm.transfers.0.amount"]`,
//         amountToTransfer.charAt(amountToTransfer.length - 1)
//       )

//       // await page.waitForTimeout(100000);
//       await page.click("#warning-close-button")

//       await page.waitForSelector('button[id="submit-proposal"]')
//       await page.click('button[id="submit-proposal"]')
//       await page.waitForTimeout(30000)
//     }
//   }
// }, 5000000)

// it("Check if registry proposal can be created", async () => {
//   await setTezosSignerProvider(bobPrivKey)
// const key = "Hello" + Math.random()
// const value = "World" + Math.random()
//   //   const daoContract = await createTestDAO(Tezos)
//   //   const addressContract = daoContract.address

//   //   const contractStorage = await daoContract.storage()
//   //   expect(contractStorage).not.toBe(null)
//   //   if (contractStorage instanceof Object) {
//   if (true) {
//     // expect((contractStorage as any).governance_token.address).toBe(params.orgSettings.governanceToken.address)

//     await page.goto(url)
//     await page.evaluate(() => {
//       localStorage.setItem("homebase:network", "ghostnet") // not work, produce errors :(
//     })
//     await page.goto(url + "/explorer/daos")
//     await page.waitForSelector("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
//     const dao = await page.$("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")

//     if (dao) {
//       console.log("dao: ", dao)
//       const daoElem = await dao.$("#dao-name")
//       const name = await daoElem?.evaluate((el: any) => el.textContent)
//       console.log("name: ", name)
//       // expect(params.orgSettings.name).toBe(name)
//       expect("LevelDAO").toBe(name)

//       await page.click("#warning-close-button")
//       await page.click("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
//       await page.waitForSelector("#page-Registry")
//       await page.click("#page-Registry")

//       await page.waitForSelector("button#new-item:not([disabled])")
//       await page.click('button[id="new-item"]')

//       await page.waitForSelector("#simple-tab-2")
//       await page.click("#simple-tab-2")

//       await page.click(`input[name="registryUpdateForm.list.0.key"]`)
//       await page.$eval(
//         `input[name="registryUpdateForm.list.0.key"]`,
//         (el: any, value: any) => (el.value = value),
//         key.substring(0, key.length - 1)
//       )
//       await page.type(`input[name="registryUpdateForm.list.0.key"]`, key.charAt(key.length - 1))

//       await page.click(`textarea[name="registryUpdateForm.list.0.value"]`)
//       await page.$eval(
//         `textarea[name="registryUpdateForm.list.0.value"]`,
//         (el: any, value: any) => (el.value = value),
//         value.substring(0, value.length - 1)
//       )
//       await page.type(`textarea[name="registryUpdateForm.list.0.value"]`, value.charAt(value.length - 1))

//       await page.click("#warning-close-button")

//       await page.waitForSelector('button[id="submit-proposal"]')
//       await page.click('button[id="submit-proposal"]')
//       await page.waitForTimeout(30000)

//       const response = await client.request(GET_PROPOSALS_QUERY, {
//         address: "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK"
//       })
//       console.log("response: ", response.proposals)
//     }
//   }
// }, 5000000)

// it("Flush All Proposals", async () => {
//   await setTezosSignerProvider(bobPrivKey)
//   //   const daoContract = await createTestDAO(Tezos)
//   //   const addressContract = daoContract.address

//   //   const contractStorage = await daoContract.storage()
//   //   expect(contractStorage).not.toBe(null)
//   //   if (contractStorage instanceof Object) {
//   if (true) {
//     // expect((contractStorage as any).governance_token.address).toBe(params.orgSettings.governanceToken.address)

//     await page.goto(url)
//     await page.evaluate(() => {
//       localStorage.setItem("homebase:network", "ghostnet") // not work, produce errors :(
//     })
//     await page.goto(url + "/explorer/daos")
//     await page.waitForSelector("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
//     const dao = await page.$("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")

//     if (dao) {
//       console.log("dao: ", dao)
//       const daoElem = await dao.$("#dao-name")
//       const name = await daoElem?.evaluate((el: any) => el.textContent)
//       console.log("name: ", name)
//       // expect(params.orgSettings.name).toBe(name)
//       expect("LevelDAO").toBe(name)

//       await page.click("#warning-close-button")
//       await page.click("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
//       await page.waitForSelector("#page-Proposals")
//       await page.click("#page-Proposals")

//       await page.waitForSelector("#execute-button:not([disabled])", { timeout: 60000 })
//       await page.click("#execute-button")
//     }
//   }
// }, 5000000)

// it("Drop All Expired Proposals", async () => {
//   await setTezosSignerProvider(bobPrivKey)
//   //   const daoContract = await createTestDAO(Tezos)
//   //   const addressContract = daoContract.address

//   //   const contractStorage = await daoContract.storage()
//   //   expect(contractStorage).not.toBe(null)
//   //   if (contractStorage instanceof Object) {
//   if (true) {
//     // expect((contractStorage as any).governance_token.address).toBe(params.orgSettings.governanceToken.address)

//     await page.goto(url)
//     await page.evaluate(() => {
//       localStorage.setItem("homebase:network", "ghostnet") // not work, produce errors :(
//     })
//     await page.goto(url + "/explorer/daos")
//     await page.waitForSelector("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
//     const dao = await page.$("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")

//     if (dao) {
//       console.log("dao: ", dao)
//       const daoElem = await dao.$("#dao-name")
//       const name = await daoElem?.evaluate((el: any) => el.textContent)
//       console.log("name: ", name)
//       // expect(params.orgSettings.name).toBe(name)
//       expect("LevelDAO").toBe(name)

//       await page.click("#warning-close-button")
//       await page.click("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
//       await page.waitForSelector("#page-Proposals")
//       await page.click("#page-Proposals")

//       await page.waitForSelector("#drop-all-expired:not([disabled])", { timeout: 60000 })
//       await page.click("#drop-all-expired")
//       await page.waitForTimeout(30000)
//     }
//   }
// }, 5000000)

it("Change Delegate Proposal", async () => {
  const newDelegate = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
  await setTezosSignerProvider(bobPrivKey)
  //   const daoContract = await createTestDAO(Tezos)
  //   const addressContract = daoContract.address

  //   const contractStorage = await daoContract.storage()
  //   expect(contractStorage).not.toBe(null)
  //   if (contractStorage instanceof Object) {
  if (true) {
    // expect((contractStorage as any).governance_token.address).toBe(params.orgSettings.governanceToken.address)

    await page.goto(url)
    await page.evaluate(() => {
      localStorage.setItem("homebase:network", "ghostnet") // not work, produce errors :(
    })
    await page.goto(url + "/explorer/daos")
    await page.waitForSelector("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
    const dao = await page.$("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")

    if (dao) {
      console.log("dao: ", dao)
      const daoElem = await dao.$("#dao-name")
      const name = await daoElem?.evaluate((el: any) => el.textContent)
      console.log("name: ", name)
      // expect(params.orgSettings.name).toBe(name)
      expect("LevelDAO").toBe(name)

      await page.click("#warning-close-button")
      await page.click("#dao-" + "KT1QKL2zdUNh177FdzASHQ8UGdBzpPLGXYpK")
      await page.waitForSelector("#page-Treasury")
      await page.click("#page-Treasury")

      await page.waitForSelector("#change-delegate-treasury:not([disabled])", { timeout: 60000 })
      await page.click("#change-delegate-treasury")

      await page.click(`input[name="newDelegationAddress"]`)
      await page.$eval(`input[name="newDelegationAddress"]`, (el: any, value: any) => (el.value = value), newDelegate)

      await page.waitForSelector("#submit-delegate-proposal")
      await page.click("#submit-delegate-proposal")

      await page.waitForTimeout(30000)
    }
  }
}, 5000000)
