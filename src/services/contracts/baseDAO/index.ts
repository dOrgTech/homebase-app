import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";

export const getContract = async (
  tezos: TezosToolkit,
  contractAddress: string
) => {
  return await tezos.wallet.at(contractAddress, tzip16);
};
