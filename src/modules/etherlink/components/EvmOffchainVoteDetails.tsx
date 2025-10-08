import React, { useContext, useMemo } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmDaoUiOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"
import { IEvmProposal } from "../types"
import { VoteDetails } from "modules/lite/explorer/components/VoteDetails"
import { Choice, WalletAddress } from "models/Choice"

export const EvmOffchainVoteDetails: React.FC<{ poll: IEvmProposal | undefined }> = ({ poll }) => {
  const { daoSelected } = useContext(EtherlinkContext)
  const { setShowProposalVoterList } = useEvmDaoUiOps()

  // Adapt Etherlink offchain choices into Lite Choice[] with equal weights.
  const adaptedChoices: Choice[] = useMemo(() => {
    const ONE = "1000000" // 1 unit at 6 decimals so totals equal voter counts
    const asWallet = (addr: string, choiceId: string): WalletAddress => ({
      address: addr,
      balanceAtReferenceBlock: ONE,
      cidLink: "",
      choiceId,
      payloadBytes: "",
      signature: ""
    })
    return (poll?.choices || []).map((c: any) => ({
      _id: String(c._id || c.id || c.name),
      name: String(c.name || ""),
      pollID: String(poll?.id || ""),
      walletAddresses: Array.isArray(c.walletAddresses)
        ? c.walletAddresses.map((a: any) => asWallet(String(a), String(c._id || c.id || c.name)))
        : []
    }))
  }, [poll?.choices, poll?.id])

  // Minimal poll stub so VoteDetails uses count-based (XTZ) path for percentages.
  const pollStub: any = useMemo(
    () => ({
      _id: String(poll?.id || ""),
      isXTZ: true
    }),
    [poll?.id]
  )

  return (
    <VoteDetails
      poll={pollStub}
      choices={adaptedChoices}
      token={daoSelected?.token}
      communityId={undefined}
      isXTZ={true}
    />
  )
}

export default EvmOffchainVoteDetails
