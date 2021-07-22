import BigNumber from "bignumber.js";
import { DAOTemplate } from "modules/creator/state";
import { useQuery } from "react-query";
import { TokenMetadata } from "services/bakingBad/tokens";
import { Network } from "services/beacon/context";
import { RegistryDAO, TreasuryDAO } from "services/contracts/baseDAO";
import { parseUnits } from "services/contracts/utils";
import { client } from "../graphql";
import {
  DAODTO,
  LedgerDTO,
  ProposalDTO,
  RegistryExtraDTO,
  VoteDTO,
} from "../types";
import { GET_DAOS_QUERY, GET_DAO_QUERY } from "./queries";

export interface DAOListItem {
  dao_type: {
    name: DAOTemplate;
  };
  description: string;
  address: string;
  frozen_token_id: string;
  governance_token_id: string;
  ledgers: {
    holder: {
      address: string;
    };
  }[];
  name: string;
  network: Network;
  period: string;
  staked: string;
  start_time: string;
  token: TokenMetadata;
}

interface GetAllDAOsDTO {
  daos: DAOListItem[];
}

export type FetchedDAO = DAODTO & {
  ledgers: LedgerDTO[];
  proposals: (ProposalDTO & { votes: VoteDTO[] })[];
};

interface GetDAODTO {
  daos: [FetchedDAO];
}

export const useAllDAOs = (network: Network) => {
  return useQuery(
    ["daos", network],
    async () => {
      const response = await client.request<GetAllDAOsDTO>(GET_DAOS_QUERY, {
        network,
      });
      return response.daos;
    },
    {
      enabled: !!network,
    }
  );
};

export const useDAO = (address: string | undefined) => {
  return useQuery(
    ["dao", address],
    async () => {
      const response = await client.request<GetDAODTO>(GET_DAO_QUERY, {
        address,
      });

      const dao = response.daos[0];
      const base = {
        ...dao,
        token: {
          ...dao.token,
          supply: new BigNumber(dao.token.supply),
        },
        ledger: dao.ledgers.map(ledger => ({
          ...ledger,
          balance: parseUnits(new BigNumber(ledger.balance), dao.token.decimals)
        })),
        type: dao.dao_type.name,
        extra: dao.registry_extras[0] as RegistryExtraDTO,
        quorum_threshold: parseUnits(new BigNumber(dao.quorum_threshold), dao.token.decimals)
      }

      switch (dao.dao_type.name) {
        case "treasury":
          return new TreasuryDAO(base);
        case "registry":
          return new RegistryDAO(base);
        default:
          throw new Error(
            `DAO with address '${dao.address}' has an unrecognized type '${dao.dao_type.name}'`
          );
      }
    },
    {
      enabled: !!address,
    }
  );
};
