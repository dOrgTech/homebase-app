import { ContractAbstraction, Wallet } from "@taquito/taquito";
import React, { useEffect, useState } from "react";
import { useConnectWallet } from "../store/wallet/hook";

export const useContract = (
  address: string
): ContractAbstraction<Wallet> | undefined => {
  const [contract, setContract] = useState<ContractAbstraction<Wallet>>();
  const { tezos, connect } = useConnectWallet();

  useEffect(() => {
    if (tezos) {
      (async () => {
        try {
          const contractInstance = await tezos.wallet.at(address);
          setContract(contractInstance);
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      connect();
    }
  }, [tezos, address, connect]);

  return contract;
};
