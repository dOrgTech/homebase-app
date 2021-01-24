import React, { useCallback, useState } from "react";
import { MetadataCarrierParameters } from "../contracts/metadataCarrier/types";
import { deployMetadataCarrier } from "../contracts/metadataCarrier/deploy";
import { TreasuryParams } from "../contracts/treasuryDAO/types";
import { ContractAbstraction, ContractProvider } from "@taquito/taquito";
import { deployTreasuryDAO } from "../contracts/treasuryDAO/deploy";

type ContractName = "Treasury" | "MetadataCarrier";

type Parameters<T extends ContractName> = T extends "Treasury"
  ? TreasuryParams
  : MetadataCarrierParameters;

type DeployFunction = (
  parameters: any
) => Promise<ContractAbstraction<ContractProvider> | undefined>;

const deployFunctionMap: Record<ContractName, DeployFunction> = {
  Treasury: deployTreasuryDAO,
  MetadataCarrier: deployMetadataCarrier,
};

export const useOriginate = <T extends ContractName>(
  contractName: T,
  parameters: Parameters<T>
): [
  () => Promise<void>,
  {
    data: ContractAbstraction<ContractProvider> | undefined;
    loading: boolean;
    error: any;
  }
] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [contract, setContract] = useState<
    ContractAbstraction<ContractProvider>
  >();

  const originate = useCallback(async () => {
    setLoading(true);
    try {
      const result = await deployFunctionMap[contractName](parameters);
      setContract(result);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [contractName, parameters]);
  return [originate, { loading, error, data: contract }];
};
