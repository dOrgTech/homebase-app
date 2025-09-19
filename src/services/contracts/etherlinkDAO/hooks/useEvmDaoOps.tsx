import { ethers } from "ethers"
import { create } from "zustand"
import { useCallback, useContext, useEffect, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EtherlinkContext } from "services/wagmi/context"

import HbTokenAbi from "assets/abis/hb_evm.json"
import { useNotification } from "modules/common/hooks/useNotification"
import { dbg } from "utils/debug"

/**
 *
 * delete - token->delete
 */

interface EvmDaoOpsStore {
  showProposalVoterList: boolean
  setShowProposalVoterList: (value: boolean) => void
}

const useEvmDaoOpsStore = create<EvmDaoOpsStore>()((set, get) => ({
  showProposalVoterList: false,
  setShowProposalVoterList: (value: boolean) => set({ showProposalVoterList: value })
}))

export const useEvmDaoOps = () => {
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null)
  const { etherlink } = useTezos()
  const { showProposalVoterList, setShowProposalVoterList } = useEvmDaoOpsStore()
  const openNotification = useNotification()

  const loggedInUserAddress = etherlink?.signer?.address
  const { daoSelected, daoMembers } = useContext(EtherlinkContext)
  const [userVotingWeight, setUserVotingWeight] = useState(0)
  const [userTokenBalance, setUserTokenBalance] = useState(0)
  const selectedUser = daoMembers?.find((member: any) => member.address === loggedInUserAddress)

  const proposalCreatedCount = selectedUser?.proposalsCreated?.length || 0
  const proposalVotedCount = selectedUser?.proposalsVoted?.length || 0

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    openNotification({
      message: "Address copied!",
      autoHideDuration: 2000,
      variant: "info"
    })
  }

  const daoDelegate = useCallback(
    async (targetAddress: string) => {
      if (!daoSelected) return
      console.log("Delegating to ", targetAddress)
      const govContract = new ethers.Contract(daoSelected.token, HbTokenAbi.abi, etherlink.signer)
      const tx = await govContract.delegate(targetAddress)
      console.log("Transaction sent:", tx.hash)
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)
      return receipt
    },
    [daoSelected, etherlink.signer]
  )

  useEffect(() => {
    if (!etherlink?.provider || !tokenContract || !etherlink?.signer?.address) return
    const getUserTokenBalance = async () => {
      dbg("[TOKEN:balanceOf:start]", {
        token: daoSelected?.token,
        account: etherlink?.signer?.address,
        decimals: daoSelected?.decimals
      })
      try {
        const balance = await tokenContract.balanceOf(etherlink?.signer?.address)
        dbg("[TOKEN:balanceOf:raw]", balance?.toString?.() ?? balance)
        const balanceActual = Number(balance) / Math.pow(10, daoSelected?.decimals)
        dbg("[TOKEN:balanceOf:calc]", balanceActual)
        setUserTokenBalance(balanceActual)
      } catch (e) {
        dbg("[TOKEN:balanceOf:error]", e)
        setUserTokenBalance(0)
      }
    }
    const getUserVotingWeight = async () => {
      dbg("[TOKEN:getVotes:start]", {
        token: daoSelected?.token,
        account: etherlink?.signer?.address,
        decimals: daoSelected?.decimals
      })
      try {
        const weight = await tokenContract.getVotes(etherlink?.signer?.address)
        dbg("[TOKEN:getVotes:raw]", weight?.toString?.() ?? weight)
        const weightActual = Number(weight) / Math.pow(10, daoSelected?.decimals)
        dbg("[TOKEN:getVotes:calc]", weightActual)
        setUserVotingWeight(weightActual)
      } catch (e) {
        dbg("[TOKEN:getVotes:error]", e)
        setUserVotingWeight(0)
      }
    }
    getUserTokenBalance()
    getUserVotingWeight()
  }, [daoSelected?.decimals, daoSelected?.token, etherlink?.provider, etherlink?.signer?.address, tokenContract])

  useEffect(() => {
    if (!etherlink?.provider || !daoSelected?.token) return
    ;(async () => {
      try {
        const code = await etherlink.provider.getCode(daoSelected?.token)
        dbg("[TOKEN:contract:init]", {
          token: daoSelected?.token,
          hasCode: code !== "0x"
        })
        if (!code || code === "0x") {
          setTokenContract(null)
          return
        }
        setTokenContract(new ethers.Contract(daoSelected?.token, HbTokenAbi.abi, etherlink.provider))
      } catch (e) {
        dbg("[TOKEN:contract:init:error]", String(e))
        setTokenContract(null)
      }
    })()
  }, [daoSelected?.token, etherlink?.provider])

  return {
    signer: etherlink?.signer,
    userTokenBalance,
    userVotingWeight,
    proposalCreatedCount,
    proposalVotedCount,
    // TODO: Maybe remove
    loggedInUser: {
      address: etherlink?.signer?.address
    },
    daoDelegate,
    copyAddress,
    showProposalVoterList,
    setShowProposalVoterList
  }
}

// UI-only ops: no on-chain reads; safe for pages that just need UI helpers
export const useEvmDaoUiOps = () => {
  const openNotification = useNotification()
  const { showProposalVoterList, setShowProposalVoterList } = useEvmDaoOpsStore()

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    openNotification({
      message: "Address copied!",
      autoHideDuration: 2000,
      variant: "info"
    })
  }

  return {
    copyAddress,
    showProposalVoterList,
    setShowProposalVoterList
  }
}
