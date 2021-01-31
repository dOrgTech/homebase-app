import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContractsAddresses, getPinnedMetadata } from "../services/pinata";
import { AppState } from "../store";
import { saveDaos } from "../store/daos/action";

export const useDAOList = () => {
  // const { daos } = useSelector<AppState, AppState["daos"]>(
  //   (state) => state.daos
  // );
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const contractAddresses = await getContractsAddresses();

      if (contractAddresses) {
        dispatch(
          saveDaos({
            daos: [
              ...contractAddresses,
              "KT1FvSHdoD6gJX6LgMJRJ1Fr7bXpGLLv6xEP",
            ],
          })
        );
      }
    })();
  }, [dispatch]);

  return [];
};
