import {
  ContractAbstraction,
  ContractProvider,
  MichelsonMap,
} from "@taquito/taquito";
import { char2Bytes } from "@taquito/tzip16";
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

interface MetadataDeploymentResult {
  contract: ContractAbstraction<ContractProvider>;
  keyName: string;
  deployAddress: string;
}

export const deployMetadataCarrier = async ({
  keyName,
  metadata,
}: MetadataCarrierParameters): Promise<
  MetadataDeploymentResult | undefined
> => {
  const Tezos = await getTestProvider();
  const metadataMap = setMetadataMap(keyName, metadata);

  try {
    console.log("Originating Metadata Carrier contract...");

    const t = await Tezos.contract.originate({
      code,
      storage: {
        metadata: metadataMap,
      },
    });
    console.log("Waiting for confirmation on Metadata Carrier contract...", t);
    const c = await t.contract();
    console.log("Metadata Carrier deployment completed", c);
    return { contract: c, keyName, deployAddress: c.address };
  } catch (e) {
    console.log("error ", e);
  }
};
