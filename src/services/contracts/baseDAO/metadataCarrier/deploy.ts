import {
  ContractAbstraction,
  ContractProvider,
  MichelsonMap,
  TezosToolkit,
  Wallet,
} from "@taquito/taquito";
import { char2Bytes } from "@taquito/tzip16";
import { useTezos } from "src/services/beacon/hooks/useTezos";
import { getTestProvider } from "../../utils";
import { code } from "./code";
import { setMetadataJSON } from "./metadata";
import { MetadataCarrierParameters, MetadataParams } from "./types";

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

export const deployMetadataCarrier = async ({
  keyName,
  metadata,
  tezos,
}: MetadataCarrierParameters & { tezos: TezosToolkit }): Promise<
  MetadataDeploymentResult | undefined
> => {
  const Tezos = await getTestProvider();
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
  } catch (e) {
    if (e.name === "UnconfiguredSignerError") {
      console.log("Please connect your wallet before deploying");
      return;
    }
    console.log("error ", e);
  }
};
