import { MetadataCarrierDeploymentData } from "services/contracts/baseDAO/metadataCarrier/types";
import { BaseStorageParams } from "../types";

export interface RegistryStorageParams extends BaseStorageParams {
  totalSupply: any;
}

export interface RegistryParams {
  storage: RegistryStorageParams;
  metadataCarrierDeploymentData: MetadataCarrierDeploymentData;
}

export type RegistryParamsWithoutMetadata = Omit<
  RegistryParams,
  "metadataCarrierDeploymentData"
>;
