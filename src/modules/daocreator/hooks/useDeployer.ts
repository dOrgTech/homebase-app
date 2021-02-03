import { useCallback, useContext, useMemo } from "react";

import { useOriginate } from "../../../hooks/useOriginate";
import { MetadataCarrierParameters } from "../../../services/contracts/baseDAO/metadataCarrier/types";
import { CreatorContext } from "../state/context";
import { ActionTypes } from "../state/types";
import { fromStateToTreasuryStorage, getTokensInfo } from "../state/utils";
import {
  Contract,
  INITIAL_MIGRATION_STATE,
  MigrationParams,
} from "../../../services/contracts/baseDAO/types";

export const useDeployer = (): (() => Promise<
  | {
      metadata: Contract;
      treasury: Contract;
    }
  | undefined
>) => {
  const { state, dispatch, updateCache } = useContext(CreatorContext);
  const info: MigrationParams = state.data;
  const { frozenToken, unfrozenToken } = getTokensInfo(info);
  const metadataCarrierParams: MetadataCarrierParameters = useMemo(
    () => ({
      keyName: info.orgSettings.name,
      metadata: {
        frozenToken,
        unfrozenToken,
        description: info.orgSettings.description,
        authors: [info.memberSettings.administrator],
      },
    }),
    [info, frozenToken, unfrozenToken]
  );

  const [originateMetaData, { data: carrierData }] = useOriginate(
    "MetadataCarrier",
    metadataCarrierParams
  );

  const treasuryParams = useMemo(() => {
    return fromStateToTreasuryStorage(
      info,
      carrierData?.address || "",
      metadataCarrierParams
    );
  }, [carrierData, info, metadataCarrierParams]);

  const [originateTreasury] = useOriginate("Treasury", treasuryParams);

  const deploy = useCallback(async () => {
    try {
      dispatch({
        type: ActionTypes.UPDATE_DEPLOYMENT_STATUS,
        status: {
          deploying: true,
          contract: undefined,
        },
      });
      const metadata = await originateMetaData();
      if (!metadata) throw new Error("Error deploying metadata contract");
      console.log(treasuryParams);
      const treasury = await originateTreasury();
      if (!treasury) throw new Error("Error deploying treasury contract");

      dispatch({
        type: ActionTypes.UPDATE_DEPLOYMENT_STATUS,
        status: {
          deploying: false,
          contract: treasury.address,
        },
      });
      updateCache(INITIAL_MIGRATION_STATE);
      return {
        treasury,
        metadata,
      };
    } catch (e) {
      console.log("Error deploying treasury DAO: ", e);
    }
  }, [originateMetaData, originateTreasury, dispatch, updateCache]);

  return deploy;
};
