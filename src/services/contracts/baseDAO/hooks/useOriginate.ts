import { Network } from "services/beacon/context";
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
import { connectIfNotConnected } from "services/contracts/utils";
import { getMetadataFromAPI } from "services/bakingBad/metadata";

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

const waitForMetadata = async (contractAddress: string, network: Network) => {
  return new Promise(async (resolve, reject) => {
    let tries = 0;

    const tryMetadata = async () => {
      try {
        await getMetadataFromAPI(contractAddress, network);
        resolve(true);
      } catch (e) {
        if (tries > 12) {
          console.log(`Metadata indexation timed out: ${e}`);
          reject(false);
        }

        console.log(`Verifying metadata indexation, trial #${tries + 1}`);

        tries++;

        setTimeout(async () => await tryMetadata(), 10000);
      }
    };

    await tryMetadata();
  });
};

export const useOriginate = (template: DAOTemplate) => {
  const queryClient = useQueryClient();
  const [states, setStates] = useState(INITIAL_STATES);

  const [activeState, setActiveState] = useState<number>();
  const { tezos, connect, network } = useTezos();

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

      await connectIfNotConnected(tezos, connect);

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
        network,
      });

      if (!contract) {
        throw new Error(`Error deploying ${template}DAO`);
      }

      updatedStates[1] = {
        ...updatedStates[1],
        completedText: `Deployed ${template} DAO contract with address "${contract.address}"`,
      };

      updatedStates[2] = {
        activeText: `Waiting for metadata to be indexed`,
        completedText: "",
      };

      setActiveState(2);
      setStates(updatedStates);

      await addNewContractToIPFS(contract.address);

      const indexed = await waitForMetadata(contract.address, network);

      updatedStates[2] = {
        ...updatedStates[2],
        completedText: indexed
          ? `Deployed ${metadataParams.metadata.unfrozenToken.name} successfully`
          : `Deployed ${metadataParams.metadata.unfrozenToken.name} successfully, but metadata has not been indexed yet. This usually takes a few minutes, your DAO page may not be available yet.`,
      };

      setActiveState(3);
      setStates(updatedStates);

      return contract;
    },
    {
      onSuccess: () => {
        queryClient.resetQueries("daos");
      },
    }
  );

  return { mutation: result, states, activeState };
};
