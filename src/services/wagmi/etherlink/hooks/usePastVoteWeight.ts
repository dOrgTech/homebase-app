import { useEffect, useMemo, useState } from "react"
import { ethers } from "ethers"

import HbDaoAbi from "assets/abis/hb_dao.json"
import HbTokenAbi from "assets/abis/hb_evm.json"

type DaoLike = {
  address?: string
  token?: string
  decimals?: number
}

type ProposalLike = {
  id?: string
}

export function usePastVoteWeight(
  dao?: DaoLike | null,
  proposal?: ProposalLike | null,
  signerAddress?: string,
  provider?: any
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weight, setWeight] = useState<bigint | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        setError(null)
        // Start a loading session for any dependency change
        setLoading(true)
        // Clear previous humanized value while we fetch again
        setWeight(null)
        // If inputs are not ready yet, keep loading=true so the UI shows
        // "Checking your voting weight..." instead of a misleading 0.
        if (!dao?.address || !dao?.token || !proposal?.id || !signerAddress || !provider) {
          return
        }
        const daoContract = new ethers.Contract(dao.address, (HbDaoAbi as any).abi, provider)
        const snapshot: bigint = await daoContract.proposalSnapshot(BigInt(proposal.id))
        if (!snapshot || snapshot === 0n) {
          setWeight(0n)
          setLoading(false)
          return
        }
        const tokenContract = new ethers.Contract(dao.token, (HbTokenAbi as any).abi, provider)
        const past: bigint = await tokenContract.getPastVotes(signerAddress, snapshot)
        if (!cancelled) setWeight(past)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [dao?.address, dao?.token, proposal?.id, signerAddress, provider])

  const decimals = dao?.decimals || 0
  const human = useMemo(() => {
    if (weight === null || weight === undefined) return null
    if (!decimals) return weight.toString()
    const s = weight.toString().padStart(decimals + 1, "0")
    const intPart = s.slice(0, -decimals)
    const frac = s.slice(-decimals).replace(/0+$/, "")
    return frac ? `${intPart}.${frac}` : intPart
  }, [weight, decimals])

  return { loading, error, weight, human }
}
