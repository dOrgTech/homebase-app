import { TezosToolkit } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import blockies from "blockies-ts";

interface ListDAO {
  id: string;
  name: string;
  symbol: string;
  voting_addresses: number;
}

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

export const saveRecent = (dao: any) => {
  let updatedList = [];
  const currentList = localStorage.getItem('recentDAOs');
  if (currentList) {
    console.log(dao);
    console.log('entra');
    updatedList = JSON.parse(currentList);
    // console.log(list);
    updatedList.push(dao);
    // console.log(list);
  }
  localStorage.setItem('recentDAOs', JSON.stringify(updatedList));
}

export const initializeRecent = () => {
  const initialArray: Array<any> = [];
  const currentList = localStorage.getItem('recentDAOs');
  if (!currentList) {
    localStorage.setItem('recentDAOs', JSON.stringify(initialArray));   
  }
}