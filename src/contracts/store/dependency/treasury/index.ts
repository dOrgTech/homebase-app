import {
  MetadataStorageState,
  Token,
} from "../../../../services/contracts/baseDAO/treasuryDAO/types";
import { MigrationParams } from "../../../../services/contracts/baseDAO/types";

// export const toStateFromMigration = () => undefined;
// export const toMigrationFromState = () => undefined;

export const getTokensInfo = (
  state: MigrationParams
): MetadataStorageState["metadata"] => {
  const tokenInformation: Omit<Token, "decimals"> = { ...state.orgSettings };
  return {
    frozenToken: { ...tokenInformation, decimals: 18 },
    unfrozenToken: { ...tokenInformation, decimals: 18 },
  };
};
