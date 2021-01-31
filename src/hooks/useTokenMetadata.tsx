import React, { useEffect, useState } from "react";
import { tzip16, View } from "@taquito/tzip16";
import { useConnectWallet } from "../store/wallet/hook";

export const useMetadataViews = (contractAddress: string) => {
  const { tezos, connect } = useConnectWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [metadataViews, setMetadataViews] = useState<
    Record<string, () => View>
  >();

  useEffect(() => {
    if (tezos) {
      setIsLoading(true);

      (async () => {
        try {
          const contract = await tezos.contract.at(contractAddress, tzip16);
          const views = await contract.tzip16().metadataViews();
          console.log(await contract.tzip16().getMetadata())
          setMetadataViews(views);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      connect()
    }
  }, [contractAddress, tezos]);

  return { isLoading, views: metadataViews };
};
