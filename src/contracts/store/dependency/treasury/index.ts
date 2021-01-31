import { MigrationParams } from "../types";
import { MetadataStorageState, Token } from "./state";

// export const toStateFromMigration = () => undefined;

// export const toMigrationFromState = () => undefined;

export const extractMetadataInformation = (
  state: MigrationParams
): MetadataStorageState => {
  const tokenInformation: Omit<Token, "decimals"> = { ...state.orgSettings };
  return {
    keyName: tokenInformation.name,
    metadata: {
      frozenToken: { ...tokenInformation, decimals: 18 },
      unfrozenToken: { ...tokenInformation, decimals: 18 },
    },
  };
};
