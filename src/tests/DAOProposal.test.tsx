import { makeStyles, ThemeProvider } from "@material-ui/core";
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { render, waitFor } from "@testing-library/react";
import App from "App";
import { createMemoryHistory } from "history";
import { MigrationParams } from "modules/creator/state";
import { ActionSheetProvider } from "modules/explorer/context/ActionSheets";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";
import { Router } from "react-router-dom";
import { TezosProvider } from "services/beacon";
import { theme } from "theme";

import * as puppeteer from "puppeteer";
import { fromStateToBaseStorage } from "services/contracts/baseDAO";
import { deployMetadataCarrier } from "services/contracts/metadataCarrier/deploy";
import { generateStorageContract } from "services/baseDAODocker";
import baseDAOContractCode from "../services/contracts/baseDAO/michelson/baseDAO";
import { getDAOs } from "services/indexer/dao/services";
import { DAOListItem } from "services/indexer/types";

import { bobPrivKey, alicePrivKey, network, url, metadataParams, params } from "./constants";
console.log("bobPrivKey: ", bobPrivKey);

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    devtools: false,
  };
  return debugging_mode;
};

let Tezos: TezosToolkit;

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

const initTezosToolKit = async (pk: string) => {
  // Tezos = new TezosToolkit("https://ithacanet.smartpy.io");
  Tezos = new TezosToolkit("http://localhost:20000");
  console.log("Tezos Connected: ");
  return Tezos;
};

let browser: puppeteer.Browser;
let page: puppeteer.Page;

beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging());
  page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await initTezosToolKit(bobPrivKey);
}, 5000000);

afterAll(() => {
  if (isDebugging()) {
    browser.close();
  }
});

const setTezosSignerProvider = async (pk: string) => {
  console.log("pk: ", pk);
  const signer = await InMemorySigner.fromSecretKey(pk);
  Tezos.setProvider({ signer });
};

// it("Check if treasury proposal can be created", async () => {
//   await setTezosSignerProvider(bobPrivKey);
//   // const treasuryParams = fromStateToBaseStorage(params);

//   // const metadata = await deployMetadataCarrier({
//   //   ...metadataParams,
//   //   tezos: Tezos,
//   // });

//   // if (!metadata) {
//   //   console.log(
//   //     "Error deploying treasury DAO: There's not address of metadata"
//   //   );
//   //   return;
//   // }

//   // const account = await Tezos.wallet.pkh();

//   // const storageCode = await generateStorageContract({
//   //   network,
//   //   template: "registry",
//   //   storage: treasuryParams,
//   //   originatorAddress: account,
//   //   metadata,
//   // });

//   // await setTezosSignerProvider(bobPrivKey);
//   // const t = Tezos.wallet.originate({
//   //   code: baseDAOContractCode,
//   //   init: storageCode,
//   // });

//   // const operation = await t.send();
//   // console.log("Waiting for confirmation on DAO contract...", t);

//   // const { address } = await operation.contract();
//   // console.log("address: ", address);

//   // expect(address).not.toBe(null);

//   // const daoContract = await Tezos.wallet.at(address);

//   // const contractStorage = await daoContract.storage();
//   // console.log("contractStorage: ", contractStorage);
//   // console.log("addressContract: ", addressContract);
//   // expect(contractStorage).not.toBe(null);
//   if (true) {
//     // if (contractStorage instanceof Object) {
//     // expect((contractStorage as any).governance_token.address).toBe(
//     //   params.orgSettings.governanceToken.address
//     // );

//     // await page.waitForTimeout(10000);

//     await page.goto(url)
//     await page.evaluate(() => {
//       localStorage.setItem('homebase:network', 'devnet'); // not work, produce errors :(
//     });
//     await page.goto(url + "/explorer/daos")
//     await page.waitForSelector("#dao-" + "KT1PpVFgXbjdaTkSSEDpzwZwnG5sLDCAAE6f");

