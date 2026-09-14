import { useCallback, useEffect, useRef, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { client } from "services/services/graphql"
import { GET_PROPOSALS_QUERY } from "services/services/dao/queries"

const POLL_INTERVAL_MS = 10000
const MAX_ATTEMPTS = 18

interface ProposalRow {
  key: string
  start_date: string
  holder: { address: string }
}

interface ProposalsResponse {
  daos: { proposals: ProposalRow[] }[]
}

/**
 * The transfer-proposal form fires the origination and forgets it: nothing in
 * the app returns the resulting proposal key, which only exists once the
 * indexer has picked the operation up.
 *
 * `startWatching` therefore records the newest proposal key this account
 * already has on the DAO, then polls the indexer until a newer one appears and
 * hands its key to the callback. It gives up quietly after a few minutes.
 */
export const useNewestOwnProposalKey = (daoAddress: string | undefined) => {
  const { account } = useTezos()
  const [isWatching, setIsWatching] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const cancelledRef = useRef(false)

  useEffect(() => {
    return () => {
      cancelledRef.current = true
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const fetchNewestOwnProposal = useCallback(async () => {
    if (!daoAddress || !account) {
      return undefined
    }

    const response = await client.request<ProposalsResponse>(GET_PROPOSALS_QUERY, { address: daoAddress })
    const proposals = response.daos[0]?.proposals || []

    return proposals
      .filter(proposal => proposal.holder?.address?.toLowerCase() === account.toLowerCase())
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0]
  }, [daoAddress, account])

  const startWatching = useCallback(
    async (onFound: (proposalKey: string) => void) => {
      if (!daoAddress || !account || isWatching) {
        return
      }

      cancelledRef.current = false
      setIsWatching(true)

      let knownNewestKey: string | undefined
      try {
        knownNewestKey = (await fetchNewestOwnProposal())?.key
      } catch (error) {
        console.log("error: ", error)
      }

      let attempts = 0

      const tick = async () => {
        if (cancelledRef.current) {
          return
        }

        attempts += 1

        try {
          const newest = await fetchNewestOwnProposal()

          if (newest?.key && newest.key !== knownNewestKey) {
            setIsWatching(false)
            onFound(newest.key)
            return
          }
        } catch (error) {
          console.log("error: ", error)
        }

        if (attempts >= MAX_ATTEMPTS) {
          setIsWatching(false)
          return
        }

        timerRef.current = setTimeout(tick, POLL_INTERVAL_MS)
      }

      timerRef.current = setTimeout(tick, POLL_INTERVAL_MS)
    },
    [daoAddress, account, isWatching, fetchNewestOwnProposal]
  )

  return { startWatching, isWatching }
}
