import { MetadataCarrierDeploymentData } from "services/contracts/metadataCarrier/types";
import { BaseStorageParams } from "../types";

export interface RegistryStorageParams extends BaseStorageParams {
  totalSupply: any;
}

export interface RegistryItem {
  key: string;
  newValue: string;
}

export interface RegistryParams {
  storage: RegistryStorageParams;
  metadataCarrierDeploymentData: MetadataCarrierDeploymentData;
}

export type RegistryParamsWithoutMetadata = Omit<
  RegistryParams,
  "metadataCarrierDeploymentData"
>;
