import {
  ContractAbstraction,
  ContractProvider,
  MichelsonMap,
  Wallet,
} from "@taquito/taquito";
import { bytes2Char, Tzip16ContractAbstraction } from "@taquito/tzip16";
import { DAOListMetadata } from "services/contracts/metadataCarrier/types";

export const getDAOListMetadata = async (
  contract: ContractAbstraction<Wallet> & {
    tzip16(
      this: ContractAbstraction<Wallet | ContractProvider>
    ): Tzip16ContractAbstraction;
  }
): Promise<DAOListMetadata> => {
  const metadata = await contract.tzip16().getMetadata();
  const views = await contract.tzip16().metadataViews();

  const {
    1: fa2Map,
  }: {
    1: MichelsonMap<string, string>;
  } = await views.token_metadata().executeView(0);

  console.log("Metadata: ", metadata.metadata);

  return {
    authors: metadata.metadata.authors || [],
    name: metadata.metadata.name || "",
    description: metadata.metadata.description || "",
    template: (metadata.metadata as any).template,
    unfrozenToken: {
      symbol: bytes2Char(fa2Map.get("symbol") as string),
      name: bytes2Char(fa2Map.get("name") as string),
      decimals: bytes2Char(fa2Map.get("decimals") as string),
    },
  };
};
