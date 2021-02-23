import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import blockies from "blockies-ts";

export const getTestProvider = async (): Promise<TezosToolkit> => {
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

export const toShortAddress = (address: string, limit = 4): string => {
  return address
    .slice(0, limit)
    .concat("...")
    .concat(address.slice(address.length - limit, address.length));
};

export const mutezToXtz = (mutez: string) => {
  return Number((Number(mutez) / 10 ** 6).toFixed(6)).toString();
};

export const xtzToMutez = (xtz: string) => {
  return (Number(xtz) * 10 ** 6).toString();
};

const b582int = (val: string): string => {
  let rv = new BigNumber(0);
  const alpha = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  for (let i = 0; i < val.length; i++) {
    rv = rv.plus(
      new BigNumber(alpha.indexOf(val[val.length - 1 - i])).multipliedBy(
        new BigNumber(alpha.length).exponentiatedBy(i)
      )
    );
  }

  return rv.toString(16);
};

export const getBlockie = (address: string): string => {
  if (address.startsWith("tz") || address.startsWith("kt")) {
    return blockies
      .create({
        seed: `0${b582int(address)}`,
        spotcolor: "#000",
      })
      .toDataURL();
  }

  return blockies.create({ seed: address }).toDataURL();
};
