import { TezosToolkit } from "@taquito/taquito";

export const connectIfNotConnected = async (
  tezos: TezosToolkit,
  connect: () => Promise<TezosToolkit>
): Promise<void> => {
  if (!("_pkh" in tezos.wallet)) {
    await connect();
  }
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
