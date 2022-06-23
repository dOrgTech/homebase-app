import { cleanup, fireEvent, render } from "@testing-library/react";
import App from "App";
import { importKey } from "@taquito/signer";
import {
  BigMapAbstraction,
  TezosToolkit,
  MichelsonMap,
} from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { fromStateToBaseStorage } from "services/contracts/baseDAO";
import { MigrationParams } from "modules/creator/state";
import { deployMetadataCarrier } from "services/contracts/metadataCarrier/deploy";
import {
  MetadataCarrierParameters,
  MetadataParams,
} from "services/contracts/metadataCarrier/types";
import { generateStorageContract } from "services/baseDAODocker";
import baseDAOContractCode from "../services/contracts/baseDAO/michelson/baseDAO";

let Tezos: TezosToolkit;

const bobPrivKey = "edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt";
const alicePrivKey = "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq";

const network = "devnet";

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

const initTezosToolKit = async (pk: string) => {
  // Tezos = new TezosToolkit("https://ithacanet.smartpy.io");
  Tezos = new TezosToolkit("http://localhost:20000");
  console.log("Tezos Connected: ");
  return Tezos;
};

beforeAll(async () => {
  await initTezosToolKit(bobPrivKey);
});

const setTezosSignerProvider = async (pk: string) => {
  const signer = await InMemorySigner.fromSecretKey(pk);
  Tezos.setProvider({ signer });
};

it("Creates a DAO and returns address", async () => {
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
}, 500000);

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
  // console.log("contractStorage: ", contractStorage);
  // console.log("addressContract: ", addressContract);
  expect(contractStorage).not.toBe(null);
  if (contractStorage instanceof Object) {
    expect((contractStorage as any).governance_token.address).toBe(
      params.orgSettings.governanceToken.address
    );
  }
}, 500000);
