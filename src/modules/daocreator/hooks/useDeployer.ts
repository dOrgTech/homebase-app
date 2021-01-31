import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import { extractMetadataInformation } from "../../../contracts/store/dependency/treasury";
import { useOriginate } from "../../../hooks/useOriginate";
import { setMetadataJSON } from "../../../services/contracts/baseDAO/metadataCarrier/metadata";
import { TokenHolder } from "../../../services/contracts/baseDAO/types";
import { AppState } from "../../../store";

export const useDeployer = (): (() => Promise<void>) => {
  const info = useSelector<AppState, AppState["saveDaoInformationReducer"]>(
    (state) => state.saveDaoInformationReducer
  );

  const test = extractMetadataInformation(info);
  const metadataCarrierParams = setMetadataJSON({
    authors: [info.memberSettings.administrator],
    description: info.orgSettings.description,
    frozenToken: test.metadata.frozenToken,
    unfrozenToken: test.metadata.unfrozenToken,
  });
  const [originateMetaData, { data: carrierData }] = useOriginate(
    "MetadataCarrier",
    test
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
      adminAddress: info.memberSettings?.administrator || "",
      frozenScaleValue: 1,
      frozenExtraValue: 0,
      slashScaleValue: 1,
      slashDivisionValue: 1,
      minXtzAmount: 1,
      maxXtzAmount: info.memberSettings?.maxAgent || 0,
      maxProposalSize: 100,
      quorumTreshold: 4,
      votingPeriod:
        (info.votingSettings?.votingHours || 1) * 3600 +
        (info.votingSettings?.votingDays || 1) * 24 * 3600 +
        (info.votingSettings?.votingMinutes || 1) * 60,
    },
    metadataCarrierDeploymentData: {
      deployAddress: carrierData ? carrierData.address : "",
      keyName: "jaja",
    },
  });

  // useEffect(() => {
  //   (async () => {
  //     await addNewContractToIPFS("KT1FvSHdoD6gJX6LgMJRJ1Fr7bXpGLLv6xEP");
  //   })();
  // }, []);

  useEffect(() => {
    if (carrierData?.address && !loadingTreasuryData) {
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
