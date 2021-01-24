import { MichelsonMap } from "@taquito/taquito";
import { char2Bytes } from "@taquito/tzip16";
import { getTestProvider } from "../utils";
import { code } from "./code";
import { setMetadataJSON } from "./metadata";
import { FA2MetadataParams, MetadataCarrierParameters } from "./types";

const setMetadataMap = (keyName: string, metadata: FA2MetadataParams) => {
  const map = new MichelsonMap();
  const json = setMetadataJSON(metadata);

  map.set(keyName, char2Bytes(JSON.stringify(json)));

  return map;
};

export const deployMetadataCarrier = async ({
  keyName,
  metadata,
  tezos,
}: MetadataCarrierParameters) => {
  const metadataMap = setMetadataMap(keyName, metadata);

  if (tezos) {
    console.log("Originating Metadata Carrier contract with wallet...");
    const test = await tezos.wallet
      .originate({
        code,
        storage: {
          metadata: metadataMap,
        },
      })
      .send();
    console.log(
      "Waiting for confirmation on Metadata Carrier contract...",
      test
    );
    const c = await test.contract();
    console.log("Metadata Carrier deployment completed", c);
    return;
  }
  const Tezos = await getTestProvider();

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
    return c;
  } catch (e) {
    console.log("error ", e);
  }
};
