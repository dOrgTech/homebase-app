import { deployDAO } from "services/contracts/baseDAO";
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
import { useNotification } from "modules/common/hooks/useNotification";
import { explorerUrls } from "services/beacon";
import { connectIfNotConnected } from "services/contracts/utils";

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

  const openNotification = useNotification();
  const result = useMutation<
    ContractAbstraction<ContractProvider | Wallet>,
    Error,
    OriginateParams
  >(
    async ({ metadataParams, params }) => {
      const {
        key: connectNotification,
        closeSnackbar: closeConnectNotification,
      } = openNotification({
        message: "You must connect before ",
      });
      await connectIfNotConnected(tezos, connect);

      closeConnectNotification(connectNotification);
      const states: string[] = [];

      setStateUpdates({
        states,
        current: "Deploying Metadata Carrier Contract",
      });

      const {
        key: metadataDeploymentNotification,
        closeSnackbar: closeMetadataDeploymentNotification,
      } = openNotification({
        message: "Metadata Contract is being deployed...",
        persist: true,
        variant: "info",
      });

      const metadata = await deployMetadataCarrier({
        ...metadataParams,
        tezos,
      });
      closeMetadataDeploymentNotification(metadataDeploymentNotification);

      if (!metadata) {
        openNotification({
          message: "Error deploying MetadataCarrier Contract",
          variant: "error",
        });
        throw new Error(
          `Could not deploy ${template}DAO because MetadataCarrier contract deployment failed`
        );
      }

      openNotification({
        message: "Metadata Contract has been deployed",
        detailsLink: explorerUrls.edo2net + "/" + metadata?.contract.address,
        variant: "success",
      });

      states.push(
        `Deployed Metadata Carrier with address "${metadata.deployAddress}" and key "${metadata.keyName}"`
      );

      openNotification({
        message: `Getting everything ready for ${template} DAO deployment...`,
        variant: "info",
      });

      setStateUpdates({
        states,
        current: `Deploying ${template} DAO Contract`,
      });
      const {
        key: templateDeploymentNotification,
        closeSnackbar: closeTemplateDeploymentNotification,
      } = openNotification({
        message: template + " Contract is being deployed...",
        persist: true,
        variant: "info",
      });

      const contract = await deployDAO({
        template,
        tezos,
        metadata,
        params,
      });

      closeTemplateDeploymentNotification(templateDeploymentNotification);

      if (!contract) {
        openNotification({
          message: `Error deploying ${template} Contract`,
          variant: "error",
        });
        throw new Error(`Error deploying ${template}DAO`);
      }

      openNotification({
        message: `${template} DAO deployed!`,
        variant: "success",
      });

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
