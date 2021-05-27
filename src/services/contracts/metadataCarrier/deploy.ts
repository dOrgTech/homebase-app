import {
  ContractAbstraction,
  ContractProvider,
  MichelsonMap,
  TezosToolkit,
  Wallet,
} from "@taquito/taquito";
import { char2Bytes } from "@taquito/tzip16";

import { code } from "services/contracts/metadataCarrier/code";
import { setMetadataJSON } from "services/contracts/metadataCarrier/metadata";
import {
  MetadataCarrierParameters,
  MetadataParams,
} from "services/contracts/metadataCarrier/types";

const setMetadataMap = (keyName: string, metadata: MetadataParams) => {
  const map = new MichelsonMap();
  const json = setMetadataJSON(metadata);

  map.set(keyName, char2Bytes(JSON.stringify(json)));

  return map;
};

export interface MetadataDeploymentResult {
  contract: ContractAbstraction<ContractProvider | Wallet>;
  keyName: string;
  deployAddress: string;
}

interface Tezos {
  tezos: TezosToolkit;
  connect: () => Promise<TezosToolkit>;
}

export const deployMetadataCarrier = async ({
  keyName,
  metadata,
  tezos,
}: MetadataCarrierParameters & Tezos): Promise<
  MetadataDeploymentResult | undefined
> => {
  const metadataMap = setMetadataMap(keyName, metadata);

  try {
    console.log("Originating Metadata Carrier contract...");

    const t = await tezos.wallet.originate({
      code,
      storage: {
        metadata: metadataMap,
      },
    });
    console.log("Waiting for confirmation on Metadata Carrier contract...", t);
    const c = await t.send();
    const contract = await c.contract();
    console.log("Metadata Carrier deployment completed", c);
    return { contract, keyName, deployAddress: contract.address };
  } catch (e: Error | any | unknown) {
    // This should be handled above!
    if (e.name === "UnconfiguredSignerError") {
      // If this happens its because the user is not connected to any wallet
      // Let's connect to a wallet provider and trigger the deployment method again
    }
    if (e instanceof Error) {
      const error: Error = e;
      console.log(error.name + ": " + error.message + "\n" + error.stack);
    }
    else {
      console.log(e);
    }
  }
};