//     const dao = await page.$("#dao-" + "KT1PpVFgXbjdaTkSSEDpzwZwnG5sLDCAAE6f")
//     if(dao) {
//       console.log("dao: ", dao);
//       const daoElem = await dao.$("#dao-name")
//       const name = await daoElem?.evaluate(el => el.textContent);
//       console.log("name: ", name);
//       expect(params.orgSettings.name).toBe(name);

//       const governanceTokenAddress = "KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx";
//       const daoName = "Test DAO";
//       const symbol = "TDAO";
//       const description = "This is Test DAO";
//       const administrator = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";
//       const guardian = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";
//       const votingBlocks = "2";
//       const proposalFlushBlocks = "4";
//       const proposalExpiryBlocks = "6";
//       const proposeStakeRequired = "5";
//       const minXtzAmount = "1";
//       const maxXtzAmount = "10";
//       const quorumThreshold = "3";
//       const minQuorumAmount = "1";
//       const maxQuorumAmount = "98";
//       const quorumChange = "5";
//       const quorumMaxChange = "10";

//       await page.click("#dao-" + "KT1PpVFgXbjdaTkSSEDpzwZwnG5sLDCAAE6f");
//       await page.waitForSelector("#page-Treasury");
//       await page.click("#page-Treasury");
//       await page.waitForTimeout(5000);

//       await page.waitForSelector('button#transfer-KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx:not([disabled])');
//       await page.click('button[id="transfer-KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx"]');
      
//       await page.waitForSelector(`input[name="transferForm.transfers.0.recipient"]`);
//       await page.click(`input[name="transferForm.transfers.0.recipient"]`);
//       await page.$eval(
//         `input[name="transferForm.transfers.0.recipient"]`,
//         (el: any, value) => (el.value = value),
//         administrator.substring(0, administrator.length - 1)
//       );
//       await page.type(
//         `input[name="transferForm.transfers.0.recipient"]`,
//         administrator.charAt(administrator.length - 1)
//       );
//       // await page.waitForTimeout(100000);
//       await page.click("#warning-close-button");

//       await page.waitForSelector('button[id="submit-proposal"]');
//       await page.click('button[id="submit-proposal"]');


//       await page.waitForTimeout(10000);
//       // await page.$eval(
//       //   `input[name="governanceToken.address"]`,
//       //   (el: any, value) => (el.value = value),
//       //   governanceTokenAddress.substring(0, governanceTokenAddress.length - 1)
//       // );
//       // await page.type(
//       //   `input[name="governanceToken.address"]`,
//       //   governanceTokenAddress.charAt(governanceTokenAddress.length - 1)
//       // );

//       // // await page.click(`input[name="governanceToken.tokenId"]`);
//       // // await page.type(`input[name="governanceToken.tokenId"]`, "0");

//       // await page.click(`input[name="name"]`);
//       // await page.$eval(
//       //   `input[name="name"]`,
//       //   (el: any, value) => (el.value = value),
//       //   daoName.substring(0, daoName.length - 1)
//       // );
//       // await page.type(`input[name="name"]`, daoName.charAt(daoName.length - 1));

//       // await page.click(`input[name="symbol"]`);
//       // await page.$eval(
//       //   `input[name="symbol"]`,
//       //   (el: any, value) => (el.value = value),
//       //   symbol.substring(0, symbol.length - 1)
//       // );
//       // await page.type(`input[name="symbol"]`, symbol.charAt(symbol.length - 1));

//       // await page.click(`textarea[aria-label="empty textarea"]`);
//       // await page.$eval(
//       //   `textarea[aria-label="empty textarea"]`,
//       //   (el: any, value) => (el.value = value),
//       //   description.substring(0, description.length - 1)
//       // );
//       // await page.type(
//       //   `textarea[aria-label="empty textarea"]`,
//       //   description.charAt(description.length - 1)
//       // );

//       // await page.click(`input[name="administrator"]`);
//       // await page.$eval(
//       //   `input[name="administrator"]`,
//       //   (el: any, value) => (el.value = value),
//       //   administrator.substring(0, administrator.length - 1)
//       // );
//       // await page.type(
//       //   `input[name="administrator"]`,
//       //   administrator.charAt(administrator.length - 1)
//       // );

