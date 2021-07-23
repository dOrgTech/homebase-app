import BigNumber from "bignumber.js";
import { useQuery } from "react-query";
import {
  TreasuryDAO,
  RegistryDAO,
  unpackExtraNumValue,
} from "services/contracts/baseDAO";
import { parseUnits } from "services/contracts/utils";
import { client } from "services/indexer/graphql";
import { FetchedDAO } from "services/indexer/types";
import { mapTreasuryProposal, mapRegistryProposal } from "../mappers/proposal";
import { GET_DAO_QUERY } from "../queries";

interface GetDAODTO {
  daos: [FetchedDAO];
}

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
        ledger: dao.ledgers.map((ledger) => ({
          ...ledger,
          balance: parseUnits(
            new BigNumber(ledger.balance),
            dao.token.decimals
          ),
        })),
        type: dao.dao_type.name,
        extra:
          dao.dao_type.name === "registry"
            ? ({
                ...dao.registry_extras[0],
                frozen_extra_value: unpackExtraNumValue(
                  (dao.registry_extras[0] as any).frozen_extra_value
                ),
                frozen_scale_value: unpackExtraNumValue(
                  (dao.registry_extras[0] as any).frozen_scale_value
                ),
                slash_division_value: unpackExtraNumValue(
                  (dao.registry_extras[0] as any).slash_division_value
                ),
                min_xtz_amount: unpackExtraNumValue(
                  (dao.registry_extras[0] as any).min_xtz_amount
                ),
                max_xtz_amount: unpackExtraNumValue(
                  (dao.registry_extras[0] as any).max_xtz_amount
                ),
                slash_scale_value: unpackExtraNumValue(
                  (dao.registry_extras[0] as any).slash_scale_value
                ),
              } as any)
            : ({
                ...dao.treasury_extras[0],
                frozen_extra_value: unpackExtraNumValue(
                  (dao.treasury_extras[0] as any).frozen_extra_value
                ),
                frozen_scale_value: unpackExtraNumValue(
                  (dao.treasury_extras[0] as any).frozen_scale_value
                ),
                slash_division_value: unpackExtraNumValue(
                  (dao.treasury_extras[0] as any).slash_division_value
                ),
                min_xtz_amount: unpackExtraNumValue(
                  (dao.treasury_extras[0] as any).min_xtz_amount
                ),
                max_xtz_amount: unpackExtraNumValue(
                  (dao.treasury_extras[0] as any).max_xtz_amount
                ),
                slash_scale_value: unpackExtraNumValue(
                  (dao.treasury_extras[0] as any).slash_scale_value
                ),
              } as any),
        quorum_threshold: parseUnits(
          new BigNumber(dao.quorum_threshold),
          dao.token.decimals
        ),
      };

      switch (dao.dao_type.name) {
        case "treasury":
          return new TreasuryDAO({
            ...base,
            proposals: base.proposals.map((proposal) =>
              mapTreasuryProposal(proposal, base.token)
            ),
          });
        case "registry":
          return new RegistryDAO({
            ...base,
            proposals: base.proposals.map((proposal) =>
              mapRegistryProposal(proposal, base.token)
            ),
          });
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
