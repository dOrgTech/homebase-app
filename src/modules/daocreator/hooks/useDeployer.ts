import { useCallback, useContext } from "react";

import { useOriginate } from "../../../hooks/useOriginate";
import { MetadataCarrierParameters } from "../../../services/contracts/baseDAO/metadataCarrier/types";
import { CreatorContext } from "../state/context";
import { ActionTypes } from "../state/types";
import { fromStateToTreasuryStorage, getTokensInfo } from "../state/utils";
import {
  Contract,
  MigrationParams,
} from "../../../services/contracts/baseDAO/types";

export const useDeployer = (): (() => Promise<
  | {
      metadata: Contract;
      treasury: Contract;
    }
  | undefined
>) => {
  const { state, dispatch } = useContext(CreatorContext);
  const info: MigrationParams = state.data;
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

  const treasuryParams = fromStateToTreasuryStorage(
    info,
    carrierData,
    metadataCarrierParams
  );
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
      const treasury = await originateTreasury();
      if (!treasury) throw new Error("Error deploying treasury contract");
      dispatch({
        type: ActionTypes.UPDATE_DEPLOYMENT_STATUS,
        status: {
          deploying: false,
          contract: treasury.address,
        },
      });
      return {
        treasury,
        metadata,
      };
    } catch (e) {
      console.log("Error deploying treasury DAO: ", e);
    }
  }, [originateMetaData, originateTreasury]);

  return deploy;
};
