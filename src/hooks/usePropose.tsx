import React, { useCallback } from "react";
// import { useContract } from "./useContract";

interface Transfer {
  amount: number;
  recipient: string;
}

interface ProposeParams {
  tokensToFreeze: number;
  agoraPostId: number;
  transfers: Transfer[];
}

export const usePropose = (
  contractAddress: string,
  { tokensToFreeze, agoraPostId, transfers }: ProposeParams
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
