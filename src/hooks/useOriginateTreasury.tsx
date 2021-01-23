import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  TreasuryStorageParams,
} from "../contracts/treasuryDAO/types";
import { deployTreasuryDAO } from "../contracts/treasuryDAO/deploy";
import { TezosToolkitContext } from "../store/wallet/context";
import { TezosToolkit } from "@taquito/taquito";
import { FA2MetadataParams } from "../contracts/metadataCarrier/types";

interface Props {
  storage: TreasuryStorageParams;
  metadata: FA2MetadataParams;
}

export const useOriginateTreasury = ({ storage, metadata }: Props) => {
  const [loading, setLoading] = useState(false);

  const originate = useCallback(async () => {
    setLoading(true);

    try {
      await deployTreasuryDAO(storage, metadata);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [storage, tezosToolkit]);

  return [originate, { loading }];
};
