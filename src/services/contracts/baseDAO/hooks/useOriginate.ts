import { OriginateParams } from "../types";
import { DAOTemplate } from "../../../../modules/creator/state/types";
import { useState } from "react";
import {
  ContractAbstraction,
  ContractProvider,
  Wallet,
} from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";

import { deployMetadataCarrier } from "services/contracts/metadataCarrier/deploy";
import { addNewContractToIPFS } from "services/pinata";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "..";
import { useNotification } from "modules/common/hooks/useNotification";

const INITIAL_STATES = [
  {
    activeText: "",
    completedText: "",
  },
  {
    activeText: "",
    completedText: "",
  },
  {
    activeText: "",
    completedText: "",
  },
];

export const useOriginate = (template: DAOTemplate) => {
  const queryClient = useQueryClient();
  const [states, setStates] = useState(INITIAL_STATES);
  const openNotification = useNotification();

  const [activeState, setActiveState] = useState<number>();
  const { tezos, connect } = useTezos();

  const result = useMutation<
    ContractAbstraction<ContractProvider | Wallet>,
    Error,
    OriginateParams
  >(
    async ({ metadataParams, params }) => {
      const updatedStates = INITIAL_STATES;

      updatedStates[0] = {
        activeText: "Deploying Metadata Carrier Contract",
        completedText: "",
      };

      setActiveState(0);
      setStates(updatedStates);

      const metadata = await deployMetadataCarrier({
        ...metadataParams,
        tezos,
        connect,
      });

      openNotification({
        message: "Metadata Carrier contract has been deployed",
      });

      if (!metadata) {
        throw new Error(
          `Could not deploy ${template}DAO because MetadataCarrier contract deployment failed`
        );
      }

      updatedStates[0] = {
        ...updatedStates[0],
        completedText: `Deployed Metadata Carrier with address "${metadata.deployAddress}" and key "${metadata.keyName}"`,
      };

      updatedStates[1] = {
        activeText: `Deploying ${template} DAO Contract`,
        completedText: "",
      };

      setActiveState(1);
      setStates(updatedStates);

      const contract = await BaseDAO.baseDeploy(template, {
        tezos,
        metadata,
        params,
      });

      if (!contract) {
        openNotification({
          message: "Deployment of " + template + " DAO has failed",
          variant: "error",
        });
        throw new Error(`Error deploying ${template}DAO`);
      }

      openNotification({
        message: template + " contract has been deployed ",
        variant: "success",
      });

      updatedStates[1] = {
        ...updatedStates[1],
        completedText: `Deployed ${template} DAO contract with address "${contract.address}"`,
      };

      updatedStates[2] = {
        activeText: `Saving ${template} DAO address in IPFS`,
        completedText: "",
      };

      setActiveState(2);
      setStates(updatedStates);

      await addNewContractToIPFS(contract.address);

      updatedStates[2] = {
        ...updatedStates[2],
        completedText: `Deployed ${metadataParams.metadata.unfrozenToken.name} successfully`,
      };

      setActiveState(3);
      setStates(updatedStates);

      return contract;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("daos");
      },
    }
  );

  return { mutation: result, states, activeState };
};
