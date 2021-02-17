import {
  ContractAbstraction,
  ContractProvider,
  Wallet,
} from "@taquito/taquito";
import { OriginateTreasuryParams } from "../types";
import { useMutation, useQueryClient } from "react-query";
import { deployMetadataCarrier } from "../metadataCarrier/deploy";
import { deployTreasuryDAO } from "../treasuryDAO/deploy";
import { useEffect, useState } from "react";
import { addNewContractToIPFS } from "../../../pinata";
import { useTezos } from "src/services/beacon/hooks/useTezos";

export const useOriginateTreasury = () => {
  const queryClient = useQueryClient();
  const [stateUpdates, setStateUpdates] = useState<{
    states: string[];
    current: string;
  }>({
    states: [],
    current: "",
  });

  const { tezos, connect } = useTezos();

  const result = useMutation<
    ContractAbstraction<ContractProvider | Wallet>,
    Error,
    OriginateTreasuryParams
  >(
    async ({ metadataParams, treasuryParams }) => {
      const states: string[] = [];

      setStateUpdates({
        states,
        current: "Deploying Metadata Carrier Contract",
      });

      const metadata = await deployMetadataCarrier({
        ...metadataParams,
        tezos,
        connect,
      });

      if (!metadata) {
        throw new Error(
          `Could not deploy TreasuryDAO because MetadataCarrier contract deployment failed`
        );
      }

      states.push(
        `Deployed Metadata Carrier with address "${metadata.deployAddress}" and key "${metadata.keyName}"`
      );

      setStateUpdates({
        states,
        current: "Deploying Treasury DAO Contract",
      });

      console.log(metadata);

      const treasury = await deployTreasuryDAO({
        ...treasuryParams,
        metadataCarrierDeploymentData: metadata,
        tezos,
      });

      if (!treasury) {
        throw new Error(`Error deploying TreasuryDAO`);
      }

      setStateUpdates({
        states,
        current: "Waiting for confirmation on Treasury DAO contract",
      });

      const treasuryContract = await treasury.contract();

      states.push(
        `Deployed Treasury DAO contract with address "${treasuryContract.address}"`
      );

      setStateUpdates({
        states,
        current: "Saving Treasury DAO address in IPFS",
      });

      await addNewContractToIPFS(treasuryContract.address);

      states.push(
        `Deployed ${metadataParams.metadata.unfrozenToken.name} successfully`
      );

      setStateUpdates({
        states,
        current: "",
      });

      return treasuryContract;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("daos");
      },
    }
  );

  return { mutation: result, stateUpdates };
};
