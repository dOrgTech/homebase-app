import { useCallback, useState } from "react";
import { ContractAbstraction, ContractProvider } from "@taquito/taquito";

import { MetadataCarrierParameters } from "../services/contracts/baseDAO/metadataCarrier/types";
import { deployMetadataCarrier } from "../services/contracts/baseDAO/metadataCarrier/deploy";
import { TreasuryParams } from "../services/contracts/baseDAO/treasuryDAO/types";
import { deployTreasuryDAO } from "../services/contracts/baseDAO/treasuryDAO/deploy";
import { Contract } from "../services/contracts/baseDAO/types";

type ContractName = "Treasury" | "MetadataCarrier";

type Parameters<T extends ContractName> = T extends "Treasury"
  ? TreasuryParams
  : MetadataCarrierParameters;

type DeployFunction = (parameters: any) => Promise<Contract>;

const deployFunctionMap: Record<ContractName, DeployFunction> = {
  Treasury: deployTreasuryDAO,
  MetadataCarrier: deployMetadataCarrier,
};

export const useOriginate = <T extends ContractName>(
  contractName: T,
  parameters: Parameters<T>
): [
  () => Promise<Contract>,
  {
    data: Contract;
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
      return result;
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [contractName, parameters]);
  return [originate, { loading, error, data: contract }];
};
