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
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "..";
import { getDAO } from "services/indexer/dao/services";
import mixpanel from "mixpanel-browser";

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

const waitForIndexation = async (contractAddress: string) => {
  return new Promise(async (resolve, reject) => {
    let tries = 0;

    const tryDAOIndexation = async () => {
      const response = await getDAO(contractAddress);

      if (response.daos.length > 0) {
        resolve(true);

      } else {
        if (tries > 12) {
          console.log(`DAO indexation timed out`);
          reject(false);
        }

        console.log(`Verifying DAO indexation, trial #${tries + 1}`);

        tries++;

        setTimeout(async () => await tryDAOIndexation(), 10000);
      }
    };

    await tryDAOIndexation();
  });
};

export const useOriginate = (template: DAOTemplate) => {
  const queryClient = useQueryClient();
  const [states, setStates] = useState(INITIAL_STATES);

  const [activeState, setActiveState] = useState<number>();
  const { tezos, connect, network, account } = useTezos();

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

      let tezosToolkit = tezos;

      if (!account) {
        tezosToolkit = await connect();
      }

      mixpanel.track("Started DAO origination", {
        contract: "MetadataCarrier",
        daoName: params.orgSettings.name,
        daoType: params.template
      })

      const metadata = await deployMetadataCarrier({
        ...metadataParams,
        tezos: tezosToolkit,
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

      mixpanel.track("Started DAO origination", {
        contract: "BaseDAO",
        daoName: params.orgSettings.name
      })

      console.log(params, network, metadata)

      const contract = await BaseDAO.baseDeploy(template, {
        tezos: tezosToolkit,
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
        activeText: `Waiting for DAO to be indexed`,
        completedText: "",
      };

      setActiveState(2);
      setStates(updatedStates);

      mixpanel.track("Completed DAO creation", {
        daoName: params.orgSettings.name,
        daoType: params.template
      })

      mixpanel.track("Waiting for DAO indexation", {
        daoName: params.orgSettings.name,
        daoType: params.template
      })

      const indexed = await waitForIndexation(contract.address);

      updatedStates[2] = {
        ...updatedStates[2],
        completedText: indexed
          ? `Deployed ${metadataParams.metadata.unfrozenToken.name} successfully`
          : `Deployed ${metadataParams.metadata.unfrozenToken.name} successfully, but metadata has not been indexed yet. This usually takes a few minutes, your DAO page may not be available yet.`,
      };

      setActiveState(3);
      setStates(updatedStates);

      mixpanel.track("Completed DAO indexation", {
        daoName: params.orgSettings.name,
        daoType: params.template
      })

      return contract;
    },
    {
      onSuccess: () => {
        queryClient.resetQueries();
      },
    }
  );

  console.log(result)

  return { mutation: result, states, activeState };
};
