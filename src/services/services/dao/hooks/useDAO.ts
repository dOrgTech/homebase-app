import BigNumber from "bignumber.js"
import { Token } from "models/Token"
import { useState, useContext, useEffect, useMemo } from "react"
import { useQuery } from "react-query"
import { TZKTSubscriptionsContext } from "services/bakingBad/context/TZKTSubscriptions"
import { getTokenMetadata } from "services/bakingBad/tokenBalances"
import { Network } from "services/beacon"
import { useTezos } from "services/beacon/hooks/useTezos"
import { unpackExtraNumValue, CycleInfo } from "services/contracts/baseDAO"
import { LambdaDAO } from "services/contracts/baseDAO/lambdaDAO"
import { parseUnits } from "services/contracts/utils"
import { getDAO } from "services/services/dao/services"
import { useBlockchainInfo } from "../../../contracts/baseDAO/hooks/useBlockchainInfo"
import { useCommunityForContract } from "modules/lite/explorer/hooks/useCommunityForContract"
import { fetchLiteData } from "services/services/lite/lite-services"
import { Community } from "services/services/types"

export const useDAO = (address: string) => {
  const [cycleInfo, setCycleInfo] = useState<CycleInfo>()
  const { network } = useTezos()
  const { data: blockchainInfo } = useBlockchainInfo()
  const {
    state: { block }
  } = useContext(TZKTSubscriptionsContext)

  const { data, ...rest } = useQuery(
    ["dao", address],
    async () => {
      const response = await getDAO(address as string)
      const liteDAO = await fetchLiteData(address, network)

      const dao = response.daos[0]

      const token = await getTokenMetadata(
        dao.token.contract,
        dao.token.network as Network,
        dao.token.token_id.toString()
      )

      const base = {
        ...dao,
        token,
        ledger: dao.ledgers.map(ledger => {
          const current_unstaked = parseUnits(new BigNumber(ledger.current_unstaked), dao.token.decimals)

          const past_unstaked = parseUnits(new BigNumber(ledger.past_unstaked), dao.token.decimals)

          const staked = parseUnits(new BigNumber(ledger.staked), dao.token.decimals)

          const current_stage_num = ledger.current_stage_num

          return {
            ...ledger,
            current_stage_num,
            current_unstaked,
            past_unstaked,
            staked,
            holder: {
              ...ledger.holder,
              proposals_voted: ledger.holder.proposals_aggregate?.aggregate.count || 0,
              votes_cast: parseUnits(
                new BigNumber(ledger.holder.votes_aggregate?.aggregate.sum.amount || 0),
                dao.token.decimals
              )
            }
          }
        }),
        type: dao.dao_type.name,
        extra:
          dao.dao_type.name === "lambda"
            ? ({
                ...dao.lambda_extras[0],
                frozen_extra_value: parseUnits(
                  unpackExtraNumValue((dao.lambda_extras[0] as any).frozen_extra_value),
                  dao.token.decimals
                ),
                frozen_scale_value: unpackExtraNumValue((dao.lambda_extras[0] as any).frozen_scale_value),
                slash_division_value: unpackExtraNumValue((dao.lambda_extras[0] as any).slash_division_value),
                min_xtz_amount: unpackExtraNumValue((dao.lambda_extras[0] as any).min_xtz_amount),
                max_xtz_amount: unpackExtraNumValue((dao.lambda_extras[0] as any).max_xtz_amount),
                slash_scale_value: unpackExtraNumValue((dao.lambda_extras[0] as any).slash_scale_value),
                max_proposal_size: (dao.lambda_extras[0] as any).max_proposal_size
              } as any)
            : ({
                ...dao.treasury_extras[0],
                frozen_extra_value: parseUnits(
                  unpackExtraNumValue((dao.treasury_extras[0] as any).frozen_extra_value),
                  dao.token.decimals
                ),
                frozen_scale_value: unpackExtraNumValue((dao.treasury_extras[0] as any).frozen_scale_value),
                slash_division_value: unpackExtraNumValue((dao.treasury_extras[0] as any).slash_division_value),
                min_xtz_amount: unpackExtraNumValue((dao.treasury_extras[0] as any).min_xtz_amount),
                max_xtz_amount: unpackExtraNumValue((dao.treasury_extras[0] as any).max_xtz_amount),
                slash_scale_value: unpackExtraNumValue((dao.treasury_extras[0] as any).slash_scale_value)
              } as any),
        quorum_threshold: parseUnits(new BigNumber(dao.quorum_threshold), dao.token.decimals)
      }

      switch (dao.dao_type.name) {
        case "lambda":
          return new LambdaDAO({ ...base, liteDAO })
        default:
          throw new Error(`DAO with address '${dao.address}' has an unrecognized type '${dao.dao_type.name}'`)
      }
    },
    {
      enabled: !!address,
      refetchInterval: 30000
    }
  )

  useEffect(() => {
    ;(async () => {
      if (data && blockchainInfo) {
        const blockTimeAverage = blockchainInfo.constants.timeBetweenBlocks
        const blocksFromStart = block - data.data.start_level
        const periodsFromStart = Math.floor(blocksFromStart / Number(data.data.period))
        const type = periodsFromStart % 2 == 0 ? "voting" : "proposing"
        const blocksLeft = Number(data.data.period) - (blocksFromStart % Number(data.data.period))

        setCycleInfo({
          blocksLeft,
          type,
          timeEstimateForNextBlock: blockTimeAverage,
          currentCycle: periodsFromStart,
          currentLevel: block
        })
      }
    })()
  }, [data, blockchainInfo, block, network])

  const ledgerWithBalances = useMemo(() => {
    if (data && cycleInfo) {
      return data.data.ledger.map(l => {
        const available_balance =
          cycleInfo.currentCycle > Number(l.current_stage_num)
            ? l.current_unstaked.plus(l.past_unstaked)
            : l.past_unstaked

        const total_balance = l.current_unstaked.plus(l.past_unstaked)

        return {
          ...l,
          available_balance,
          pending_balance: total_balance.minus(available_balance),
          total_balance
        }
      })
    }
  }, [data, cycleInfo])

  return {
    data,
    cycleInfo,
    ledger: ledgerWithBalances,
    ...rest
  }
}
