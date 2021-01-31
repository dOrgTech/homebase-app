import { useContext, useEffect, useMemo } from "react";

import { useOriginate } from "../../../hooks/useOriginate";
import { MetadataCarrierParameters } from "../../../services/contracts/baseDAO/metadataCarrier/types";
import { CreatorContext } from "../state/context";
import { MigrationParams, TokenHolder } from "../state/types";
import { getTokensInfo } from "../state/utils";

export const useDeployer = (): (() => Promise<void>) => {
  const info: MigrationParams = useContext(CreatorContext).state.data;
  const { frozenToken, unfrozenToken } = getTokensInfo(info);
  const metadataCarrierParams: MetadataCarrierParameters = {
    keyName: info.orgSettings.name,
    metadata: {
      frozenToken,
      unfrozenToken,
      description: info.orgSettings.description,
      authors: [info.memberSettings.administrator],
    },
  };

  const [originateMetaData, { data: carrierData }] = useOriginate(
    "MetadataCarrier",
    metadataCarrierParams
  );

  const membersTokenAllocation = useMemo(() => {
    return info.memberSettings.tokenHolders.map((holder: TokenHolder) => ({
      address: holder.address,
      amount: holder.balance.toString(),
      tokenId: "1",
    }));
  }, [info.memberSettings.tokenHolders]);

  const [
    originateTreasury,
    { loading: loadingTreasuryData, data: treasuryData },
  ] = useOriginate("Treasury", {
    storage: {
      membersTokenAllocation,
      adminAddress: info.memberSettings.administrator || "",
      // Make sure these four are well connected
      frozenScaleValue: info.votingSettings.proposeStakeRequired,
      frozenExtraValue: info.votingSettings.proposeStakePercentage,
      slashScaleValue: info.votingSettings.voteStakeRequired,
      slashDivisionValue: info.votingSettings.voteStakePercentage,

      minXtzAmount: info.votingSettings.minStake,
      maxXtzAmount: info.memberSettings.maxAgent || 0,
      maxProposalSize: 100,
      quorumTreshold: 4,
      votingPeriod:
        (info.votingSettings.votingHours || 1) * 3600 +
        (info.votingSettings.votingDays || 1) * 24 * 3600 +
        (info.votingSettings.votingMinutes || 1) * 60,
    },
    metadataCarrierDeploymentData: {
      deployAddress: carrierData ? carrierData.address : "",
      keyName: metadataCarrierParams.keyName,
    },
  });

  useEffect(() => {
    if (carrierData && !loadingTreasuryData) {
      originateTreasury();
    }
  }, [carrierData, originateTreasury, loadingTreasuryData]);

  useEffect(() => {
    if (treasuryData) {
      console.log("Treasury DAO contract data: ", treasuryData);
    }
  }, [treasuryData]);

  return originateMetaData;
};
