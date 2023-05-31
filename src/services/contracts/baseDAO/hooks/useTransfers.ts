import { BaseDAO } from ".."
import { useQuery } from "react-query"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getDAOTransfers } from "services/bakingBad/transfers"
import { mutezToXtz, parseUnits } from "services/contracts/utils"
import { BigNumber } from "bignumber.js"
import { getXTZTransfers } from "services/services/dao/services"
import dayjs from "dayjs"

export interface TransferWithBN {
  name: string
  amount: BigNumber
  recipient: string
  sender: string
  date: string
  hash: string
}

export const useTransfers = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress)
  const { network } = useTezos()

  const result = useQuery<TransferWithBN[], Error>(
    ["transfers", contractAddress],
    async () => {
      const tokenTransfersDTO = await getDAOTransfers((dao as BaseDAO).data.address, network)

      const xtzTransfersDTO = await getXTZTransfers((dao as BaseDAO).data.address)

      const xtzTransfers: TransferWithBN[] = xtzTransfersDTO.transfer.map(t => ({
        ...t,
        recipient: contractAddress,
        sender: t.from_address,
        date: t.timestamp,
        name: "XTZ",
        hash: t.hash,
        amount: mutezToXtz(new BigNumber(t.amount))
      }))

      const tokenTransfers: TransferWithBN[] = tokenTransfersDTO.map(t => ({
        ...t,
        recipient: t.to,
        sender: t.from,
        date: t.timestamp,
        name: t.token.symbol === "OBJKT" ? `${t.token.symbol}#${t.token.token_id}` : t.token.symbol || "-",
        hash: t.hash,
        amount: parseUnits(new BigNumber(t.amount), t.token.decimals)
      }))

      return tokenTransfers.concat(xtzTransfers).sort((a, b) => (dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1))
    },
    {
      enabled: !!dao
    }
  )

  return result
}
