import { BigMapAbstraction } from "@taquito/taquito";
import { Ledger } from "../../bakingBad/ledger/types";
import { DAOListMetadata } from "./metadataCarrier/types";

export type DAOItem = {
  ledger: Ledger;
} & DAOListMetadata;

export interface DAOStorageDTO {
  //TODO

  ledger: BigMapAbstraction;
}
