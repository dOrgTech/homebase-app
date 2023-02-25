import { MetadataStorageState, Token } from "services/contracts/baseDAO/types"
import { MigrationParams } from "."

export const getTokensInfo = (state: MigrationParams): MetadataStorageState["metadata"] => {
  const tokenInformation: Omit<Token, "decimals"> = { ...state.orgSettings }
  return {
    frozenToken: { ...tokenInformation, decimals: 18 },
    unfrozenToken: { ...tokenInformation, decimals: 18 }
  }
}
