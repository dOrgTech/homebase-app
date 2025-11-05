import BigNumber from "bignumber.js"
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
import { fetchLiteData } from "services/services/lite/lite-services"
import { EtherlinkContext } from "services/wagmi/context"

// Generally this is used for onChain DAOs so can be renamed to useOnChainDAO
export const useDAO = (address: string) => {
  const [isLoading, setIsLoading] = useState(true)
  const [daoData, setDaoData] = useState<any | null>(null)
  const [cycleInfo, setCycleInfo] = useState<CycleInfo>()
  const { network } = useTezos()
  const { data: blockchainInfo } = useBlockchainInfo()
  const {
    daos: etherlinkOnchainDAOs,
    selectDao: selectEtherlinkDao,
    daoSelected: etherlinkDaoSelected
  } = useContext(EtherlinkContext)
  const {
    state: { block }
  } = useContext(TZKTSubscriptionsContext)

  const { data, ...rest } = useQuery(
    ["dao", address],
    async () => {
      const [response, liteDAO] = await Promise.all([getDAO(address as string), fetchLiteData(address, network)])

      console.log("useDAO.ts", { response, liteDAO })

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
      enabled: !!address && !network?.startsWith("etherlink"),
      refetchInterval: 30000,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    ;(async () => {
      if ((data as any)?.address === "onchain-etherlink") {
        console.log("No cycle info for etherlink")
        return
      } else if (data && blockchainInfo) {
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

  useEffect(() => {
    const dao = etherlinkDaoSelected
    if (dao) {
      setDaoData(
        new LambdaDAO({
          id: 1,
          name: dao.name,
          dao_type: {
            id: 3,
            name: "lambda"
          },
          description: dao.description,
          data: {
            network: network
          },
          start_level: 0,
          period: "0",
          ledger: [],
          admin: "",
          address: dao.address,
          token: {
            id: 0,
            name: "Unknown",
            symbol: "Unknown",
            decimals: 0,
            network: network as Network,
            supply: "0",
            contract: "Unknown",
            token_id: "Unknown",
            standard: "Unknown"
          },
          etherlink: {
            stats: {
              members: "58",
              active_proposals: "1",
              awaiting_executions: "2"
            }
          },
          meta: {
            users: [
              {
                address: "tz1VJpG3LpAgE3yvvQn9FgG4YbYpP3oYXxw",
                availableStaked: 5000,
                totalStaked: 10000,
                votes: 1000,
                proposalsVoted: 100
              }
            ]
          },
          extra: {
            frozen_token_id: "0",
            min_quorum_threshold: "0",
            quorum_change: "0",
            quorum_threshold: "0",
            frozen_extra_value: "0",
            frozen_scale_value: "0",
            max_proposal_size: 0,
            max_xtz_amount: "0",
            returnedPercentage: 0
          },
          liteDAO: undefined,
          frozen_token_id: "0",
          frozen_scale_value: "0",
          frozen_extra_value: "0",
          guardian: "",
          max_quorum_change: "0",
          max_quorum_threshold: "0",
          min_quorum_threshold: "0",
          quorum_change: "0",
          quorum_threshold: "0",
          max_proposal_size: 0,
          max_xtz_amount: "0",
          min_xtz_amount: "0",
          network: network,
          slash_division_value: "0",
          slash_scale_value: "0"
        } as any)
      )
    } else {
      setDaoData(data)
    }
  }, [address, etherlinkDaoSelected, network, data])

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

  useEffect(() => {
    console.log("useDAO.ts", { daoData })
  }, [daoData])

  useEffect(() => {
    selectEtherlinkDao(address)
  }, [address, selectEtherlinkDao])

  return {
    data: daoData,
    cycleInfo,
    ledger: ledgerWithBalances,
    ...rest,
    isLoading: rest.isLoading || isLoading
  }
}
