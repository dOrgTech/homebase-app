import { MetadataCarrierDeploymentData } from "services/contracts/metadataCarrier/types";
import { BaseStorageParams } from "../types";

export interface TreasuryParams {
  storage: BaseStorageParams;
  metadataCarrierDeploymentData: MetadataCarrierDeploymentData;
}

export type TreasuryParamsWithoutMetadata = Omit<
  TreasuryParams,
  "metadataCarrierDeploymentData"
>;
