import { useEffect } from "react";
import { useQuery } from "react-query";
import { getDAOs } from "..";
import { useConnectWallet } from "../../../../store/wallet/hook";
import { getContractsAddresses } from "../../../pinata";
import { DAOItem } from "../types";

export const useDAOs = () => {
  const { tezos, connect } = useConnectWallet();

  const { data: addresses } = useQuery("daosAddresses", getContractsAddresses);

  console.log(addresses)

  const daosAddresses = addresses || [];

  const result = useQuery<DAOItem[], Error>(
    ["daos", addresses],
    async () => getDAOs(daosAddresses, tezos),
    {
      enabled: !!daosAddresses.length && !!tezos,
    }
  );

  useEffect(() => {
    if (!tezos) {
      connect();
    }
  }, [connect, tezos]);

  return result;
};