import {
  MetadataStorageState,
  MigrationParams,
  Token,
} from "services/contracts/baseDAO/types";

export const getTokensInfo = (
  state: MigrationParams
): MetadataStorageState["metadata"] => {
  const tokenInformation: Omit<Token, "decimals"> = { ...state.orgSettings };
  return {
    frozenToken: { ...tokenInformation, decimals: 18 },
    unfrozenToken: { ...tokenInformation, decimals: 18 },
  };
};