//       // await page.click(`input[name="guardian"]`);
//       // await page.$eval(
//       //   `input[name="guardian"]`,
//       //   (el: any, value) => (el.value = value),
//       //   guardian.substring(0, guardian.length - 1)
//       // );
//       // await page.type(
//       //   `input[name="guardian"]`,
//       //   guardian.charAt(guardian.length - 1)
//       // );

//       // await page.click("#warning-close-button");
//       // await page.click("#next-button");

//       // await page.click(`input[name="votingBlocks"]`);
//       // await page.type(`input[name="votingBlocks"]`, votingBlocks);

//       // await page.click(`input[name="proposalFlushBlocks"]`);
//       // await page.type(`input[name="proposalFlushBlocks"]`, proposalFlushBlocks);

//       // await page.click(`input[name="proposalExpiryBlocks"]`);
//       // await page.type(`input[name="proposalExpiryBlocks"]`, proposalExpiryBlocks);

//       // await page.click(`input[name="proposeStakeRequired"]`);
//       // await page.type(`input[name="proposeStakeRequired"]`, proposeStakeRequired);

//       // await page.click(`input[name="minXtzAmount"]`);
//       // await page.type(`input[name="minXtzAmount"]`, minXtzAmount);

//       // await page.click(`input[name="maxXtzAmount"]`);
//       // await page.type(`input[name="maxXtzAmount"]`, maxXtzAmount);

//       // const slider = await page.$(`span[role="slider"]`);
//       // if (slider) {
//       //   console.log("slider: ", slider);
//       //   const bounding_box = await slider.boundingBox();
//       //   if (bounding_box) {
//       //     await page.mouse.move(bounding_box.x, bounding_box.y);
//       //     await page.mouse.down();
//       //     console.log("bounding_box: ", bounding_box);
//       //     await page.mouse.move(bounding_box.x + 50, bounding_box.y);
//       //   }
//       //   await page.mouse.up();
//       // }

//       // await page.click("#next-button");

//       // await page.click(`input[name="quorumThreshold"]`);
//       // await page.$eval(
//       //   `input[name="quorumThreshold"]`,
//       //   (el: any, value) => (el.value = value),
//       //   quorumThreshold
//       // );
//       // // await page.type(`input[name="quorumThreshold"]`, quorumThreshold);

//       // await page.click(`input[name="minQuorumAmount"]`);
//       // await page.$eval(
//       //   `input[name="quorumThreshold"]`,
//       //   (el: any, value) => (el.value = value),
//       //   minQuorumAmount
//       // );
//       // // await page.type(`input[name="minQuorumAmount"]`, minQuorumAmount);

//       // await page.click(`input[name="maxQuorumAmount"]`);
//       // await page.$eval(
//       //   `input[name="quorumThreshold"]`,
//       //   (el: any, value) => (el.value = value),
//       //   maxQuorumAmount
//       // );
//       // // await page.type(`input[name="maxQuorumAmount"]`, maxQuorumAmount);

//       // await page.click(`input[name="quorumChange"]`);
//       // await page.$eval(
//       //   `input[name="quorumThreshold"]`,
//       //   (el: any, value) => (el.value = value),
//       //   quorumChange
//       // );
//       // // await page.type(`input[name="quorumChange"]`, quorumChange);

//       // await page.click(`input[name="quorumMaxChange"]`);
//       // await page.$eval(
//       //   `input[name="quorumThreshold"]`,
//       //   (el: any, value) => (el.value = value),
//       //   quorumMaxChange
//       // );
//       // // await page.type(`input[name="quorumMaxChange"]`, quorumMaxChange);

//       // await page.click("#next-button");
//       // await page.click("#next-button");

//       // await page.waitForTimeout(15000);
//       // const contractDeployedText = "Waiting for DAO to be indexed"
//       // const isContractDeployed = await page.waitForXPath(`//*[contains(text(), "${contractDeployedText}")]`)
//       // console.log("isContractDeployed: ", isContractDeployed);

