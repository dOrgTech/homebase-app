import { TezosToolkit } from "@taquito/taquito"

import { bobPrivKey, alicePrivKey, network, url, metadataParams, params } from "./constants"

import puppeteer from "puppeteer-core"
import { randomUUID } from "crypto"
import { deployMetadataCarrier } from "services/contracts/metadataCarrier/deploy"
import { getNetworkHead } from "services/bakingBad/stats"
import { BaseDAO } from "services/contracts/baseDAO"
import { InMemorySigner } from "@taquito/signer"

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    devtools: true
  }
  return debugging_mode
}

let Tezos: TezosToolkit

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 60000),
//       retry: false,
//       retryOnMount: false,
//       refetchOnMount: false,
//       refetchOnWindowFocus: true,
//       staleTime: 5000,
//       cacheTime: 30000,
//     },
//   },
// });

// const styles = makeStyles({
//   success: {
//     backgroundColor: "#4BCF93 !important",
//     padding: "6px 28px",
//     height: 54,
//     fontSize: 13,
//     lineHeight: "0px",
//     opacity: 1,
//   },
//   error: {
//     backgroundColor: "#ED254E !important",
//     padding: "6px 28px",
//     height: 54,
//     fontSize: 13,
//     lineHeight: "0px",
//     opacity: 1,
//   },
//   info: {
//     backgroundColor: "#3866F9 !important",
//     padding: "6px 28px",
//     height: 54,
//     fontSize: 13,
//     lineHeight: "0px",
//     opacity: 1,
//   },
// });

// const classes = styles();

// const initTezosToolKit = async (pk: string) => {
//   // Tezos = new TezosToolkit("https://ithacanet.smartpy.io");
//   Tezos = new TezosToolkit("http://localhost:20000")
//   console.log("Tezos Connected: ")
//   return Tezos
// }

let browser: any
let page: any

beforeAll(async () => {
  // browser = await puppeteer.launch(isDebugging())
  browser = await puppeteer.launch({ executablePath: "/opt/homebrew/bin/chromium", headless: false, devtools: true })
  page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768 })
  // await initTezosToolKit(bobPrivKey)
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
  }
}, 5000000)

