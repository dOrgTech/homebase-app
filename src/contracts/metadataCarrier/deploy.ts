import { MichelsonMap } from "@taquito/taquito";
import { getTestProvider } from "../utils";
import { code } from "./code";
import { setMetadataJSON } from "./metadata";
import { FA2MetadataParams } from "./types";

const setMetadataMap = (keyName: string, metadata: FA2MetadataParams) => {
  const map = new MichelsonMap();
  const json = setMetadataJSON(metadata);

  map.set(keyName, json);

  return map;
};

export const deployMetadataCarrier = async (
  keyName: string,
  metadataParams: FA2MetadataParams
) => {
  const Tezos = await getTestProvider();
  const metadataMap = setMetadataMap(keyName, metadataParams);

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
  } catch (e) {
    console.log("error ", e);
  }
};
