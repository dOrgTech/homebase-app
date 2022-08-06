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
import { bobPrivKey, alicePrivKey, network,url, metadataParams, params } from "./constants";

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    devtools: true,
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
  const signer = await InMemorySigner.fromSecretKey(pk);
  Tezos.setProvider({ signer });
};

// it("Check if DAO is being listed on explorer", async () => {
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
//   if (contractStorage instanceof Object) {
//     expect((contractStorage as any).governance_token.address).toBe(
//       params.orgSettings.governanceToken.address
//     );

//     await page.waitForTimeout(10000);

//     await page.goto(url)
//     await page.evaluate(() => {
//       localStorage.setItem('homebase:network', 'devnet'); // not work, produce errors :(
//     });
//     await page.goto(url + "/explorer/daos")
//     await page.waitForSelector("#dao-" + daoContract.address);

//     const dao = await page.$("#dao-" + daoContract.address)
//     if(dao) {
//       console.log("dao: ", dao);
//       const daoElem = await dao.$("#dao-name")
//       const name = await daoElem?.evaluate(el => el.textContent);
//       console.log("name: ", name);
//       expect(params.orgSettings.name).toBe(name);
//       }
//   }
// }, 5000000);

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