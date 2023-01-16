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

import { BaseDAO, fromStateToBaseStorage } from "services/contracts/baseDAO"
import { deployMetadataCarrier } from "services/contracts/metadataCarrier/deploy"
import { generateStorageContract } from "services/baseDAODocker"
import baseDAOContractCode from "../services/contracts/baseDAO/michelson/baseDAO"
import { getDAOs } from "services/indexer/dao/services"
import { DAOListItem } from "services/indexer/types"
import { alicePrivKey, bobPrivKey, network, url, metadataParams, params } from "./constants"
import { getNetworkHead } from "services/bakingBad/stats"
import puppeteer from "puppeteer-core"

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    devtools: true
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
  const signer = await InMemorySigner.fromSecretKey(pk)
  Tezos.setProvider({ signer })
}

it("Check if the DAO exists after getting created", async () => {
  await page.goto(url)
  await page.evaluate(() => {
    localStorage.setItem("homebase:network", "ghostnet") // not work, produce errors :(
  })
  await setTezosSignerProvider(alicePrivKey)

  const metadata = await deployMetadataCarrier({
    ...metadataParams,
    tezos: Tezos
  })

  if (!metadata) {
    console.log("Error deploying treasury DAO: There's not address of metadata")
    return
  }

  const account = await Tezos.wallet.pkh()
  console.log("account: ", account)
  const currentLevel = await getNetworkHead(network)
  console.log("currentLevel: ", currentLevel)

  const contract = await BaseDAO.baseDeploy("lambda", {
    tezos: Tezos,
    metadata,
    params,
    network
  })
  console.log("contract: ", contract)

  const address = contract.address
  console.log("address: ", address)

  expect(address).not.toBe(null)

  const daoContract = await Tezos.wallet.at(address)

  const contractStorage = await daoContract.storage()
  console.log("contractStorage: ", contractStorage)
  // console.log("addressContract: ", addressContract);
  expect(contractStorage).not.toBe(null)
  console.log("(contractStorage as any).governance_token.address: ", (contractStorage as any).governance_token.address)
  // it'll wait until the mock function has been called once.
  await page.goto(url + "/explorer/daos")
  if (contractStorage instanceof Object) {
    expect((contractStorage as any).governance_token.address).toBe(params.orgSettings.governanceToken.address)

    // await page.waitForTimeout(10000)

    console.log("#dao-" + address)
    await page.waitForSelector("#dao-" + address)
    const dao = await page.$("#dao-" + address)
    console.log("dao: ", dao)
    if (dao) {
      console.log("dao: ", dao)
      const daoElem = await dao.$("#dao-name")
      console.log("daoElem: ", daoElem)
      const name = await daoElem?.evaluate((el: any) => el.textContent)
      console.log("name: ", name)
      console.log("name: ", name)
      expect(params.orgSettings.name).toBe(name)
    }
  }
}, 5000000)

it("Get daos from the GraphQL api", async () => {
  await setTezosSignerProvider(alicePrivKey)

  const metadata = await deployMetadataCarrier({
    ...metadataParams,
    tezos: Tezos
  })

  if (!metadata) {
    console.log("Error deploying treasury DAO: There's not address of metadata")
    return
  }

  const account = await Tezos.wallet.pkh()
  console.log("account: ", account)
  const currentLevel = await getNetworkHead(network)
  console.log("currentLevel: ", currentLevel)

  const contract = await BaseDAO.baseDeploy("lambda", {
    tezos: Tezos,
    metadata,
    params,
    network
  })
  console.log("contract: ", contract)

  const address = contract.address
  console.log("address: ", address)

  expect(address).not.toBe(null)

  const daoContract = await Tezos.wallet.at(address)

  const contractStorage = await daoContract.storage()
  console.log("contractStorage: ", contractStorage)
  // console.log("addressContract: ", addressContract);
  expect(contractStorage).not.toBe(null)
  // it'll wait until the mock function has been called once.

  let daos: DAOListItem[] = []

  daos = await getDAOs("ghostnet")
  console.log("daos: ", daos)

  const daoIndex = daos.findIndex(dao => dao.address === address)
  expect(daoIndex).not.toBe(-1)
}, 5000000)
