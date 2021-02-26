import { OriginateParams } from "../types";
import { DAOTemplate } from "../../../../modules/creator/state/types";
import { useState } from "react";
import {
  ContractAbstraction,
  ContractProvider,
  Wallet,
} from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";

import { deployMetadataCarrier } from "services/contracts/baseDAO/metadataCarrier/deploy";
import { addNewContractToIPFS } from "services/pinata";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "../classes";

export const useOriginate = (template: DAOTemplate) => {
  const queryClient = useQueryClient();
  const [stateUpdates, setStateUpdates] = useState<{
    states: string[];
    current: string;
  }>({
    states: [],
    current: "Waiting for confirmation",
  });

  const { tezos, connect } = useTezos();

  const result = useMutation<
    ContractAbstraction<ContractProvider | Wallet>,
    Error,
    OriginateParams
  >(
    async ({ metadataParams, params }) => {
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
          `Could not deploy ${template}DAO because MetadataCarrier contract deployment failed`
        );
      }

      states.push(
        `Deployed Metadata Carrier with address "${metadata.deployAddress}" and key "${metadata.keyName}"`
      );

      setStateUpdates({
        states,
        current: `Deploying ${template} DAO Contract`,
      });

      const contract = await BaseDAO.baseDeploy(template, {
        tezos,
        metadata,
        params,
      });

      if (!contract) {
        throw new Error(`Error deploying ${template}DAO`);
      }

      setStateUpdates({
        states,
        current: `Waiting for confirmation on ${template} DAO contract`,
      });

      states.push(
        `Deployed ${template} DAO contract with address "${contract.address}"`
      );

      setStateUpdates({
        states,
        current: `Saving ${template} DAO address in IPFS`,
      });

      await addNewContractToIPFS(contract.address);

      states.push(
        `Deployed ${metadataParams.metadata.unfrozenToken.name} successfully`
      );

      setStateUpdates({
        states,
        current: "",
      });

      return contract;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("daos");
      },
    }
  );

  return { mutation: result, stateUpdates };
};
