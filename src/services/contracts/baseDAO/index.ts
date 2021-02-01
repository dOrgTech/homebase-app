import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import { mapLimit } from "async";
import { getLedgerAddresses } from "../../bakingBad/ledger";
import { getStorage } from "../../bakingBad/storage";
import { Network } from "../../beacon/context";
import { getDAOListMetadata } from "./metadataCarrier";
import { DAOItem } from "./types";
import { getProposals } from "../../bakingBad/proposals";
import { Proposal } from "../../bakingBad/proposals/types";
import { Ledger } from "../../bakingBad/ledger/types";

const getContract = async (tezos: TezosToolkit, contractAddress: string) => {
  return await tezos.wallet.at(contractAddress, tzip16);
};

export const getDAOs = async (
  addresses: string[],
  tezos: TezosToolkit | undefined,
  network: Network
): Promise<DAOItem[]> => {
  if (!tezos) {
    return [];
  }

  return mapLimit(addresses, 5, async (address) =>
    getDAOInfoFromContract(address, tezos, network)
  );
};

export const getDAOInfoFromContract = async (
  contractAddress: string,
  tezos: TezosToolkit,
  network: Network
): Promise<DAOItem> => {
  const contract = await getContract(tezos, contractAddress);
  const storage = await getStorage(contractAddress, network)
  const metadata = await getDAOListMetadata(contract);
  const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);

  return {
    ...metadata,
    ledger,
  };
};

export const getDAOProposals = async (
  contractAddress: string,
  network: Network
): Promise<Proposal[]> => {
  const storage = await getStorage(contractAddress, network)
  const proposals = await getProposals(storage.proposalsMapNumber, network)

  return proposals;
};

export const getDAOTokenHolders = async (
  contractAddress: string,
  network: Network
): Promise<Ledger> => {
  const storage = await getStorage(contractAddress, network)
  const ledger = await getLedgerAddresses(storage.proposalsMapNumber, network)

  return ledger;
}
