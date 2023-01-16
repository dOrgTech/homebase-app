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

it("Deposit To Existing DAO", async () => {
  const depositAmount = "1"
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

      await page.waitForSelector("#nav-connect-wallet")
      await page.click("#nav-connect-wallet")

      await page.waitForSelector("#page-User")
      await page.click("#page-User")

      await page.click("#deposit-dao")

      await page.waitForSelector(`input[name="deposit"]`)
      await page.click(`input[name="deposit"]`)
      await page.$eval(
        `input[name="deposit"]`,
        (el: any, value: any) => (el.value = value),
        depositAmount.substring(0, depositAmount.length - 1)
      )
      await page.type(`input[name="deposit"]`, depositAmount.charAt(depositAmount.length - 1))
      // await page.waitForTimeout(100000);

      await page.waitForSelector('button[id="deposit-submit"]')
      await page.click('button[id="deposit-submit"]')
    }
  }
}, 5000000)

it("Deposit To Existing DAO", async () => {
  const depositAmount = "1"
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

      await page.waitForSelector("#nav-connect-wallet")
      await page.click("#nav-connect-wallet")

      await page.waitForSelector("#page-User")
      await page.click("#page-User")

      await page.click("#withdraw-dao")

      await page.waitForSelector(`input[name="amount-field"]`)
      await page.click(`input[name="amount-field"]`)
      await page.$eval(
        `input[name="amount-field"]`,
        (el: any, value: any) => (el.value = value),
        depositAmount.substring(0, depositAmount.length - 1)
      )
      await page.type(`input[name="amount-field"]`, depositAmount.charAt(depositAmount.length - 1))
      // await page.waitForTimeout(100000);

      await page.waitForSelector('button[id="amount-submit"]')
      await page.click('button[id="amount-submit"]')
    }
  }
}, 5000000)
