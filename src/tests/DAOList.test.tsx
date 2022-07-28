import { makeStyles, ThemeProvider } from "@material-ui/core";
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { render } from "@testing-library/react";
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

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    devtools: true,
  };
  return debugging_mode;
};

let Tezos: TezosToolkit;

const bobPrivKey = "edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt";
const alicePrivKey = "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq";

const network = "devnet";

const url = "http://localhost:3000";

const metadataParams: any = {
  keyName: "metadataKey",
  metadata: {
    frozenToken: {
      name: "Test DAO",
      symbol: "TEST",
      description: "This is the DAO",
      governanceToken: {
        address: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
        tokenId: "0",
        tokenMetadata: {
          contract: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
          level: 717794,
          token_id: 0,
          symbol: "TEST",
          name: "Test",
          decimals: 18,
          network: "ithacanet",
          supply: "1e+25",
        },
      },
      administrator: "tz1LCFwczMiEuNHcMvpqgNzzEs8f4FNBgyNK",
      guardian: "tz1LCFwczMiEuNHcMvpqgNzzEs8f4FNBgyNK",
      decimals: 18,
    },
    unfrozenToken: {
      name: "Test DAO",
      symbol: "TEST",
      description: "This is the DAO",
      governanceToken: {
        address: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
        tokenId: "0",
        tokenMetadata: {
          contract: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
          level: 717794,
          token_id: 0,
          symbol: "TEST",
          name: "Test",
          decimals: 18,
          network: "ithacanet",
          supply: "1e+25",
        },
      },
      administrator: "tz1LCFwczMiEuNHcMvpqgNzzEs8f4FNBgyNK",
      guardian: "tz1LCFwczMiEuNHcMvpqgNzzEs8f4FNBgyNK",
      decimals: 18,
    },
    description: "This is the DAO",
    authors: ["tz1LCFwczMiEuNHcMvpqgNzzEs8f4FNBgyNK"],
    template: "registry",
  },
};

const params: MigrationParams = {
  template: "registry",
  orgSettings: {
    name: "Test DAO",
    symbol: "TEST",
    description: "This is the DAO",
    governanceToken: {
      address: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
      tokenId: "0",
      tokenMetadata: {
        contract: "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW",
        level: 717794,
        token_id: 0,
        symbol: "TEST",
        name: "Test",
        decimals: 18,
        network: "ithacanet",
        supply: "1e+25",
      },
    },
    administrator: "tz1LCFwczMiEuNHcMvpqgNzzEs8f4FNBgyNK",
    guardian: "tz1LCFwczMiEuNHcMvpqgNzzEs8f4FNBgyNK",
  },
  votingSettings: {
    votingBlocks: 10,
    proposeStakeRequired: 5,
    returnedTokenPercentage: 25,
    minXtzAmount: 5,
    maxXtzAmount: 10,
    proposalFlushBlocks: 18,
    proposalExpiryBlocks: 22,
  },
  quorumSettings: {
    quorumThreshold: 2,
    minQuorumAmount: 1,
    maxQuorumAmount: 99,
    quorumChange: 5,
    quorumMaxChange: 19,
  },
};

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
  // browser = await puppeteer.launch(isDebugging());
  // page = await browser.newPage();
  // await page.setViewport({ width: 1366, height: 768 });
  await initTezosToolKit(bobPrivKey);
}, 5000000);

// afterAll(() => {
//   if (isDebugging()) {
//     browser.close();
//   }
// });

const setTezosSignerProvider = async (pk: string) => {
  const signer = await InMemorySigner.fromSecretKey(pk);
  Tezos.setProvider({ signer });
};

// it("Creates a DAO and returns address", async () => {
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
// }, 500000);

