import React, { useCallback } from "react";
// import { useContract } from "./useContract";



export const usePropose = (
  contractAddress: string,
) => {
  // const contract = useContract(contractAddress);

  // return useCallback(async () => {
  //   if (contract) {
  //     return await contract.methods
  //       .propose(
  //         tokensToFreeze,
  //         agoraPostId,
  //         transfers.map(({ amount, recipient }) => ({
  //           transfer_type: {
  //             amount,
  //             recipient,
  //           },
  //         }))
  //       )
  //       .send();
  //   }
  // }, [contract, tokensToFreeze, agoraPostId, transfers]);
};
