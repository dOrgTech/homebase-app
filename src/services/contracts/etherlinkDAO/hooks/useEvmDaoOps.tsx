import { ethers } from "ethers"
import { create } from "zustand"
import { useCallback, useContext, useEffect, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EtherlinkContext } from "services/wagmi/context"

import HbTokenAbi from "assets/abis/hb_evm.json"
import { useNotification } from "modules/common/hooks/useNotification"

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

  console.log("YYY", { showProposalVoterList })

  useEffect(() => {
    if (!etherlink?.signer || !tokenContract) return
    const getUserTokenBalance = async () => {
      const balance = await tokenContract.balanceOf(etherlink?.signer?.address)
      const balanceActual = Number(balance) / Math.pow(10, daoSelected?.decimals)
      console.log("User Balance", balanceActual)
      setUserTokenBalance(balanceActual)
    }
    const getUserVotingWeight = async () => {
      const weight = await tokenContract.getVotes(etherlink?.signer?.address)
      const weightActual = Number(weight) / Math.pow(10, daoSelected?.decimals)
      console.log("User Voting Weight", weightActual)
      setUserVotingWeight(weightActual)
    }
    getUserTokenBalance()
    getUserVotingWeight()
  }, [daoSelected?.decimals, daoSelected?.token, etherlink.signer, tokenContract])

  useEffect(() => {
    if (!etherlink?.signer || !daoSelected?.token) return
    setTokenContract(new ethers.Contract(daoSelected?.token, HbTokenAbi.abi, etherlink.signer))
  }, [daoSelected?.token, etherlink.signer])

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