//       // expect(text).toContain("Enter App");
//     }
//   }
// }, 5000000);

it("Check if registry proposal can be created", async () => {
  await setTezosSignerProvider(bobPrivKey);
  // const treasuryParams = fromStateToBaseStorage(params);

  // const metadata = await deployMetadataCarrier({
  //   ...metadataParams,
  //   tezos: Tezos,
  // });

  // if (!metadata) {
  //   console.log(
  //     "Error deploying treasury DAO: There's not address of metadata"
  //   );
  //   return;
  // }

  // const account = await Tezos.wallet.pkh();

  // const storageCode = await generateStorageContract({
  //   network,
  //   template: "registry",
  //   storage: treasuryParams,
  //   originatorAddress: account,
  //   metadata,
  // });

  // await setTezosSignerProvider(bobPrivKey);
  // const t = Tezos.wallet.originate({
  //   code: baseDAOContractCode,
  //   init: storageCode,
  // });

  // const operation = await t.send();
  // console.log("Waiting for confirmation on DAO contract...", t);

  // const { address } = await operation.contract();
  // console.log("address: ", address);

  // expect(address).not.toBe(null);

  // const daoContract = await Tezos.wallet.at(address);

  // const contractStorage = await daoContract.storage();
  // console.log("contractStorage: ", contractStorage);
  // console.log("addressContract: ", addressContract);
  // expect(contractStorage).not.toBe(null);
  if (true) {
    // if (contractStorage instanceof Object) {
    // expect((contractStorage as any).governance_token.address).toBe(
    //   params.orgSettings.governanceToken.address
    // );

    // await page.waitForTimeout(10000);

    await page.goto(url)
    await page.evaluate(() => {
      localStorage.setItem('homebase:network', 'devnet'); // not work, produce errors :(
    });
    await page.goto(url + "/explorer/daos")
    await page.waitForSelector("#dao-" + "KT1PpVFgXbjdaTkSSEDpzwZwnG5sLDCAAE6f");

    const dao = await page.$("#dao-" + "KT1PpVFgXbjdaTkSSEDpzwZwnG5sLDCAAE6f")
    if(dao) {
      console.log("dao: ", dao);
      const daoElem = await dao.$("#dao-name")
      const name = await daoElem?.evaluate(el => el.textContent);
      console.log("name: ", name);
      expect(params.orgSettings.name).toBe(name);

      const governanceTokenAddress = "KT1RZ51CPGAtg3J4QB4HWZ2WitiAj5fandMx";
      const daoName = "Test DAO";
      const symbol = "TDAO";
      const description = "This is Test DAO";
      const administrator = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";
      const guardian = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";
      const votingBlocks = "2";
      const proposalFlushBlocks = "4";
      const proposalExpiryBlocks = "6";
      const proposeStakeRequired = "5";
      const minXtzAmount = "1";
      const maxXtzAmount = "10";
      const quorumThreshold = "3";
      const minQuorumAmount = "1";
      const maxQuorumAmount = "98";
      const quorumChange = "5";
      const quorumMaxChange = "10";
      const key = "thiskey"
      const value = "thisvalue"

      await page.click("#dao-" + "KT1PpVFgXbjdaTkSSEDpzwZwnG5sLDCAAE6f");
      await page.waitForSelector("#page-Registry");
      await page.click("#page-Registry");
      await page.waitForTimeout(5000);

      await page.waitForSelector('button#new-item:not([disabled])');
      await page.click('button[id="new-item"]');
      
      // await page.waitForSelector(`input[name=registryUpdateForm.list.0.key"]`);
      await page.click(`input[name="registryUpdateForm.list.0.key"]`);
      await page.$eval(
        `input[name="registryUpdateForm.list.0.key"]`,
        (el: any, value) => (el.value = value),
        key.substring(0, key.length - 1)
      );
      await page.type(
        `input[name="registryUpdateForm.list.0.key"]`,
        key.charAt(key.length - 1)
      );

      await page.click(`textarea[name="registryUpdateForm.list.0.value"]`);
      await page.$eval(
        `textarea[name="registryUpdateForm.list.0.value"]`,
        (el: any, value) => (el.value = value),
        description.substring(0, description.length - 1)
      );
      await page.type(
        `textarea[name="registryUpdateForm.list.0.value"]`,
        description.charAt(description.length - 1)
      );

      // await page.waitForTimeout(100000);
      await page.click("#warning-close-button");

      await page.waitForSelector('button[id="submit-proposal"]');
      await page.click('button[id="submit-proposal"]');

      await page.waitForTimeout(10000);
      // await page.$eval(
      //   `input[name="governanceToken.address"]`,
      //   (el: any, value) => (el.value = value),
      //   governanceTokenAddress.substring(0, governanceTokenAddress.length - 1)
      // );
      // await page.type(
      //   `input[name="governanceToken.address"]`,
      //   governanceTokenAddress.charAt(governanceTokenAddress.length - 1)
      // );

      // // await page.click(`input[name="governanceToken.tokenId"]`);
      // // await page.type(`input[name="governanceToken.tokenId"]`, "0");

      // await page.click(`input[name="name"]`);
      // await page.$eval(
      //   `input[name="name"]`,
      //   (el: any, value) => (el.value = value),
      //   daoName.substring(0, daoName.length - 1)
      // );
      // await page.type(`input[name="name"]`, daoName.charAt(daoName.length - 1));

      // await page.click(`input[name="symbol"]`);
      // await page.$eval(
      //   `input[name="symbol"]`,
      //   (el: any, value) => (el.value = value),
      //   symbol.substring(0, symbol.length - 1)
      // );
      // await page.type(`input[name="symbol"]`, symbol.charAt(symbol.length - 1));

      // await page.click(`textarea[aria-label="empty textarea"]`);
      // await page.$eval(
      //   `textarea[aria-label="empty textarea"]`,
      //   (el: any, value) => (el.value = value),
      //   description.substring(0, description.length - 1)
      // );
      // await page.type(
      //   `textarea[aria-label="empty textarea"]`,
      //   description.charAt(description.length - 1)
      // );

      // await page.click(`input[name="administrator"]`);
      // await page.$eval(
      //   `input[name="administrator"]`,
      //   (el: any, value) => (el.value = value),
      //   administrator.substring(0, administrator.length - 1)
      // );
      // await page.type(
      //   `input[name="administrator"]`,
      //   administrator.charAt(administrator.length - 1)
      // );

      // await page.click(`input[name="guardian"]`);
      // await page.$eval(
      //   `input[name="guardian"]`,
      //   (el: any, value) => (el.value = value),
      //   guardian.substring(0, guardian.length - 1)
      // );
      // await page.type(
      //   `input[name="guardian"]`,
      //   guardian.charAt(guardian.length - 1)
      // );

      // await page.click("#warning-close-button");
      // await page.click("#next-button");

      // await page.click(`input[name="votingBlocks"]`);
      // await page.type(`input[name="votingBlocks"]`, votingBlocks);

      // await page.click(`input[name="proposalFlushBlocks"]`);
      // await page.type(`input[name="proposalFlushBlocks"]`, proposalFlushBlocks);

      // await page.click(`input[name="proposalExpiryBlocks"]`);
      // await page.type(`input[name="proposalExpiryBlocks"]`, proposalExpiryBlocks);

      // await page.click(`input[name="proposeStakeRequired"]`);
      // await page.type(`input[name="proposeStakeRequired"]`, proposeStakeRequired);

      // await page.click(`input[name="minXtzAmount"]`);
      // await page.type(`input[name="minXtzAmount"]`, minXtzAmount);

      // await page.click(`input[name="maxXtzAmount"]`);
      // await page.type(`input[name="maxXtzAmount"]`, maxXtzAmount);

      // const slider = await page.$(`span[role="slider"]`);
      // if (slider) {
      //   console.log("slider: ", slider);
      //   const bounding_box = await slider.boundingBox();
      //   if (bounding_box) {
      //     await page.mouse.move(bounding_box.x, bounding_box.y);
      //     await page.mouse.down();
      //     console.log("bounding_box: ", bounding_box);
      //     await page.mouse.move(bounding_box.x + 50, bounding_box.y);
      //   }
      //   await page.mouse.up();
      // }

      // await page.click("#next-button");

      // await page.click(`input[name="quorumThreshold"]`);
      // await page.$eval(
      //   `input[name="quorumThreshold"]`,
      //   (el: any, value) => (el.value = value),
      //   quorumThreshold
      // );
      // // await page.type(`input[name="quorumThreshold"]`, quorumThreshold);

      // await page.click(`input[name="minQuorumAmount"]`);
      // await page.$eval(
      //   `input[name="quorumThreshold"]`,
      //   (el: any, value) => (el.value = value),
      //   minQuorumAmount
      // );
      // // await page.type(`input[name="minQuorumAmount"]`, minQuorumAmount);

      // await page.click(`input[name="maxQuorumAmount"]`);
      // await page.$eval(
      //   `input[name="quorumThreshold"]`,
      //   (el: any, value) => (el.value = value),
      //   maxQuorumAmount
      // );
      // // await page.type(`input[name="maxQuorumAmount"]`, maxQuorumAmount);

      // await page.click(`input[name="quorumChange"]`);
      // await page.$eval(
      //   `input[name="quorumThreshold"]`,
      //   (el: any, value) => (el.value = value),
      //   quorumChange
      // );
      // // await page.type(`input[name="quorumChange"]`, quorumChange);

      // await page.click(`input[name="quorumMaxChange"]`);
      // await page.$eval(
      //   `input[name="quorumThreshold"]`,
      //   (el: any, value) => (el.value = value),
      //   quorumMaxChange
      // );
      // // await page.type(`input[name="quorumMaxChange"]`, quorumMaxChange);

      // await page.click("#next-button");
      // await page.click("#next-button");

      // await page.waitForTimeout(15000);
      // const contractDeployedText = "Waiting for DAO to be indexed"
      // const isContractDeployed = await page.waitForXPath(`//*[contains(text(), "${contractDeployedText}")]`)
      // console.log("isContractDeployed: ", isContractDeployed);

      // expect(text).toContain("Enter App");
    }
  }
}, 5000000);

