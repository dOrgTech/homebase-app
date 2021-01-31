import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";

export const getDAOInfoFromContract = async (
  contractAddress: string,
  tezos: TezosToolkit
) => {
  const contract = await tezos.wallet.at(contractAddress, tzip16);

  const metadata = await contract.tzip16().getMetadata();
  const storage: any = await contract.storage();

  storage.ledger.get()

  console.log(metadata, storage);
};