it("Creates a DAO based on given parameters", async () => {
  await setTezosSignerProvider(bobPrivKey);
  const treasuryParams = fromStateToBaseStorage(params);

  const metadata = await deployMetadataCarrier({
    ...metadataParams,
    tezos: Tezos,
  });

  if (!metadata) {
    console.log(
      "Error deploying treasury DAO: There's not address of metadata"
    );
    return;
  }

  const account = await Tezos.wallet.pkh();

  const storageCode = await generateStorageContract({
    network,
    template: "registry",
    storage: treasuryParams,
    originatorAddress: account,
    metadata,
  });

  await setTezosSignerProvider(bobPrivKey);
  const t = Tezos.wallet.originate({
    code: baseDAOContractCode,
    init: storageCode,
  });

  const operation = await t.send();
  console.log("Waiting for confirmation on DAO contract...", t);

  const { address } = await operation.contract();
  console.log("address: ", address);

  expect(address).not.toBe(null);

  const daoContract = await Tezos.wallet.at(address);

  const contractStorage = await daoContract.storage();
  console.log("contractStorage: ", contractStorage);
  // console.log("addressContract: ", addressContract);
  expect(contractStorage).not.toBe(null);
  if (contractStorage instanceof Object) {
    expect((contractStorage as any).governance_token.address).toBe(
      params.orgSettings.governanceToken.address
    );
  }
}, 500000);

// const customRender = (ui: any, { ...renderOptions }) => {
//   return render(
//     <TezosProvider>
//       <ThemeProvider theme={theme}>
//         <SnackbarProvider
//           classes={{
//             variantSuccess: classes.success,
//             variantError: classes.error,
//             variantInfo: classes.info,
//           }}
//         >
//           <QueryClientProvider client={queryClient}>
//             <ActionSheetProvider>{ui}</ActionSheetProvider>
//           </QueryClientProvider>
//         </SnackbarProvider>
//       </ThemeProvider>
//     </TezosProvider>,
//     renderOptions
//   );
// };

// it("Creates a DAO with frontend components", async () => {
//   const history = createMemoryHistory();
//   customRender(
//     <Router history={history}>
//       <App />
//     </Router>,
//     {}
//   );
// }, 500000);

// it("shows a success message after submitting a form", async () => {
//   try {
//     await page.goto(url + "/creator/dao");
//     await page.waitForSelector(`input[name="governanceToken.address"]`);

//     const governanceTokenAddress = "KT1QVMpfK12j9v8wy8s4v2EK3EHHH8jvisnW";
//     const daoName = "Test DAO";
//     const symbol = "TDAO";
//     const description = "This is Test DAO";
//     const administrator = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";
//     const guardian = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";
//     const votingBlocks = "2";
//     const proposalFlushBlocks = "4";
//     const proposalExpiryBlocks = "6";
//     const proposeStakeRequired = "5";
//     const minXtzAmount = "1";
//     const maxXtzAmount = "10";
//     const quorumThreshold = "3";
//     const minQuorumAmount = "1";
//     const maxQuorumAmount = "98";
//     const quorumChange = "5";
//     const quorumMaxChange = "10";

//     await page.click(`input[name="governanceToken.address"]`);
//     await page.$eval(
//       `input[name="governanceToken.address"]`,
//       (el: any, value) => (el.value = value),
//       governanceTokenAddress.substring(0, governanceTokenAddress.length - 1)
//     );
//     await page.type(
//       `input[name="governanceToken.address"]`,
//       governanceTokenAddress.charAt(governanceTokenAddress.length - 1)
//     );

//     // await page.click(`input[name="governanceToken.tokenId"]`);
//     // await page.type(`input[name="governanceToken.tokenId"]`, "0");

//     await page.click(`input[name="name"]`);
//     await page.$eval(
//       `input[name="name"]`,
//       (el: any, value) => (el.value = value),
//       daoName.substring(0, daoName.length - 1)
//     );
//     await page.type(`input[name="name"]`, daoName.charAt(daoName.length - 1));

//     await page.click(`input[name="symbol"]`);
//     await page.$eval(
//       `input[name="symbol"]`,
//       (el: any, value) => (el.value = value),
//       symbol.substring(0, symbol.length - 1)
//     );
//     await page.type(`input[name="symbol"]`, symbol.charAt(symbol.length - 1));

//     await page.click(`textarea[aria-label="empty textarea"]`);
//     await page.$eval(
//       `textarea[aria-label="empty textarea"]`,
//       (el: any, value) => (el.value = value),
//       description.substring(0, description.length - 1)
//     );
//     await page.type(
//       `textarea[aria-label="empty textarea"]`,
//       description.charAt(description.length - 1)
//     );