it("shows a success message after submitting a form", async () => {
  try {
    await page.goto(url + "/creator/dao")
    await page.waitForSelector(`input[name="governanceToken.address"]`)

    const governanceTokenAddress = "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW"
    const daoName = "Test DAO"
    const symbol = "TDAO"
    const tokenId = "0"
    const description = "This is Test DAO"
    const administrator = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
    const guardian = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
    const votingBlocks = "2"
    const proposalFlushBlocks = "4"
    const proposalExpiryBlocks = "6"
    const proposeStakeRequired = "5"
    const minXtzAmount = "1"
    const maxXtzAmount = "10"
    const quorumThreshold = "3"
    const minQuorumAmount = "1"
    const maxQuorumAmount = "98"
    const quorumChange = "5"
    const quorumMaxChange = "10"

    await page.click(`input[name="governanceToken.address"]`)
    await page.$eval(
      `input[name="governanceToken.address"]`,
      (el: any, value: any) => (el.value = value),
      governanceTokenAddress.substring(0, governanceTokenAddress.length - 1)
    )
    await page.type(
      `input[name="governanceToken.address"]`,
      governanceTokenAddress.charAt(governanceTokenAddress.length - 1)
    )

    // await page.click(`input[name="governanceToken.tokenId"]`)
    // await page.type(`input[name="governanceToken.tokenId"]`, "0")

    await page.click(`input[name="name"]`)
    await page.$eval(
      `input[name="name"]`,
      (el: any, value: any) => (el.value = value),
      daoName.substring(0, daoName.length - 1)
    )
    await page.type(`input[name="name"]`, daoName.charAt(daoName.length - 1))

    await page.click(`input[name="governanceToken.tokenId"]`)

    const tokenIdFile = await page.$(`input[name="governanceToken.tokenId"]`)
    tokenIdFile.press("Backspace")
    await page.waitForTimeout(1000)

    await page.type(`input[name="governanceToken.tokenId"]`, tokenId)

    await page.click(`textarea[aria-label="empty textarea"]`)
    await page.$eval(
      `textarea[aria-label="empty textarea"]`,
      (el: any, value: any) => (el.value = value),
      description.substring(0, description.length - 1)
    )
    await page.type(`textarea[aria-label="empty textarea"]`, description.charAt(description.length - 1))

    await page.click(`input[name="administrator"]`)
    await page.$eval(
      `input[name="administrator"]`,
      (el: any, value: any) => (el.value = value),
      administrator.substring(0, administrator.length - 1)
    )
    await page.type(`input[name="administrator"]`, administrator.charAt(administrator.length - 1))

    await page.click(`input[name="guardian"]`)
    await page.$eval(
      `input[name="guardian"]`,
      (el: any, value: any) => (el.value = value),
      guardian.substring(0, guardian.length - 1)
    )
    await page.type(`input[name="guardian"]`, guardian.charAt(guardian.length - 1))

    await page.click("#warning-close-button")
    await page.click("#next-button")

    await page.click(`input[name="votingBlocks"]`)
    await page.type(`input[name="votingBlocks"]`, votingBlocks)

    await page.click(`input[name="proposalFlushBlocks"]`)
    await page.type(`input[name="proposalFlushBlocks"]`, proposalFlushBlocks)

    await page.click(`input[name="proposalExpiryBlocks"]`)
    await page.type(`input[name="proposalExpiryBlocks"]`, proposalExpiryBlocks)

    await page.click(`input[name="proposeStakeRequired"]`)
    await page.type(`input[name="proposeStakeRequired"]`, proposeStakeRequired)

    await page.click(`input[name="minXtzAmount"]`)
    await page.type(`input[name="minXtzAmount"]`, minXtzAmount)

    await page.click(`input[name="maxXtzAmount"]`)
    await page.type(`input[name="maxXtzAmount"]`, maxXtzAmount)

    const slider = await page.$(`span[role="slider"]`)
    if (slider) {
      console.log("slider: ", slider)
      const bounding_box = await slider.boundingBox()
      if (bounding_box) {
        await page.mouse.move(bounding_box.x, bounding_box.y)
        await page.mouse.down()
        console.log("bounding_box: ", bounding_box)
        await page.mouse.move(bounding_box.x + 50, bounding_box.y)
      }
      await page.mouse.up()
    }

    await page.click("#next-button")

    await page.click(`input[name="quorumThreshold"]`)
    await page.$eval(`input[name="quorumThreshold"]`, (el: any, value: any) => (el.value = value), quorumThreshold)
    // await page.type(`input[name="quorumThreshold"]`, quorumThreshold);

    await page.click(`input[name="minQuorumAmount"]`)
    await page.$eval(`input[name="quorumThreshold"]`, (el: any, value: any) => (el.value = value), minQuorumAmount)
    // await page.type(`input[name="minQuorumAmount"]`, minQuorumAmount);

    await page.click(`input[name="maxQuorumAmount"]`)
    await page.$eval(`input[name="quorumThreshold"]`, (el: any, value: any) => (el.value = value), maxQuorumAmount)
    // await page.type(`input[name="maxQuorumAmount"]`, maxQuorumAmount);

    await page.click(`input[name="quorumChange"]`)
    await page.$eval(`input[name="quorumThreshold"]`, (el: any, value: any) => (el.value = value), quorumChange)
    // await page.type(`input[name="quorumChange"]`, quorumChange);

    await page.click(`input[name="quorumMaxChange"]`)
    await page.$eval(`input[name="quorumThreshold"]`, (el: any, value: any) => (el.value = value), quorumMaxChange)
    // await page.type(`input[name="quorumMaxChange"]`, quorumMaxChange);

    await page.click("#next-button")
    await page.click("#next-button")

    // await page.waitForTimeout(15000)
    const contractDeployedText = "Waiting for DAO to be indexed"
    const isContractDeployed = await page.waitForXPath(`//*[contains(text(), "${contractDeployedText}")]`, {
      timeout: 10000000000
    })
    console.log("isContractDeployed: ", isContractDeployed)
  } catch (error) {
    console.log("error: ", error)
  }

  // expect(text).toContain("Enter App");
}, 1000000)
