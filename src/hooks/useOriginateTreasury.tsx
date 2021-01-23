import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  TreasuryMetadataParams,
  TreasuryStorageParams,
} from "../contracts/treasuryDAO/types";
import { deployContract } from "../services/deployContract";
import { TezosToolkitContext } from "../store/wallet/context";

interface Props {
  storage: TreasuryStorageParams;
  metadata: TreasuryMetadataParams;
}

export const useOriginateTreasury = ({ storage, metadata }: Props) => {
  const [loading, setLoading] = useState(false);
  const { tezosToolkit } = useContext(TezosToolkitContext);

  const originate = useCallback(async () => {
    setLoading(true);

    try {
      if (!tezosToolkit) {
        throw new Error("You need to connect your wallet");
      }

      await deployContract(storage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [storage, tezosToolkit]);

  return [originate, { loading }];
};
