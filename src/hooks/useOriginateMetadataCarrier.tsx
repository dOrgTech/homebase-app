import React, { useCallback, useState } from "react";
import { FA2MetadataParams } from "../contracts/metadataCarrier/types";
import { deployMetadataCarrier } from "../contracts/metadataCarrier/deploy";

export const useOriginateMetadataCarrier = (
  keyName: string,
  metadata: FA2MetadataParams
) => {
  const [loading, setLoading] = useState(false);

  const originate = useCallback(async () => {
    setLoading(true);

    try {
      await deployMetadataCarrier(keyName, metadata);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [keyName, metadata]);

  return [originate, { loading }];
};
