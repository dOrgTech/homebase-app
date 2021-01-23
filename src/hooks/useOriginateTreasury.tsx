import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FA2MetadataParams,
  TreasuryStorageParams,
} from "../contracts/treasuryDAO/types";
import { deployContract } from "../contracts/treasuryDAO/deploy";
import { TezosToolkitContext } from "../store/wallet/context";

interface Props {
  storage: TreasuryStorageParams;
  metadata: FA2MetadataParams;
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
