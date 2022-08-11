import {
  MetadataStorageState,
} from "services/contracts/baseDAO/types";
import { MigrationParams } from ".";

export const getTokensInfo = (
  state: MigrationParams
): MetadataStorageState["metadata"] => {
  const tokenInformation = { ...state.orgSettings };
  return {
    frozenToken: tokenInformation.name,
    unfrozenToken: tokenInformation.name,
  };
};
