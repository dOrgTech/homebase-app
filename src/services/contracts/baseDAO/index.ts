import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import { mapLimit } from "async";
import { getLedgerAddresses } from "../../bakingBad/ledger";
import { Proposal } from "../../bakingBad/proposals/types";
import { getDAOListMetadata } from "./metadataCarrier";
import { DAOItem, DAOStorageDTO } from "./types";

const getContract = async (tezos: TezosToolkit, contractAddress: string) => {
  return await tezos.wallet.at(contractAddress, tzip16);
};

export const getDAOs = async (
  addresses: string[],
  tezos: TezosToolkit | undefined
): Promise<DAOItem[]> => {
  if (!tezos) {
    return [];
  }

  return mapLimit(addresses, 5, async (address) =>
    getDAOInfoFromContract(address, tezos)
  );
};

export const getDAOInfoFromContract = async (
  contractAddress: string,
  tezos: TezosToolkit
): Promise<DAOItem> => {
  const contract = await getContract(tezos, contractAddress);
  const storage = await contract.storage<DAOStorageDTO>();
  const metadata = await getDAOListMetadata(contract);
  const ledger = await getLedgerAddresses(storage.ledger, "delphinet");

  return {
    ...metadata,
    ledger,
  };
};

export const getDAOProposals = async (
  contractAddress: string,
  tezos: TezosToolkit
): Promise<void> => {
  const contract = await getContract(tezos, contractAddress);
};
