import { MetadataCarrierParameters } from "../../../../services/contracts/baseDAO/metadataCarrier/types";
import { Token } from "../../../../services/contracts/baseDAO/treasuryDAO/types";
import { MigrationParams } from "../../../../services/contracts/baseDAO/types";

// export const toStateFromMigration = () => undefined;
// export const toMigrationFromState = () => undefined;

export const extractMetadataInformation = (
  state: MigrationParams
): MetadataCarrierParameters => {
  const tokenInformation: Omit<Token, "decimals"> = {
    ...state.orgSettings,
  };
  return {
    keyName: tokenInformation.name,
    metadata: {
      frozenToken: { ...tokenInformation, decimals: 18 },
      unfrozenToken: { ...tokenInformation, decimals: 18 },
      authors: ["a"],
      description: "a",
    },
  };
};