//     await page.click(`input[name="administrator"]`);
//     await page.$eval(
//       `input[name="administrator"]`,
//       (el: any, value) => (el.value = value),
//       administrator.substring(0, administrator.length - 1)
//     );
//     await page.type(
//       `input[name="administrator"]`,
//       administrator.charAt(administrator.length - 1)
//     );

//     await page.click(`input[name="guardian"]`);
//     await page.$eval(
//       `input[name="guardian"]`,
//       (el: any, value) => (el.value = value),
//       guardian.substring(0, guardian.length - 1)
//     );
//     await page.type(
//       `input[name="guardian"]`,
//       guardian.charAt(guardian.length - 1)
//     );

//     await page.click("#warning-close-button");
//     await page.click("#next-button");

//     await page.click(`input[name="votingBlocks"]`);
//     await page.type(`input[name="votingBlocks"]`, votingBlocks);

//     await page.click(`input[name="proposalFlushBlocks"]`);
//     await page.type(`input[name="proposalFlushBlocks"]`, proposalFlushBlocks);

//     await page.click(`input[name="proposalExpiryBlocks"]`);
//     await page.type(`input[name="proposalExpiryBlocks"]`, proposalExpiryBlocks);

//     await page.click(`input[name="proposeStakeRequired"]`);
//     await page.type(`input[name="proposeStakeRequired"]`, proposeStakeRequired);

//     await page.click(`input[name="minXtzAmount"]`);
//     await page.type(`input[name="minXtzAmount"]`, minXtzAmount);

//     await page.click(`input[name="maxXtzAmount"]`);
//     await page.type(`input[name="maxXtzAmount"]`, maxXtzAmount);

//     const slider = await page.$(`span[role="slider"]`);
//     if (slider) {
//       console.log("slider: ", slider);
//       const bounding_box = await slider.boundingBox();
//       if (bounding_box) {
//         await page.mouse.move(bounding_box.x, bounding_box.y);
//         await page.mouse.down();
//         console.log("bounding_box: ", bounding_box);
//         await page.mouse.move(bounding_box.x + 50, bounding_box.y);
//       }
//       await page.mouse.up();
//     }

//     await page.click("#next-button");

//     await page.click(`input[name="quorumThreshold"]`);
//     await page.$eval(
//       `input[name="quorumThreshold"]`,
//       (el: any, value) => (el.value = value),
//       quorumThreshold
//     );
//     // await page.type(`input[name="quorumThreshold"]`, quorumThreshold);

//     await page.click(`input[name="minQuorumAmount"]`);
//     await page.$eval(
//       `input[name="quorumThreshold"]`,
//       (el: any, value) => (el.value = value),
//       minQuorumAmount
//     );
//     // await page.type(`input[name="minQuorumAmount"]`, minQuorumAmount);

//     await page.click(`input[name="maxQuorumAmount"]`);
//     await page.$eval(
//       `input[name="quorumThreshold"]`,
//       (el: any, value) => (el.value = value),
//       maxQuorumAmount
//     );
//     // await page.type(`input[name="maxQuorumAmount"]`, maxQuorumAmount);

//     await page.click(`input[name="quorumChange"]`);
//     await page.$eval(
//       `input[name="quorumThreshold"]`,
//       (el: any, value) => (el.value = value),
//       quorumChange
//     );
//     // await page.type(`input[name="quorumChange"]`, quorumChange);

//     await page.click(`input[name="quorumMaxChange"]`);
//     await page.$eval(
//       `input[name="quorumThreshold"]`,
//       (el: any, value) => (el.value = value),
//       quorumMaxChange
//     );
//     // await page.type(`input[name="quorumMaxChange"]`, quorumMaxChange);

//     await page.click("#next-button");
//     await page.click("#next-button");

//     await page.waitForTimeout(15000);
//     // const contractDeployedText = "Waiting for DAO to be indexed"
//     // const isContractDeployed = await page.waitForXPath(`//*[contains(text(), "${contractDeployedText}")]`)
//     // console.log("isContractDeployed: ", isContractDeployed);
//   } catch (error) {
//     console.log("error: ", error);
//   }

//   // expect(text).toContain("Enter App");
// }, 1000000000);
