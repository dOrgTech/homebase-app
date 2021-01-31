import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import { mapLimit } from "async";
import { getLedgerAddresses } from "../../bakingBad/ledger";
import { getDAOListMetadata } from "./metadataCarrier";
import { DAOItem, DAOStorageDTO } from "./types";

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
  const contract = await tezos.wallet.at(contractAddress, tzip16);
  const storage = await contract.storage<DAOStorageDTO>();
  const metadata = await getDAOListMetadata(contract);
  const ledger = await getLedgerAddresses(storage.ledger, "delphinet");

  return {
    ...metadata,
    ledger,
  };
};