// it("Get daos from the GraphQL api", async () => {
//   await setTezosSignerProvider(bobPrivKey);
//   const treasuryParams = fromStateToBaseStorage(params);

//   const metadata = await deployMetadataCarrier({
//     ...metadataParams,
//     tezos: Tezos,
//   });

//   if (!metadata) {
//     console.log(
//       "Error deploying treasury DAO: There's not address of metadata"
//     );
//     return;
//   }

//   const account = await Tezos.wallet.pkh();

//   const storageCode = await generateStorageContract({
//     network,
//     template: "registry",
//     storage: treasuryParams,
//     originatorAddress: account,
//     metadata,
//   });

//   await setTezosSignerProvider(bobPrivKey);
//   const t = Tezos.wallet.originate({
//     code: baseDAOContractCode,
//     init: storageCode,
//   });

//   const operation = await t.send();
//   console.log("Waiting for confirmation on DAO contract...", t);

//   const { address } = await operation.contract();
//   console.log("address: ", address);

//   expect(address).not.toBe(null);

//   const daoContract = await Tezos.wallet.at(address);

//   const contractStorage = await daoContract.storage();
//   console.log("contractStorage: ", contractStorage);
//   // console.log("addressContract: ", addressContract);
//   expect(contractStorage).not.toBe(null);
// // it'll wait until the mock function has been called once.

//   let daos: DAOListItem[] = [];

//   await new Promise((r) => setTimeout(r, 30000));

//   daos = await getDAOs("devnet")
//   console.log("daos: ", daos);

//   const daoIndex = daos.findIndex((dao) => dao.address === address)
//     expect(daoIndex).not.toBe(-1)
// }, 5000000)