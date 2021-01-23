import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";

export const getTestProvider = async () => {
  const Tezos = new TezosToolkit("https://api.tez.ie/rpc/delphinet");

  Tezos.setProvider({
    signer: await InMemorySigner.fromSecretKey(
      "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"
    ),
  });

  return Tezos;
};

export const stringToHex = (value: string): string => {
  let result = "";

  for (let i = 0; i < value.length; i++) {
    result += value.charCodeAt(i).toString(16).slice(-4);
  }

  return result;
};
