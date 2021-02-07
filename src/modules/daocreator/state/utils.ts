import { MetadataCarrierParameters } from "../../../services/contracts/baseDAO/metadataCarrier/types";
import {
  MetadataStorageState,
  Token,
} from "../../../services/contracts/baseDAO/treasuryDAO/types";
import { MigrationParams } from "../../../services/contracts/baseDAO/types";
import { TokenHolder } from "./types";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_DAY = 60 * 60 * 24;

export const getTokensInfo = (
  state: MigrationParams
): MetadataStorageState["metadata"] => {
  const tokenInformation: Omit<Token, "decimals"> = { ...state.orgSettings };
  return {
    frozenToken: { ...tokenInformation, decimals: 18 },
    unfrozenToken: { ...tokenInformation, decimals: 18 },
  };
};

export const fromStateToTreasuryStorage = (info: MigrationParams) => {
  const membersTokenAllocation = info.memberSettings.tokenHolders.map(
    (holder: TokenHolder) => ({
      address: holder.address,
      amount: holder.balance.toString(),
      tokenId: "0",
    })
  );

  const storageData = {
    storage: {
      membersTokenAllocation,
      adminAddress: info.memberSettings.administrator || "",

      frozenScaleValue: info.votingSettings.proposeStakePercentage,
      frozenExtraValue: info.votingSettings.proposeStakeRequired,
      slashScaleValue: info.votingSettings.frozenScaleValue,
      slashDivisionValue: 100,

      minXtzAmount: info.votingSettings.minXtzAmount,
      maxXtzAmount: info.votingSettings.maxXtzAmount || 0,
      maxProposalSize: info.votingSettings.maxProposalSize,
      quorumTreshold: info.votingSettings.quorumTreshold,
      votingPeriod:
        (info.votingSettings.votingHours || 0) * SECONDS_IN_HOUR +
        (info.votingSettings.votingDays || 0) * SECONDS_IN_DAY +
        (info.votingSettings.votingMinutes || 0) * SECONDS_IN_MINUTE,
    },
  };

  return storageData;
};
